#!/usr/bin/env bash
# Varredura do build ANTES do deploy: procura chave secreta nos arquivos que vão para o navegador (SEC-04.3).
# Uso (na raiz do projeto, depois do build):
#   bash varrer-build.sh               → .next/static, dist, build, out + HTML/RSC pré-renderizado de .next/server/app
#   bash varrer-build.sh <pasta> ...   → outras saídas de cliente (ex.: .output/public, .svelte-kit/output/client)
# Saída: 0 = limpo · 1 = CRÍTICO (chave secreta no cliente: BLOQUEANTE, não publicar)
#        2 = nenhuma pasta de build encontrada · 3 = sem crítico, mas com suspeitas para revisar
# Nunca imprime o valor de uma chave (regra R5): só arquivo, tipo e a chave mascarada.
#
# Por que não basta `grep -rEi "service_role|sb_secret_|SUPABASE_SERVICE"`: o próprio código das bibliotecas
# oficiais vai para o bundle e contém esses textos (@supabase/auth-js tem "service_role"; @supabase/supabase-js
# tem `startsWith('sb_secret_')`). Por isso o script separa VALOR de chave (crítico) de TEXTO solto (informativo)
# e decodifica todo JWT encontrado: "role":"service_role" = falha crítica; "role":"anon" = chave pública por design.
set -u

if [ "$#" -gt 0 ]; then ALVOS=("$@"); else ALVOS=(.next/static dist build out); fi
LISTA="$(mktemp)"; trap 'rm -f "$LISTA"' EXIT
for a in "${ALVOS[@]}"; do [ -d "$a" ] && find "$a" -type f -print0 >> "$LISTA"; done
if [ "$#" -eq 0 ] && [ -d .next/server/app ]; then
  find .next/server/app -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.body' \) -print0 >> "$LISTA"
fi
if [ ! -s "$LISTA" ]; then
  echo "Nenhuma saída de build encontrada (${ALVOS[*]}). Rode o build antes ou informe a pasta do cliente."; exit 2
fi
nfiles="$(tr -cd '\0' < "$LISTA" | wc -c | tr -d ' ')"
echo "Varrendo $nfiles arquivos de cliente em: ${ALVOS[*]}$([ "$#" -eq 0 ] && [ -d .next/server/app ] && echo ' + .next/server/app (*.html, *.rsc)')"

mask() { local s="$1"; printf '%s****%s' "${s:0:10}" "${s: -4}"; }
b64url() { local s="${1//-/+}"; s="${s//_//}"; case $(( ${#s} % 4 )) in 2) s="$s==" ;; 3) s="$s=" ;; esac; printf '%s' "$s" | base64 -d 2>/dev/null; }
# -a: binários (.dll, .wasm, imagens) também são varridos; -o devolve só o trecho casado, nunca bytes soltos
achados() { xargs -0 grep -aHoE "$1" < "$LISTA" 2>/dev/null | sort -u; }
# Nomes de variável: ignora .d.ts/.map e linhas de comentário (JSDoc das bibliotecas cita SUPABASE_SECRET_KEY como exemplo).
# A linha inteira só é usada para filtrar; o que sai é arquivo + nome (R5).
nomes() {
  tr '\0' '\n' < "$LISTA" | grep -vE '\.(d\.ts|map)$' | tr '\n' '\0' | xargs -0 grep -IHnE "$1" 2>/dev/null \
    | grep -vE '^[^:]+:[0-9]+:[[:space:]]*(\*|//|/\*)' \
    | while IFS= read -r l; do f="${l%%:*}"; printf '%s\n' "${l#*:*:}" | grep -oE "$1" | sed "s#^#$f:#"; done | sort -u
}

crit=0; susp=0

# 1. Valores com formato de chave secreta (CRÍTICO)
while IFS= read -r l; do
  [ -z "$l" ] && continue
  f="${l%%:*}"; v="${l#*:}"
  case "$v" in
    sb_secret_*)     t="Supabase secret key (sb_secret_)" ;;
    sk_live_*|rk_live_*) t="Stripe secret/restricted key (live)" ;;
    sk_test_*|rk_test_*) t="Stripe secret/restricted key (test)" ;;
    sk-ant-*)        t="Anthropic API key" ;;
    sk-*)            t="OpenAI/compatível API key" ;;
    *PRIVATE*)       t="chave privada (PEM)" ;;
    *)               t="segredo" ;;
  esac
  echo "❌ CRÍTICO  $f — $t: $(mask "$v")"; crit=$((crit + 1))
done < <(achados 'sb_secret_[A-Za-z0-9_-]{20,}|[sr]k_(live|test)_[A-Za-z0-9]{16,}|sk-(proj-|ant-|svcacct-)?[A-Za-z0-9_-]{32,}|-----BEGIN ([A-Z]+ )?PRIVATE KEY-----')

# 2. JWTs: decodificar o payload e conferir a claim role
while IFS= read -r l; do
  [ -z "$l" ] && continue
  f="${l%%:*}"; jwt="${l#*:}"; p="${jwt#*.}"; p="${p%%.*}"
  role="$(b64url "$p" | grep -oE '"role" *: *"[^"]*"' | head -1 | sed -E 's/.*"([^"]*)"$/\1/')"
  case "$role" in
    service_role)  echo "❌ CRÍTICO  $f — JWT com \"role\":\"service_role\": $(mask "$jwt")"; crit=$((crit + 1)) ;;
    anon)          echo "ℹ️  ok      $f — JWT anon (chave pública por design; a proteção é a RLS): $(mask "$jwt")" ;;
    "")            echo "⚠️  revisar $f — JWT sem claim role: $(mask "$jwt")"; susp=$((susp + 1)) ;;
    *)             echo "⚠️  revisar $f — JWT com role \"$role\" embutido no cliente: $(mask "$jwt")"; susp=$((susp + 1)) ;;
  esac
done < <(achados 'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}')

# 3. Nomes de variáveis só de servidor referenciados no código de cliente (SUSPEITA: código errado, mesmo sem o valor)
while IFS= read -r l; do
  [ -z "$l" ] && continue
  echo "⚠️  revisar ${l%%:*} — cita variável de servidor: ${l#*:}"; susp=$((susp + 1))
done < <(nomes 'SUPABASE_SERVICE[A-Z_]*|SUPABASE_SECRET[A-Z_]*|STRIPE_SECRET[A-Z_]*|OPENAI_API_KEY|ANTHROPIC_API_KEY|RESEND_API_KEY')

# 4. Texto solto sem valor de chave (informativo: esperado no código das bibliotecas @supabase/*)
ntxt="$(xargs -0 grep -lIiE 'service_role|sb_secret_' < "$LISTA" 2>/dev/null | wc -l | tr -d ' ')"
[ "$ntxt" -gt 0 ] && echo "ℹ️  info    texto 'service_role'/'sb_secret_' sem valor de chave em $ntxt arquivo(s) — normal no código de @supabase/auth-js e @supabase/supabase-js"

echo "---"
if [ "$crit" -gt 0 ]; then
  echo "RESULTADO: CRÍTICO — $crit chave(s) secreta(s) no cliente. BLOQUEANTE: não publicar; rotacionar a chave no painel do provedor."; exit 1
elif [ "$susp" -gt 0 ]; then
  echo "RESULTADO: sem chave secreta, mas $susp suspeita(s) para revisar antes de publicar."; exit 3
fi
echo "RESULTADO: limpo — nenhuma chave secreta no build de cliente."; exit 0
