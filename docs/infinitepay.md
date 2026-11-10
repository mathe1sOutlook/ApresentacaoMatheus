# InfinitePay — Casa Martech (Pix e cartão)

## Situação

Implementação preparada na branch `feat/infinitepay-pix-checkout`.
**Não há transações reais realizadas por esta implementação.** A publicação
depende dos passos abaixo; o servidor não funciona sem as credenciais.

## Arquitetura

- Frontend: `admin/index.html`, botão **Cobrar · Pix/cartão** nas parcelas pendentes.
- Backend: Supabase Edge Function `infinitepay-checkout`, projeto `mApps`
  (`wsgjbzsdewzplsnpfvdf`).
- Banco: `amaralesilva_infinitepay_checkouts` guarda todas as tentativas,
  `amaralesilva_payments` é a fonte dos valores e da divisão Matheus/Bruno.
- Retorno do comprador: `/pagamento-retorno.html`; exibe confirmação somente
  após consulta ao endpoint do provedor.
- Webhook HTTPS: `https://wsgjbzsdewzplsnpfvdf.supabase.co/functions/v1/infinitepay-checkout`.
- Fonte: https://www.infinitepay.io/checkout-documentacao

## Pré-requisitos manuais

1. No Supabase mApps → **Edge Functions → Secrets**, configurar:
   - `INFINITEPAY_API_KEY`: chave secreta `inchk_...` criada pelo titular.
   - `INFINITEPAY_HANDLE`: InfiniteTag sem o símbolo `$`, exemplo
     `matheus-castro-xaq` (confirmar a grafia no app InfinitePay).
   - Não adicionar nenhuma dessas credenciais a HTML, GitHub ou Vercel.
2. Aplicar **uma vez** `admin/infinitepay-schema.sql` com a migração Supabase
   `amaralesilva_infinitepay_checkout`; conferir as constraints e as policies
   antes de executar no mApps, compartilhado com outros projetos.
3. Fazer o deploy **somente** da nova função `infinitepay-checkout` a partir
   de `supabase/functions/infinitepay-checkout/index.ts` com
   `verify_jwt=false` (configurado em `supabase/config.toml`). Sem isso
   a InfinitePay não consegue entregar seu webhook.
4. Fazer merge do PR após conferir o estado do banco e o deploy da função.
   A Vercel então publica o painel e o retorno.
5. Realizar cobrança de **R$ 1,00 ou mais** em uma parcela de teste para
   confirmar o fluxo Pix e, se necessário, cartão. Não usar uma parcela
   real de cliente como teste.

## Fluxo

1. O membro autorizado acessa o CRM/Financeiro e clica **Cobrar · Pix/cartão**.
2. A Edge Function verifica a sessão Google e a allowlist
   `amaralesilva_members`, busca no banco o valor **real** da parcela e
   prepara uma tentativa com ID próprio; o valor não é aceito do navegador.
3. A InfinitePay recebe `POST /links` com `X-Api-Key`, `order_nsu`,
   item em centavos e as opções:
   - `payment_methods_enabled: ["credit_card", "pix"]`
   - `single_payment: true`
   - `valid_until` sete dias após a preparação
   - `assured_installments: 0` (não absorve taxas de parcelamento)
   - `require_delivery_address: false`
4. A URL é copiada e pode ser enviada ao cliente. A tela mostra o link para abrir.
5. Após pagamento, o webhook `paid` ou a página de retorno informa IDs da
   transação. **Nenhum desses avisos é confiável por si só.** A Edge Function
   usa `POST /payment_check` com `handle`, `order_nsu`,
   `transaction_nsu` e `slug`, exigindo `success: true`, `paid: true`
   e valor original em centavos idêntico ao registrado.
6. A RPC `amaralesilva_infinitepay_confirm` grava em transação atômica o
   comprovante/identificadores e marca a parcela como paga. Eventos repetidos
   não provocam uma segunda quitação.
7. O CRM já relê os dados periodicamente e exibe o novo status.

## Limites e atenção

- A InfinitePay **não fornece sandbox**; os links da API são reais.
- A InfinitePay **não assina webhook**; a verificação no `payment_check` é
  obrigatória, inclusive quando a notificação vier da tela de retorno.
- Não existe split de pagamento pela API. A divisão Matheus/Bruno segue
  **contábil** no CRM, não é transferência automática para duas contas.
- `assured_installments: 0` não impede o cliente de parcelar; apenas define
  que o custo do parcelamento pode ser repassado. Se preferir absorver taxas,
  revisar a opção antes da produção.
- Estorno e cancelamento **não são automatizados**. Fazer pelo app e conciliar
  manualmente com o Financeiro; os registros confirmados ficam preservados.
- Não editar valor/projeto nem excluir parcela com link ativo ou pagamento
  confirmado. O banco possui trigger de proteção.
- Uma tentativa `prepared` pode ser repetida com `order_nsu` igual.
  A InfinitePay não garante idempotência para payloads diferentes; o backend
  mantém o payload determinístico. Conferir cobranças pendentes após falhas.
- A validade de sete dias não substitui uma data de vencimento contratual.
- Nenhum produto precisa estar pré-cadastrado: o item é enviado na requisição.

## Verificação antes do merge

- [ ] Secrets configurados no Supabase (não em GitHub).
- [ ] Migração aplicada em mApps, com RLS e grants verificados.
- [ ] Função publicada com JWT da plataforma desativado e validação própria.
- [ ] Gerar checkout a partir de uma parcela de teste (sem clicar repetidamente).
- [ ] Checkout apresenta Pix e cartão.
- [ ] Realizar transação real de baixo valor.
- [ ] Verificar `amaralesilva_infinitepay_checkouts.state = 'paid'`.
- [ ] Verificar parcela paga no CRM e recibo acessível.
- [ ] Repetir webhook para confirmar idempotência.
- [ ] Garantir que um `order_nsu` inventado não marca parcela.
- [ ] Conferir manualmente estorno e conciliação antes de usar com cliente.

## Referências

- https://www.infinitepay.io/checkout-documentacao
- https://ajuda.infinitepay.io/pt-BR/articles/10766888-como-usar-o-checkout-integrado-da-infinitepay
