# Processo Compacto — AI-First Design com Claude Code

Pipeline de design em 4 fases, com spec viva como contrato único e portões
bloqueantes entre fases. Este repositório é o kit inicial: clone, ajuste os
tokens e rode a primeira demanda.

## Pipeline

```
insumos → [01 spec-viva] → spec → [02 gerar-com-guardrails] → peça + rastro
        → [03 portao-de-qualidade] ⇄ (editar/rejeitar → 02 · escalar → 01)
        → aprovado → [04 entregar-e-realimentar] → Δspec/Δtokens/Δrubric ↺ 01
```

## Setup (uma vez)

1. Instale o Claude Code: https://docs.claude.com/en/docs/claude-code/overview
2. `git init` neste diretório (as skills em `.claude/skills/` viajam com o repo —
   quem clonar roda o mesmo processo)
3. Substitua `design-system/tokens.json` pelos tokens reais do seu design system
4. (Opcional) Conecte o MCP do Figma: `claude mcp add` — a fase 02 puxa tokens
   reais e a 04 pode empurrar a peça validada pro arquivo
5. (Recomendado) Adicione um hook que bloqueie entrega sem veredicto do portão —
   hooks são determinísticos, instruções são probabilísticas

## Rodando uma demanda

```
claude
> /spec-viva redesenho do fluxo de checkout
    → gera specs/checkout-redesign.md; para nos portões que faltam dono
> /gerar-com-guardrails specs/checkout-redesign.md
    → gera peça a peça em pecas/checkout-redesign/, com rastro
> /portao-de-qualidade pecas/checkout-redesign/
    → roda o rubric, emite veredicto e rota de retorno
> /entregar-e-realimentar checkout-redesign
    → empacota a entrega e roteia os aprendizados
```

## Estrutura

```
CLAUDE.md                 → regras sempre-ativas do pipeline
.claude/skills/
├── spec-viva/            → fase 01 + template-spec.md
├── gerar-com-guardrails/ → fase 02
├── portao-de-qualidade/  → fase 03 + rubric.md versionado
└── entregar-e-realimentar/ → fase 04
specs/                    → uma spec viva por demanda
pecas/                    → saídas da geração e entregas
design-system/tokens.json → guardrails visuais
aprendizados.md           → notas sem destino roteado
```

## Princípios

- O designer é editor, não autor
- Nada gerado é tratado como verdade sem passar pelo portão
- Toda rota de retorno é definida: editar→02, rejeitar→02, escalar→01
- Só conta aprendizado atribuível e com destino roteado
