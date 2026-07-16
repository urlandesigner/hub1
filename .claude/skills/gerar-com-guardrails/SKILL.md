---
name: gerar-com-guardrails
description: Fase 02 (Prototipar) do Processo Compacto. Gera peças de interface a partir de uma spec viva, com o design system como guardrail. Use SEMPRE que o usuário pedir pra gerar, construir, prototipar, criar tela/componente/fluxo, ou disser "fase 2", "gera a peça", "constrói", "prototipa" — desde que exista spec em specs/. Se não existir spec, rode /spec-viva primeiro; nunca gere sem spec.
---

# Fase 02 — Prototipar (gerar com guardrails)

Gere as peças da spec indicada em `$ARGUMENTS` (ex.: `specs/checkout-redesign.md`).

## Antes de gerar (obrigatório)

1. **Leia a spec inteira.** Ela é o contrato: resultado esperado, escopo, restrições,
   decisões anteriores e quebra de tarefas.
2. **Leia `design-system/tokens.json`.** Todo valor visual (cor, espaçamento, raio,
   tipografia) vem de lá. Valor não mapeado = pare e pergunte, nunca invente.
2b. **Se houver captura dev-mode disponível, ela é o guardrail primário.** Quando existir
   `tokens_extracted.json` + `cache/snippets/` + `cache/assets/` de uma skill dev-mode
   (ex.: `dev-mode-virtual-office` pro Escritório, `dev-mode-ecomm-on` pra loja), use os
   tokens e snippets REAIS capturados do app antes do `tokens.json` estático — a peça vira
   réplica fiel do produto no ar, não aproximação. O `tokens.json` continua como fallback
   pro que a captura não cobrir. Materialize os assets reais (`cache/assets/`) na peça.
3. **Leia a skill `frontend-design` e defina a Direção Estética** (obrigatório, não
   condicional). Antes de qualquer peça, decida a aposta visual — produtos-régua,
   personalidade, composição/escala, motion — e **registre na seção `## Direção estética`
   da spec**. Tokens são o guardrail (o que é permitido); a direção é a ambição (como a
   peça se sente). Guardrail sem direção produz peça correta e genérica — o craft mora
   aqui. A direção é decisão de design, não descoberta da geração.
4. Se a spec estiver `status: bloqueada`, **não gere** — aponte o bloqueio.

> **As três skills de craft (altitudes diferentes, não substitutas):**
> `frontend-design` decide *o que a peça é* (direção macro). `emil-design-eng` refina
> *como ela se sente* (motion, micro-interações, foco, os detalhes invisíveis).
> `design:ux-copy` afia *o que ela diz* (CTA, estado vazio, erro, badge). Use as três.

## Processo de geração

- **Peça por peça, de dentro pra fora** (núcleo → composição → tela). Nunca a tela
  toda de uma vez.
- Quando a decisão pedir, gere **2–3 direções** da mesma peça com o trade-off de
  cada uma registrado — a escolha entre direções é do designer, olhando o renderizado.
- Saída em `pecas/<nome-da-demanda>/`, um arquivo por peça, nomeado pela quebra de
  tarefas da spec.
- **Copy vem da `design:ux-copy`**, não do improviso: CTAs, títulos, estados vazio/erro,
  badges e microcopy passam por ela antes de entrar na peça.
- **Passe de polish com `emil-design-eng`** ao montar/fechar cada peça: calibre motion
  (curvas, timing, stagger), micro-interações (hover, press), foco visível e os detalhes
  invisíveis. É o que separa "correto" de "premium" na execução.
- O designer é **editor**: apresente cada peça e aguarde aceitar / corrigir / rejeitar
  antes de seguir pra próxima.

## Ao final de cada peça

Registre no bloco `## Rastro` da spec:
- o que foi aceito, corrigido ou rejeitado, e por quê
- qualquer valor de token que faltou no design system (isso vira Δtokens na fase 04)

## Portão de saída

Nenhum veredicto aqui. **Toda peça vai obrigatoriamente para `/portao-de-qualidade`.**
Nunca declare uma peça pronta, nem mostre como final, sem o portão ter rodado.
