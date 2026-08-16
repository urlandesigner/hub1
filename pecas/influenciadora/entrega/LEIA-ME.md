# Entrega — Atualização da POC de Referência (Tela A · painel de vínculos + modais)

## 🏷️ Carimbo: **DEMO**

Protótipo navegável de design, **não é código de produção**. Estados são simulados
(a autorização OAuth real é RF-008 do DRF), dados são fictícios ("Camila Duarte") e a
barra de estados no rodapé da peça 06 é ferramenta de revisão (dev only).

## O que é

Atualização da POC de referência (`poc-hub-ybera.vercel.app`) para o padrão de vinculação
decidido no Brief de Design v1.1: o painel de vínculos da Tela A (Catálogo do Escritório
Virtual) com **três estados por canal** — vinculado / nunca vinculou / **vínculo expirado
(novo, RF-11)** — e os **dois modais** (A: primeira vinculação · B: reautorização), tudo
via link contextual → Modal, sem navegar para fora da tela (H-UX-04).

Réplica fiel do app real (`app.yberaclub.com`) a partir de captura dev-mode autenticada:
tokens `b2c-*` do bundle, fontes Nunito, estrutura sidebar+topbar+grid real.

**Comece por `06-fluxo-completo.html`** — Tela A interativa: clique nos links do painel
para abrir os modais e simular a autorização; barra inferior alterna os estados do painel.

| Peça | O que documenta |
|------|-----------------|
| 01 | Linha de canal — os 3 estados isolados |
| 02 | Painel completo — cenário didático (1 de 3) + estado-alvo (3 de 3) + loading + erro de leitura |
| 03 | Modal A — primeira vinculação (tom onboarding) |
| 04 | Modal B — reautorização (tom reconexão, nunca "novata") |
| 05 | Tela A completa estática — sidebar + filtros + painel novo + grid com CTA "HUB Ybera" |
| 06 | **Fluxo montado interativo** — link → modal → estado atualizado |

## Decisões-chave (rastro completo em `spec-atualizacao-poc-referencia.md`)

- **3 estados distinguíveis à primeira vista:** verde=confirmação sem ação · neutro+link
  rosa=convite (nunca erro) · âmbar=reconexão (nunca vermelho, nunca "novata")
- **Contador de progresso** ("1 de 3 canais recebendo suas vendas pelo link do Hub") —
  enquadra vínculo como progresso, não pendência
- **Modal A ≠ Modal B deliberadamente:** badge rosa/faísca vs. âmbar/renovar; 3 passos vs.
  2; "você só faz uma vez" vs. "você já fez isso antes — ela só expirou, por segurança"
- **Wake nunca mostra ação de vinculação** (vínculo nativo)
- **Rótulo "HUB Ybera" validado pelo designer** (premissa 4 do ciclo) — sem emoji, com
  ícone de link
- **Estados do painel:** skeleton espelhando a anatomia + erro de leitura gracioso que
  não esconde o catálogo
- **Acessibilidade AA calculada e corrigida** — incl. 2 casos em que a convenção do app
  real reprovaria (ver pendência 3 abaixo)

## Pendências carimbadas

| # | Pendência | Dono | Prazo/gatilho |
|---|-----------|------|---------------|
| 1 | Vídeos tutoriais dos Modais A e B são placeholder — roteiro e gravação | Produto/Operação | antes do go-to-market |
| 2 | Cobertura real de OAuth Shopee/TikTok (Q-11/Q-12) — painel projetado para "nunca vinculou" como estado comum | Rolim + Romulo Alves + Vinícius Graff | antes do refinamento da Feature |
| 3 | **Feedback ao time do app:** 2 convenções do app real reprovam WCAG AA — chip "Aprovado" (positive-30/positive-20 ≈ 2.4:1) e rótulos de seção da sidebar (≈ 2.55:1). A POC usa pares AA da mesma rampa | Guardião do DS / time do Escritório | próxima revisão do app |
| 4 | Ícones da sidebar são aproximações SVG (biblioteca de ícones do DS segue pendente — decisão: provisório aceito) | Guardião do DS | decisão definitiva do DS |
| 5 | Autorização OAuth real (URLs, callback, estados `aguardando_autorizacao`/`erro` do DRF) — a POC simula a concessão | Engenharia (RF-008) | implementação |
| 6 | Remover barra de estados (dev only) da peça 06 na implementação | Engenharia | implementação |
| 7 | Fontes via Google Fonts na POC — produção usa o self-host já existente do app | Engenharia | implementação |
| 8 | Captura dev-mode de 2026-06-26 — revalidar contra o app antes da POC oficial de handoff | Design | POC oficial |

---
_Ciclo atualizacao-poc-referencia · fase 04 · 2026-07-15 · Processo Compacto AI-First Ybera_
