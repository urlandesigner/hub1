---
name: spec-viva
description: Fase 01 (Enquadrar) do Processo Compacto. Transforma insumos brutos numa spec viva de 1 página. Use SEMPRE que uma demanda nova chegar, que o usuário colar um pedido, briefing, feedback ou dados de uso, ou disser qualquer variação de "nova demanda", "vamos começar", "enquadra isso", "cria a spec", "fase 1". Use também quando alguém pedir pra gerar uma peça sem spec existente — rode esta skill primeiro.
---

# Fase 01 — Enquadrar (spec viva)

Transforme os insumos em `$ARGUMENTS` (ou colados na conversa) numa spec viva.

## Processo

1. **Leia todos os insumos** fornecidos. Se `aprendizados.md` ou uma spec anterior
   relacionada existir, leia também — aprendizados do ciclo anterior são entrada.
2. **Feche o recorte em uma conversa só.** Extraia e, quando ambíguo, pergunte:
   - **UMA tarefa principal** (o que o usuário precisa conseguir fazer)
   - **UM usuário primário** (quem, em que contexto)
   - **UM critério de sucesso observável** (checável olhando o resultado — nunca
     "melhorar a experiência"; sempre "o usuário completa X sem Y")
3. **Ranqueie as premissas por risco.** Para cada premissa: criticidade (mata a
   ideia se falsa?) × evidência (temos dado ou é palpite?). As críticas-sem-evidência
   precisam de dono e prazo.
4. **Escreva a spec** em `specs/<nome-da-demanda>.md` usando `template-spec.md`
   (nesta pasta) como estrutura.

## Portão de saída (bloqueante)

A spec só está pronta quando:
- [ ] O critério de sucesso é checável olhando
- [ ] Nenhuma premissa crítica está sem dono
- [ ] Escopo tem fronteira explícita (o que está FORA)

Se faltar algo essencial: **não avance**. Devolva a pergunta com dono e prazo
sugeridos, e marque a spec como `status: bloqueada`.

## Regras

- 1 página. Se passar disso, o recorte está largo demais — proponha fatiar.
- Não proponha solução de design nesta fase. Enquadrar ≠ desenhar.
- Registre decisões de recorte no bloco `## Rastro` da spec (o que ficou de fora e por quê).
