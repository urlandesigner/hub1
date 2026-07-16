# Processo Compacto — AI-First Design (4 fases)

Este repositório roda um pipeline de design com IA em 4 fases, com uma **spec viva**
como contrato único e **portões bloqueantes** entre as fases.

## O pipeline

```
insumos → [01 spec-viva] → spec → [02 gerar-com-guardrails] → peça + rastro
        → [03 portao-de-qualidade] ⇄ (editar/rejeitar → 02 · escalar → 01)
        → aprovado → [04 entregar-e-realimentar] → entrega + Δspec/Δtokens/Δrubric ↺ 01
```

## Regras sempre-ativas (não negociáveis)

1. **Toda demanda tem uma spec viva** em `specs/<nome-da-demanda>.md`. Se não existe
   spec, a primeira ação é rodar `/spec-viva`. Nunca gerar peça sem spec.
2. **Nada gerado é tratado como verdade.** Toda peça passa obrigatoriamente pelo
   `/portao-de-qualidade` antes de qualquer entrega, apresentação ou commit final.
3. **As rotas de retorno são fixas:**
   - `editar` → volta pra fase 02, corrige SOMENTE o item apontado
   - `rejeitar` → volta pra fase 02 com o plano revisto
   - `escalar` → volta pra fase 01, o problema é da spec
   Nunca "voltar para discutir" sem rota definida.
4. **A spec é viva.** Se a realidade divergir da spec em qualquer fase: ou a spec
   atualiza (mudança intencional, registrada) ou o trabalho volta (drift).
5. **Guardrails visuais:** toda geração usa os tokens de `design-system/tokens.json`.
   Nunca inventar valores de cor, espaçamento ou tipografia.
5b. **Direção estética e craft antes de gerar:** toda peça nasce de uma Direção Estética
   decidida na entrada da fase 02 e registrada na spec. Tokens dizem o que é permitido;
   a direção diz como a peça se sente. Guardrail sem direção = peça correta e genérica.
   Trio de craft na fase 02 (altitudes diferentes, não substitutas): `frontend-design`
   (direção macro) → `emil-design-eng` (polish/motion/micro-interações) → `design:ux-copy`
   (microcopy). Na fase 03, `screenshot-feedback-loop` e `accessibility-review` reforçam a
   crítica. O portão avalia craft (rubric §6), não só correção.
6. **Rastro de decisões:** toda geração registra o que foi aceito, corrigido e
   rejeitado no bloco `## Rastro` da própria spec.
7. **Aprendizado roteado:** ao final de cada ciclo, cada aprendizado tem UM destino:
   Δspec (specs/), Δtokens (design-system/), ou Δrubric
   (.claude/skills/portao-de-qualidade/rubric.md). O que não tem destino é comentário
   e vai para `aprendizados.md` como nota.

## Estrutura

```
specs/            → uma spec viva por demanda (contrato do ciclo)
pecas/            → saída da fase 02 (uma subpasta por demanda)
design-system/    → tokens.json e referências visuais (guardrails)
aprendizados.md   → notas sem destino roteado
.claude/skills/   → as 4 fases do processo
```

## Papel do humano

O designer é **editor, não autor**: aceita, corrige ou rejeita o que a IA produz.
Julgamento, direção e veredicto do portão são sempre humanos. A IA acelera a
execução; nunca decide sozinha que algo está pronto.

## Convenções

- Idioma dos artefatos: português (pt-BR)
- Nome de demanda: kebab-case (ex.: `checkout-redesign`)
- Uma demanda = uma tarefa principal = um usuário primário = um critério de sucesso
