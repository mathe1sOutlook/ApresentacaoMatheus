// Casa Martech — Checkout InfinitePay. Sem chave no navegador.
// Configurar INFINITEPAY_API_KEY e INFINITEPAY_HANDLE nos secrets do Supabase.
// GET ?order_nsu&slug&transaction_nsu: retorno do checkout (nao confiavel).
// POST {action:"create",payment_id}: membro autorizado do CRM.
// POST {action:"verify",order_nsu,slug,transaction_nsu}: conciliacao manual.
// POST {action:"webhook",...}: evento sem assinatura; confirmar na API antes de gravar.
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const API = "https://api.checkout.infinitepay.io";
const CANON = "https://www.casamartech.com.br";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const IP_KEY = Deno.env.get("INFINITEPAY_API_KEY") || "";
const HANDLE = (Deno.env.get("INFINITEPAY_HANDLE") || "").replace(/^\$/, "");
const FN_URL = SUPABASE_URL + "/functions/v1/infinitepay-checkout";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {auth:{persistSession:false,autoRefreshToken:false}});
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": CANON,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {status, headers});
const fail = (message: string, status = 400) => respond({error:message},status);
const string = (v: unknown, max = 300) => typeof v === "string" ? v.slice(0,max).trim() : "";
const receipt = (v: unknown) => {
  const raw = string(v,2048);
  try { const u = new URL(raw); return u.protocol === "https:" ? raw : null; }
  catch { return null; }
};
const getAttempt = async (order: string) => {
  const {data,error}=await admin.from("amaralesilva_infinitepay_checkouts")
    .select("*").eq("order_nsu",order).maybeSingle();
  if(error) throw error;
  return data;
};
async function member(req: Request) {
  const authorization = req.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) return false;
  const token=authorization.slice(7);
  const authClient=createClient(SUPABASE_URL,PUBLIC_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error}=await authClient.auth.getUser(token);
  if(error || !user?.email) return false;
  const {data, error:memberError}=await admin.from("amaralesilva_members")
    .select("id").ilike("email",user.email).limit(1);
  if(memberError) throw memberError;
  return !!data?.length;
}
async function ipPost(path: string,payload: object) {
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try {
    const res=await fetch(API+path,{method:"POST",headers:{"Content-Type":"application/json","X-Api-Key":IP_KEY},
      body:JSON.stringify(payload),signal:controller.signal});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) {
      console.error("InfinitePay request failed",path,res.status);
      throw new Error("Falha na InfinitePay (HTTP "+res.status+").");
    }
    return data;
  } finally {clearTimeout(timeout);}
}
async function create(paymentId: string) {
  if(!UUID.test(paymentId)) return fail("Parcela invalida.");
  const {data: attempt,error:prepareError}=await admin.rpc("amaralesilva_infinitepay_prepare",{p_payment_id:paymentId});
  if(prepareError) throw prepareError;
  if(!attempt || attempt.state==="paid") return fail("Parcela ja paga.");
  const now=Date.now();
  if(Date.parse(attempt.valid_until)<=now) return fail("Cobranca expirada. Tente novamente.");
  if(attempt.checkout_url) return respond({url:attempt.checkout_url,order_nsu:attempt.order_nsu});
  // Payload deterministico: mesmo order_nsu e mesmos dados em retries.
  const body={
    order_nsu:attempt.order_nsu,
    redirect_url:CANON+"/pagamento-retorno.html",
    webhook:{url:FN_URL,events:["paid"]},
    items:[{quantity:1,price:Number(attempt.amount_cents),description:"Parcela de servicos Casa Martech"}],
    options:{assured_installments:0,require_delivery_address:false,
      single_payment:true,valid_until:attempt.valid_until,
      payment_methods_enabled:["credit_card","pix"]}
  };
  const result=await ipPost("/links",body);
  const url=typeof result.url==="string" ? result.url :
    (typeof result.checkout_url==="string" ? result.checkout_url : result.link);
  if(typeof url!=="string" || !/^https:\/\//i.test(url)) {
    console.error("Resposta InfinitePay sem URL: campos",Object.keys(result));
    throw new Error("InfinitePay nao retornou link HTTPS.");
  }
  const parsed=new URL(url);
  if(!parsed.hostname.endsWith(".infinitepay.io") && parsed.hostname!=="infinitepay.io"
      && !parsed.hostname.endsWith(".infinitepay.com.br") && parsed.hostname!=="infinitepay.com.br") {
    throw new Error("Dominio inesperado no link InfinitePay.");
  }
  const {data:saved,error:saveError}=await admin.from("amaralesilva_infinitepay_checkouts")
    .update({checkout_url:url,state:"created"})
    .eq("id",attempt.id).eq("state","prepared").select("checkout_url").maybeSingle();
  if(saveError) throw saveError;
  if(!saved) {
    const current=await getAttempt(attempt.order_nsu);
    if(!current || current.state==="paid") return fail("Parcela ja foi paga.");
    return respond({url:current.checkout_url || url,order_nsu:attempt.order_nsu});
  }
  return respond({url,order_nsu:attempt.order_nsu});
}
async function verify(raw: Record<string,unknown>) {
  const order=string(raw.order_nsu,128),slug=string(raw.slug || raw.invoice_slug,128),
    transaction=string(raw.transaction_nsu,128);
  if(!order || !slug || !transaction) return fail("Identificadores incompletos.");
  const attempt=await getAttempt(order);
  if(!attempt) return fail("Cobranca nao encontrada.",404);
  if(attempt.state==="paid")
    return respond({paid:true,order_nsu:order,already_confirmed:true});
  const checked=await ipPost("/payment_check",{
    handle:HANDLE,order_nsu:order,transaction_nsu:transaction,slug
  });
  if(checked.success!==true || checked.paid!==true) return respond({paid:false,order_nsu:order});
  // amount e preco original; paid_amount pode conter taxa repassada.
  const amount=Number(checked.amount),paid=Number(checked.paid_amount);
  if(!Number.isInteger(amount)||amount!==Number(attempt.amount_cents)
      ||!Number.isInteger(paid)||paid<amount) {
    console.error("InfinitePay: valor inesperado na verificacao",order);
    return fail("Divergencia de valores. Necessaria conciliacao manual.",409);
  }
  const capture=string(checked.capture_method,30);
  if(!["pix","credit_card"].includes(capture)) return fail("Metodo nao reconhecido.",409);
  const {data:confirmed,error}=await admin.rpc("amaralesilva_infinitepay_confirm",{
    p_order_nsu:order,p_transaction_nsu:transaction,p_invoice_slug:slug,
    p_capture_method:capture,p_paid_amount_cents:paid,p_receipt_url:receipt(raw.receipt_url)
  });
  if(error) throw error;
  return respond({paid:confirmed===true,order_nsu:order});
}
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers});
  if(!IP_KEY || !HANDLE || !SERVICE_KEY || !PUBLIC_KEY)
    return fail("Checkout ainda nao configurado no servidor.",503);
  try{
    if(req.method==="GET"){
      const u=new URL(req.url);
      const result=await verify(Object.fromEntries(u.searchParams));
      return result; // retorno publico so retorna estado; nunca autentica no navegador
    }
    if(req.method!=="POST") return fail("Metodo invalido.",405);
    const body=await req.json();
    if(!body||typeof body!=="object"||Array.isArray(body)) return fail("JSON invalido.");
    const action=string(body.action);
    if(action==="create"||action==="verify"){
      if(!(await member(req))) return fail("Acesso negado.",403);
      if(action==="create") return create(string(body.payment_id,64));
      return verify(body);
    }
    // Webhook pode chegar sem campo action e sem assinatura. NUNCA confiar
    // no sinal 'paid' do evento: payment_check do provedor decide.
    return verify(body);
  }catch(error){
    console.error("InfinitePay edge function error",error instanceof Error?error.message:String(error));
    return fail("Nao foi possivel processar a cobranca. Verifique novamente.",502);
  }
});
