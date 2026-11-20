// Modelos dos e-mails aos clientes. Desenho aprovado no canvas "E-mails aos
// clientes": faixa escura com a marca no topo, corpo claro (e-mail escuro fica
// ilegível quando o leitor inverte as cores), um botão principal por e-mail.
// HTML de e-mail: tabelas, estilo inline, sem fonte web (Georgia e Arial como
// substitutos de Fraunces e Inter). Todo texto variável passa por esc().
// Cada modelo devolve também a versão em texto puro.

export type Mail = { subject: string; preheader: string; html: string; text: string };

const C = {
  page: "#E7E3DA", paper: "#FBFAF7", line: "#E2DDD1", border: "#D6D1C5",
  ink: "#0B0D12", body: "#2A2C33", soft: "#5B5A55", link: "#7A5A12",
  ochre: "#C9A24E", blue: "#7A93E6", bar: "#0B0D12", barInk: "#F1EEE6",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";
const MONO = "'Courier New', Courier, monospace";

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const p = (html: string, extra = "") =>
  `<p style="margin:0 0 18px;font:16px/1.6 ${SANS};color:${C.body};${extra}">${html}</p>`;
const eyebrow = (t: string) =>
  `<p style="margin:0 0 14px;font:bold 11px/1.4 ${MONO};letter-spacing:1.5px;text-transform:uppercase;color:${C.link}">${esc(t)}</p>`;
const h1 = (t: string) =>
  `<h1 style="margin:0 0 20px;font:normal 30px/1.2 ${SERIF};color:${C.ink}">${esc(t)}</h1>`;
const button = (href: string, label: string) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:6px 0 14px"><tr>
<td bgcolor="${C.ochre}" style="border-radius:8px">
<a href="${esc(href)}" style="display:inline-block;padding:15px 26px;font:bold 15px ${SANS};color:${C.ink};text-decoration:none;border-radius:8px">${esc(label)}</a>
</td></tr></table>`;
const small = (html: string) =>
  `<p style="margin:0 0 18px;font:13px/1.55 ${SANS};color:${C.soft}">${html}</p>`;
const rule = `<div style="height:1px;background:${C.line};margin:10px 0 24px;line-height:1px;font-size:1px">&nbsp;</div>`;

export type Signer = { name: string; role: string };
const signature = (signers: Signer[]) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
${signers.map((s) => `<td style="padding:0 36px 0 0;vertical-align:top">
<div style="font:normal 19px ${SERIF};color:${C.ink}">${esc(s.name)}</div>
<div style="font:13px ${SANS};color:${C.soft}">${esc(s.role)}</div></td>`).join("")}
</tr></table>`;

type Frame = { preheader: string; header: boolean; body: string; footer: string };
function frame(f: Frame): string {
  const bar = f.header ? `
<tr><td bgcolor="${C.bar}" style="padding:22px 40px;border-radius:6px 6px 0 0">
<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${C.ochre}"></span>
<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${C.blue};margin-right:10px"></span>
<span style="font:bold 13px ${MONO};letter-spacing:2px;color:${C.barInk}">CASA MARTECH</span>
</td></tr>` : "";
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>CASA MARTECH</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(f.preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${C.page}"><tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px">
<tr><td>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${C.paper}" style="border:1px solid ${C.border};border-radius:6px">
${bar}
<tr><td style="padding:40px 40px 22px">${f.body}</td></tr>
</table>
</td></tr>
<tr><td style="padding:18px 4px 0;font:12px/1.55 ${SANS};color:${C.soft}">${f.footer}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const SITE_FOOT = (site: string) =>
  `<p style="margin:0 0 6px">CASA MARTECH · Bruno Amaral e Matheus Silva · <a href="${esc(site)}" style="color:${C.soft}">casamartech.com.br</a></p>`;
const textFoot = "\n--\nCASA MARTECH · Bruno Amaral e Matheus Silva · casamartech.com.br\n";

const hello = (first: string) => (first ? `Olá, ${first}` : "Olá");

/* ─── Atualização: nova versão da prévia ─────────────────────────── */
export function atualizacao(d: {
  first: string; project: string; version: number; title: string | null;
  url: string; portal: string; signer: Signer; site: string;
}): Mail {
  const subject = `${d.project}: a versão ${d.version} está pronta para você ver`;
  const preheader = "Dá para navegar, marcar pontos na página e comentar ali mesmo.";
  const extra = d.title && !d.project.toLowerCase().includes(d.title.toLowerCase()) ? " · " + d.title : "";
  const tag = `${d.project} · versão ${d.version}${extra}`;
  const html = frame({
    preheader, header: true,
    body: eyebrow(tag) + h1(`${hello(d.first)}. A versão ${d.version} já pode ser vista.`) +
      p(`Subimos uma nova versão de <b>${esc(d.project)}</b> na sua área de cliente. Ela funciona como o site de verdade: dá para clicar, navegar entre as páginas e ver como fica no computador e no celular.`) +
      p(`Se algo chamar sua atenção, clique em <b>Marcar um ponto</b>, aponte o lugar na página e escreva o que quer mudar. O comentário fica preso ali, e a gente responde no mesmo lugar. Quando estiver tudo certo, é só aprovar a versão.`) +
      button(d.url, "Abrir a prévia") +
      small(`Entre com este mesmo e-mail. Se o botão não abrir, copie o endereço: <a href="${esc(d.portal)}" style="color:${C.link}">${esc(d.portal.replace(/^https:\/\//, ""))}</a>`) +
      rule + p("Qualquer dúvida, responda este e-mail.") + signature([d.signer]),
    footer: SITE_FOOT(d.site) +
      `<p style="margin:0">Você recebe este e-mail porque tem um projeto em andamento com a gente.</p>`,
  });
  const text = `${hello(d.first)},

Subimos a versão ${d.version} de ${d.project} na sua área de cliente. Ela funciona como o site de verdade: dá para clicar, navegar e ver como fica no computador e no celular.

Se algo chamar sua atenção, clique em "Marcar um ponto", aponte o lugar na página e escreva o que quer mudar. Quando estiver tudo certo, é só aprovar a versão.

Abrir a prévia: ${d.url}
(Entre com este mesmo e-mail.)

Qualquer dúvida, responda este e-mail.

${d.signer.name}
${d.signer.role} · CASA MARTECH
${textFoot}`;
  return { subject, preheader, html, text };
}

/* ─── Proposta ───────────────────────────────────────────────────── */
export const BOTH: Signer[] = [
  { name: "Bruno Amaral", role: "Marca e estratégia" },
  { name: "Matheus Silva", role: "Tecnologia e dados" },
];
export function proposta(d: { first: string; project: string; url: string; date: string; site: string }): Mail {
  const subject = `${d.project}: a nossa proposta`;
  const preheader = "O que entendemos da conversa, o que propomos fazer e em quanto tempo.";
  const html = frame({
    preheader, header: true,
    body: eyebrow(`Proposta · ${d.date}`) + h1(`${hello(d.first)}. A proposta está pronta.`) +
      p(`Obrigado pela conversa. Juntamos o que você contou numa página só, que começa pelo que entendemos do momento de vocês e segue pelo que propomos fazer, como fica na tela e o prazo de cada etapa.`) +
      p(`Vale ler com calma e na ordem. O investimento está no fim, depois de tudo que ele cobre.`) +
      button(d.url, "Ler a proposta") +
      small(`O endereço é só seu e não aparece em buscadores. Na própria página há um botão para salvar em PDF, se preferir guardar ou repassar internamente.`) +
      rule + p("Se quiser passar por ela junto com a gente, marcamos meia hora. É só responder com um horário bom para você.") +
      signature(BOTH),
    footer: SITE_FOOT(d.site) +
      `<p style="margin:0">Você recebe este e-mail porque conversou com a gente sobre um projeto. Responder chega direto aos dois.</p>`,
  });
  const text = `${hello(d.first)},

Obrigado pela conversa. Juntamos o que você contou numa página só, que começa pelo que entendemos do momento de vocês e segue pelo que propomos fazer, como fica na tela e o prazo de cada etapa.

Vale ler com calma e na ordem. O investimento está no fim, depois de tudo que ele cobre.

Ler a proposta: ${d.url}
(O endereço é só seu. Na página há um botão para salvar em PDF.)

Se quiser passar por ela junto com a gente, marcamos meia hora. É só responder com um horário bom para você.

Bruno Amaral · Marca e estratégia
Matheus Silva · Tecnologia e dados
${textFoot}`;
  return { subject, preheader, html, text };
}

/* ─── Acompanhamento da proposta ─────────────────────────────────── */
// Sai como resposta na conversa da proposta, sem cabeçalho de marca, para
// chegar com cara de mensagem de uma pessoa.
export function acompanhamento(d: {
  first: string; project: string; url: string; sentOn: string | null;
  stopUrl: string; signer: Signer; whatsapp: string; site: string;
}): Mail {
  const subject = `Re: ${d.project}: a nossa proposta`;
  const preheader = "Passando para saber se ficou alguma dúvida.";
  const quando = d.sentOn ? ` em ${esc(d.sentOn)}` : "";
  const html = frame({
    preheader, header: false,
    body: p(`Oi${d.first ? ", " + esc(d.first) : ""},`) +
      p(`Mandamos a proposta de ${esc(d.project)}${quando} e queria saber se você conseguiu olhar. Às vezes uma parte do escopo ou do prazo levanta pergunta que fica mais fácil resolver numa conversa curta do que por e-mail.`) +
      p(`Se for o caso, me diga um horário. Se a decisão depende de mais alguém aí, posso mandar um resumo de uma página para facilitar.`) +
      p(`A proposta continua no mesmo endereço: <a href="${esc(d.url)}" style="color:${C.link}">abrir a proposta</a>.`) +
      p("Um abraço,", "margin-bottom:8px") + signature([d.signer]) +
      `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px"><tr>
<td style="border:1px solid ${C.ink};border-radius:8px"><a href="${esc(d.whatsapp)}" style="display:inline-block;padding:12px 20px;font:bold 14px ${SANS};color:${C.ink};text-decoration:none">Falar no WhatsApp</a></td></tr></table>`,
    footer: SITE_FOOT(d.site) +
      `<p style="margin:0">Prefere não receber lembretes sobre esta proposta? <a href="${esc(d.stopUrl)}" style="color:${C.soft}">Parar lembretes</a>. A gente não escreve de novo sobre ela.</p>`,
  });
  const text = `Oi${d.first ? ", " + d.first : ""},

Mandamos a proposta de ${d.project}${d.sentOn ? " em " + d.sentOn : ""} e queria saber se você conseguiu olhar. Às vezes uma parte do escopo ou do prazo levanta pergunta que fica mais fácil resolver numa conversa curta do que por e-mail.

Se for o caso, me diga um horário. Se a decisão depende de mais alguém aí, posso mandar um resumo de uma página para facilitar.

A proposta continua no mesmo endereço: ${d.url}

Um abraço,
${d.signer.name}
${d.signer.role} · CASA MARTECH
WhatsApp: ${d.whatsapp}

Prefere não receber lembretes sobre esta proposta? ${d.stopUrl}
${textFoot}`;
  return { subject, preheader, html, text };
}

/* ─── Cobrança ───────────────────────────────────────────────────── */
export function cobranca(d: {
  first: string; project: string; position: string; description: string;
  due: string; dueLong: string; amount: string; checkout: string | null;
  howToPay: string; portal: string; site: string; overdue: boolean;
}): Mail {
  const subject = d.overdue
    ? `${d.project}: a parcela ${d.position} venceu em ${d.due}`
    : `${d.project}: a parcela ${d.position} vence em ${d.due}`;
  const preheader = d.checkout ? "Dá para pagar por Pix ou cartão pelo link deste e-mail." : "Os dados para pagamento estão neste e-mail.";
  const lead = d.overdue
    ? `${hello(d.first)}. A parcela que venceu em ${d.dueLong} ainda aparece em aberto.`
    : `${hello(d.first)}. A próxima parcela vence em ${d.dueLong}.`;
  const intro = d.overdue
    ? "Pode ter sido só um descompasso entre o pagamento e a baixa aqui. Se já pagou, responda com o comprovante que a gente acerta."
    : "É um lembrete com alguns dias de antecedência, para não pegar ninguém de surpresa. Se já estiver pago, desconsidere.";
  const row = (k: string, v: string, big = false) => `<tr>
<td style="padding:12px 0;border-top:1px solid ${C.line};font:15px ${SANS};color:${C.soft};width:42%">${esc(k)}</td>
<td style="padding:12px 0;border-top:1px solid ${C.line};${big ? `font:bold 21px ${SERIF};color:${C.ink}` : `font:15px ${SANS};color:${C.body}`}">${esc(v)}</td></tr>`;
  const table = `<p style="margin:6px 0 10px;font:bold 11px ${MONO};letter-spacing:1.5px;text-transform:uppercase;color:${C.link}">Parcela</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-bottom:1px solid ${C.line};margin-bottom:24px">
${row("Projeto", d.project)}${row("Parcela", d.position + (d.description ? " · " + d.description : ""))}${row("Vencimento", d.due)}${row("Valor", d.amount, true)}
</table>`;
  const how = d.howToPay
    ? `<p style="margin:0 0 8px;font:bold 11px ${MONO};letter-spacing:1.5px;text-transform:uppercase;color:${C.link}">Como pagar</p>` +
      p(esc(d.howToPay).replace(/\n/g, "<br>"))
    : "";
  const html = frame({
    preheader, header: true,
    body: h1(lead) + p(intro) + table +
      (d.checkout ? button(d.checkout, "Pagar com Pix ou cartão") + small("Checkout seguro da InfinitePay. A baixa aqui é automática depois da confirmação.") : "") +
      how +
      small(`Suas parcelas também ficam na área do cliente: <a href="${esc(d.portal)}" style="color:${C.link}">${esc(d.portal.replace(/^https:\/\//, ""))}</a>`) +
      rule + p("Precisa mudar a data ou tem alguma pendência com a nota fiscal? Responda este e-mail e a gente acerta.", "margin-bottom:0"),
    footer: SITE_FOOT(d.site) +
      `<p style="margin:0">Aviso referente ao contrato de ${esc(d.project)}. A CASA MARTECH nunca troca dados de pagamento por e-mail nem pede pagamento a partir de outro endereço.</p>`,
  });
  const text = `${lead}

${intro}

Projeto: ${d.project}
Parcela: ${d.position}${d.description ? " · " + d.description : ""}
Vencimento: ${d.due}
Valor: ${d.amount}
${d.checkout ? `\nPagar com Pix ou cartão (InfinitePay): ${d.checkout}\n` : ""}${d.howToPay ? `\nComo pagar:\n${d.howToPay}\n` : ""}
Suas parcelas também ficam na área do cliente: ${d.portal}

Precisa mudar a data ou tem alguma pendência com a nota fiscal? Responda este e-mail e a gente acerta.

A CASA MARTECH nunca troca dados de pagamento por e-mail nem pede pagamento a partir de outro endereço.
${textFoot}`;
  return { subject, preheader, html, text };
}
