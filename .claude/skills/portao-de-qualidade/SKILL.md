---
name: portao-de-qualidade
description: Fase 03 do Processo Compacto. Roda o rubric contra a peça e a spec e emite veredicto (aprovar, editar, rejeitar ou escalar). Use quando o usuário disser "roda o portão", "fase 3", "critica", "revisa a peça", "valida", ou anexar um screenshot da peça pedindo avaliação. É a única fase que emite veredicto — nunca aprove uma peça fora dela.
disable-model-invocation: true
---

# Fase 03 — Portão de Qualidade

Avalie a peça indicada em `$ARGUMENTS` contra a spec da demanda e o `rubric.md`
(nesta pasta). O veredicto final é sempre do designer — seu papel é diagnosticar
e recomendar.

## Regras de avaliação

- **Avalie olhando o renderizado** (screenshot/preview), nunca só o código.
- **Contra o rubric, não contra gosto.** Cada problema apontado cita o item do
  rubric que ele viola. Achou um problema real que o rubric não cobre? Aponte
  mesmo assim e marque como `[fora do rubric]` — isso vira Δrubric na fase 04.
- **Diagnostique, não conserte.** A saída é a lista de problemas com severidade;
  quem conserta é a rota de retorno.
- **Reforço de crítica independente:** use `anthropic-skills:screenshot-feedback-loop`
  para o olhar sobre hierarquia/spacing/DS/responsividade e `design:accessibility-review`
  para o crivo de a11y (WCAG). Elas dão a segunda opinião sobre o renderizado; o veredicto
  contra o rubric continua sendo desta fase, e o final é sempre do designer.

## Formato da saída

```
## Veredicto: aprovar | editar | rejeitar | escalar

## Problemas
| # | Severidade | Item do rubric | Problema | Onde |
|---|-----------|----------------|----------|------|

## Rota
<pra onde volta e com qual instrução>
```

## Critérios de veredicto

- **aprovar** — zero bloqueios E o critério de sucesso da spec verificado no
  **percurso completo**, não só na peça isolada
- **editar** — problemas pontuais; volta pra fase 02 corrigindo SOMENTE os itens
  listados (correção cirúrgica, preserva o resto)
- **rejeitar** — problema estrutural na peça; volta pra fase 02 com plano revisto
- **escalar** — o problema é da spec (recorte, critério, premissa); volta pra fase 01

## Ao final (sempre)

Registre no `## Rastro` da spec: veredicto, data, problemas encontrados.
Falhas que o rubric não cobria ficam marcadas para a fase 04 atualizar o rubric.
O loop 02⇄03 continua até `aprovar`. Não existe "aprovar com ressalvas".
