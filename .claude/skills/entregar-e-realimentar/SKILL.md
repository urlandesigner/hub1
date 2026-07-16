---
name: entregar-e-realimentar
description: Fase 04 do Processo Compacto. Empacota a entrega da peça aprovada e roteia cada aprendizado pro seu destino (Δspec, Δtokens, Δrubric). Use SEMPRE que o usuário disser "entrega", "handoff", "fecha o ciclo", "fase 4", "empacota", ou quando o portão tiver aprovado e o próximo passo natural for entregar. Nunca rode sem veredicto "aprovar" registrado no Rastro da spec.
disable-model-invocation: true
---

# Fase 04 — Lançar & Realimentar

Feche o ciclo da demanda indicada em `$ARGUMENTS`.

## Pré-condição (bloqueante)

Verifique no `## Rastro` da spec: existe veredicto **aprovar** do portão?
Sem ele, **pare** e aponte que o portão não rodou ou não aprovou.

## Parte 1 — Entregar

1. **Carimbe a entrega:** `demo` ou `produção` — explícito, no topo da spec e no
   pacote. Peça de demo nunca se passa por código de produção.
2. **Empacote:** peça(s) final(is) + spec + rastro de decisões num diretório
   `pecas/<demanda>/entrega/`. Quem recebe deve conseguir entender **o que** foi
   feito e **por que** sem perguntar.
3. **Liste pendências carimbadas** (ex.: tokens provisórios aguardando valores
   reais) com dono e prazo.

## Parte 2 — Realimentar (o que fecha o loop)

Percorra o `## Rastro` da spec e roteie cada aprendizado para UM destino:

| Aprendizado                                        | Destino |
|----------------------------------------------------|---------|
| Descoberta sobre problema/usuário/premissa         | **Δspec** — atualiza a spec (ou a próxima) |
| Valor visual que faltou ou inconsistência recorrente| **Δtokens** — atualiza `design-system/tokens.json` |
| Falha que o portão não pegou / item `[fora do rubric]`| **Δrubric** — adiciona item em `rubric.md` + changelog |
| Não é atribuível ou não tem destino                | **nota** em `aprendizados.md` (é comentário) |

Regra de ouro: **só conta o que for atribuível e roteado.** Aprendizado sem
destino não é aprendizado.

## Saída

Resumo do ciclo: o que foi entregue, com que carimbo, quais Δ foram aplicados e
o que ficou pendente. O Δspec/Δtokens/Δrubric aplicado aqui é a entrada da
próxima fase 01 — o pipeline é um ciclo, não uma linha.
