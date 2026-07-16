# Entrega — Comparador público · Ciclo 2 (frete por CEP)

## 🏷️ Carimbo: **DEMO**

Protótipo navegável de design, **não é código de produção**. O cálculo de frete é
**simulado** (a consulta real de frete por transportadora é backend, fora desta peça),
os valores de frete são exemplos fixos, e a barra de estados no rodapé é ferramenta de
revisão (dev only).

## O que é

Ciclo 2 da demanda `comparador-publico`: adiciona **frete por CEP** ao comparador entregue
no ciclo 1. Resolve a premissa 6 (frete por CEP) que ficou registrada como escopo do ciclo 2.
Estende a página do ciclo 1 (`05/06`) — não a substitui.

**Comece por `10-pagina-completa-cep.html`** — a página integrada. Use a barra inferior:
- **Sem CEP** → comparação com "frete de referência" (o estado do ciclo 1).
- **CEP SP · reordena** → aplica 01310-100; a pilha **reordena** e o melhor migra para
  Ybera.com (frete grátis na capital). É o momento-herói: os cards deslizam para a nova posição.
- **CEP AC · não entrega** → aplica 69900-970; o TikTok Shop aparece como **"não entrega
  neste CEP"** (visível, com aviso, sem preço nem botão de compra).
- **Recarregar (CEP some)** → prova do CEP transitório: nada é guardado, recarregou → volta
  ao estado sem CEP.

Também dá pra digitar o CEP no campo (01310-100 ou 69900-970 são os exemplos mapeados;
outros mostram o erro "CEP não encontrado").

| Peça | O que documenta |
|------|-----------------|
| 07 | Entrada de CEP — 5 estados: vazio/convite · digitando · calculando · aplicado · inválido |
| 08 | Card de canal com frete por CEP — frete de referência · frete p/ CEP · frete grátis · **não entrega neste CEP** |
| 09 | Reordenação da pilha — o momento-herói de motion (FLIP): o "melhor" migrando de canal |
| 10 | **Página completa integrada** — hero + CEP + pilha + fluxo de compra |

## Decisões-chave (rastro completo em `spec-comparador-publico.md`)

- **O CEP é refinamento, não pedágio:** a comparação já funciona sem CEP ("frete de
  referência"); o CEP *melhora* a informação, nunca barra o conteúdo.
- **Honestidade do frete como régua de craft:** todo valor de frete declara a que se refere
  ("de referência" ou "para [CEP]"). Nunca há um número de frete ambíguo na tela.
- **"Não entrega neste CEP" ≠ "canal inválido":** o canal que existe mas não entrega pra
  aquele CEP fica **visível** com aviso âmbar (esconder seria mentir por omissão). Diferente
  do canal inválido do RF-006, que some.
- **CEP transitório (LGPD):** o CEP é usado só na sessão, sem `localStorage`, sem
  `sessionStorage`, sem query string — provado por asserção. Microcopy "não guardamos seu CEP"
  torna a privacidade visível já no campo.
- **Reordenação animada (FLIP):** quando o melhor troca de canal, os cards deslizam para a
  nova posição — o cliente vê que o CEP mudou algo real. Desligado sob `prefers-reduced-motion`.
- **Acessibilidade AA calculada** — todos os pares de cor do ciclo verificados (5,3–7,7:1);
  alvo de toque do "Trocar" corrigido para 44px no portão.
- **Responsivo (mobile-first, não mobile-only):** no celular é coluna única; **no desktop
  (≥900px) são duas colunas** — produto + hero + CEP à esquerda (sticky), comparação à
  direita. A reordenação por CEP funciona nos dois breakpoints.

## Pendências carimbadas

| # | Pendência | Dono | Prazo/gatilho |
|---|-----------|------|---------------|
| 1 | Consulta **real** de frete por CEP (transportadora/API) — a POC simula os valores | Engenharia + Produto | implementação |
| 2 | Estado "calculando" com **latência real** da API (a POC recalcula instantâneo) e skeleton do recálculo | Engenharia | implementação |
| 3 | Barra de estados (dev only) removida na peça 10 na implementação | Engenharia | implementação |
| 4 | Regra de negócio do frete grátis (ex.: Ybera.com grátis na capital SP) — confirmar condições reais | Produto/Comercial | antes do go-to-market |
| 5 | Cobertura de "não entrega neste CEP" por canal — mapear quais canais/regiões realmente não entregam | Produto | refinamento da Feature |
| 6 | Ícones provisórios (SVG inline) — biblioteca de ícones do DS segue pendente (decisão: provisório aceito) | Guardião do DS | decisão definitiva |
| 7 | Fontes via Google Fonts na POC — produção usa o self-host já existente | Engenharia | implementação |

## Relação com o ciclo 1

O ciclo 1 (`../entrega/`) entregou o comparador com frete de referência. Este ciclo 2 é o
addendum de frete por CEP. A página 10 daqui é a evolução da página 05/06 do ciclo 1.

---
_Ciclo comparador-publico · ciclo 2 · fase 04 · 2026-07-15 · Processo Compacto AI-First Ybera_
