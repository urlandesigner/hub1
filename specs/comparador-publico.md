# Spec — comparador-publico

status: ativa
ciclo: 2
carimbo-entrega-ciclo-1: demo (2026-07-15, `pecas/comparador-publico/entrega/`)
atualizada: 2026-07-15

## Resultado esperado
O cliente final (anônimo) que recebe um link de indicação consegue, ao abrir a página do
comparador, ver o mesmo produto nos canais de venda disponíveis (Wake, Shopee, TikTok Shop)
ordenados por menor custo total (preço + frete) e escolher onde comprar sem fricção.
Critério de sucesso observável: abrindo o link, o cliente vê os canais válidos ordenados
por menor custo, canais indisponíveis/sem vínculo/sem estoque somem sem deixar rastro de
erro, e o clique em "Comprar" leva ao redirecionamento para o canal escolhido com o vínculo
da influenciadora preservado.

**Ciclo 2 — frete por CEP (recorte deste ciclo):** o cliente informa o CEP (opcional,
transitório) e o comparador passa a exibir o frete real de cada canal para aquele CEP,
reordenando por menor custo total. Critério de sucesso observável do ciclo: sem CEP,
Frete e Prazo de entrega ficam sinalizados como "A calcular" (nenhum valor é mostrado
antes do cliente informar o CEP — decisão revisada em 2026-07-16, ver Rastro) e o Total
exibe só o preço do produto ("A partir de R$ X"), sem badge de melhor oferta nem
ordenação por custo (ordem neutra, a de cadastro dos canais); informado um CEP válido,
os fretes e prazos aparecem, a ordenação recalcula visivelmente (o "melhor" pode trocar
de canal sem quebrar a página) e nenhum dado do cliente persiste — recarregou, o CEP
sumiu.

## Usuário primário
Cliente Final — consumidor anônimo que recebe o link via redes sociais, WhatsApp ou lives.
Sem login, sem cadastro, acessando predominantemente via mobile (4G como referência de
performance).

## Escopo
- Dentro (ciclo 1 — ENTREGUE, carimbo demo):
  - Página pública do comparador (RF-004 do DRF): mesmo produto (SKU único) em até 3 canais
  - Ordenação por menor custo (preço + frete) e ocultação silenciosa de canal inválido (RF-006)
  - Estados de tela: loading, sucesso (1 a 3 canais), indisponibilidade total (zero canais
    válidos), e o clique em "Comprar" → redirecionamento (RF-007)
  - Tratamento visual do caso "sem vínculo" como estado comum, não exceção (ver premissa 1)
- Dentro (ciclo 2 — frete por CEP):
  - Entrada de CEP do cliente: opcional, transitória, sem persistência — a página nunca
    força o CEP como pré-requisito de acesso (sem CEP = Frete e Prazo em branco/"A calcular",
    Total mostra só o preço do produto; decisão revisada em 2026-07-16, ver Rastro — antes
    disso o padrão era mostrar frete de referência do cache)
  - Frete por canal recalculado para o CEP informado + reordenação visível da pilha
  - Estados novos: calculando frete, CEP inválido, frete indisponível para aquele CEP em
    um canal (sem derrubar o canal inteiro), e troca de CEP
  - Rotulagem honesta do frete: sem CEP não existe valor de frete pra rotular (campo fica
    "A calcular"); com CEP aplicado, o chip "Frete para {CEP}" já identifica a fonte —
    dispensa rótulo repetido por card
  - **Responsivo mobile E desktop (correção de escopo 2026-07-15, escalada durante a fase 04):**
    mobile-first NÃO é mobile-only. No desktop (≥900px) a página usa layout de DUAS COLUNAS —
    produto + hero + entrada de CEP à esquerda (coluna sticky), lista "Onde comprar" à direita.
    Abaixo de 900px, coluna única (o layout mobile já validado). Decisão do designer.
- Fora (ciclo 2):
  - Cálculo real de frete por CEP no backend (API/arquitetura — Engenharia; a peça simula)
  - Autopreenchimento por geolocalização/IP (fingerprinting proibido — LGPD-mínima)
  - Prazo de entrega por canal (só custo; prazo é candidato a ciclo futuro se Produto pedir)
  - Persistência/lembrança do CEP entre visitas (violaria CEP transitório)
- Fora (da demanda, desde o ciclo 1):
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

### Direção estética — ciclo 2 (frete por CEP), decidida na entrada da fase 02 (2026-07-15)
Estende a direção do ciclo 1 sem reabri-la. A aposta do ciclo 2:
- **O CEP é um refinamento, não um pedágio.** A entrada de CEP não bloqueia a comparação:
  a página já mostra tudo com "frete de referência"; o CEP *melhora* a informação. Visual:
  uma faixa leve e convidativa entre o hero e a pilha ("Ver o frete certo pro seu endereço"),
  nunca um formulário que barra o conteúdo. Densidade baixa, uma linha.
- **Honestidade do frete é a régua de craft do ciclo.** Todo valor de frete diz a que se
  refere: "frete de referência" (neutro, `text/tertiary`) antes do CEP; "frete para
  01310-100" depois. Nunca há um número de frete ambíguo na tela — é o que separa esta peça
  de um comparador genérico que mente sobre o que sabe.
- **A reordenação é o momento-herói (motion, calibrado com emil-design-eng).** Quando o CEP
  entra e o "melhor" troca de canal, a pilha reordena com transição FLIP visível (cards
  deslizam para a nova posição, ~360ms ease-out), os números de frete fazem crossfade, e o
  selo "Melhor custo total" migra com destaque momentâneo. O cliente *vê* a lista se
  reorganizar — entende que o CEP mudou algo real. Tudo desligado sob `prefers-reduced-motion`
  (troca instantânea, sem deslize).
- **Cor:** base neutra do ciclo 1. Rosa Club (`club-500/600`) só no CTA de aplicar CEP e no
  foco. Verde (`green-800` sobre `green-100`, o par AA do ciclo 1) para "frete grátis" —
  reaproveita a pill de economia. Âmbar (`amber` do DS) para o aviso "não entrega neste CEP",
  nunca vermelho (não é erro do cliente; vermelho fica reservado a CEP inválido no input).
- **Copy (design:ux-copy):** convite sem pressão ("Ver frete pro seu endereço" > "Digite seu
  CEP"), estado aplicado que devolve controle ("Frete para 01310-100 · trocar"), erro que
  orienta ("CEP não encontrado — confira os 8 dígitos"), e o aviso de canal sem entrega que
  não culpa nem esconde ("A loja não entrega neste CEP").
- **LGPD visível como craft:** o estado aplicado deixa claro que o CEP é só daquela sessão —
  microcopy discreta "usado só agora, não guardamos" perto do campo. Privacidade como
  reforço de confiança, não como letra miúda.

### Dataset de exemplo fixado — ciclo 2 (imutável entre todas as peças)
Preços do produto são os mesmos do ciclo 1 (imutáveis); só o frete varia por CEP.
- **Produto:** Escova Progressiva Fashion Gold 500g · indicação de "Camila".
- **Preços (fixos):** Shopee R$ 179,90 · TikTok Shop R$ 184,90 · Ybera.com R$ 189,90.
- **Frete de referência (sem CEP — cache RF-005, herdado do ciclo 1):** Shopee R$ 24,90
  (total 204,80) · TikTok R$ 22,00 (206,90) · Ybera.com R$ 19,90 (209,80). Ordem:
  **Shopee < TikTok < Ybera** — melhor = Shopee.
- **CEP exemplo A = 01310-100 (São Paulo, SP):** Ybera.com **frete grátis** (0,00 → total
  189,90) · Shopee R$ 16,90 (196,80) · TikTok R$ 18,00 (202,90). Nova ordem: **Ybera <
  Shopee < TikTok** — o melhor TROCA de Shopee para Ybera.com (o herói da reordenação).
- **CEP exemplo B = 69900-970 (Rio Branco, AC):** Shopee R$ 42,90 (222,80) · Ybera.com R$
  34,90 (224,80) · TikTok Shop **não entrega neste CEP** (canal mostrado com aviso âmbar,
  sem total nem CTA de compra — premissa 10). Ordem entre os que entregam: Shopee < Ybera.

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
| 6 | ~~Frete padrão por canal sem CEP é suficiente~~ **RESOLVIDA + ENTREGUE (2026-07-15): frete por CEP é o ciclo 2, entregue (DEMO).** Cliente informa CEP (transitório, sem armazenamento — LGPD, provado por asserção) e o comparador exibe frete por canal com reordenação. Peças 07–10 em `pecas/comparador-publico/entrega-ciclo2/` | — | ciclo 2 entregue; consulta real de frete e regra de frete grátis pendentes (Engenharia/Produto) | Design (feito) + Engenharia/Produto (impl.) | entregue |
| 7 | **[ciclo 2]** Frete por CEP é viável dentro da arquitetura do RF-005: o cache atual é por canal×produto (defasagem 30 min), não por CEP — cálculo por CEP pode exigir consulta sob demanda às APIs dos canais, ameaçando o p95 < 500ms e o rate limit. O DRP registra que "frete não é calculado por afiliado"; por CEP não está nos requisitos | alta (mata a ideia se o custo/latência for proibitivo) | sem evidência — só a menção a "CEP transitório" no brief/DRP sugere que foi contemplado | Engenharia (Vinícius Graff) + Produto | refinamento técnico da Feature |
| 8 | **[ciclo 2]** Produto referenda a inclusão do frete por CEP (decisão partiu do designer em sessão, não do DRP) | alta (é a licença do ciclo) | decisão registrada no Rastro; referendo pendente | Produto (Victor Lima / Rolim) | refinamento da Feature — a peça DEMO deste ciclo é o material do referendo |
| 9 | **[ciclo 2]** CEP como refinamento opcional (página abre com frete de referência; CEP melhora) converte mais do que CEP como pedágio de entrada (pedir antes de mostrar) | média (define a arquitetura da página) | palpite de Design, coerente com "sem fricção" do resultado esperado | Design (este ciclo prototipa a via opcional; teste real fica para produção) | ao final deste ciclo |
| 10 | **[ciclo 2]** Quando um canal não retorna frete para o CEP, mostrar o canal com aviso é melhor que ocultá-lo (a ocultação silenciosa do RF-006 vale para canal INVÁLIDO; canal válido com frete desconhecido é outro caso) | média | sem evidência; análise de requisito | Design propõe na peça; Produto referenda | portão deste ciclo |

## Quebra de tarefas
Ciclo 1 (entregue):
1. Card de canal (preço, frete, total, CTA "Comprar") — peça atômica
2. Lista de canais ordenada por menor custo (estado sucesso, 1 a 3 canais visíveis)
3. Estado de indisponibilidade total (zero canais válidos)
4. Estado de loading
5. Página completa do comparador — composição mobile-first de dentro pra fora
6. Transição/feedback do clique em "Comprar" (redirecionamento)

Ciclo 2 (frete por CEP) — de dentro pra fora, sobre as peças entregues:
1. Entrada de CEP — peça atômica: vazio (convite), digitando/máscara, calculando,
   aplicado (CEP visível + trocar/limpar), inválido
2. Card de canal com frete por CEP — atualização da peça 01: rótulo do frete
   (referência vs. para o CEP), estado "frete indisponível para este CEP" (premissa 10)
3. Reordenação da pilha pós-CEP — a transição do recálculo: o "melhor" pode trocar de
   canal; a troca precisa ser perceptível sem desorientar (atualização da peça 02)
4. Página completa integrada — hero + entrada de CEP + pilha, fluxo de ponta a ponta
   incluindo troca de CEP e recarga (CEP some — prova do transitório)

## Critérios de verificação
O portão confere olhando a peça renderizada (nunca o código):
- O canal de menor custo total é visualmente o mais destacado / primeiro
- Canais ocultos não deixam espaço vazio, placeholder ou mensagem de erro
- Nenhum dado de comissão, ganho ou financeiro aparece em nenhum estado
- Composição funciona em mobile (coluna única) E desktop (duas colunas, ≥900px), sem scroll
  horizontal, sem quebra de layout — verificar nos DOIS breakpoints, não só a 375px
- O estado "sem vínculo"/canal oculto foi tratado como cenário comum na direção estética,
  não como caso raro maquiado
- CTA "Comprar" comunica claramente a ação de redirecionamento externo

Ciclo 2 (adicionais):
- Sem CEP, a página é indistinguível da entrega do ciclo 1 em conteúdo (frete de
  referência rotulado) — o CEP nunca é pedágio
- Informado um CEP, todo frete exibido declara a que CEP se refere; nunca há frete
  ambíguo na tela
- A reordenação pós-CEP é acompanhável a olho (o cliente entende que a lista mudou e
  por quê), inclusive quando o "melhor" troca de canal
- CEP não sobrevive à recarga da página e não aparece em URL/query string
- Canal sem frete para o CEP não é confundível com canal indisponível
- Estados de CEP inválido e de cálculo em andamento não derrubam a comparação já exibida

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
[2026-07-15] [pós-ciclo] Premissa 6 RESOLVIDA por decisão do designer: frete por CEP
entra no comparador (CEP transitório, LGPD-mínima preservada). Escopo do CICLO 2 desta
demanda — a peça entregue (frete-padrão) permanece válida como demo do ciclo 1. Produto
referenda no refinamento da Feature. Pendência #3 do LEIA-ME da entrega atualizada por
esta decisão.
[2026-07-15] [fase 01 · ciclo 2] Spec reaberta (status: ativa, ciclo: 2) para o recorte
frete por CEP. Recorte fechado: CEP é refinamento OPCIONAL sobre a página entregue —
nunca pedágio (premissa 9); backend do cálculo fica FORA (a peça simula; Engenharia
valida viabilidade na premissa 7); geolocalização/IP, prazo de entrega e persistência de
CEP ficam FORA (LGPD-mínima e recorte de custo). Achado da leitura do DRF que virou
premissa 7 (crítica): frete por CEP NÃO está nos requisitos — RF-005 cacheia frete por
canal×produto e o DRP diz que frete não é calculado por afiliado; a única âncora é o
"CEP transitório" da LGPD. A peça deste ciclo é o material com que Produto referenda a
inclusão (premissa 8). Premissa 10 registra decisão de requisito a propor: canal sem
frete para o CEP ≠ canal inválido — não herda a ocultação silenciosa do RF-006.
Aprendizados do ciclo 1 aplicados como entrada: dados de exemplo fixados cedo (a fase 02
deve fixar CEPs e fretes de exemplo antes da 1ª peça) e rubric v4 (seção 7 de performance
vale para o custo do cálculo de frete percebido pelo cliente).
[2026-07-15] [fase 02 · ciclo 2] Direção estética do ciclo 2 e dataset de exemplo fixados
na spec ANTES da 1ª peça (CEP é refinamento não-pedágio; honestidade do frete como régua
de craft; reordenação como momento-herói de motion; CEP exemplo A 01310-100 reordena via
frete grátis Ybera.com; CEP B 69900-970 exercita "canal não entrega neste CEP").
Confirmado que o comparador público é superfície própria, sem captura dev-mode aplicável
(a captura dev-mode-virtual-office é do Escritório) — `tokens.json` é o guardrail primário.
[2026-07-15] [fase 02 · ciclo 2] Peça 07 (entrada de CEP) gerada em `pecas/comparador-publico/
07-entrada-cep.html`, componente atômico com 5 estados: (1) vazio/convite — lead "Ver o
frete certo pro seu endereço" + microcopy LGPD "usado só agora, não guardamos" (privacidade
como craft), botão desabilitado; (2) digitando — máscara 00000-000, botão habilita em
club-600; (3) calculando — input travado, spinner CSS no botão, nota "consultando o frete
de cada loja"; (4) aplicado — chip verde (green-100/800, par AA do ciclo 1) "Frete para
01310-100 / São Paulo, SP" + botão "Trocar" (controle devolvido); (5) inválido — borda
red-600, alerta red-700 "CEP não encontrado — confira os 8 dígitos" (orienta, não culpa).
Correção durante a geração: no estado aplicado, CEP+cidade+Trocar não cabiam em 375px
(cidade truncava) → cidade empilhada abaixo do CEP, sem ellipsis. Ícones SVG inline
provisórios (pendência #1 de token). Verificado no browser a 375px (mobile-first).
Aguardando veredicto do designer.
[2026-07-15] [fase 02 · ciclo 2] Peça 07 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02 · ciclo 2] Peça 08 (card de canal com frete por CEP) gerada em
`pecas/comparador-publico/08-card-canal-cep.html`, estendendo a anatomia do card do ciclo 1
sem reabri-la. 4 estados: (A) frete de referência (sem CEP) — igual ao ciclo 1 + tag de
proveniência "Frete de referência" (ícone caminhão, neutral-600); (B) frete p/ CEP, melhor
com frete grátis — tag "Frete p/ 01310-100" (ícone pin), "Frete grátis" em green-800
substituindo o valor de frete, total menor que a referência; (C) frete p/ CEP, canal padrão
— tag de CEP + "+ frete R$ 16,90"; (D) NÃO ENTREGA NESTE CEP (premissa 10) — canal
permanece VISÍVEL (não some, ao contrário do canal inválido do RF-006), cartão em borda
tracejada neutral-400 + fundo neutral-100, faixa âmbar full-width "A loja não entrega neste
CEP", SEM total e SEM CTA de compra. Régua de craft do ciclo (honestidade do frete): todo
card declara a proveniência do frete via tag — nunca há valor de frete ambíguo. Correção
durante a geração: no estado D o aviso âmbar espremido na coluna de preço quebrava em 5
linhas (max-width 180px) → movido para faixa full-width abaixo da identidade (onde fica o
CTA nos cards normais), grid de 2 colunas no estado noship. Contraste calculado do aviso
âmbar: amber-800 #92400E sobre amber-100 #FEF3C7 = 6,37:1 PASS AA. Ícones SVG provisórios
(pendência #1). Verificado a 375px. Aguardando veredicto do designer.
[2026-07-15] [fase 02 · ciclo 2] Peça 08 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02 · ciclo 2] Peça 09 (reordenação da pilha pós-CEP) gerada em
`pecas/comparador-publico/09-reordenacao-pilha.html` — peça interativa, o momento-herói de
motion do ciclo. Alterna entre "sem CEP (referência)" e "CEP 01310-100 aplicado" via barra
dev; ao aplicar, a pilha reordena de [Shopee, TikTok, Ybera] para [Ybera, Shopee, TikTok] —
o "melhor" MIGRA de Shopee para Ybera.com (frete grátis). Motion: FLIP genuíno (mede first
rects → reordena DOM → mede last → aplica transform inverso → anima a zero, curva
cubic-bezier(.2,.7,.2,1) .42s), crossfade no conteúdo que muda (.swap) e pulso no selo que
migra (.channel--just-best badgePop); tudo desligado sob prefers-reduced-motion (troca
instantânea). Decisão de composição: a PROVENIÊNCIA do frete foi HOISTED para o cabeçalho da
pilha ("frete de referência" / "frete para 01310-100") em vez de repetida em cada card — em
lista, um enunciado único cobre "declara a que CEP se refere" (critério do ciclo) e mantém
os cards limpos (padrão Kayak/Google Flights da direção); a tag por card da peça 08 continua
válida como forma atômica. Verificado no browser a 375px: estado inicial ref (Shopee melhor,
frete de referência) e, após aplicar, asserção de DOM confirmou order=[ybera,shopee,tiktok],
best=ybera, rótulo="frete para 01310-100", chip de CEP aplicado; transforms limpos (none)
após a animação assentar. Aguardando veredicto do designer.
[2026-07-15] [fase 02 · ciclo 2] Peça 09 ACEITA pelo designer sem correções.
[2026-07-15] [fase 02 · ciclo 2] Peça 10 (página completa com frete por CEP) gerada em
`pecas/comparador-publico/10-pagina-completa-cep.html` — integra hero (herdado do ciclo 1)
+ entrada de CEP (peça 07) + pilha com reordenação FLIP (peça 09) + card "não entrega"
(peça 08) + fluxo de saída (CTA→overlay→redirect, herdado do ciclo 1). 3 cenários via
barra dev: (ref) sem CEP → Shopee melhor; (cepA 01310-100) reordena → Ybera.com melhor com
frete grátis; (cepB 69900-970) → Shopee melhor, TikTok como "não entrega neste CEP" (sem
total, sem CTA, ordem: canais que entregam primeiro por preço, noship por último). Entrada
de CEP funcional: input lê o valor, mapeia 01310-100→SP e 69900-970→AC, valida 8 dígitos e
mostra erro inline ("CEP não encontrado"/"CEP incompleto"). Prova do CEP TRANSITÓRIO (LGPD,
premissa 6/critério): asserção no browser confirmou localStorage.length=0,
sessionStorage.length=0, location.search="" — nada é persistido; botão "Recarregar" volta ao
estado sem CEP. Proveniência do frete no cabeçalho da pilha (hoisted, decisão da peça 09).
Verificado a 375px: estados ref/cepA/cepB corretos por asserção de DOM (ordem, melhor,
noship sem CTA, rótulo de proveniência) e transforms FLIP limpos após assentar.
[2026-07-15] [fase 02 · ciclo 2] Peça 10 ACEITA pelo designer. Fase 02 do ciclo 2 fechada:
peças 07–10. Todas as peças seguem OBRIGATORIAMENTE para o portão de qualidade (fase 03).

## Portão de qualidade — ciclo 2 (fase 03)
[2026-07-15] 1ª rodada — diagnóstico contra rubric v4. Contrastes calculados de todos os
pares novos do ciclo passam AA: CEP note neutral-600/branco 5,30:1; "Frete grátis"
green-800/branco 6,58:1; savings green-800/green-100 (herdado, AA); aviso âmbar
amber-800/amber-100 6,37:1; erro red-700/branco 7,69:1; proveniência neutral-700/neutral-200
6,27:1; cidade neutral-700/branco 7,43:1. **1 BLOQUEIO (4.2):** botão "Trocar" no estado CEP
aplicado media 68×36px (altura < 44) nas peças 07/09/10 — medido no render. Notas: (3.2) o
estado "calculando" existe isolado na peça 07 mas o recálculo na página 10 é instantâneo
(aceitável em demo; API real terá latência); (7.2) recálculo sem skeleton próprio (usa
spinner + o FLIP já evita layout shift); (2.4/7.1) ícones provisórios e fontes Google já
carimbados (pendências #1/#7 do ciclo 1, não renascem). Demais itens passam: fidelidade (1),
tokens sem invenção (2.1), percurso completo com "não entrega" + transitório (3.1), critério
verificável (5.1), direção estética cumprida e craft de produção (6). **Veredicto do
designer: EDITAR** — corrigir só o 4.2.
[2026-07-15] Editar aplicado: `.cep__change` → min-height:44px, padding:0 18px, inline-flex
centrado, font 14px, nas peças 07/09/10. Re-medido no render: "Trocar" = 79×44 PASS 4.2.
Sem regressão visual (chip aplicado permanece limpo). **2ª rodada: sem bloqueios. Veredicto
do designer: APROVAR** — confirmado. Ciclo 2 segue para a fase 04.

## Fase 04 — Entregar e realimentar (ciclo 2)
[2026-07-15] Pré-condição OK (aprovar registrado). **Carimbo: DEMO** (cálculo de frete
simulado; valores de frete são exemplos; barra de estados é dev only). **Empacotado** em
`pecas/comparador-publico/entrega-ciclo2/`: peças 07–10 + assets + spec + LEIA-ME.md (com
7 pendências carimbadas e a relação com o ciclo 1). "Comece por 10-pagina-completa-cep.html".

Realimentação — cada aprendizado roteado:
- **Δspec** → premissa 6 marcada RESOLVIDA + ENTREGUE (frete por CEP entregue como ciclo 2);
  a distinção "não entrega neste CEP" ≠ "canal inválido" (premissa 10) fica registrada como
  material do referendo do Produto (premissa 8). Nenhuma spec nova precisa nascer daqui.
- **Δtokens** → NENHUM novo. O ciclo usou só rampas já existentes no tokens.json (amber,
  green-800, red-700, neutral). As pendências de ícone (#1) e de asset de marca de canal (#2)
  já estavam abertas desde o ciclo 1 e não renascem.
- **Δrubric** → NENHUM. E isso é o sinal de maturidade do processo: o único bloqueio do ciclo
  (4.2 — alvo de toque do "Trocar" < 44px) foi PEGO pelo rubric v4 existente. O rubric não
  precisou crescer porque já cobria a falha — diferente dos ciclos anteriores, em que cada
  portão revelava um buraco (2.4 ícones, seção 6 craft, seção 7 performance).
- **notas** → nenhuma sem destino.

**Fim do ciclo 2 da demanda comparador-publico.** Status da spec: entregue (ciclos 1 e 2).
As pendências de implementação (consulta real de frete, latência/skeleton, regra de frete
grátis, cobertura de "não entrega", ícones, fontes) têm dono e gatilho no LEIA-ME.

## Escalar — correção de escopo desktop (2026-07-15, pós-entrega)
[2026-07-15] O designer apontou, olhando a página 10 no desktop, que **mobile-first ≠
mobile-only**: as peças foram construídas como coluna fixa de 390px, que no desktop vira uma
faixa estreita centralizada. Foi DRIFT da minha execução — a spec dizia "mobile-first"
(usuário primário via mobile) mas nunca decidiu excluir o desktop; eu inferi mobile-only sem
registro. Rota correta: **escalar** para a fase 01 (o problema é de escopo, não da peça).
Decisão registrada: desktop entra no escopo, layout de **duas colunas** ≥900px (produto+hero+
CEP à esquerda sticky, pilha à direita), coluna única abaixo disso. Critério de verificação
atualizado para exigir os DOIS breakpoints. Próximo passo: ajustar a peça 10 (a página
entregue) para responsiva e re-rodar o portão em mobile e desktop. Aprendizado salvo em
memória (feedback): tratar mobile-first como espectro que inclui desktop, verificar em mais
de um breakpoint.
[2026-07-15] Correção aplicada na peça 10: HTML reestruturado em `.layout > .col-left`
(hero + CEP) e `.col-right` (comparação); media query ≥900px = grid duas colunas
(2fr/3fr, gap 40px, `space-kz` tokens), coluna esquerda `position:sticky`, hero
alinhado à esquerda com título 32px no desktop. Abaixo de 900px = block/coluna única
(mobile intacto). **Re-portão nos DOIS breakpoints:** desktop 1280px — duas colunas OK,
reordenação FLIP funciona (asserção: order=[ybera,shopee,tiktok], best=ybera, col-left
sticky), chip de CEP e "Trocar" (44px) preservados; mobile 375px — coluna única, sem
scroll horizontal (scrollWidth=innerWidth=375), sem regressão. Sem tokens inventados
(grid usa space-kz). Sem mudança de cor → contrastes AA do ciclo permanecem válidos.
**Sem bloqueios. Critério de desktop atendido.** Pacote de entrega atualizado com a peça
10 responsiva + spec. Ciclo 2 re-entregue (DEMO). **Fim do escalar.**
[2026-07-15] Screenshot-feedback-loop (crítica de senior product designer) sobre o desktop:
achados 🟡/🟢 aprovados pelo designer e aplicados na peça 10 — (1) card esticado com vão
morto no meio + CTA full-width gigante → página contida a max-width 900px (colunas 320px +
1fr), trazendo o card pra ~476px (proporção próxima do mobile validado), o que matou o vão e
encurtou o CTA de uma vez; (2) logo YBERA órfão centralizado → alinhado à esquerda (masthead
sobre o conteúdo, `justify-content:flex-start`); (3) pill "Economize" desancorada → contida
sob o total no bloco de preço (efeito colateral positivo da contenção). Desequilíbrio de
altura entre colunas aceito como tradeoff (sticky resolve no scroll). Revalidado a 1280px
(ref e CEP aplicado com reordenação FLIP OK, card=476px) e mobile intacto (edições só dentro
do media query ≥900px). Sem novos tokens (usa space-kz). Sem bloqueios.
[2026-07-15] 2ª crítica do designer (screenshot): o "conter a 900px" foi MEIO-FIX — o vão
morto no meio do card persistiu. Diagnóstico correto: o card EMPILHADO (nome à esquerda,
preço à direita, CTA full-width embaixo) sempre gera void ao alargar, porque quer ser
estreito; tratei a largura, não a causa. **Fix real: card HORIZONTAL no desktop** — uma
linha só, `grid-template-areas:"logo name . price cta"`, CTA inline à direita (não mais
full-width embaixo). Card caiu de ~200px para 124px de altura; o vão virou separação natural
"identidade → ação" (padrão de linha de comparação); preço+CTA agrupados e alinhados entre
cards. Página voltou a max-width 1080 (o card horizontal USA a largura, ao contrário do
empilhado). Noship também vira linha ("logo name notice", aviso âmbar à direita). Revalidado
a 1280px: ref, cepA (reordena FLIP), cepB (noship horizontal) todos OK; mobile intacto
(card 343px, grid empilhado, sem h-scroll). Sem novos tokens. Sem bloqueios. Lição: quando
o layout "estica errado", a causa costuma ser o componente, não o container.

## Varredura de bugs (frontend-design · foco: quebras de código)
[2026-07-15] Sweep nas peças 07–10. Console limpo nas quatro. Achados:
- **FALSO ALARME (registrado por honestidade):** suspeitei de "transform travado" no FLIP
  após toggles rápidos, mas era artefato do método de teste — ler o DOM via JS sem pintar um
  frame no meio congela o `requestAnimationFrame`, então o reset não rodava. Num browser real
  (que pinta a cada frame) a animação assenta — todos os screenshots confirmaram. Não era bug.
  Mantido um endurecimento inofensivo (cancelar rAF pendente + double-rAF, padrão FLIP).
- **BUG REAL #1 (responsivo):** entre 900–1023px o card horizontal do desktop esmagava o
  nome do canal para ~3px (clipado) — logo+nome+preço+CTA longo não cabiam na coluna direita
  estreita. Corrigido: breakpoint das duas colunas subiu de 900 para **1024px** (abaixo =
  coluna única empilhada, validada). A 1024px a coluna direita tem ~600px, nome cabe folgado.
- **BUG REAL #2 (responsivo):** no limiar 1024px, a coluna do nome usava `minmax(0,auto)`,
  cujo mínimo 0 permitia comprimir o texto a nada, clipando "TikTok Shop"/"Ybera.com".
  Corrigido para `auto` (mínimo = min-content; nome é `nowrap`, então nunca comprime abaixo
  da largura do texto). Revalidado: 375/900 coluna única sem h-scroll; 1024/1280 duas colunas,
  nomes cabem, "não entrega" sem overflow, reordenação FLIP OK. 07/08/09 sem quebras (são
  fichas de componente centradas, sem o card horizontal do desktop).
[2026-07-15] "corrige tudo": fechado o item divergente que eu tinha sinalizado — a peça 09
tinha o mesmo FLIP da 10 SEM o endurecimento. Aplicado o mesmo padrão re-entrância-safe
(cancelar rAF pendente + zerar transforms antes de medir + double-rAF). Verificado: 09
reordena correto (order/best/src OK), console limpo, sem h-scroll a 375. Sweep final de
overflow: 07 a 1280px sem offenders/clipping; 08 é HTML estático sem JS/media query (centra
em qualquer largura). Todas as peças 07–10 sem bugs conhecidos.
[2026-07-15] O designer apontou (screenshot) o **botão vazando do card** — bug REAL que eu
tinha dado como fechado. Minha varredura anterior checou clip de nome e h-scroll do
documento, mas NÃO mediu o botão contra a caixa do card; como a página tem 32px de padding
lateral, o botão vazava pra dentro desse gutter sem gerar h-scroll, então passou. Medição
revelou: a 1024px (breakpoint então vigente) o espaçador `1fr` dos cards de nome longo
(TikTok/Ybera) era 0px — encaixe no limite exato, sem margem; variação de fonte empurrava o
botão pra fora. **Fix (blindagem): breakpoint das duas colunas subiu de 1024 para 1080px**
(= largura máxima da página), onde a coluna direita tem os 656px cheios e o espaçador fica
22–95px de folga. Abaixo de 1080 = coluna única. Revalidado: 1079 coluna única sem h-scroll;
1080/1280 duas colunas, botão dentro do card (−21px = padding), espaçador positivo, nomes
sem clip. Lição reforçada: medir o componente contra SUA caixa, não só contra o viewport.
[2026-07-15] Exploração de craft (frontend-design) numa CÓPIA `10-elevada.html` — NÃO toca a
peça 10 aprovada; aguarda veredicto do designer (se adotada, substitui a 10 e re-passa o
portão). Direção: a personalidade da spec ("quente-mas-clean, editorial, decisiva"), refino
não maximalismo. Tudo dentro dos tokens KZ (nenhuma fonte/cor/sombra nova): (a) atmosfera de
fundo — brilho radial club-50 fadeando do topo sobre gradiente neutral-100→200 + grão sutil
(efeito $noise-kz-sm do DS, opacity .05, camada fixed atrás do conteúdo); (b) micro-interações
— hover dos cards com $shadow-sm + borda (sem transform, pra não brigar com o FLIP), seta do
CTA deslizando, zoom lento no hero; (c) `.page` sobe pra z-index 1 acima das camadas de fx.
Verificado 375/1280: layout intacto, contraste preservado (club-50 ~branco), sem h-scroll.
[2026-07-15] O designer apontou (na elevada) DOIS bugs que valem pra AMBAS as peças (10 e
10-elevada) — corrigidos nas duas: (BUG) botão "Ver frete" vazava 10px do card de CEP na
coluna esquerda de 320px — mesma armadilha de flex do nome: o `<input>` tinha `min-width:auto`
e não encolhia. Fix: `.cep__input{min-width:0}` → botão volta pra dentro (−17px). (ORGANIZAÇÃO)
o bloco de preço empilhava 4 itens (total + pill + preço + frete em 2 linhas), ragged e
ruidoso. Fix: breakdown vira UMA linha ("R$ 179,90 + frete R$ 24,90"; no frete grátis usa
separador "·") — `.caption span{display:inline}` + separador no fillCard. Hierarquia agora:
total → pill de economia → breakdown (1 linha muted). Revalidado 375/1280 nas duas peças:
botão do CEP dentro do card, breakdown 1 linha, nomes sem clip, sem h-scroll. Lição (again):
medir CADA elemento interativo contra sua caixa; `min-width:0` em item flex com conteúdo
intrínseco (input/texto nowrap) é obrigatório quando a coluna pode ficar estreita.
[2026-07-15] Ajuste de logo (designer) nas duas peças: centralizado (o desktop estava
left-aligned; revertido pra center a pedido), aumentado 18→24px, e respiro abaixo maior
(mobile bottom sp-400→sp-600; desktop top/bottom sp-600/sp-500 → sp-800/sp-1000). Vira um
masthead centrado com folga. Verificado 375/1280.
[2026-07-15] Distribuição do card horizontal (designer: "distribua melhor, mais respiro pro
bloco de informação"). O preço estava espremido contra o CTA, com vão grande antes. Fix nas
duas peças: DOIS espaçadores no grid (`48px auto 1fr auto 1fr auto`, areas "logo name .
price . cta") → folga equilibrada dos dois lados do preço; página 1080→1160 e coluna esquerda
320→280 pra caber com respiro; column-gap sp-400→sp-500, padding do card sp-400→sp-500 vertical
(ar); título do hero 32→28px pra não quebrar em 3 linhas na coluna mais estreita. Verificado
no limiar crítico 1080px: TikTok (card mais longo) com 20px de folga do CTA à borda, preços
alinhados (~591-604px, ~13px de variância), sem h-scroll; mobile intacto (mudanças só no
media query ≥1080). Breakpoint mantido em 1080.
[2026-07-15] Mais ajustes do designer (nas duas peças): coluna esquerda 280→300px (com padding
do CTA sp-600→sp-500 pra compensar no limiar); respiro cabeçalho→pilha (margin-top na pilha);
e um lote de conteúdo novo: (1) cabeçalho "Onde comprar" em linha com "Preços atualizados há
6 min" à DIREITA (compare-head space-between); (2) REMOVIDO "frete de referência" do cabeçalho
— **nota de honestidade:** a proveniência do frete no estado SEM CEP deixa de ser rotulada
explicitamente; apoia-se no chip de CEP (aplicado) e no convite "Ver o frete certo pro seu
endereço" (implica que o atual é estimado). Registrado caso o critério "todo frete declara a
que se refere" precise reforço; (3) BARRA DE GARANTIAS full-width (3 itens, ícones Club:
escudo/cadeado/check) abaixo da comparação, `flex 1 1 240px` (3 col desktop, empilha mobile);
(4) FOOTER dark full-bleed (neutral-900): logo branco (filter no logo-black.svg), linha de
privacidade, links (Sobre/Parceiros/Política/Termos), "© 2026 Ybera Group". Tudo em tokens KZ.
Verificado 375/1280: barra e footer OK, sem h-scroll, console limpo, srcLabel guardado.
[2026-07-15] MUDANÇA GRANDE do designer (só na ELEVADA por ora; base 10 fica pra trás — a
recomendação de adotar a elevada como oficial fica mais forte): card reformulado de linha
compacta para **card DETALHADO por canal** (referência: print do designer) — cabeçalho
logo+nome+subtítulo, linhas Preço do produto / Frete / **Prazo de entrega** / **Parcelamento**,
divisor, TOTAL grande + pill de economia (melhor), botão full-width. Card vertical (mesmo
mobile/desktop) — removidos os overrides do card horizontal. Footer virou **sticky na base**
(margin-top:auto no body flex min-height:100vh) — interpretei "fixo na base da tela" como
sticky-footer (não position:fixed, que sobreporia conteúdo com um footer alto); confirmar se
era isso. **⚠ EXPANSÃO DE ESCOPO (escalar/Produto):** "prazo de entrega" estava FORA do
escopo (spec: "só custo; prazo é candidato a ciclo futuro") e "parcelamento" é informação
NOVA. Ambos usam VALORES DE EXEMPLO (não há fonte de dado — backend/Produto): prazo varia por
CEP (ex.: SP 2–4 dias, AC 6–12), parcelamento por canal (Shopee 12x c/juros, TikTok 4x s/juros,
Ybera 6x s/juros). Precisam de fonte real e referendo do Produto antes de qualquer POC oficial.
Também muda a UX de "comparação rápida" para "detalhe por canal" (página longa) — Produto
ciente. Verificado 375/1280: card detalhado, reordenação FLIP (deslize grande por card alto),
"não entrega" (cabeçalho+aviso), sem h-scroll, console limpo.
[2026-07-15] +2 ajustes (elevada): (1) removido o `padding-bottom` do body (era o espaço
reservado pra devbar que aparecia como faixa vazia abaixo do footer) → footer rente à base
(footerBottom = docH). (2) badge de melhor custo: `★` de texto → **estrela SVG** (elemento
`.channel__badge` no DOM em vez de ::before content) — renderiza sempre, consistente com os
ícones. badgePop retargetado. **Base 10 agora bem divergente da elevada (card compacto vs
detalhado) — sincronizar tweaks pequenos parou de fazer sentido; recomendação de ADOTAR a
elevada como oficial está madura.**
[2026-07-15] Card detalhado estava alto (designer) → compactado o ritmo vertical (padding
sp-600→sp-500, head/rows/divider/cta gaps menores, linhas 15→14px, total 32→26px, cta
52→48px, logo 48→44, best padding-top sp-800→sp-600). Card ~381→335px, página ~170px mais
curta. Legibilidade preservada. Só na elevada.

[2026-07-15] Detalhes do card em 4 COLUNAS (rótulo em cima, valor embaixo) em vez de 4 linhas empilhadas — desktop 4 col, mobile 2×2. Card ~335→278px. Sem clipe/h-scroll nos dois. Só elevada.

[2026-07-15] Logo do footer: era logo-black.svg com filtro CSS (brightness/invert + opacity .95), que ficava acinzentado. Criado asset real logo-white.svg (mesmo wordmark do header, fill #FFFFFF) e usado no footer sem filtro → branco puro/crisp. Só elevada.

[2026-07-15] CTA movido pra linha do nome da loja, alinhado à direita (desktop) — sai o bloco full-width do rodapé do card. Mobile: CTA quebra pra largura cheia abaixo do nome. Card ~278→216px. Obs UX: o botão passa a ficar ACIMA do total (antes era o último elemento) — consequência da ideia; total segue visível e grande. Só elevada.

[2026-07-15] Removida a microcopy "Usado só agora pra calcular o frete — não guardamos seu CEP" do card de CEP (designer). A garantia de privacidade permanece no footer ("O CEP, quando informado, não é armazenado"). Só elevada.

[2026-07-15] Removido o badge "Economize R$ X" do total do card melhor (designer). Só elevada.

[2026-07-15] Proporção das colunas ajustada de left-fixo-300/right-1fr para 32fr/68fr (proporcional) — esquerda um pouco mais larga (~28%→32%, ~338px a 1160), direita 68% das colunas = 66% do layout (≥65% garantido em qualquer largura, contando o gap). Motivo do fr em vez de fixo: com esquerda fixa o % da direita cai nas telas menores. Só elevada.

[2026-07-15] Header visível: o logo (que flutuava transparente) virou uma BANDA branca full-width no topo (.site-header, movido pra fora do .page), com borda inferior neutral-200 — simétrico com o footer escuro. Logo aumentado 24→30px. Só elevada.

[2026-07-15] CEP: qualquer 8 dígitos agora aplica (antes só 01310-100 e 69900-970 eram reconhecidos; outros davam "não encontrado"). CEPs não-mapeados usam cenário genérico (cepGen: frete recalculado + reordena p/ Ybera), chip mostra o CEP digitado formatado sem cidade. Os dois CEPs de exemplo seguem com dado curado (cidade real, cenários específicos). Nota: prazo/parcelamento/frete continuam SIMULADOS — na produção o backend calcula por CEP real. Só elevada.

[2026-07-15] Respiro entre header e conteúdo: padding-top no .page (mobile sp-800/32px, desktop sp-1000/40px) — o header estava colado no conteúdo. Só elevada.

[2026-07-15] Proporção das colunas → 40fr/60fr (esquerda 40%, direita 60% das colunas). Substitui o piso de 65% da direita (decisão nova do designer). Verificado no limiar 1080px: CTA c/ 21px de folga, nomes/valores sem clipe, sem h-scroll. Só elevada.

[2026-07-15] Badge "Melhor custo total" mudou de club-600 (rosa) para green-800 (verde) — texto branco, contraste 6,6:1 AA. (Borda/total/CTA do card melhor seguem rosa.) Só elevada.

[2026-07-15] Badge "Melhor custo total" → verde SEMÂNTICO do DS: fundo green-100 (surface/badge/green) + borda green-200 (border/badge/green), pílula clara. Texto/estrela em green-800 (AA-safe 6,6:1) em vez do token text/badge/green=green-700 (que dá ~3,5:1, reprova AA a 12px) — mesma prática AA do ciclo 1. +green-200 no :root. Só elevada.

[2026-07-15] Copy do campo de CEP: "Ver o frete certo pro seu endereço" → "Consultar valor do frete". Só elevada.

[2026-07-15] "Compare preço e frete e compre na loja que preferir" MOVIDA do lead do hero para subtítulo abaixo de "Onde comprar" (era a mesma frase — evitei duplicar). Hero agora = título + CEP. Só elevada.

[2026-07-15] "Preços atualizados há 6 min" alinhado com a linha do subtítulo (compare-head align-items:flex-end) em vez do título. Só elevada.

[2026-07-15] Hero: trocada a ordem — nome do produto em cima, imagem embaixo (reveal d-0/d-1 ajustados). Só elevada.

[2026-07-15] Imagem do produto (hero__media) → quadrada (aspect-ratio 16/10 → 1/1). Só elevada.

[2026-07-15] Fix "carrega scrollado após refresh": history.scrollRestoration=manual + window.scrollTo(0,0) após montar os cards (o navegador restaurava scroll / ancorava quando o JS injetava a pilha). Verificado scrollY=0 no load. Só elevada.

[2026-07-15] +respiro entre seções: conteúdo→barra de garantias e barra→footer agora 64px (sp-1600, +tokens sp-1200/1600 no :root; padding-bottom no .page; margin-top/padding maiores na .trust). REMOVIDA a barra dev (era dev-only) da elevada — os cenários de CEP seguem acessíveis digitando 01310-100 (reordena) / 69900-970 (não entrega); refresh reseta. Só elevada.

[2026-07-16] Adicionado elemento de avaliação (estrelas + nota, ex. "★★★★☆ 4,6") em cada card de canal — pedido do designer a partir de referência visual anexada. Posição: dentro de `channel__id`, logo abaixo do nome+subtítulo do canal (antes das linhas de preço/frete), mesma posição nos 3 cards independente de "melhor oferta". Motivo da posição: consistência (não desloca com a badge "Melhor oferta", que fica à direita), e hierarquia (identidade → confiança/verificação → nota → dados de compra). Implementado com token novo `--amber-600` (#D97706, de `color-kz/amber/600` do DS) para as estrelas preenchidas; estrelas vazias em `--neutral-300`. Notas são mock por canal (shopee 4,6 / tiktok 4,3 / ybera 4,8) — pendência: origem real da nota (loja oficial do canal vs. agregador) fica para Engenharia/Produto decidir; não há RF que cubra isso ainda. Replicado nos 3 espelhos (raiz, pecas/comparador-publico/, entrega-ciclo2/).

[2026-07-16] [correção, mesmo ciclo] Duas correções apontadas pelo designer após revisão visual da peça acima: (1) estrelas trocadas de caractere Unicode cortado por %-de-largura (gerava recorte serrilhado feio na estrela parcial) para SVGs discretos — cheia/meia/vazia, arredondando a nota pro múltiplo de 0,5 mais próximo (a nota exata continua exibida ao lado, só o desenho da estrela arredonda); meia-estrela usa `clip-path` sobre o mesmo path vetorial (corte limpo, sem serrilhado). (2) badge "Melhor oferta" estava descolando do padding superior do card porque `channel__head` centralizava verticalmente (`align-items:center`) e o bloco nome+subtítulo+rating ficou mais alto que o logo — badge (e logo) agora ficam no topo (`align-items:flex-start`), alinhados com a primeira linha do nome, respeitando o padding do card (sp-500/20px) igual antes da rating existir. `STAR_PATH` da estrela virou constante única, reaproveitada pelo ícone da badge (elimina duplicação do path SVG). Replicado nos 3 espelhos.

[2026-07-16] [correção, mesmo ciclo] Designer trouxe print de referência (card TikTok Shop) mudando o formato do rating: em vez de 5 estrelas empilhadas numa linha própria abaixo do nome, virou 1 estrela + nota (ex. "★ 4,6") inline na MESMA linha do subtítulo do canal, com um selo de verificado (círculo vermelho + check branco) antes do texto. Pergunta em aberto respondida pelo designer: o ícone de check só aparece quando o texto é "Canal verificado" (hoje só o card de melhor oferta) — os demais cards mantêm seu subtítulo próprio (ex. "Loja no TikTok Shop") sem o ícone, sem alterar a lógica de quem é "verificado". Efeito colateral corrigido: essa linha ficou mais larga que antes, o que empurrava a badge "Melhor oferta" pra quebrar numa linha nova no mobile (375px) — resolvido reestruturando `channel__id` em duas linhas próprias: `channel__toprow` (nome + badge, sempre juntos, badge não compete mais por espaço com o subtítulo) e `channel__meta` (ícone verificado + subtítulo + estrela + nota), cada uma com a largura cheia do card pra si. Replicado nos 3 espelhos.

[2026-07-16] [correção, mesmo ciclo] Removido o selo de verificado (círculo vermelho + check) adicionado na entrada anterior — pedido do designer, sem motivo registrado. "Canal verificado" volta a ser só texto (igual ao subtítulo dos demais canais), seguido da estrela + nota. Removidos `VERIFIED_ICON`, `.channel__verified` e `.channel__verified svg` dos 3 espelhos — nenhum uso restante desses símbolos no código.

[2026-07-16] [correção, drift entre spec e peça] Designer perguntou por que o frete aparecia sem ele ter informado o CEP ainda. Investigação: comportamento em si é o esperado (spec do ciclo 2 já prevê "sem CEP a página funciona como o ciclo 1, frete de referência do cache") — mas a exigência da própria spec de "rotulagem honesta do frete" (distinguir frete de referência vs. frete para o CEP informado) nunca chegou a ficar visível: `st.src` era computado e a chamada `srcLabel.textContent = st.src` já existia no JS, só que nenhum elemento `id="srcLabel"` existia no HTML — atribuição morta, silenciada pelo `if(srcLabel)`. Corrigido: adicionado `<span class="src" id="srcLabel">` na linha "Preços atualizados há 6 min", alternando entre "frete de referência" (sem CEP) e "frete para {CEP}" (com CEP aplicado) — reaproveita o texto que já existia em `STATE.*.src`, sem inventar copy nova. Ajuste de craft durante a verificação: o separador "·" ficava órfão numa linha sozinha quando o texto quebrava no mobile (375px) — envolvido "· + rótulo" num `.src-sep{white-space:nowrap}` pra viajarem juntos. Replicado e testado (com e sem CEP aplicado) nos 3 espelhos.

[2026-07-16] [mudança intencional de spec, ciclo 2] Ao ver a correção acima, o designer decidiu que rotular o frete de referência não é suficiente — achou ruim mostrar valores de Frete/Prazo "reais" antes do CEP, mesmo rotulados. Pergunta feita e respondida: como ficam Total/ordenação/badge, já que dependiam do frete de referência? Decisão: Total vira "A partir de {preço}" (só o preço do produto, sem frete), ordenação fica neutra (a ordem de cadastro dos canais, que já coincidia com a ordem por custo do ciclo 1 — não precisou reordenar o array), e a badge "Melhor oferta" + texto "Canal verificado" somem até o CEP ser aplicado (não há "melhor" sem frete pra comparar). **Isso reverte a premissa 9 e as seções "Resultado esperado"/"Escopo" do ciclo 2** (que diziam "sem CEP = frete de referência do cache, rotulado") — texto dessas seções já atualizado acima para refletir a decisão nova. Implementação: `STATE.ref` ganhou `isRef:true` (único jeito confiável de sinalizar "sem CEP" pro `fillCard`, já que nem todo estado com CEP tem `st.cep` — o `cepGen` genérico não tem); `hasCep = !st.isRef` decide: Frete/Prazo → `<dd class="pending">A calcular</dd>` (cinza, `--neutral-500`, mais leve que o valor real em `--neutral-900`/700 weight) em vez do valor; `isBest` força `false` sem CEP (cascata: sem badge, sem "Canal verificado", sem `channel--best`); Total usa preço em vez de total quando `!hasCep`. Removido também o rótulo "frete de referência"/"frete para X" da fase anterior (`srcLabel`, `.src`, `.src-sep`, `st.src` nos 3 estados) — ficou redundante: sem CEP não há mais valor de frete pra "rotular" (o campo já comunica isso sozinho, em branco), e com CEP o chip "Frete para {CEP}" já identifica a fonte. Testado sem CEP (Frete/Prazo em branco, Total "A partir de", sem badge/"Canal verificado") e com CEP 01310-100 (comportamento normal restaurado: Frete/Prazo reais, "Total da compra", badge, "Canal verificado") nos 3 espelhos.
