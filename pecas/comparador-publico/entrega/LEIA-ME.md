# Entrega — Comparador Público (HUB Inteligente Ybera)

## 🏷️ Carimbo: **DEMO**

Protótipo navegável de design, **não é código de produção**. Dados de preço/frete são
fixos (conjunto de exemplo), URLs de destino são demonstrativas e a barra de cenários no
rodapé das peças 05/06 é ferramenta de revisão (dev only) — nada disso vai para produção.

## O que é

Peças da capacidade 1 do Brief de Design v1.1 (HUB-001): a página pública de comparação
de preço + frete entre canais (Wake/Ybera.com, Shopee, TikTok Shop), mobile-first, sem
login, acessada via link encurtado `hub.ybera.com/r/{slug}`.

**Comece por `05-pagina-completa.html`** — é a composição final com todos os estados
(use a barra A–E no rodapé). As demais peças documentam a construção de dentro pra fora:

| Peça | O que documenta |
|------|-----------------|
| 01 | Card de canal (variantes: melhor custo / padrão) |
| 02 | Pilha ordenada + cenários de ocultação (3/2/1 canais) |
| 03 | Loading (skeleton) + indisponibilidade total |
| 04 | Hero do produto (marca, indicação, imagem) |
| 05 | **Página completa** — hero + pilha + estados + motion |
| 06 | Feedback do clique → redirecionamento (RF-007) + exceção canal-caiu |

## Decisões-chave (rastro completo em `spec-comparador-publico.md`)

- **Hierarquia estrutural do melhor custo**: borda + badge + CTA rosa Club; demais cards
  neutros. Badge só existe com ≥2 canais visíveis.
- **Ocultação sem rastro** (H-UX-03): canal inválido some; contagem de lojas ajusta.
- **"Sem vínculo" é estado comum, não exceção** (risco Q-11/Q-12): cenário de 1 canal
  (só Wake) desenhado como primeira classe.
- **Sem branding "HUB"** (H-UX-05): logo Ybera = marca do produto; a palavra HUB não
  aparece.
- **Frescor honesto**: "Preços atualizados há X min" (cache 30 min, RNF-Frescor), nunca
  "tempo real".
- **Zero PII**: nenhuma coleta; retry manual; métricas ficam para RF-011 (fora desta peça).
- **Acessibilidade AA verificada**: contrastes ≥ 4.5:1 (evidência no rastro), alvos ≥ 48px,
  focus-visible, `prefers-reduced-motion`.

## Pendências carimbadas

| # | Pendência | Dono | Prazo/gatilho |
|---|-----------|------|---------------|
| 1 | Biblioteca de ícones do DS (★/setas/spinner são SVG inline provisórios) | Guardião do DS | antes da POC oficial |
| 2 | Assets/tokens de marca de canal (logos em `assets/` são provisórios) | Guardião do DS | antes da POC oficial |
| 3 | Frete exibido é padrão por canal (sem CEP) — validar se v1 pede frete por CEP | Produto (Victor/Rolim) | refinamento da Feature |
| 4 | Nome/avatar da influenciadora ("Camila") são placeholders — produção resolve via slug | Engenharia (RF-002) | implementação |
| 5 | URLs de destino são demonstrativas — produção usa link com vínculo (RF-002/RF-007) | Engenharia | implementação |
| 6 | Remover barra de cenários (dev only) das peças 05/06 na implementação | Engenharia | implementação |
| 7 | Estratégia de fontes (Syne/Nunito Sans hoje via Google Fonts) — self-host/preload para LCP < 2,5s | Engenharia + DS | implementação |

---
_Ciclo comparador-publico · fase 04 · 2026-07-15 · Processo Compacto AI-First Ybera_
