# Pendências de tokens (Δtokens roteados)

> Δtokens que emergiram de ciclos de design mas **não podem ser resolvidos inventando
> valores** — dependem de decisão do guardião do DS. Registrados aqui em vez de
> corromper `tokens.json` (que é gerado do Figma). Cada item cita o ciclo de origem.

## 1. Biblioteca de ícones — AUSENTE
- **Origem:** ciclo `comparador-publico` (2026-07-14).
- **Problema:** `tokens.json` cobre cor, espaço, raio, tipografia e efeitos, mas **não
  define biblioteca de ícones**. As peças usaram emoji como placeholder (📍 ✓ ⚠ 🔗 🛍️).
- **Decisão pendente:** qual biblioteca de ícones o DS adota (ex.: set próprio, Lucide,
  Phosphor), com nomes/tokens e tamanhos alinhados à escala.
- **Dono:** guardião do DS. **Impacto:** todas as peças com ícone.
- **Decisão do designer (2026-07-15):** provisório aceito — SVG inline/glifo não bloqueia
  demos nem a POC de referência. A pendência segue aberta para a decisão definitiva do DS,
  mas sai do caminho crítico dos ciclos de design.

## 2. Marca de canal (Shopee / TikTok / Ybera.com) — SEM TOKEN
- **Origem:** ciclo `comparador-publico` (2026-07-14).
- **Problema:** o comparador precisa exibir a identidade de cada canal. Não há token de
  asset/logo nem de cor de marca de canal no DS. Solução provisória: logos em
  `pecas/comparador-publico/assets/` (Shopee.svg, tiktok.svg, ybera.svg).
- **Decisão pendente:** formalizar assets de marca de canal como tokens/assets do DS
  (e, se houver cor de marca aplicada em UI, defini-la — sem inventar; usar a oficial da marca).
- **Dono:** guardião do DS. **Impacto:** comparador e qualquer superfície multi-canal.

## 3. Convenções de cor do app real que reprovam WCAG AA — FEEDBACK AO TIME DO APP
- **Origem:** ciclo `atualizacao-poc-referencia` (2026-07-15), portão rodado com contraste
  calculado sobre os tokens `b2c-*` capturados do bundle real.
- **Problema:** duas convenções em produção no Escritório Virtual reprovam AA:
  (a) chip de status "Aprovado" usa `bg-b2c-positive-30` + `text-b2c-positive-20` ≈ 2.4:1;
  (b) rótulos de seção da sidebar usam `text-b2c-disabled-20` ≈ 2.55:1 sobre branco.
- **O que a POC fez:** pares AA da MESMA rampa (`-10`/`-40` para chips; `neutral-60` para
  rótulos), com desvio consciente registrado na spec.
- **Decisão pendente:** time do app corrigir as convenções (ou documentar exceção).
- **Dono:** guardião do DS / time do Escritório. **Impacto:** chips de status e sidebar
  em todo o app.

---
Changelog:
- 2026-07-14 — criado no fechamento do ciclo `comparador-publico` (Fase 04).
- 2026-07-15 — +item 3 (contraste do app real) no fechamento do ciclo
  `atualizacao-poc-referencia` (Fase 04); item 1 anotado com decisão do designer
  (provisório aceito, fora do caminho crítico).
