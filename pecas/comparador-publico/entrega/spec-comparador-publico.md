# Spec — comparador-publico

status: entregue
carimbo-entrega: demo
ciclo: 1
atualizada: 2026-07-15

## Resultado esperado
O cliente final (anônimo) que recebe um link de indicação consegue, ao abrir a página do
comparador, ver o mesmo produto nos canais de venda disponíveis (Wake, Shopee, TikTok Shop)
ordenados por menor custo total (preço + frete) e escolher onde comprar sem fricção.
Critério de sucesso observável: abrindo o link, o cliente vê os canais válidos ordenados
por menor custo, canais indisponíveis/sem vínculo/sem estoque somem sem deixar rastro de
erro, e o clique em "Comprar" leva ao redirecionamento para o canal escolhido com o vínculo
da influenciadora preservado.

## Usuário primário
Cliente Final — consumidor anônimo que recebe o link via redes sociais, WhatsApp ou lives.
Sem login, sem cadastro, acessando predominantemente via mobile (4G como referência de
performance).

## Escopo
- Dentro:
  - Página pública do comparador (RF-004 do DRF): mesmo produto (SKU único) em até 3 canais
  - Ordenação por menor custo (preço + frete) e ocultação silenciosa de canal inválido (RF-006)
  - Estados de tela: loading, sucesso (1 a 3 canais), indisponibilidade total (zero canais
    válidos), e o clique em "Comprar" → redirecionamento (RF-007)
  - Tratamento visual do caso "sem vínculo" como estado comum, não exceção (ver premissa 1)
- Fora:
  - Geração do link/slug encurtado (RF-002) — assume-se resolvido no backend, esta demanda
    parte de um slug já resolvido
  - Onboarding/autorização OAuth do afiliado (RF-008) e painel de vínculos da Tela A do
    Escritório Virtual (RF-009) — pertencem à jornada da influenciadora, não do comparador;
    ver nota no Rastro sobre a POC de referência desatualizada (`poc-hub-ybera.vercel.app`)
  - Sincronização/cache de preço e frete (RF-005) — backend
  - Comissão, ganhos ou qualquer dado financeiro — domínio exclusivo do Escritório Virtual
  - Internacionalização e integração com Mercado Livre (H2/H3)

## Restrições
- Guardrails visuais: `design-system/tokens.json` — nenhum valor de cor/espaço/tipografia
  inventado. Pendências conhecidas sem token ainda: biblioteca de ícones e assets de marca
  por canal (ver `design-system/pendencias-tokens.md`) — usar os SVGs provisórios em
  `pecas/comparador-publico/assets/` até o guardião do DS decidir
- Acesso público, sem autenticação, sem fricção, sem login
- Mobile-first: LCP < 2,5s · TTI < 3,5s
- Zero PII do cliente — CEP transitório (sem armazenamento, sem fingerprinting), postura
  LGPD-mínima
- Canal indisponível ou sem vínculo é **ocultado**, nunca exibido com erro visível ao cliente
- Nenhum dado de comissão, ganho ou financeiro exibido
- v1 é Brasil apenas

## Direção estética
Decidida na entrada da fase 02 (2026-07-15) via frontend-design, dentro dos guardrails do
KZ Design System.

- **Produtos-régua:** a experiência de decisão limpa de um comparador de viagem/preço
  (Google Flights / Kayak — a hierarquia de "melhor opção" é instantânea), com o calor
  editorial de uma marca de beleza premium (Sephora / Glossier na temperatura, não no
  layout). O cliente não deve perceber que está num "HUB" (H-UX-05) — parece a vitrine da
  própria influenciadora.
- **Personalidade (5 adjetivos):** confiável, editorial, quente-mas-clean, decisiva, mobile-nativa.
- **Composição/escala:** mobile-first, coluna única, respiração generosa. Hero curto do
  produto no topo (nome + imagem `produto-hero.jpg`), seguido da pilha de canais como o
  ato principal. O canal de menor custo total ganha destaque estrutural (não só um selo):
  card elevado, primeiro da pilha, com o rótulo de recomendação. Densidade baixa — cada
  card é uma decisão, não uma linha de tabela.
- **Uso da marca (calor Ybera):** base neutra clara e arejada (`neutral/50–100`), tipografia
  em `neutral/900`. O rosa da marca (ramp **Club**, `club/500` #ED1A57 / `club/600` #C70F43)
  é acento cirúrgico — reservado ao destaque de "melhor escolha" e ao CTA primário, nunca
  como fundo chapado. Marcas de canal aparecem com seus próprios logos (assets provisórios),
  neutras, sem competir com o rosa Ybera.
- **Tipografia:** Syne (display, títulos — nome do produto, preços) + Nunito Sans (corpo,
  labels, frete). O preço total é o maior elemento tipográfico de cada card.
- **Motion (calibrado na fase 02 com emil-design-eng):** um único page-load orquestrado —
  hero aparece, depois a pilha de canais entra em stagger de cima pra baixo (o melhor
  primeiro, reforçando a hierarquia). Press-state tátil no CTA. Sem motion decorativo que
  atrase o LCP (< 2,5s é restrição dura).
- **Ícones:** pendência de token aberta (`pendencias-tokens.md` item 1) — usar SVG inline
  mínimo/emoji sóbrio como placeholder, marcado como provisório no Rastro.

## Decisões anteriores
- SKU interno Ybera é a chave única de produto entre os 3 canais — se um canal não retornar
  o SKU, o canal é ocultado (guarda-corpo), nunca exibido com produto divergente
- Link é encurtado (slug), sem canal como parâmetro — resolvido pelo HUB no carregamento
- O comparador nunca exibe % de comissão nem dado financeiro (invariante do sistema)
- Wake é o canal-base garantido (sem OAuth); Shopee e TikTok exigem vínculo ativo do afiliado
  para aparecerem — ver premissa 1 abaixo sobre cobertura esperada desse vínculo

## Premissas por risco
| # | Premissa | Criticidade | Evidência | Dono | Prazo |
|---|----------|-------------|-----------|------|-------|
| 1 | Cobertura real de influenciadoras com Shopee/TikTok autorizados é incerta (Q-11/Q-12 do DRP) — "sem vínculo" pode ser o estado mais frequente do canal, não exceção | alta | palpite (sem dado hoje) | Rolim + Romulo Alves (Comercial) + Vinícius Graff (CTO) — fora do escopo de Design | antes do refinamento técnico da Feature |
| 2 | H-UX-01: comparador mobile-first ordenado por custo-benefício é suficiente sem filtros adicionais | alta (define escopo da peça) | palpite do Produto | Design (esta demanda testa) | ao final deste ciclo |
| 3 | Critério de desempate quando preço+frete empatam entre canais (BLOCKED-03 do DRF) | média | sem evidência | Produto + Engenharia | refinamento técnico |
| 4 | Comportamento quando cache expira em todos os canais simultaneamente (BLOCKED-06 do DRF) | média | sem evidência | Engenharia | refinamento técnico |
| 5 | H-UX-03: ocultar graciosamente é preferível a exibir erro — não gera confusão no cliente | média | palpite do Produto, plausível | Design (esta demanda valida) | ao final deste ciclo |
| 6 | Frete exibido no comparador é o padrão por canal (do cache RF-005), sem CEP do cliente — suficiente para a decisão de compra no v1 (Δspec do ciclo 1) | média | palpite; peça demo assume isso | Produto (Victor/Rolim) | refinamento da Feature |

## Quebra de tarefas
1. Card de canal (preço, frete, total, CTA "Comprar") — peça atômica
2. Lista de canais ordenada por menor custo (estado sucesso, 1 a 3 canais visíveis)
3. Estado de indisponibilidade total (zero canais válidos)
4. Estado de loading
5. Página completa do comparador — composição mobile-first de dentro pra fora
6. Transição/feedback do clique em "Comprar" (redirecionamento)

## Critérios de verificação
O portão confere olhando a peça renderizada (nunca o código):
- O canal de menor custo total é visualmente o mais destacado / primeiro
- Canais ocultos não deixam espaço vazio, placeholder ou mensagem de erro
- Nenhum dado de comissão, ganho ou financeiro aparece em nenhum estado
- Composição funciona mobile-first, sem scroll horizontal, sem quebra de layout
- O estado "sem vínculo"/canal oculto foi tratado como cenário comum na direção estética,
  não como caso raro maquiado
- CTA "Comprar" comunica claramente a ação de redirecionamento externo

## Rastro
[2026-07-15] [fase 01] Spec criada a partir dos insumos em `insumos/` (brief.md v1.1,
drp.md v1.8, drf.md v0.4) — motivo: pasta `specs/` estava vazia (só `.gitkeep`); nenhuma
spec formal existia ainda, apesar de já haver artefatos de um ciclo anterior
(`pecas/comparador-publico/assets`, `aprendizados.md` e `design-system/pendencias-tokens.md`
datados de 2026-07-14). Os arquivos de peça desse ciclo anterior não estão presentes no
disco (só sobreviveram assets e as notas roteadas) — tratado como reinício do ciclo 1,
preservando os aprendizados e pendências de token como entrada, não descartando-os.
[2026-07-15] [fase 01] Escopo recortado para a capacidade 1 do brief (Comparador público)
apenas — motivo: regra de 1 demanda = 1 tarefa principal. Onboarding/autorização (cap. 4) e
status de integração (cap. 3) ficam para demandas separadas, pois pertencem à jornada da
influenciadora no Escritório Virtual, não ao comparador do cliente final.
[2026-07-15] [fase 01] Premissas 1, 3 e 4 têm dono fora de Design (Produto/Comercial/CTO/
Engenharia) e prazo definido no DRP — não bloqueiam a spec, mas condicionam a peça: o
componente precisa projetar bem o estado "sem vínculo" como comum, e a peça atômica de
card de canal deve reservar um comportamento de desempate simples (ex.: ordem de chegada)
sem travar no bloqueio de Engenharia.
[2026-07-15] [fase 02] Direção Estética registrada na spec (comparador de decisão limpa ×
calor editorial de beleza; rosa Club como acento cirúrgico; Syne para preços/títulos).
Dados de exemplo fixados para TODAS as peças (aprendizado do ciclo anterior): Escova
Progressiva Fashion Gold 500g — Shopee R$179,90+24,90=204,80 (melhor) · TikTok
R$184,90+22,00=206,90 · Ybera.com R$189,90+19,90=209,80.
[2026-07-15] [fase 02] Peça 01 (card de canal) gerada em `pecas/comparador-publico/
01-card-canal.html`, 2 variantes (melhor custo / padrão). Correções durante a geração:
breakdown de preço unificado sob o total (as duas variantes divergiam), quebras de linha
controladas (total nowrap, breakdown em 2 linhas intencionais), economia virou pill verde.
Aguardando veredicto do designer. Δtokens candidatos: (a) sombra de elevação do card
destaque (`--shadow-lift`) não existe no DS — só há `$shadow-sm`; valor provisório com
tinta do club-600 proposto para apreciação do guardião; (b) ícones ★ e seta do CTA são
SVG/glifo inline provisórios (pendência #1 de `pendencias-tokens.md`).
[2026-07-15] [fase 02] Peça 01 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02] Peça 02 (pilha ordenada) gerada em `pecas/comparador-publico/
02-pilha-canais.html` com 3 cenários: A (3 canais), B (2 canais, TikTok oculto sem rastro),
C (1 canal — estado comum da premissa 1). Decisões novas: (a) cabeçalho "Onde comprar" +
linha de frescor ("Preços atualizados há X min · N lojas", ponto verde) — honesto com o
cache de 30 min do RNF-Frescor, sem prometer tempo real; (b) badge "Melhor custo total" só
aparece com ≥2 canais visíveis — comparação de um item só não é comparação; (c) nota de
confiança no rodapé da pilha ("Sua compra é feita direto na loja escolhida...") — reforça
H-UX-05 (transparência do HUB) e prepara o redirecionamento externo. Aguardando veredicto.
[2026-07-15] [fase 02] Peça 02 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02] Peça 03 (loading + indisponibilidade total) gerada em `pecas/
comparador-publico/03-estados-loading-indisponivel.html`. Decisões: (a) skeleton espelha
1:1 a anatomia do card real (logo/nome/preço/CTA) — evita layout shift no swap, protegendo
o LCP; shimmer CSS-only com `prefers-reduced-motion` respeitado; (b) indisponibilidade
total em tom âmbar (warning do DS), nunca vermelho — é pausa temporária, não erro; copy
"As lojas deram uma pausa" + explicação honesta do ciclo de 30 min + ação "Verificar de
novo" (retry manual, zero coleta). Nenhum botão de compra no estado vazio (RF-004).
Aguardando veredicto.
[2026-07-15] [fase 02] Peça 03 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02] Peça 04 (hero do produto) gerada em `pecas/comparador-publico/
04-hero-produto.html`. Decisões: (a) logo Ybera discreto no topo — é a marca do PRODUTO
(confiança), não branding do HUB; H-UX-05 preservada, a palavra "HUB" não aparece em lugar
nenhum da página; (b) pill "Indicação de Camila" (avatar-inicial em club-100) sobreposta à
foto — materializa o vínculo social do JTBD do cliente ("de quem me indicou") usando dado
da influenciadora, não do cliente (LGPD ok); (c) foto do produto em 16:10 contido com
scrim sutil na base — não fullbleed, protegendo o LCP; (d) lead de uma linha ("Compare
preço e frete e compre na loja que preferir") faz a ponte para a pilha. Nome fictício
"Camila" e avatar-inicial são dados de exemplo — produção recebe nome real via slug.
Aguardando veredicto.
[2026-07-15] [fase 02] Peça 04 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02] Peça 05 (página completa) gerada em `pecas/comparador-publico/
05-pagina-completa.html`. Composição hero+pilha+estados com: (a) page-load orquestrado —
reveal em stagger (hero 0ms → título 90ms → cabeçalho da pilha 180ms → cards 260/340/420ms,
melhor primeiro), curva ease-out, desligado sob `prefers-reduced-motion`; (b) barra de
cenários A–E fixa no rodapé, marcada DEV ONLY (removida na entrega) — permite ao portão
criticar os 5 estados olhando uma peça só; (c) no estado vazio o hero permanece — produto
e indicação seguem dando contexto; só a pilha é substituída. Verificado no browser: os 5
cenários alternam sem quebra. PERGUNTA ABERTA registrada: o frete exibido não pede CEP —
assume frete-padrão por canal vindo do cache (RF-005/RF-007). Se Produto quiser frete por
CEP (o brief cita "CEP transitório"), é iteração sobre esta peça, não bloqueio. Dono
sugerido: Produto (Victor/Rolim). Aguardando veredicto.
[2026-07-15] [fase 02] Peça 05 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02] Peça 06 (feedback do clique → redirecionamento, RF-007) gerada em
`pecas/comparador-publico/06-feedback-redirecionamento.html`. Fluxo feliz: press → CTA em
loading ("Abrindo a Shopee…", spinner) ~550ms → overlay de saída (fundo claro + blur, logo
do canal em destaque, "Levando você para a Shopee", dots pulsando) → redirect real na
implementação. Exceção canal-caiu-no-clique: CTA vira "Indisponível agora" (desabilitado,
cinza), nota âmbar inline ("Escolha outra loja abaixo — os preços continuam valendo") e o
card PERDE o destaque de recomendação (badge/pill/borda saem — a recomendação migra para
o próximo válido na página real). Corrigido durante a geração: pill de economia vazava
sem estilo quando o card era rebaixado → regra `:not(.channel--best)` esconde. Copy do
overlay evita prometer desconto/benefício: "Você conclui a compra direto na loja, do jeito
de sempre" (só confiança, sem mecânica do vínculo — H-UX-05). Simulações dev-only na barra
inferior. Aguardando veredicto.
[2026-07-15] [fase 02] Peça 06 ACEITA pelo designer sem correções. Fase 02 encerrada:
6/6 peças da quebra de tarefas geradas e aceitas. Próximo: portão de qualidade (fase 03).
[2026-07-15] [fase 03] PORTÃO rodado (rubric v3) — veredicto do designer: EDITAR. 8
problemas acionáveis (7 bloqueios + 1 ajuste): 4× contraste WCAG (4.1), 2× valores fora
de token (2.1), 1× percurso não fechava na peça montada (3.1), 1× focus-visible (4.3).
2 notas [fora do rubric] para a fase 04: (a) performance/LCP de fontes externas — o rubric
não tem seção de performance (Δrubric candidato); (b) contraste de componente desabilitado
— WCAG isenta, só registro. Craft (seção 6) passou sem ressalva.
[2026-07-15] [fase 02·editar] Correções cirúrgicas aplicadas conforme decisão por item do
designer: #1 caption→neutral-600, trust-note→neutral-700 · #2 badge→club-600 · #3 pill→
green-800 (token novo no ramp, já existia no DS) · #4 frescor→neutral-700 + 14px · #5
escala: total 22→24px/32, textos 13→14px, overlay h2 20→24px, paddings 10→12px, outline
3→2px, spinner 2.5→2px, logo 44→48px · #6 --shadow-lift REJEITADA pelo designer → tudo em
$shadow-sm; overlay alfa .94→alfa/90-light (rgba 255,255,255,.9). Δtoken shadow-lift sai
da lista de candidatos · #7 fluxo de clique integrado à página completa — verificado no
browser de ponta a ponta: clique → CTA loading → overlay → redirect REAL abriu
shopee.com.br (URLs de demonstração; produção usa link com vínculo RF-002) · #8
focus-visible no retry. Efeito colateral positivo do #5: a pill de economia migrou para
sob o total (coluna de preço), resolvendo o overflow do total 24px e aproximando a
economia do número a que se refere. Peças atualizadas: todas. Aguardando re-rodada do
portão (loop 02⇄03).
[2026-07-15] [fase 03] PORTÃO re-rodado sobre as peças corrigidas — veredicto do designer:
APROVAR. Todos os bloqueios saneados com evidência (contrastes 5.30/6.78/5.87/5.85 PASS;
percurso completo verificado no browser com redirect real). Ficam para a fase 04: 2 notas
[fora do rubric] (Δrubric candidato de performance; nota de disabled) + pendências de
token já carimbadas (ícones, marca de canal). Ciclo segue para entrega.
[2026-07-15] [fase 04] ENTREGA fechada, carimbo DEMO. Pacote em `pecas/comparador-publico/
entrega/` (6 peças + spec + LEIA-ME com 7 pendências carimbadas, cada uma com dono).
Aprendizados roteados: Δrubric → rubric v4 (+seção 7 Performance percebida, nascida da
nota real de fontes externas vs. LCP; +7.2 skeleton-espelha-anatomia); Δspec → premissa 6
(frete-padrão sem CEP, dono Produto); Δtokens → NENHUM novo (shadow-lift rejeitada no
portão; ícones e marca de canal seguem como pendências já carimbadas em
`design-system/pendencias-tokens.md`); notas → aprendizados.md (disabled 4.07:1 isento
por WCAG; confirmação da prática de dados-fixos-cedo). Status da spec: entregue. Fim do
ciclo 1 — Δspec/Δrubric aplicados são entrada da próxima fase 01.
