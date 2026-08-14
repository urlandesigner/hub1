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

## 4. Sombra de elevação de hover — SEM TOKEN
- **Origem:** ciclo 3 de `comparador-publico` (2026-08-13), ao replicar o hover da peça irmã
  `07-comparador-premium` (hub2-eta.vercel.app) a pedido do designer.
- **Problema:** o DS só tem `$shadow-sm` (`0 0 8px rgba(5,5,5,.10)`), que é sombra de repouso.
  Elevação de hover precisa de sombra ampla e direcional. A peça usa
  `0 16px 40px rgba(30,30,31,.10)` (card comum) e `0 16px 40px -12px rgba(30,30,31,.30)`
  (card destacado) — valores **copiados da peça irmã já publicada**, não inventados aqui.
- **Histórico relevante:** um `--shadow-lift` foi PROPOSTO no ciclo 1 e **rejeitado pelo designer**
  no portão (tudo voltou para `$shadow-sm`). A pendência ressuscita com procedência diferente:
  agora o valor vem de outra peça Ybera, e o hover elevado é pedido explícito do designer.
- **Decisão pendente:** formalizar (ou recusar de novo) um par de tokens de elevação de hover —
  ex.: `$shadow-hover` e `$shadow-hover-strong` — com a tinta correta por superfície.
- **Dono:** guardião do DS. **Impacto:** qualquer card clicável, em todas as superfícies.

## 5. Selo Reclame Aqui — ATIVO DE TERCEIRO, NÃO É PENDÊNCIA DE TOKEN (é de marca/jurídico)
- **Origem:** ciclo 3 de `comparador-publico` (2026-08-13), a pedido do designer.
- **O que está na peça (2ª correção, 2026-08-13):** o **selo de REPUTAÇÃO** ("Ótimo"), reproduzindo
  o widget oficial — o mesmo que roda no rodapé da KaBuM. Os dois SVGs são os **arquivos oficiais do
  RA** (`s3.amazonaws.com/raichu-beta/selos/assets/images/otimo.svg` e `…/reclame-aqui-logo.svg`),
  baixados para `assets/ra-otimo.svg` e `assets/ra-logo.svg`. Medidas copiadas do widget real:
  caixa 137×48, borda `1px #A4C929`, raio 4px, carinha 38px, rótulo 14px/700 em `#4B5963`,
  wordmark 80×12,75.
- **Houve uma tentativa errada antes desta**, registrada para não se repetir: apliquei o selo
  *RA Verificada* (escudo azul, "Verificada por ReclameAQUI"). São artefatos diferentes —
  *Verificada* atesta identidade/existência da empresa; *reputação* é a nota (Ótimo/Bom/Regular…).
  O designer queria o de reputação. Asset da tentativa anterior removido do repositório.
- **Em produção o selo não é imagem estática:** o RA entrega um embed com script de tracking
  (`trk.reclameaqui.com.br/assets/trk.min.js?trackIdRA=…`), que renderiza o selo e o link de
  verificação. Trocar o PNG por esse embed é tarefa de implementação.
- **Por que não dá pra "só colocar o selo":**
  1. O selo oficial é **licenciado** e servido pelo próprio Reclame Aqui (embed/script com link de
     verificação para a página da empresa). Uma cópia estática dele é credencial fabricada.
  2. A reputação é **dado dinâmico** — muda com o volume e o tratamento das reclamações. "Boa" hoje
     pode não ser "Boa" no mês que vem; um selo chapado no HTML mente com o tempo.
  3. Exibir a reputação exige que a Ybera **de fato** tenha esse status no RA hoje.
- **Decisão pendente:** (a) confirmar a reputação REAL da Ybera no RA — a peça exibe "Ótimo" como
  dado de exemplo, e reputação muda com o tempo; (b) trocar a reprodução pelo **embed oficial**, que
  o RA serve e mantém atualizado, com link para a página da empresa
  (`reclameaqui.com.br/empresa/{slug}/?utm_source=rav&utm_medium=embed&utm_campaign=horizontal`);
  (c) aprovação de marca/jurídico para usar o ativo de terceiro.
- **Dono:** Produto + Marketing/Jurídico da Ybera (não é o guardião do DS).
- **Impacto:** rodapé do comparador público — superfície voltada ao cliente final, onde credencial
  incorreta vira risco de confiança, não só de layout.

## 6. Rampa neutral não tem degrau para BORDA DE CAMPO acessível
- **Origem:** ciclo 3 de `comparador-publico` (2026-08-13), no campo de CEP.
- **Problema:** o WCAG 1.4.11 exige **3:1** para contorno de componente de UI. Contra o branco:
  `neutral-400` = 1,66:1 · `neutral-500` = **2,18:1** · `neutral-600` = **5,30:1**. Não existe
  degrau entre 2,18 e 5,30 — ou a borda reprova, ou ela fica visivelmente escura (o designer leu
  `neutral-600` a 1px como "borda preta", e tem razão: é o mesmo tom do texto secundário).
- **Estado atual da peça:** `neutral-500` por decisão do designer, ou seja **reprovando 1.4.11**.
  Registrado também como bloqueio candidato no portão do ciclo 3.
- **Decisão pendente:** criar um degrau de borda por volta de `#8A8A8E` (~3,4:1), ou um token
  semântico `border/field` que resolva o caso sem escurecer a moldura visualmente. Fills não
  resolvem: campo branco sobre card branco dá 1,03:1, e tingir o campo mudaria a direção visual.
- **Dono:** guardião do DS. **Impacto:** todo input com borda sobre superfície clara, em qualquer
  superfície Ybera — não é específico desta peça.

---
Changelog:
- 2026-08-13 — +item 6 (borda de campo acessível) no ciclo 3 de `comparador-publico`.
- 2026-08-13 — +item 5 (selo Reclame Aqui) na fase 02 do ciclo 3 de `comparador-publico`.
- 2026-08-13 — +item 4 (sombra de hover) durante a fase 02 do ciclo 3 de `comparador-publico`.
- 2026-07-14 — criado no fechamento do ciclo `comparador-publico` (Fase 04).
- 2026-07-15 — +item 3 (contraste do app real) no fechamento do ciclo
  `atualizacao-poc-referencia` (Fase 04); item 1 anotado com decisão do designer
  (provisório aceito, fora do caminho crítico).
