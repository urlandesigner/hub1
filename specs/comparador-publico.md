# Spec — comparador-publico

status: ativa
ciclo: 3
carimbo-entrega-ciclo-1: demo (2026-07-15, `pecas/comparador-publico/entrega/`)
carimbo-entrega-ciclo-2: demo (2026-07-15, `pecas/comparador-publico/entrega-ciclo2/`)
atualizada: 2026-08-13
insumo-de-referencia: Brief Design v1.7 (12/08/2026, derivado do DRP v2.4) — colado na
conversa, NÃO presente em `insumos/` (lá só existe a v1.1); a v1.6 não existe no repo

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

**Ciclo 3 — selos de tier (recorte deste ciclo):** o cliente enxerga, em cada card de canal,
o **Estoque** e o **Volume de Vendas** daquele canal como rótulo categórico (selo), nunca
como número. Critério de sucesso observável do ciclo: abrindo a página **sem informar CEP**,
cada card já exibe seu selo de Estoque (Disponível / Últimas unidades / Indisponível) e, quando
houver, seu selo de Volume de Vendas (Campeão de vendas / Mais vendido / Lançamento); nenhum
número de estoque ou de unidades vendidas aparece em qualquer estado; um canal com Estoque
"Indisponível" permanece **visível** no card, sem total e sem CTA de compra (não é ocultado
nem confundido com "não entrega neste CEP"); e a presença de qualquer selo **não altera a
ordem** da pilha — a ordenação continua sendo só por custo total (RF-06).

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
- Dentro (ciclo 3 — selos de tier de Estoque e Volume de Vendas):
  - **Selo de Estoque** por canal, 3 valores: `Disponível` · `Últimas unidades` · `Indisponível`
    (rótulos literais do Produto — decisão de Design para H-UX-10, ver Rastro)
  - **Selo de Volume de Vendas** por canal, 4 valores: `Campeão de vendas` · `Mais vendido` ·
    `Lançamento` · nada (ausência de selo é um valor válido e o padrão — H-UX-11)
  - Ambos os selos visíveis **desde o primeiro paint**, sem depender de CEP (decisão do
    designer 2026-08-13: os selos vêm da API do canal, não do frete)
  - Estado novo de card: **canal com Estoque "Indisponível"** — card visível, sem total e
    sem CTA de compra, visualmente distinto do canal "não entrega neste CEP" (premissa 10)
  - Hierarquia visual entre os selos e a badge "Melhor oferta" já existente (H-UX-11 pede a
    decisão de qual selo é mais chamativo — o card não pode virar mural de badges)
  - Tratamento visual **não alarmista** de "Últimas unidades" (mitigação do risco de limiar
    mal calibrado registrado no brief v1.7)
- Fora (ciclo 3):
  - **Interface administrativa de override + TTL (Telas 4 e 5 do brief v1.7, RF-13)** — é
    outro usuário primário (admin) e outra tarefa principal; exige spec própria, não cabe
    aqui pela regra de 1 demanda = 1 tarefa. É a prioridade declarada do brief e segue
    pendente de spec (ver Rastro)
  - Qualquer indicação, no card público, de que um campo está sob override ou de quando
    expira — o brief é explícito: a indicação de override é do painel, nunca do card
  - Número exato de estoque ou de unidades vendidas — decisão fechada do Produto: tier sempre
  - Cálculo/limiar que classifica cada tier (Q-23 do DRP) — Produto/Engenharia; a peça recebe
    o tier já resolvido
  - Origem do dado por canal (API vs. fallback admin) exposta ao cliente — ver premissa 12
  - Campo **Imagem** como campo por canal (taxonomia do brief) — a peça mantém uma imagem de
    produto no hero; ver premissa 13
  - Campo **Parcelamento** — removido do card em 2026-08-13 por decisão do designer; ver
    premissa 14
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
- **[ciclo 3, inegociável — brief v1.7 §Restrições]** Nenhum override administrativo (Estoque,
  Avaliação, Volume de Vendas) pode ser desenhado de forma que sugira alteração na lógica de
  **ordenação** do comparador (RF-06): override afeta apenas exibição. Na prática, para a peça:
  selo nunca reordena a pilha, nunca aparece como critério de ranking e nunca compete com a
  badge "Melhor oferta" pelo papel de "este é o recomendado"
- **[ciclo 3, decidido pelo Produto — não reabrir]** Estoque e Volume de Vendas são exibidos
  como **tier**, nunca número exato. Avaliação segue como **nota real** (estrelas), fora do
  tratamento de tier. "Lançamento" é escolha manual do admin — nenhuma UI pode sugerir que
  existe cálculo automático por data por trás desse selo

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

### Direção estética — ciclo 3 (selos de tier), decidida na entrada da fase 02 (2026-08-13)
Estende as direções dos ciclos 1 e 2 sem reabri-las. O problema de craft do ciclo não é
"desenhar um badge" — é que o card passa a ter **três marcações simultâneas** (Melhor oferta
+ Estoque + Volume de Vendas) num componente que os últimos ciclos deliberadamente tornaram
menos promocional. A aposta:

- **Três altitudes de marcação, nunca três badges.** O peso visual de cada marca é
  proporcional à **autoridade e à durabilidade** do dado que ela carrega:
  1. **Veredicto** (o comparador falando) = `Melhor oferta`. Única pílula **preenchida** do
     card, no `toprow`. Não muda — é a conclusão da comparação, o ativo mais valioso da página.
  2. **Prova social** (o mercado falando) = Volume de Vendas. Chip de **contorno** (borda +
     texto, sem preenchimento), com hierarquia interna por peso: `Campeão de vendas` mais
     forte que `Mais vendido`; `Lançamento` é lateral, não é degrau da mesma escada.
  3. **Estado do estoque** (a loja falando) = Estoque. Marcação **tipográfica** com ponto de
     status — sem caixa nenhuma. É a mais leve das três de propósito: é o dado mais volátil
     (TTL de 48–72h no brief) e o mais exposto a erro de limiar (Q-23).
  Isso responde H-UX-11 (Volume de Vendas > Estoque em proeminência) com um critério, não com
  gosto — e é a mitigação de craft do risco "selo mal calibrado": a marca mais frágil é também
  a mais discreta, então errar custa menos.
- **Cor continua sendo acento cirúrgico.** Verde = veredicto/economia; âmbar = ressalva;
  rosa Club = CTA/foco. Nenhuma cor nova entra para os tiers: os chips de Volume de Vendas são
  **neutros** (a "prova social" ganha presença por ícone e peso tipográfico, não por cor —
  padrão dos produtos-régua Kayak/Google Flights). O único tier colorido é `Últimas unidades`
  (âmbar, texto + ponto, **sem preenchimento** — ressalva, não alarme) e `Indisponível`
  (neutro rebaixado). Sem vermelho, sem timer, sem "corre".
- **Linha própria para os tiers.** Os selos NÃO disputam espaço com o nome nem com a badge:
  entram numa terceira linha do bloco de identidade (`channel__flags`), abaixo de
  `toprow` (nome + Melhor oferta) e `meta` (subtítulo + avaliação). Aplicação direta do
  aprendizado de 2026-07-16, quando enfiar conteúdo na linha do subtítulo empurrou a badge
  pra quebrar a 375px.
- **Ausência é um valor, não um buraco.** Volume de Vendas sem tier simplesmente não renderiza
  chip; a linha de flags colapsa sem deixar espaço morto (o Estoque, que é sempre presente,
  sustenta a linha sozinho).
- **Motion (emil-design-eng):** os selos entram no reveal do card já existente, sem animação
  própria — nada de pulsar, piscar ou contar. Na reordenação FLIP, selo **não** faz crossfade
  (ele não muda com o CEP): só os valores de frete/total mudam. Selo animado viraria promessa
  de urgência, exatamente o que a direção recusa.
- **Copy (design:ux-copy):** rótulos literais do Produto, sentence case — `Disponível`,
  `Últimas unidades`, `Campeão de vendas`, `Mais vendido`, `Lançamento`. Sem ponto final, sem
  caps lock, sem exclamação. Decisão de H-UX-10/H-UX-11 registrada no Rastro.

### Dataset de exemplo fixado — ciclo 3 (tiers por canal, imutável entre as peças)
Escolhido para exercitar TODOS os valores de tier, incluindo a ausência, sem inventar canal:
- **Shopee:** Estoque `Disponível` · Volume `Campeão de vendas` (é o canal com API de volume)
- **TikTok Shop:** Estoque `Últimas unidades` · Volume `Lançamento` (fallback admin, tag manual)
- **Ybera.com:** Estoque `Disponível` · Volume **nada** (Wake é sempre fallback admin — o
  estado "sem tier" precisa aparecer na peça, e é o canal onde ele é mais provável)
- **Cenário extra para o estado novo:** Shopee com Estoque `Indisponível` (card visível, sem
  total, sem CTA — premissa 11)
- `Mais vendido` é exercitado na ficha de componente (peça 11), onde todos os valores aparecem
  lado a lado, mesmo os que não caem no dataset da página.

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
| 11 | **[ciclo 3] CONFLITO DE REQUISITO — o mais crítico do ciclo.** O brief v1.7 lista `Indisponível` como tier EXIBIDO no card; a spec (ciclos 1–2) e o RF-006 dizem que canal sem estoque é OCULTADO sem rastro. As duas regras não coexistem. Decisão do designer (2026-08-13): o canal fica **visível com o selo**, sem total e sem CTA — o que **revoga a parte "sem estoque" do RF-006** e precisa de referendo | alta (a peça materializa a mudança de requisito) | decisão de Design registrada; referendo do Produto pendente | Produto (Victor Lima / Rolim) — a peça deste ciclo é o material do referendo | refinamento da Feature |
| 12 | **[ciclo 3] H-UX-08 revisada — RESPONDIDA (2026-08-13).** Com Estoque e Volume de Vendas em tier, o cliente vê só o selo, nunca a origem; resta a Avaliação, que é nota real e pode estar sob override. **Resposta de Design: NÃO distinguir** nota de API de nota sob override no card público. Motivo: um rótulo tipo "nota ajustada" expõe mecânica interna e contamina com suspeita TODAS as notas da página — inclusive as que vêm de API — sem ajudar o cliente a decidir a compra. A indicação de override é do painel admin, como o próprio brief determina | média (é resposta a hipótese do brief, não bloqueia a peça) | decisão de Design registrada, coerente com H-UX-05 | Design (respondido); Produto ciente | fechada neste ciclo |
| 13 | **[ciclo 3]** A taxonomia do brief v1.7 trata **Imagem** como campo por canal (API dos 3 canais, com override), mas a peça tem UMA imagem de produto no hero, fora do card. **Regra proposta por Design (2026-08-13):** o hero mantém UMA imagem, escolhida por **ordem canônica fixa — Wake (canal oficial) → Shopee → TikTok**, a primeira com imagem válida vence, e ela **nunca troca com a reordenação da pilha**. Motivo: imagem é identidade do produto; se ela acompanhasse o "melhor canal", o produto piscaria e pareceria outro a cada CEP informado. O card **não** ganha imagem própria — o comparador compara custo, não fotografia. O override por canal segue fazendo sentido no painel (canal com foto ruim), só não vira imagem por card | média (muda a anatomia da página se resolvida contra a peça) | lacuna do brief; regra proposta por Design | Produto referenda a regra | próxima rodada de brief |
| 14 | **[ciclo 3]** **Parcelamento** foi REMOVIDO do card por decisão do designer (2026-08-13, commit 2827db4), mas a taxonomia do brief v1.7 ainda o lista como campo do card (admin-only, Q-20). Ou o brief atualiza, ou o campo volta | baixa-média (1 linha do card) | divergência peça × brief, verificada | Produto (referendar a remoção) | próxima rodada de brief |
| 15 | **[ciclo 3]** A copy `Frete: "Não informado" (exceção TikTok)` do brief divergiu da peça, que mostra `Calculado no checkout` no TikTok. **Decisão de Design (2026-08-13): manter `Calculado no checkout`**, e propor ao Produto a regra geral — **a copy do campo vazio segue a CAUSA, não o campo**: `Não informado` = o dado não existe/não veio (caso do Prazo na Shopee); `Calculado no checkout` = o canal só revela o valor adiante no fluxo (caso do Frete no TikTok); `Informe o CEP` = falta uma entrada do cliente. Achatar as três em "Não informado" descartaria informação verdadeira e faria dado ausente por design parecer falha de integração | baixa | divergência peça × brief, verificada no render | Design decidiu; Produto referenda a regra | próxima rodada de brief |

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

Ciclo 3 (selos de tier) — de dentro pra fora, sobre a peça elevada (`10-elevada.html`):
1. Selo de tier — peça atômica: as 3 variantes de Estoque × as 4 de Volume de Vendas,
   incluindo a ausência de selo, e a hierarquia com a badge "Melhor oferta" já existente
2. Card de canal com selos — atualização da anatomia: onde os selos moram no card sem
   virar mural de badges, nos estados com e sem CEP
3. Card de canal com Estoque "Indisponível" — o estado novo: visível, sem total, sem CTA,
   distinguível do "não entrega neste CEP" (premissa 11)
4. Pilha + página completa — os selos convivendo com a reordenação FLIP e com a ordenação
   por custo, provando que selo não mexe na ordem (RF-06)

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

Ciclo 3 (adicionais) — o portão confere olhando a peça renderizada:
- Cada card exibe seu selo de Estoque **já no primeiro paint**, sem CEP informado; o selo de
  Volume de Vendas aparece quando existe e a sua ausência não deixa buraco no layout
- Nenhum número de estoque ("3 unidades") ou de vendas ("1.2 mil vendidos") aparece em
  qualquer estado — só rótulo categórico
- O canal com "Indisponível" é visível, sem total e sem CTA, e **não é confundível** com o
  canal "não entrega neste CEP" nem com um canal oculto
- Trocar o CEP e disparar a reordenação FLIP **não muda nenhum selo** e nenhum selo muda a
  ordem da pilha — a ordem continua explicada só pelo custo total
- "Últimas unidades" não usa vermelho, timer, nem tratamento de urgência agressiva
- O card com 3 marcações simultâneas (Melhor oferta + Estoque + Volume de Vendas) mantém
  hierarquia legível a 375px, sem quebra de linha órfã e sem badge vazando da caixa
- Contraste AA (4.5:1) em cada par cor/fundo novo dos selos, medido no render

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

[2026-07-17] [limpeza de código morto] Investigação disparada por task separada (mesmo padrão do bug do `srcLabel`): o campo `savings:'Economize R$ X,XX'` existia nos 3 estados de `STATE` (ref/cepA/cepB) e havia CSS pronto pra um chip `.channel__savings` (inclusive uma regra escondendo-o em cards não-melhores), mas nenhum lugar do `fillCard` inseria esse valor no HTML — nunca foi renderizado. Confirmado antes de decidir: os valores já estavam matematicamente corretos (diferença entre o total do canal "melhor oferta" e o segundo mais barato — ex. ref: R$ 206,90 − R$ 204,80 = R$ 2,10), então não era dado quebrado, só nunca ligado à tela. Perguntado ao designer se queria ligar o chip (perto do Total, só com CEP aplicado, seguindo a mesma regra de `hasCep` do badge/Total) ou remover como código morto — decisão: **remover**. Apagados `savings` dos 3 objetos em `STATE` e as regras `.channel__savings` e `.channel:not(.channel--best) .channel__savings{display:none}` do CSS, nos 3 espelhos. Sem mudança visual (o chip nunca apareceu) — confirmado sem erros de console após a remoção.

[2026-08-13] [fase 01 · ciclo 3] **Spec reaberta (ciclo 3)** a partir do **Brief Design v1.7**
(12/08/2026, DRP v2.4), colado na conversa pelo designer. Recorte fechado: entram apenas os
**selos de tier de Estoque e Volume de Vendas** no card do comparador público (Tela 1 do brief).
Rota: mudança intencional de spec (o brief mudou o contrato), não drift.
- **Fatiamento decidido:** as Telas 4 e 5 do brief (override administrativo + TTL + tag manual
  "Lançamento", RF-13) são a **prioridade declarada do Produto**, mas ficaram FORA desta spec —
  outro usuário primário (admin), outra tarefa principal, e a regra do processo é 1 demanda = 1
  tarefa. Precisam de **spec própria** (`specs/painel-override-ttl.md`, a nascer numa fase 01
  separada). Sinalizado ao designer: enquanto essa spec não existir, o entregável que o brief
  mais pede segue não atendido — é a maior lacuna aberta do ciclo, e é de escopo, não de peça.
- **Lacuna de insumo registrada:** `insumos/brief.md` é a **v1.1**; a **v1.6** não existe no
  repo. Todos os itens que a v1.7 marca "sem mudança — ver Brief v1.6" (H-UX-06, H-UX-07,
  H-UX-09, Q-22, Telas 2/3/6/7/8, riscos e restrições herdados) ficam **não verificáveis** neste
  ciclo. Consequência concreta já observada: não consigo confirmar se o disclaimer de variação
  de preço (Tela 7, "sem mudança") e a contrapartida pública do timer de escassez (Tela 6) eram
  requisitos já pendentes — a peça atual não tem nenhum dos dois. Dono: Produto (anexar a v1.6
  em `insumos/`). Não bloqueia o recorte dos selos.
- **3 decisões do designer que destravaram o recorte** (perguntadas na entrada da fase 01):
  (1) *Estoque "Indisponível"* → canal fica **visível com o selo**, sem total e sem CTA. Isso
  **revoga a parte "sem estoque" do RF-006** (ocultação silenciosa) e virou a premissa 11 —
  crítica, com referendo do Produto pendente e a peça como material do referendo. A ocultação
  silenciosa continua valendo para canal INVÁLIDO/sem vínculo.
  (2) *Selos sem CEP* → **sempre visíveis**, desde o primeiro paint: vêm da API do canal, não
  do frete. Difere do tratamento de Frete/Prazo/Total/badge, que a decisão de 2026-07-16
  condicionou ao CEP — e é coerente, porque ali o motivo era não mostrar valor de frete que a
  página não sabe; aqui a página sabe.
  (3) *Copy dos tiers (H-UX-10/H-UX-11)* → **rótulos literais do Produto** (`Disponível`,
  `Últimas unidades`, `Campeão de vendas`, `Mais vendido`, `Lançamento`), sem estilizar para
  urgência comercial. Motivo: casa com a direção "premium, menos promocional" consolidada nos
  últimos ciclos e **baixa o custo de um limiar mal calibrado** — risco que o próprio brief
  mapeia (Q-23) e cuja mitigação ele atribui ao tratamento visual.
- **H-UX-08 revisada respondida** como premissa 12 (não distinguir, no card público, nota de API
  de nota sob override). **H-UX-12** (motivo obrigatório para "Lançamento") NÃO é resposta desta
  spec — é decisão da tela administrativa, vai com a spec do painel.
- **3 divergências peça × brief** encontradas na leitura e registradas como premissas em vez de
  serem corrigidas em silêncio: Imagem como campo por canal (13), Parcelamento removido do card
  mas ainda na taxonomia (14), copy do Frete no TikTok (15). Nenhuma bloqueia os selos.
- **Pendência FECHADA pelo brief:** a origem real da nota de avaliação (aberta sem dono no
  Rastro de 2026-07-16) agora tem fonte definida — API (Wake, Shopee) / fallback admin (TikTok,
  até HT-04). O mock atual da peça (4,6 / 4,3 / 4,8) segue válido como dado de exemplo.
- **Portão de saída da fase 01:** critério de sucesso do ciclo 3 é checável olhando ✔ · escopo
  com fronteira explícita (incluindo o fatiamento do painel admin) ✔ · premissa crítica 11 com
  dono (Produto) e prazo (refinamento da Feature) ✔. Spec segue `ativa`, não bloqueada.
  Próximo passo: fase 02 (`/gerar-com-guardrails`) — decidir a Direção Estética dos selos na
  entrada, antes da 1ª peça, e fixar os valores de tier de exemplo por canal (aprendizado dos
  ciclos 1 e 2: dados de exemplo fixados cedo).

[2026-08-13] [fase 02 · ciclo 3] **Direção Estética do ciclo 3 registrada na spec ANTES da 1ª
peça** (regra 5b), via `frontend-design`: "três altitudes de marcação, nunca três badges" — peso
visual proporcional à autoridade e à durabilidade do dado (veredicto preenchido > prova social em
contorno > estado de estoque tipográfico). Dataset de tiers por canal também fixado antes de
gerar (aprendizado dos ciclos 1 e 2), escolhido para exercitar todos os valores incluindo a
ausência de tier (Ybera.com/Wake).

[2026-08-13] [fase 02 · ciclo 3] **Peça 11 (selo de tier) gerada** em
`pecas/comparador-publico/11-selo-tier.html` — ficha de componente com **3 direções** para o
designer escolher olhando o renderizado (a decisão de hierarquia é dele, não da geração):
- **A — estado tipográfico:** nenhum chip novo; Estoque e Volume viram texto com marcador.
  Trade-off: card máximamente calmo, mas a prova social quase desaparece e o Produto pode
  considerar que o selo não entrega o que o brief pediu.
- **B — chip de contorno (recomendada):** `Melhor oferta` segue a única pílula preenchida;
  Volume de Vendas em chip de contorno com hierarquia interna (borda 1.5px + neutral-900 para
  `Campeão de vendas`, 1px + neutral-700 para `Mais vendido`, tracejado para `Lançamento` —
  tracejado porque é escolha MANUAL do admin, não degrau da mesma escada, atendendo a restrição
  do brief de não sugerir cálculo automático); Estoque tipográfico com ponto de status.
  Trade-off: mais uma forma no card — satura se um 4º selo aparecer depois.
- **C — badge preenchido semântico:** usa o sistema `surface·text·border/badge/*` do DS por cor.
  Trade-off: legível de longe, mas é o mural de badges, colide o âmbar de `Últimas unidades` com
  o âmbar do aviso "não entrega neste CEP", e reintroduz o tom promocional que os ciclos
  anteriores tiraram de propósito. Registrado na peça que blue/purple nunca foram usados nesta
  página — escolher C é decidir expandir a paleta do comparador.
- **Estado novo (premissa 11) prototipado lado a lado** com o "não entrega neste CEP" para provar
  o critério de não-confundibilidade: sem estoque = neutro rebaixado, borda contínua, nota
  "Sem estoque nesta loja agora", sem total e sem CTA; não entrega = âmbar, borda tracejada,
  estoque segue `Disponível`. Causas diferentes, tratamentos diferentes.
- **Linha de flags** (`.channel__flags`) criada como 3ª linha do bloco de identidade, sem disputar
  espaço com nome/badge — aplicação direta do aprendizado de 2026-07-16.
- **Correções durante a geração:** (a) o separador "·" da direção A ficava **órfão no início da
  linha** quando a linha de flags quebrava — mesma armadilha do `.src-sep` do ciclo 2; removido, a
  separação ficou no `column-gap`. (b) a ficha punha 3 cards lado a lado a partir de 720px, o que
  dava cards de ~240px — mais estreitos que na página real (~340px), fazendo a linha de flags
  quebrar num lugar onde a página real não quebra: a ficha estaria mentindo. Breakpoint subiu para
  1000px e a ficha para 1080px de largura; cards medidos em **349px**, próximos do real.
- **Verificação:** console limpo; a 375px e a 1280px sem h-scroll, sem clipping e **nenhum selo
  vazando da caixa do card** (medido elemento-contra-sua-caixa, não contra o viewport — lição do
  ciclo 2); linha de flags em 1 linha nos dois breakpoints. **Ressalva honesta:** os screenshots
  pararam de funcionar no meio da verificação (painel do Browser oculto, imagens vindo preto), então
  as direções B e C foram verificadas por **medição de DOM, não visualmente** — a direção A eu vi
  renderizada. A crítica visual das três é do designer (é o veredicto desta fase).
- **Δtokens:** NENHUM novo. Tudo em rampas já existentes no `tokens.json` (neutral, green, amber; a
  direção C usa blue/purple que existem no DS mas nunca foram usados nesta superfície). Ícones
  (troféu, tendência, brilho) são SVG inline provisórios — pendência #1, já carimbada, não renasce.
- **Achado fora do escopo da peça, para o portão:** o `.pending` da peça 10/elevada (usado em
  "Informe o CEP", "Não informado", "Calculado no checkout") é `neutral-500` #B0AFB2 sobre branco =
  **~2,2:1, reprova WCAG AA** com folga. É texto que o cliente lê, introduzido na mudança de
  2026-07-16 (quando Frete/Prazo passaram a ficar em branco sem CEP) e nunca medido. Na peça 11 usei
  `neutral-600` (5,30:1, par já validado no ciclo 1) para o mesmo papel. **Não corrigi na peça 10 por
  estar fora do recorte desta peça** — vai como bloqueio candidato para o portão do ciclo 3.
Aguardando veredicto do designer (aceitar uma direção / corrigir / rejeitar) antes da peça 12.

[2026-08-13] [fase 02 · ciclo 3] **Veredicto do designer na peça 11: direção C** (badge preenchido
semântico) — não a B que eu havia recomendado. Decisão registrada, direção C aplicada.
**Peça 12 (selos na página) aplicada** em `index.html` e `pecas/comparador-publico/10-elevada.html`:
`.channel__flags` como 3ª linha do bloco de identidade, `TIER` (stock/volume) + `TIER_ICON` e
`renderFlags(ch)`; tiers por canal no `CH` conforme o dataset da spec (Shopee ok/champ · TikTok
low/launch · Ybera ok/sem volume). Ordem no card: volume → estoque. Selos independem de CEP, como
decidido. +6 tokens no `:root` (blue-100/200/700, purple-100/200/700) — rampas que já existem no
`tokens.json` mas **entram nesta superfície pela 1ª vez**; nenhum valor inventado.
**`entrega-ciclo2/10-elevada.html` NÃO foi tocada** (divergindo da prática de "3 espelhos" dos
ciclos anteriores): é pacote de entrega carimbado do ciclo 2 e o ciclo 3 ainda não passou pelo
portão — a entrega do ciclo 3 nasce em pasta própria na fase 04. O espelho fica desatualizado de
propósito, e isso está registrado aqui para não virar drift silencioso.
**Verificação (375 e 1280, console limpo):** sem h-scroll, nenhum selo/badge/CTA vazando da caixa
do card (medido elemento-contra-sua-caixa), linha de flags em 1 linha nos dois breakpoints;
reordenação FLIP com CEP 01310-100 preservada (asserção: order=[ybera,shopee,tiktok], best=ybera)
e **nenhum selo muda com o CEP** — a ordem segue explicada só pelo custo (RF-06 preservado).
Contrastes calculados dos pares novos, todos PASS AA: blue-700/blue-100 **6,64:1** ·
purple-700/purple-100 **5,92:1** · neutral-900/neutral-200 **14,1:1** · green-800/green-100 e
amber-800/amber-100 já validados nos ciclos 1–2 (6,6 e 6,37:1).
**2 problemas REAIS que a direção C materializou** (eram os riscos que a peça 11 previa; agora têm
evidência visual, ambos no cenário CEP 69900-970):
1. **Colisão de verde:** o card melhor exibe `Melhor oferta` (pílula verde) e `Disponível` (pílula
   verde) em linhas adjacentes, mesma forma e quase mesma cor. O verde deixa de significar "este é
   o recomendado" e passa a significar também "tem estoque" — o veredicto, que é o ativo mais
   valioso da página, perde exclusividade. Ninguém tinha previsto ESTE par (a peça 11 mostrou o
   card melhor com Ybera, que não tem tier de volume, então o empilhamento não apareceu).
2. **Colisão de âmbar (prevista na peça 11, confirmada):** no card "não entrega neste CEP", a
   pílula âmbar `Últimas unidades` fica imediatamente acima da faixa âmbar "A loja não entrega
   neste CEP". Além da cor repetida, a leitura é contraditória: pressa pra comprar em cima do
   aviso de que ali não dá pra comprar.
Ambos vão ao designer com proposta de correção mínima (sem sair da direção C) antes do portão.

[2026-08-13] [fase 02 · ciclo 3] **Peça 12 ACEITA pelo designer sem correções** — as duas colisões
apontadas (verde `Melhor oferta` × `Disponível`; âmbar `Últimas unidades` × aviso "não entrega")
ficam como estão, por decisão explícita ("pode manter assim"). Registrado como **decisão, não
descuido**: as correções mínimas foram propostas (neutralizar o `Disponível`; suprimir o selo de
estoque no card que não entrega) e recusadas. Consequência assumida: o verde deixa de ser
exclusivo do veredicto do comparador, e o card "não entrega" carrega duas marcas âmbar com leitura
contraditória. Se o portão (fase 03) reabrir esses pontos pela seção de craft/hierarquia, o
veredicto continua sendo do designer — este registro existe para que a reabertura seja uma escolha
informada e não uma redescoberta.
**Estado do ciclo 3:** peças 11 (ficha de 3 direções) e 12 (selos aplicados na página) geradas e
aceitas. Pendentes da quebra de tarefas: o card com Estoque `Indisponível` como estado de página
(hoje só existe na ficha da peça 11 — deliberadamente NÃO implementei o caminho `stock:'out'` no
`fillCard`, porque não há cenário que o alcance e isso viraria código morto, o mesmo defeito que
`srcLabel` e `savings` já causaram neste projeto). **Nenhuma peça do ciclo 3 passou pelo portão
ainda** — regra 2 do processo: nada é entrega, apresentação ou commit final antes da fase 03.

[2026-08-13] [fase 01 · ciclo 3 · Δspec] Fechados os 4 itens de "a ajustar" que o brief v1.7
levantou e que sobreviveram ao ciclo (os outros 2 — selos sem CEP e selo × ordenação — foram
resolvidos e verificados na peça 12):
- **Frete no TikTok (premissa 15):** mantido `Calculado no checkout`. Regra geral proposta ao
  Produto: copy de campo vazio segue a CAUSA (`Não informado` = dado não veio · `Calculado no
  checkout` = canal só revela adiante · `Informe o CEP` = falta entrada do cliente). Zero mudança
  de código — a peça já estava certa, o brief é que precisa alinhar.
- **Imagem (premissa 13):** hero mantém uma imagem, por ordem canônica Wake → Shopee → TikTok,
  imutável na reordenação. Card não ganha imagem própria. Zero mudança de código — a peça já se
  comporta assim; o que faltava era a REGRA escrita, que agora existe para o Produto referendar.
- **H-UX-08 (premissa 12): RESPONDIDA** — não distinguir nota de API de nota sob override no card
  público. Fechada.
- **Origem da nota de avaliação:** pendência aberta desde 2026-07-16 **FECHADA** pelo brief v1.7
  (API Wake/Shopee; fallback admin TikTok até HT-04). Mocks 4,6 / 4,3 / 4,8 seguem válidos como
  dado de exemplo. **Deliberadamente NÃO criei campo `source:'api'|'admin'` no `CH`**: como a
  premissa 12 decidiu não exibir origem, o campo nasceria sem ninguém que o renderize — seria o
  terceiro caso de código morto deste projeto, depois de `srcLabel` e `savings`. A origem vive no
  documento, não no protótipo.
Nenhum dos quatro exigiu tocar em `index.html` — são contrato, não pixel. Δ pro Produto sai da
premissa 13 (regra da imagem) e da 15 (regra da copy por causa).

[2026-08-13] [fase 02 · ciclo 3] **Card de melhor oferta reformulado a partir de print de
referência do designer** — moldura preta GROSSA (border 1px → 3px, cor `neutral-900` mantida a
pedido, não a rosa do print) + faixa full-width no topo, DENTRO da moldura: fundo `neutral-900`,
texto branco em caixa alta com `letter-spacing:.12em`, estrela `amber-600`. **Reverte duas decisões
anteriores** e isso é intencional, não drift: (a) 72c2e96, que trouxe o selo de volta pra DENTRO
do card alinhado ao logo; (b) a mudança de 2026-07-15, que levou o selo de rosa `club-600` →
`green-800` → pílula clara `green-100/200`. O `.channel__badge` foi REMOVIDO (CSS e JS) em vez de
ficar órfão — sem resíduo, confirmado por grep.
Implementação: `.channel__ribbon` é o 1º filho do `<article>`, com margem negativa
`calc(var(--sp-500) * -1)` compensando o padding do card, e `overflow:hidden` no `.channel--best`
para a faixa herdar o raio interno sem cálculo de raio. A animação de migração do selo trocou de
`badgePop` (scale) para `ribbonIn` (translateY + opacity): scale com overshoot 1.08 seria clipado
pelo `overflow:hidden`. `prefers-reduced-motion` atualizado para o novo seletor.
**Efeito colateral positivo:** some a **colisão de verde** registrada e aceita na entrada anterior
— o veredicto agora é preto, então o verde volta a ser exclusivo do selo `Disponível`. O problema
1 daquela lista morreu sem correção dedicada. A colisão de âmbar (problema 2) **continua**, como
decidido.
**Verificação (375 e 1280, console limpo):** faixa a 3px do topo e da esquerda do card (= exatamente
a borda), largura interna cheia (337px no mobile, 628px no desktop), 20px de respiro até o conteúdo;
sem h-scroll; nada vazando da caixa em nenhum card. Artefato de método registrado de novo: com a aba
sem pintar, a animação congela no frame 0 e a medição acusa a faixa 38px acima do card — falso
positivo já documentado no ciclo 2; medido de novo sem a classe de animação, geometria correta.

[2026-08-13] [fase 02 · ciclo 3] **Selos de tier reposicionados a pedido do designer**: menores
(12→11px, padding 6/10→4/8, ícone 13→11px) e no **canto superior direito do card**, não mais numa
faixa própria abaixo da identidade. Implementação final: os selos vivem dentro do
`.channel__toprow` (linha do nome), com `margin-left:auto`; `align-items` do toprow passou de
`center` para `flex-start` para o topo dos selos casar com a 1ª linha do nome e com o topo do logo.
No mobile (<1080px) os dois selos empilham em coluna (`flex-direction:column; align-items:flex-end`);
no desktop ficam em linha.
**Duas tentativas descartadas antes desta, com o motivo medido:** (1) selos como 3º filho do
`.channel__head` (irmãos do bloco de identidade) — a 375px o flex quebrava os selos para uma linha
própria e sobrava um vão morto à esquerda deles, porque `flex-basis:auto` do `.channel__id` reserva
a largura do conteúdo antes de encolher; (2) forçar a mesma linha com `.channel__id{flex:1 1 0}` —
os selos subiam para o topo, mas o subtítulo era espremido a 94px e quebrava em **3 linhas**
(medido: `metaH` 54px na Shopee, 38px no TikTok). A solução adotada evita as duas porque o
subtítulo fica numa linha própria, embaixo, com a largura cheia do card.
**Verificação (375 e 1280, console limpo, com e sem CEP):** selos alinhados ao topo do cabeçalho
(`topGapVsHead` = 0) e rentes à borda direita do conteúdo (`rightGap` = 0) nos 3 canais; nome e
subtítulo em 1 linha cada; sem colisão entre selo e nome; sem h-scroll. Convivência verificada nos
3 contextos: card melhor (faixa preta no topo + selos abaixo dela, à direita), card comum e card
"não entrega neste CEP" (selos no canto, aviso âmbar abaixo — a colisão de âmbar segue, como
decidido pelo designer).

[2026-08-13] [fase 02 · ciclo 3] **Painel branco do card melhor com raio nos 4 cantos** (designer:
o branco só tinha raio embaixo; no print de referência tem nos quatro). O card melhor deixou de ser
"card branco com borda" e virou **moldura**: `.channel--best` tem fundo `neutral-900` e `padding:0`,
e o conteúdo passou a morar num `.channel__panel` — branco, `border-radius:var(--r-200)`, recuado
4px (`var(--sp-100)`) à esquerda, direita e base, de modo que o preto apareça em volta dele. Raio
escolhido por geometria, não por gosto: raio externo 16 − borda 3 = 13 de raio interno, menos 4 de
recuo = 9 ideal; `--r-200` (8px) é o token mais próximo, sem inventar valor.
`.channel__panel` foi adicionado como wrapper no `fillCard` do card normal — no card comum ele é
**transparente, sem padding e sem raio** (verificado: `rgba(0,0,0,0)` / `0px` / `0px`), só ganha
corpo sob `.channel--best`. O caminho "não entrega neste CEP" não recebeu wrapper: `isBest` exclui
`noship` por construção, então ali o painel nunca teria efeito e seria estrutura morta.
**Verificação (375 e 1280, console limpo):** recuo de 4px medido nos três lados (esquerda, direita,
base), faixa encostada no topo do painel (`ribbonToPanel` = 0), raio 8px aplicado, fundo do painel
branco sobre moldura preta, sem h-scroll. Artefato de método reincidente: o FLIP congela no meio
quando a aba não pinta — precisei finalizar as animações via `getAnimations().finish()` antes de
screenshotar; não é bug da peça (já documentado no ciclo 2).

[2026-08-13] [fase 02 · ciclo 3] **Moldura do card melhor afinada para 4px** (designer: "ficou
grossa"). Diagnóstico: o preto aparente eram **7px** — 3px de borda + 4px de recuo do painel — e não
os 3px que o CSS declarava; a espessura percebida não estava num valor só. Correção: borda
3px→4px e recuo do painel 4px→0, deixando a moldura ser exatamente a borda. Medido: preto = 4px à
esquerda, direita e base, nos dois breakpoints. **Topo mantido como estava**, conforme pedido — a
faixa "MELHOR OFERTA" segue com a mesma altura (38px) e o mesmo tratamento. O painel branco conserva
o raio nos 4 cantos (`--r-200`, 8px); encostado na moldura, os cantos de baixo mostram um vinco
preto discreto contra o raio interno, e os de cima seguem soltos sob a faixa. Sem h-scroll a 375 e
1280, console limpo.

[2026-08-13] [fase 02 · ciclo 3] **Nota de saída externa adicionada abaixo da pilha** (designer, com
print de referência): "Você será levado ao site do canal oficial para finalizar." + ícone de escudo,
centralizada, `neutral-700` 14px, ícone `neutral-600` 18px. Reaproveita o path do escudo já usado na
barra de garantias do rodapé — sem ícone novo, pendência #1 não cresce. Entra no reveal orquestrado
(`d-5`), depois dos cards.
Contexto: isto **restaura** a função da "nota de confiança no rodapé da pilha" que existia no ciclo 1
("Sua compra é feita direto na loja escolhida…") e se perdeu na reformulação da peça elevada — com
copy nova, mais direta sobre o redirecionamento (RF-007) e ancorada onde a decisão acontece, não só
no rodapé da página.
Espaçamento: `margin-top:var(--sp-500)` soma ao `gap` de 16px do `.compare` (flex column), dando
**36px** entre o último card e a nota — exatamente o mesmo respiro que já existe entre o cabeçalho
"Onde comprar" e a pilha (20 + 16). Ritmo preservado por coincidência verificada, não por sorte:
medido nos dois pontos. Verificado a 375 e 1280: 1 linha, sem h-scroll, console limpo.

[2026-08-13] [fase 02 · ciclo 3] **Hover dos cards replicado da peça irmã** indicada pelo designer
(`hub2-eta.vercel.app/pecas/comparador-publico/07-comparador-premium.html`). Lido direto do CSS dela,
não estimado por screenshot: `transform:translateY(-4px)` + `box-shadow:0 16px 40px rgba(30,30,31,.10)`,
transição de **240ms** em `cubic-bezier(.23,1,.32,1)`, tudo dentro de `@media (hover:hover)`.
Aplicado aqui com 3 adaptações conscientes:
- **Curva:** usei a `--ease-out` que já existe no projeto (`cubic-bezier(.22,1,.36,1)`) em vez de
  importar a da referência (`.23,1,.32,1`) — diferença imperceptível, e evita um token duplicado.
- **Cor da sombra do card melhor:** a referência tinta de rosa (`rgba(237,26,87,…)`) porque a moldura
  dela é `club-600`; a nossa moldura é preta, então a sombra tinge de `rgba(30,30,31,…)`. Mesma
  estrutura (`0 16px 40px -12px`, alfa .30), coerente com a nossa moldura.
- **`@media (hover:hover)` adotado** (não existia nas nossas peças): evita hover grudado em touch,
  onde o dedo não tem como "sair de cima". Sob `prefers-reduced-motion` o lift é desligado e só a
  sombra responde.
- **Borda deixou de mudar no hover** (era `neutral-400`), acompanhando a referência. A regra
  `.channel--best:hover{border-color}` existia só para neutralizar esse efeito → **removida**, senão
  ficaria CSS morto.
**Risco do FLIP resolvido (era o alerta que eu tinha levantado):** o FLIP escreve `transition` e
`transform` INLINE, e a inline vencia o CSS — depois de cada reordenação o hover herdava
`transform .42s cubic-bezier(.2,.7,.2,1)` (lift lento, e sombra sem transição nenhuma, porque a
inline não lista `box-shadow`). Correção: `flipCleanup`, um timeout de 460ms agendado no fim do FLIP
que **remove a transition inline**, devolvendo o controle ao CSS; cancelado no topo de `applyState`
para não interferir em toggle rápido de CEP.
**Verificação (console limpo):** em repouso, hover no card comum = `translateY(-4px)` +
`rgba(30,30,31,.1) 0 16px 40px` (idêntico à referência). Após aplicar CEP e a pilha reordenar
(ordem [ybera,shopee,tiktok], best=ybera), `transition` e `transform` inline voltaram a vazio,
`transitionProperty` efetiva = `transform, box-shadow`, e o hover no card melhor deu
`translateY(-4px)` + `rgba(30,30,31,.3) 0 16px 40px -12px`. Ou seja: hover funciona **antes e depois**
da reordenação, que era exatamente o risco.
**Δtokens (candidato, para a fase 04):** a sombra de hover `0 16px 40px rgba(...)` **não existe no
`tokens.json`** — o DS só tem `$shadow-sm` (`0 0 8px rgba(5,5,5,.10)`). Isto ressuscita o
`--shadow-lift` que o designer REJEITOU no portão do ciclo 1, agora com procedência diferente: não é
valor meu, é o valor de uma peça Ybera já publicada. Vai como Δtokens/pendência para o guardião do DS
decidir (elevação de hover é padrão recorrente, merece token), NÃO como invenção silenciosa.

[2026-08-13] [fase 02 · ciclo 3] **Tilt 3D + brilho na foto do produto**, portado da mesma peça irmã
(`07-comparador-premium`), que por sua vez porta o comet-card da Aceternity. Lido do CSS/JS de lá,
não recriado de olho: `perspective:1200px` no wrapper, `rotateX(--tiltx) rotateY(--tilty)` na foto
com `transition:transform .15s ease-out`, amplitude `maxDeg 12` (±24° de faixa total), e uma camada
de brilho `radial-gradient(circle at --gx --gy, rgba(255,255,255,.55), transparent 60%)` em
`mix-blend-mode:overlay`, que aparece no hover e segue o cursor.
**Armadilha estrutural resolvida na entrada:** o `.hero__media` carregava a classe `reveal`, que é
uma animação com `animation-fill-mode:forwards` sobre `transform`. Animação vence declaração normal
no cascade, então o `forwards` do reveal (transform:none) **anularia o tilt para sempre** depois do
page-load. Correção: criado o wrapper `.hero__figure`, que ficou com a perspectiva E com o `reveal`;
o tilt vive na foto. As duas camadas de transform deixam de disputar.
Ordem no DOM: a camada de brilho entra **entre a `<img>` e o pill "Indicação de Camila"** — assim
glaza a foto sem lavar o pill. `pointer-events:none` garante que não rouba o clique do link do
Instagram.
Mantido o zoom lento que já existia (`img:hover{scale(1.04)}`, 800ms) — não estava na referência,
mas é detalhe já aceito em ciclo anterior e compõe com o tilt em vez de brigar (elementos
diferentes). **Sinalizo para o veredicto:** se ficar movimento demais junto, o zoom é o primeiro a
sair, não o tilt.
**Verificação (console limpo):** desktop com ponteiro no canto superior esquerdo da foto →
`--tiltx:-7.51deg`, `--tilty:7.23deg`, `--gx:19.9% --gy:18.7%`, `transform` resolvido em `matrix3d`
real e perspectiva de 1200px no wrapper; ao sair do elemento, tilt volta a `0deg`/matriz identidade e
o brilho a `opacity:0`. Em viewport touch (375px, `hover:none`, 5 pontos de toque): `transform:none`
na foto e `display:none` no brilho — os dois guardas da referência funcionando, sem tilt travado no
mobile. Sem h-scroll, foto em 343px.

[2026-08-13] [fase 02 · ciclo 3] **Respiro cabeçalho → 1º card reduzido de 36px para 20px**
(designer: distância grande demais). Causa: o espaçamento não estava num valor só — `margin-top`
de 20px na `.pilha` somando ao `gap` de 16px do `.compare` (flex column). Correção no `margin-top`
(20px → 4px), preservando o `gap` do container. Hierarquia de espaçamento resultante, medida:
cabeçalho→1º card **20px** · entre cards **16px** · último card→nota de saída **36px**. Ou seja, o
cabeçalho fica colado no que ele rotula (só 4px mais que o intervalo entre cards) e a nota de saída
mantém o respiro maior, porque encerra o bloco em vez de pertencer a ele.
Nota de método: as medições brutas acusaram 8px e 48px porque o `reveal` estava congelado no frame 0
(`translateY(12px)`) — a aba sem pintar não avança a animação. Remedido após `getAnimations().finish()`
nos elementos com `reveal`. Terceira vez que este artefato aparece no ciclo; vale como aviso pra quem
medir espaçamento nesta peça: finalize as animações antes de acreditar no número.

[2026-08-13] [fase 02 · ciclo 3] **Raio do botão "Trocar" alinhado ao padrão de CTA** (designer):
`.cep__change` usava `--r-full` (pílula) — era o único botão redondo da peça, enquanto "Ver frete"
(`.cep__apply`) e "Comprar na…" (`.channel__cta`) usam `--r-300`. Trocado para `--r-300`. Verificado
no render: `borderRadius` do "Trocar" = 12px = o do CTA, e a altura de **44px** foi preservada (era o
bloqueio 4.2 corrigido no portão do ciclo 2 — alvo de toque; não regrediu).
Varredura de consistência no resto da peça: os `--r-full` restantes são todos elementos onde a pílula
é correta (selos de tier, pill de indicação, avatar, ponto de frescor, spinner, dots do overlay) —
nenhum outro botão fora do padrão.
**Achado colateral, fora do escopo desta edição:** o CSS de `.devbar` (e a linha
`document.querySelectorAll('.devbar button')` em `applyState`) continuam na peça, mas **não existe
markup de devbar** — ela foi removida em 2026-07-15. É CSS + JS morto, quarto caso do padrão
`srcLabel`/`savings`. Não removi porque não é o que o designer pediu aqui; fica registrado como
limpeza candidata para o portão.

[2026-08-13] [fase 02 · ciclo 3] **Selo Reclame Aqui adicionado ao rodapé — como PLACEHOLDER**,
entre a barra de garantias e o divisor. Marca "RA" em `green-800`, "Reclame Aqui" + "Reputação boa"
com ponto verde, caixa de borda `alfa-10-light` e raio `--r-300` (mesmo raio dos CTAs). Tudo em
tokens KZ, sem cor nova.
**Não reproduzi o selo oficial, de propósito, e isso não é preciosismo:** (1) o selo do RA é ativo
licenciado, servido pelo próprio Reclame Aqui via embed com link de verificação — uma cópia estática
é credencial fabricada; (2) reputação é dado DINÂMICO, muda com o tratamento das reclamações, então
um selo chapado no HTML começa correto e vira mentira sozinho; (3) exibir "Reputação boa" pressupõe
que a Ybera tenha esse status hoje, o que Design não tem como afirmar. O elemento entrega a **posição
e o peso visual** do selo no layout, que é o que a peça precisa validar; a troca pelo selo real é
tarefa de produção. Registrado como **pendência #5** em `pendencias-tokens.md` — com dono em
Produto + Marketing/Jurídico, não no guardião do DS, porque o bloqueio é de marca de terceiro e não
de token. `aria-label` declara "selo provisório" e o `href` é `#` (não aponta para uma página de
verificação que não existe).
**Verificação:** 375 e 1280, sem h-scroll, selo contido no `.footer__inner` (183×62px no mobile),
ordem do rodapé: garantias → selo → divisor → logo → privacidade → links → copyright.
**Ressalva de método:** os screenshots do painel pararam de repintar no fim desta rodada (devolvem
frame antigo em qualquer scroll), então o selo foi verificado por **medição de DOM, não visualmente**.
Vale um olhar do designer antes do portão.

[2026-08-13] [fase 02 · ciclo 3] **Barra flutuante do produto (só mobile)** — pedido do designer a
partir da peça irmã `07-comparador-premium`. Thumb 36px + nome do produto, `position:fixed` no topo,
entra quando o hero sai da tela via `IntersectionObserver` (não listener de scroll — não roda a cada
pixel). `aria-hidden` porque duplica o `<h1>`.
**Achado que muda a decisão, encontrado no CSS da própria referência:** lá a barra é **desligada no
mobile de propósito**, com o motivo escrito no arquivo — `@media(max-width:600px){.float-produto{
display:none}}` e o comentário "o chip flutuante vira só um círculo sem rótulo e sobrepõe os preços
dos cards" (abaixo de 480px eles já escondiam o rótulo, sobrando um círculo mudo). Ou seja: o pedido
é justamente para o breakpoint onde a referência desistiu. Entreguei mesmo assim, resolvendo as duas
causas em vez de repetir o formato:
- **Pílula ocupa a largura entre as gutters** (`left` e `right` = `sp-400`) em vez de ancorar em
  `top/right`. Não paira sobre UMA coluna do card, e o rótulo nunca precisa sumir (era a causa do
  "círculo mudo").
- **Fundo sólido** (`neutral-50`) em vez de `rgba(255,255,255,.92)` + blur: na referência ela pairava
  sobre fundo liso; aqui passa por cima dos cards, e o translúcido deixava o preço de trás
  fantasmando através dela — visto no render e corrigido.
- **Não existe no desktop** (`display:none` ≥1080px): a coluna esquerda já é sticky e mantém o produto
  visível o tempo todo; a barra seria redundância sobre redundância.
Sobra o overlap inerente a qualquer overlay fixo (o conteúdo passa por baixo) — agora limpo, sem
transparência. Se ainda incomodar, o caminho é a barra empurrar o conteúdo em vez de sobrepor
(`padding-top` no topo do documento quando ela aparece), o que custa um reflow no scroll.
**Verificado:** 375px — barra oculta com o hero na tela, aparece ao sair (`show` aplicado pelo
observer), fundo `rgb(255,255,255)` sólido, sem `backdrop-filter`, sem h-scroll. 1280px —
`display:none`. Console limpo.

[2026-08-13] [fase 02 · ciclo 3] **Seção "Como funciona" (3 passos) adicionada antes do rodapé**, a
partir de print do designer — a peça irmã do link NÃO tem essa seção (confirmado por busca no DOM
dela), então foi construída do zero com os tokens KZ, não portada. Título Syne 28px, subtítulo
`neutral-700`, três passos com círculo `neutral-900` numerado (36px) + título + descrição, ligados
por um traço `neutral-300` de 1px.
Detalhe de implementação que vale registrar: o traço vai de centro a centro dos círculos via
`.howto__step + .howto__step::before{left:-50%; right:50%}`, o que **só fecha exato com `gap:0`** no
grid — por isso o respiro entre colunas fica no `padding` do item, não no gap. Os círculos sobem com
`z-index:1` para o traço passar por trás.
Mobile: coluna única, `gap:sp-800`, **sem traço** (o conector horizontal não faz sentido empilhado).
**Verificado:** 1280px — 3 colunas de 376px, os três círculos com o centro exatamente na mesma altura
(y=290) e o traço a 18px do topo do passo, que é o centro do círculo de 36px; 375px — empilhado, sem
h-scroll, conector ausente. Console limpo. Semântica: `<section aria-labelledby>` + `<ol>` (é uma
sequência ordenada, não uma lista de features).

[2026-08-13] [fase 02 · ciclo 3] **Selo do Reclame Aqui trocado do placeholder para a ARTE OFICIAL**
(designer: "ficou muito diferente do oficial… só pra vermos a aplicação real"). Origem: manual do
próprio RA (`manual.reclameaqui.com.br/ra-verificada`), variante escura — escolhida porque o rodapé
é `neutral-900` e as variantes clara/verde-clara sumiriam no fundo. Asset em
`assets/selo-reclame-aqui.png` (210×169), renderizando a 80×64.
Como o asset foi obtido, para o registro: o PNG limpo e avulso do selo **só é liberado para empresas
já verificadas**; o que existe público é um screenshot da página do manual mostrando as 3 variantes.
Recortei a variante escura desse screenshot com bounding box detectado por varredura de pixel (não a
olho): recorte exato em (1643,95)–(1853,264). **É raster de screenshot** — bom para avaliar
aplicação, ruim para produção.
**Duas ressalvas que mudam o que a peça está afirmando:**
1. **O selo oficial não fala de reputação.** "Verificada por ReclameAQUI" atesta identidade e
   existência da empresa. Reputação (Ótimo/Bom/Regular) é outro artefato, com o *RA1000* como selo
   próprio. Hoje a peça mostra a arte de verificação **ao lado** do texto "Reputação boa", que não é
   arte oficial — são duas coisas diferentes coladas. Decisão de qual comunicar é do designer/Produto.
2. **Em produção não é imagem:** o RA entrega um embed com script de tracking
   (`trk.reclameaqui.com.br/assets/trk.min.js?trackIdRA=…`) que renderiza o selo e o link de
   verificação — e exige que a Ybera esteja de fato verificada.
Pendência #5 de `pendencias-tokens.md` atualizada com os três pontos. **Verificado:** imagem carrega
(`naturalWidth` 210), render 80×64, `alt` "Verificada por Reclame AQUI", sem h-scroll a 1280.
Screenshots do painel seguem sem repintar — conferência visual final é do designer.

[2026-08-13] [fase 02 · ciclo 3] **Selo do RA corrigido: era o artefato errado.** O designer apontou
que o certo é o selo de **REPUTAÇÃO** ("Ótimo", carinha verde), não o *RA Verificada* (escudo azul)
que eu tinha aplicado — e indicou o rodapé da KaBuM como referência viva. Erro meu de leitura na
rodada anterior: tratei "selo com reputação boa" como se houvesse um selo só.
Em vez de imitar de olho pelo print, inspecionei o widget real no rodapé da KaBuM e copiei a
especificação: caixa **137×48**, borda `1px #A4C929`, raio 4px, carinha **38px** à esquerda, e à
direita "ÓTIMO" (14px/700, `#4B5963`, uppercase) empilhado sobre o wordmark **80×12,75**. Os dois
SVGs são os **arquivos oficiais do RA** (`s3.amazonaws.com/raichu-beta/selos/assets/images/`),
baixados para `assets/ra-otimo.svg` e `assets/ra-logo.svg` — a peça fica self-contained, sem
hotlink. Asset da tentativa anterior (`selo-reclame-aqui.png`) **removido** do repositório.
Adaptação necessária: o selo tem texto `#4B5963` e wordmark escuro, feito para fundo claro — sumiria
no rodapé `neutral-900`. Por isso ele mora sobre uma **placa branca** (`neutral-50`, raio `--r-200`),
que é como marcas aplicam esse selo em rodapé escuro. Hover com o mesmo lift de 2px/sombra da peça.
**Verificado no render:** os dois SVGs carregam, caixa 137×48, borda `rgb(164,201,41)`, raio 4px,
carinha 38×38, wordmark 80×13, rótulo "Ótimo" em `rgb(75,89,99)` 14px — bate com o widget da KaBuM
medida por medida. Sem h-scroll.
**Segue valendo (pendência #5):** "Ótimo" aqui é dado de exemplo — reputação real muda com o tempo,
e em produção isto deve ser o embed que o RA serve e mantém atualizado, com link para a página da
empresa. Reprodução estática não se atualiza sozinha.

[2026-08-13] [fase 02 · ciclo 3] **Selo do RA mudou de nível: "Ótimo" → "Boa"** (designer). Troquei
também a ARTE, não só o texto: a carinha do widget é vinculada ao nível, então baixei a oficial do
nível correspondente (`bom.svg` → `assets/ra-bom.svg`) e removi `ra-otimo.svg`, que ficou sem uso.
`aria-label` atualizado. Trocar só o rótulo deixaria a arte de "Ótimo" contradizendo o texto.
**Divergência de nomenclatura registrada:** a escala oficial do RA é `otimo` · **`bom`** · `regular`
· `ruim` · `nao-recomendada` — confirmado testando os arquivos no S3 deles (`boa.svg` responde 403,
`bom.svg` responde 200). Ou seja, o rótulo oficial deste nível é **"BOM"**, não "Boa". Mantive "Boa"
porque foi o pedido explícito do designer, mas fica o registro: se a intenção é fidelidade ao selo
oficial, é uma palavra a trocar. Verificado no render: `ra-bom.svg` carrega, rótulo "Boa", caixa
137×48 preservada, sem h-scroll.

[2026-08-13] [fase 02 · ciclo 3] Seção "Como funciona" ganhou **fundo branco** (`neutral-50`),
full-bleed (designer). Efeito de ritmo: a página passa a ter três faixas distintas — comparação
sobre o gradiente neutro, "como funciona" em branco, rodapé em `neutral-900` — em vez de a seção
flutuar sobre o mesmo fundo da comparação. Verificado: `rgb(255,255,255)`, largura = viewport
(1280), sem h-scroll.

[2026-08-13] [fase 02 · ciclo 3] **Rodapé reorganizado no desktop** (print do designer): de coluna
única centrada para **grid de 2 colunas**, com `grid-template-areas` — `trust` e `div` ocupando a
largura toda, `brand` (logo sobre o texto, alinhados à esquerda) × `links` (à direita, em linha
única `nowrap`), e embaixo `copy` × **selo do RA no canto inferior direito**. O selo saiu de perto
do topo do rodapé e virou o último elemento, encostado na direita. Markup: logo e texto de
privacidade agrupados num `.footer__brand` (o grid precisa de UM item por área). **Mobile
intacto:** o grid vive só dentro do `@media (min-width:1080px)`; abaixo disso o rodapé continua
flex column centrado — única mudança lá é a posição do selo, que agora fecha a pilha em vez de
aparecer logo após a barra de garantias.
**Verificado — desktop 1280:** `display:grid`, marca a 32px da borda esquerda, logo acima do texto,
links a 32px da direita, selo a 32px da direita, abaixo dos links, na mesma linha do copyright e
sendo o elemento mais baixo do rodapé. **Mobile 375:** `display:flex`, ordem trust → divisor →
marca → links → copyright → selo, tudo centrado. Sem h-scroll nos dois. Console limpo.
**NÃO adotei a copy do print** — e isso é deliberado: o texto mostrado ("O Hub Inteligente é um
comparador independente…") nomeia o **HUB**, e existe decisão registrada desde o ciclo 1 de que a
palavra "HUB" não aparece em lugar nenhum da página (H-UX-05: o cliente deve perceber a vitrine da
influenciadora, não um agregador). Mantive o texto de privacidade atual na mesma posição. Vale
registrar, porém, que a frase do print é justamente o **disclaimer de variação de preço** que o
brief v1.7 pede na Tela 7 (RNF-Transparência) e que a peça não tem — apontado na leitura do brief e
ainda em aberto. Cabe adotá-la com redação sem "Hub" (ex.: "Preços e condições pertencem a cada
canal e podem mudar a qualquer momento"), o que fecharia a lacuna sem violar H-UX-05. Decisão do
designer.

[2026-08-13] [fase 02 · ciclo 3] Quatro ajustes de rodapé/fundo pedidos em sequência, todos só no
desktop exceto o último:
- **Garantias acompanhando a grid:** o diagnóstico não era o óbvio — as CAIXAS dos 3 itens já
  estavam alinhadas (offset 0 nas duas pontas). O que destoava era o CONTEÚDO: com `flex:1 1 240px`
  cada item virava uma coluna de 349px com o texto encostado à esquerda, então o 3º texto parava
  antes da borda. Fix: `flex:0 1 auto` + `justify-content:space-between` + `nowrap`. Medido: 1º a
  0px da esquerda, 3º a 0px da direita, larguras agora 250/301/312 (tamanho do conteúdo).
- **48px do divisor ao conteúdo:** resolvido com `row-gap:var(--sp-1200)` no grid e `margin:0` no
  divisor — **num valor só**, sem compor margem + gap (a armadilha que já apareceu duas vezes neste
  ciclo: 36px do cabeçalho e 7px da moldura eram somas escondidas). Efeito colateral coerente:
  garantias→divisor também virou 48px, dando ritmo uniforme ao rodapé.
- **Links alinhados ao topo do TEXTO, não do logo:** desciam junto com o topo do bloco de marca.
  Em vez de cravar 40px, criei `--footer-logo-h:24px` como fonte única — o logo usa a variável e os
  links descem `calc(var(--footer-logo-h) + var(--sp-400))`. Se o logo mudar de altura, o
  alinhamento acompanha sozinho. Medido: `linksTop - textoTop = 0`; antes era 0 contra o logo, agora
  são 40px abaixo dele. `margin-top` fica dentro do media query — no mobile é 0, empilhado intacto.
- **Fundo da página clareado:** o gradiente ia de `neutral-100` a `neutral-200` já em 62% da altura,
  escurecendo o miolo. Passou a `neutral-50` → `neutral-200` em 100%: começa branco e só encosta no
  cinza na base. Mesmas rampas do DS, nenhuma cor nova.
**Verificado 1280/1080/1079/375:** no limiar 1080 os 3 itens cabem numa linha sem clipe e sem
h-scroll; a 1079 o rodapé volta ao empilhado centrado (`flex`, `flex:1 1 240px`, `justify:center`),
com a margem dos links zerada. Console limpo.

[2026-08-13] [fase 02 · ciclo 3] **Fundo clareado de novo** — o designer disse que a 1ª tentativa
"não mudou nada", e ele estava certo na percepção: a mudança existia no CSS, mas era pequena demais
no miolo da tela. Diagnóstico com número, não com impressão: pintei os dois gradientes em canvas e
amostrei a cor por altura de viewport. Original × 1ª tentativa × versão final, no meio da tela:
`#EFEEF2` → (1ª tentativa, ~`#F6F5F8`) → **`#FBFAFD`**. Amostragem da versão final:
15% `#FEFDFE` · 35% `#FCFBFD` · 50% `#FBFAFD` · 70% `#F5F4F8` · 90% `#EFEEF2` — contra o original,
que já chapava em `#ECEBF0` a partir de 62% (70% e 90% ambos `#ECEBF0`).
Solução: parada intermediária em `neutral-100` aos 55%, com `neutral-200` só encostando na base.
Mantém o miolo quase branco **sem** matar a profundidade sob os cards — que é o motivo de eu não ter
ido para branco chapado: os cards são `neutral-50` (#FFFFFF) e perderiam a separação do fundo.
Só rampas do DS, nenhuma cor nova. `background-attachment:fixed` inalterado (o gradiente é da
viewport, não do documento — por isso a percepção muda pouco ao rolar).

[2026-08-13] [fase 02 · ciclo 3] **Bloqueio de acessibilidade corrigido — pego pelo designer a olho
nu, e confirmado por cálculo.** Os valores em `.pending` ("Informe o CEP", "Não informado",
"Calculado no checkout") usavam `neutral-500` #B0AFB2 sobre o branco do card = **2,18:1**, contra o
mínimo de 4,5:1 do WCAG AA. Trocado para `neutral-600` = **5,30:1** (par já validado no portão do
ciclo 1). Isso fecha o achado que eu tinha registrado como candidato a bloqueio na entrada da peça
12 — herdado da mudança de 2026-07-16, quando Frete/Prazo passaram a ficar em branco sem CEP e a cor
nunca foi medida.
**Varredura do mesmo defeito no resto da peça** (não me limitei ao elemento apontado): `.hero__sku`
("SKU 150264") tinha o mesmo `neutral-500` sobre o fundo da página = **2,15:1** — também corrigido
para `neutral-600` (5,22:1). O `.site-footer__copy` usa `neutral-500` mas sobre o rodapé
`neutral-900`: **7,63:1**, passa, mantido.
**Fica em aberto, mesma família, NÃO corrigido:** a borda do `.cep__input` usa `neutral-500` sobre
branco = 2,18:1, contra o mínimo de **3:1** exigido para contorno de componente de UI (WCAG 1.4.11
Non-text Contrast). É borda, não texto — muda o peso visual do campo, então não mexi sem o designer
ver. Candidato a bloqueio no portão.
Medido no render após a correção: `pending` 5,30:1 e `sku` 5,22:1, ambos PASS AA.

[2026-08-13] [fase 05→06 · ciclo 3] Crítica de screenshot (senior product designer) sobre a seção
"Como funciona" + rodapé no desktop. Achados medidos, não estimados. **Três aplicados pelo designer:**
- **Passo 3 — texto reescrito por DUPLICAÇÃO, não por estilo.** A descrição era "Você vai direto ao
  site oficial para finalizar a compra", quase verbatim da nota da pilha ("Você será levado ao site
  do canal oficial para finalizar") a ~600px de distância: o passo 3, que fecha a sequência, virava
  eco. Reescrito mudando o ÂNGULO, não só as palavras — "A compra é fechada na loja, sob as regras e
  a garantia dela" responde quem é o responsável depois do clique, informação que **nenhum outro
  elemento da página dava** (a nota diz para onde você vai; a barra de garantias fala de pagamento e
  de custo). Sobreposição de palavras entre os dois textos verificada por script: **zero**.
- **Título do passo 3 → "Compre".** Era "Compre com segurança", 3 palavras contra 1 dos outros dois.
  A sequência agora é **Compare → Escolha → Compre**: mesma classe gramatical, mesmo peso, e o
  paralelismo faz o trio ler como uma sequência em vez de três blocos.
- **Placa do selo do RA: padding `sp-300/sp-400` → `sp-200`.** A placa branca 169×72 era o elemento
  mais claro do rodapé e ficava na posição de menor prioridade, puxando o olho antes da marca.
  Agora 153×64, o selo continua legível e para de competir.
**Não aplicados nesta rodada** (registrados para o portão): (a) vazio de 102px entre o texto de
privacidade e o copyright — `align-self:center` no copyright resolve; (b) conector dos passos em
`neutral-300` sobre branco ≈1,3:1, quase invisível, sendo ele que carrega a metáfora de sequência —
`neutral-400` resolve sem virar traço pesado.
Verificado após as três: sem h-scroll, console limpo.

[2026-08-13] [fase 02 · ciclo 3] **BUG REAL corrigido: 2 selos quebravam o card no mobile.** O
designer mandou print: com duas tags no canto superior direito, elas empilhavam e rasgavam o bloco
de identidade — nome no topo, subtítulo empurrado ~28px pra baixo, escadinha. **A causa é física, e
foi medida antes de mexer:** a 375px sobram ~303px úteis no card; logo (44) + subtítulo com nota
(~180) + coluna de tags (~118) = **342px**. Não cabe lado a lado em nenhuma configuração — reduzir
fonte/padding das tags não fecha a conta (sobra 247px para 180+118).
**Correção por breakpoint, em vez de forçar um layout só:**
- **Mobile:** as tags voltam a ser a 3ª linha do bloco de identidade (abaixo de nome e subtítulo),
  alinhadas à ESQUERDA com o subtítulo. Isso resolve o vão morto que motivou a mudança anterior —
  o problema lá não era a linha própria, era ela estar alinhada à direita.
- **Desktop:** as tags ficam no canto superior direito como o designer pediu, agora via
  `position:absolute` no `.channel__id` (que ganhou `position:relative`). Absolutas saem do fluxo,
  então não empurram nem espremem nada: nome e subtítulo continuam colados. Só é seguro porque no
  desktop o card tem ~628px, folga de sobra.
**Verificado 375:** nome→subtítulo 2px (era 28), tags numa linha só, abaixo do subtítulo, alinhadas
à esquerda com ele, nada vazando do card, nos 3 canais (1 e 2 tags). **Verificado 1280:** tags a 0px
do topo e 0px da direita do bloco de identidade, sem colisão com nome nem subtítulo, numa linha.
Sem h-scroll nos dois. Console limpo.

[2026-08-13] [fase 02 · ciclo 3] **Barra flutuante do produto passou a ter a largura do conteúdo**
(designer: ocupava a página toda). Removido o `right`, o `position:fixed` encolhe para o conteúdo;
`max-width:calc(100vw - var(--sp-800))` impede vazamento com nome longo, e o `text-overflow:ellipsis`
do rótulo assume a partir daí. Medido a 375px: **272px** de largura (era 343), ancorada a 16px da
esquerda, 87px de folga à direita, sem clipe de texto. Nota: isso reduz a área coberta, mas não
elimina a sobreposição — overlay fixo sempre passa por cima do conteúdo que rola sob ele.

[2026-08-13] [fase 02 · ciclo 3] **SKU tirado do fluxo de leitura do topo** (designer questionou a
relevância dele ali). Concordo com a leitura, e a spec sustenta: o SKU interno é **guarda-corpo de
sistema** — "se um canal não retornar o SKU, o canal é ocultado" (Decisões anteriores) — não é
informação de compra para um cliente anônimo. Ele estava ocupando uma linha inteira entre o título e
a foto, na região mais cara da página.
Movido para um **chip discreto no canto superior direito da foto**: custo zero de altura (sai do
fluxo), continua acessível a quem procura, e para de competir com o título. Chip claro
(`rgba(255,255,255,.9)` + blur) em vez de texto direto sobre a imagem — sobre foto o contraste seria
imprevisível; com o chip é `neutral-700` sobre branco = **8,04:1**. Herda o tilt junto com a foto,
como o pill de indicação.
**Alternativa que fica registrada:** remover do card público de vez também se defende, já que o
papel do SKU é de backend. Mantive porque o designer pediu para reposicionar, não para remover.
Verificado 375 e 1280: chip dentro da foto (13px do topo e da direita nos dois), sem h-scroll.

[2026-08-13] [fase 02 · ciclo 3] **Ícone da nota de saída desalinhado no mobile — corrigido.** Causa:
o escudo era irmão flex do texto com `align-items:center`, então quando a frase quebrava em 2 linhas
a 375px ele ficava centralizado contra o bloco inteiro — boiando entre as duas linhas em vez de
acompanhar a leitura. Fix: o ícone entrou no FLUXO do texto (`display:inline-block` +
`vertical-align:-3px`), o `.stack-note` virou `display:block; text-align:center`. Assim ele ancora na
1ª linha e as demais fluem por baixo, como qualquer ícone dentro de frase. Tamanho 18→16px para casar
com a altura da linha de 20px. Medido: centro do ícone a **0,5px** do centro da 1ª linha (era
metade da altura do bloco de 2 linhas). Sem h-scroll.

[2026-08-13] [fase 02 · ciclo 3] Ordem dos campos do card trocada (designer): **Preço do produto →
Prazo de entrega → Frete** (Frete e Prazo invertidos). Consequência favorável, registrada: o Frete
passa a ficar encostado no divisor, imediatamente acima do Total — e é ele a parcela que faz o total
variar com o CEP. No mobile (grade 2 col) a 1ª linha vira `Preço | Prazo` e o Frete ocupa a largura
cheia da 2ª linha, ganhando peso. Verificado nos 3 canais por leitura de DOM; sem h-scroll.

[2026-08-13] [fase 02 · ciclo 3] **"Calculado no checkout" parou de quebrar em 2 linhas.** Causa
direta da troca de ordem da entrada anterior: são 3 campos numa grade de 2 colunas no mobile, então
o último (agora o Frete) ficava sozinho na 2ª linha com metade da largura. Fix: no mobile o último
campo ocupa a linha inteira (`grid-column:1/-1`), escopado em `@media (max-width:1079px)` para não
tocar o desktop, onde a grade é de 3 colunas e cada campo tem a sua. Não mexi na copy — "Calculado
no checkout" é a redação decidida na premissa 15 (copy segue a causa), então o ajuste tinha que ser
de layout. Medido a 375px: célula do Frete 301px (era ~145) e valor em **1 linha** nos 3 canais.
A 1280px: 3 colunas de 189px, `grid-column:auto`, tudo na mesma linha, sem regressão.

[2026-08-13] [fase 05→06 · ciclo 3] Crítica externa (formato senior product designer) trazida pelo
designer, tratada **por etapas**, a pedido dele. Duas decisões desta etapa:
- **CEP NÃO muda para a coluna da direita** (recusado pelo designer): empurraria os cards para
  baixo, reduzindo quantos canais cabem na primeira dobra — que é o ativo da página. O achado da
  crítica (o card diz "Informe o CEP" e o campo está ~1000px à esquerda) continua **válido e em
  aberto**; a correção de menor custo, ainda não aplicada, é tornar o próprio "Informe o CEP" um
  controle que dá foco no campo existente.
- **Campo de CEP reconstruído com LABEL FLUTUANTE** (padrão outlined, referência Gmail, pedido do
  designer) resolvendo junto o achado de acessibilidade: o placeholder fazia papel de label, e
  placeholder desaparece ao digitar, deixando o campo sem nome (WCAG 3.3.2). Agora existe
  `<label for="cepInput">CEP</label>` de verdade; **removi o `aria-label="Seu CEP"`** que existia,
  porque ele sobreporia o label visível e o leitor de tela anunciaria algo diferente do que está na
  tela. Adicionado `autocomplete="postal-code"`.
Implementação sem JS: `:placeholder-shown` é o detector de "campo vazio", e a dica de formato
(`00000-000`) só aparece **depois** que o label sobe — senão os dois disputariam o mesmo lugar.
`prefers-reduced-motion` desliga a transição. Estado de erro tinge o label de `red-700`.
**Verificado nos 4 estados** (medido; ver nota de método abaixo): vazio+sem foco → label dentro do
campo, centro a 22px do topo (= centro do campo), 16px, `neutral-600`, placeholder transparente ·
com foco → label em cima da borda (desvio **0**), 12px, `neutral-900`, placeholder "00000-000"
aparece · preenchido+sem foco → segue em cima da borda, 12px, `neutral-700` · esvaziou → desce de
volta. Console limpo.
**Nota de método (nova, vale para as próximas verificações):** `:focus` não casa quando
`document.hasFocus()` é false — a aba do painel nasce sem foco de janela, então `input.focus()` via
JS mudava o `activeElement` mas NÃO ativava as regras `:focus` do CSS. Cheguei a medir "o label não
sobe no foco" e era falso negativo. Foi preciso um clique real no documento para dar foco de janela
antes de medir. Terceiro artefato de método deste ciclo, junto do rAF congelado e do viewport zero.
**Efeito colateral declarado:** a borda do campo passou de `neutral-500` (2,18:1) para `neutral-600`
(5,30:1), fechando o bloqueio WCAG 1.4.11 que eu havia registrado como candidato de portão — o
mínimo para contorno de componente de UI é 3:1. Não foi pedido explicitamente; é o mesmo defeito da
família que o designer já mandou corrigir duas vezes hoje, e eu estava reconstruindo o campo.

[2026-08-13] [fase 06 · ciclo 3] **Bloco de CEP compactado + ícone dentro do campo.** Saiu a linha
"Consultar valor do frete" (o label dentro do campo assumiu o papel) e o pin virou ícone interno,
reaproveitando a constante `PIN_LEAD` — que teria virado órfã. Bloco de **106px → 78px**. Removido
também o CSS de `.cep__note`, morto desde que a microcopy de LGPD saiu.
Desdobramento apontado pelo designer: com a linha fora, o campo passou a dizer só *o que preencher*,
não *o que resolve*. Medi o espaço útil dentro do campo e a copy foi para o próprio label. Precisou
de **dois passos**: "CEP para calcular o frete" cabia no desktop (180px em 230 úteis) mas **não no
mobile** (151px úteis) — o label passava por baixo do botão "Ver frete", verificado no render.
Ficou **"CEP para o frete"** (119px), que cabe nos dois. Lição: medir o espaço útil no breakpoint
MAIS APERTADO antes de decidir copy que vive dentro de um componente.

[2026-08-13] [fase 06 · ciclo 3] **Indicação da influenciadora saiu de cima da foto e foi para o
header, à direita.** Atende o achado da crítica externa: a atribuição comercial estava no elemento de
menor peso semântico da tela, sobreposta à imagem como se fosse enfeite. No header ela é estrutura.
Ganhou **borda** (`neutral-300`, pílula) a pedido do designer, para ler como badge; perdeu o blur e o
fundo translúcido, que existiam só para descolar da foto. **O logo voltou para a esquerda** —
reverte o pedido de centralizar de 2026-07-15, agora que a direita tem conteúdo.
Registro de um mal-entendido meu, para não se repetir: interpretei "levar para o canto direito do
header" como sendo o NOME DO PRODUTO e cheguei a movê-lo, junto com CSS morto e um H1 no masthead.
O designer corrigiu — era o badge de indicação. Desfeito por inteiro: o `<h1>` voltou ao hero acima
da imagem, `.hero__title` restaurado, e as 4 regras de `.hero__referral` (o pill sobre a foto)
removidas por já não terem uso.
**Pergunta do designer ainda EM ABERTO, não respondida:** "levar o nome do produto para baixo da
imagem seria ganho de UX?".
**Header agora respeita a grade do site** (pedido do designer): era banda full-bleed com padding
próprio, começando a 32px da viewport, enquanto o conteúdo da página começa a 92px no desktop —
desalinhado em 60px. Ganhou `.site-header__inner` com `max-width:1160px` e gutter igual ao do `.page`
e do `.footer__inner`. Medido a 1280: logo em **92px** = início da coluna esquerda; badge terminando
em **1188px** = fim da coluna direita; desalinhamento **0** nos dois lados, e o rodapé (que já
seguia a grade) confirma o mesmo 92px. A 375px: 0 nos dois lados também.

[2026-08-13] [fase 06 · ciclo 3] **Nome do produto movido para ABAIXO da imagem** — e vale registrar
como a decisão foi tomada, porque eu errei o método antes de acertar. O designer perguntou se havia
ganho de UX; respondi de princípio, sem olhar, que não haveria. Ele cobrou se eu tinha de fato
avaliado. Não tinha. Montei as duas versões na página e medi:
- **Empatam no que é mensurável:** altura do hero 443px nas duas, "Onde comprar" começa em y=640 nas
  duas, e o órfão do "90ml" continua em 2 linhas nas duas (é largura de coluna contra 28px, não
  posição — isso da minha resposta original se sustentou).
- **O que muda:** a imagem sobe 80px e passa a ser a primeira coisa depois do header.
**Veredicto revisado:** vale mover, não por métrica (elas empataram) mas por **coerência com a
direção estética registrada** — "calor editorial de marca de beleza" e "parece a vitrine da própria
influenciadora". Foto liderando é entrada editorial; nome liderando é ficha de e-commerce. O nome
vira legenda da foto. Decisão do designer: aplicar.
Ajuste que veio junto: com a troca, imagem→nome era 16px e nome→CEP 20px — quase iguais, e o nome
flutuava entre os dois sem pertencer a nenhum. Virou **12px / 32px** nos dois breakpoints, que é o
que faz o nome ler como legenda da imagem em vez de rótulo do campo de CEP.
Os delays do `reveal` trocaram junto (figura d-0, nome d-1) para o page-load orquestrado seguir a
nova ordem de leitura em vez de acender o nome antes da foto que ele legenda.
**Lição de método registrada:** "avaliar" não é argumentar de princípio. Duas versões renderizadas e
medidas custaram uma rodada e mudaram minha recomendação.

[2026-08-13] [fase 06 · ciclo 3] **Os dois estados vazios deixaram de ser gêmeos visuais.** Achado
da crítica: "Informe o CEP" e "Não informado" eram ambos `neutral-600` — um pede AÇÃO do cliente,
o outro informa que o dado NÃO EXISTE, e ao olho eram idênticos. A copy já estava certa (é a regra
da premissa 15, agora exigida também pelo brief v1.9); faltava o visual acompanhar.
- `.pending` (dado ausente: "Não informado", "Calculado no checkout") — inalterado, `neutral-600`.
- `.await` (falta ação: "Informe o CEP") — `neutral-900` + o **mesmo pin do campo de CEP**, que
  amarra visualmente o valor ao lugar onde ele se resolve.
**Recusei a sugestão original de dar cara de link** (sublinhado / cor de link): o texto ainda não é
clicável, e afordância falsa é defeito pior do que a indistinção que se queria corrigir. Se e quando
o "Informe o CEP" virar controle que foca o campo (prioridade 1 da crítica, ainda não aplicada),
aí a cara de link passa a ser honesta.

[2026-08-13] [fase 06 · ciclo 3] **Órfão do "90ml" resolvido com `text-wrap:balance`**, uma
declaração, no lugar de `&nbsp;` cravado. Medido linha a linha com Range (a caixa do H1 mede a
largura total e esconderia o efeito): **sem balance 295px + 61px** — o "90ml" sozinho numa linha —,
**com balance 161px + 196px**, duas linhas equilibradas. Escolhi `balance` em vez de `&nbsp;` porque
o dataset de produto muda: `&nbsp;` conserta ESTE nome e quebra no próximo; `balance` é o browser
distribuindo, e continua valendo para qualquer nome.

[2026-08-13] [fase 06 · ciclo 3] **Borda do campo de CEP no estado de repouso: `neutral-600` →
`neutral-500`**, por decisão do designer ("está com borda preta"). Ele tem razão na leitura:
`neutral-600` é o mesmo tom do texto secundário, e a 1px lê como preto.
**Consequência assumida, não escondida:** a borda cai de 5,30:1 para **2,18:1**, abaixo do mínimo de
3:1 do WCAG 1.4.11 para contorno de componente. É uma REGRESSÃO consciente do bloqueio que eu mesmo
tinha fechado horas antes ao reconstruir o campo. Fica como bloqueio candidato no portão.
A causa raiz não é a peça, é o DS: contra o branco, a rampa neutral oferece 1,66 · 2,18 · 5,30 —
**não existe degrau perto de 3:1**. Ou a borda reprova, ou fica visivelmente escura. Registrado como
**item 6 de `pendencias-tokens.md`** (proposta: degrau ~`#8A8A8E` ≈ 3,4:1, ou um token semântico
`border/field`), com dono no guardião do DS e impacto em todo input com borda sobre superfície clara
— não é específico desta peça. Fills não resolvem: campo branco sobre card branco dá 1,03:1.
Mitigação que permanece: o **foco** continua em `neutral-900` com halo, então repouso × ativo seguem
inequívocos; o que reprova é só a identificação do campo em repouso.

[2026-08-13] [fase 06 · ciclo 3] **Nome do produto REVERTIDO para acima da imagem**, por preferência
do designer depois de ver as duas versões no ar. Fica o registro de que a decisão foi tomada
olhando, não argumentando — que é o critério certo, e valeu para os dois lados: eu argumentei
contra mover, depois medi e mudei de recomendação, e o designer testou e preferiu o original.
Revertido também o espaçamento 12/32 (mobile), que existia só para o nome funcionar como legenda da
foto — voltou ao 16/20 original; no desktop o gap de 12px é o valor de ciclos anteriores e não foi
tocado. **`text-wrap:balance` MANTIDO**: resolve o órfão independentemente da posição, e com o nome
no topo as linhas ficam 188px + 228px em vez de 295px + 61px.
Aprendizado que sobra da ida e volta: mover um elemento e não recalibrar a tipografia deixa a
mudança pela metade — o nome desceu como "legenda" mas continuou com 28px de título, e foi isso que
o designer sentiu como coluna esquerda errada antes mesmo de identificar a causa.

[2026-08-13] [fase 06 · ciclo 3] **`text-wrap:balance` removido do título** — quebra natural, a
pedido do designer. Linhas voltam a 345px + 72px ("90ml" sozinho na segunda). Isso **reverte a
correção do órfão** apontado na crítica: o item sai da lista de pendências e passa a ser decisão
registrada do designer, não defeito em aberto. Se alguém reabrir o assunto numa rodada futura, a
resposta é esta entrada.

[2026-08-13] [fase 06 · ciclo 3] **Garantias viraram FAIXA branca própria, entre "Como funciona" e o
rodapé** (designer). Pergunta dele era "antes ou depois da seção?" — resposta: já estavam depois, o
que mudava o peso era o BLOCO. No rodapé escuro elas eram lidas como letra miúda; agora fecham o
argumento, respondendo ao passo 3 ("a compra é fechada na loja"). Removidos: o divisor que eu tinha
posto acima delas e o divisor do rodapé, que ficou órfão quando a barra saiu (era ele que separava
garantias de marca — sem elas, não separava nada). Cores invertidas para fundo claro:
texto `neutral-700` (8,04:1) e ícone `neutral-600` (5,30:1).
**Correção de grade descoberta no caminho:** "Como funciona" estava a **76px** da borda enquanto
página, header e rodapé estão a **92px** — 16px fora, defeito que eu introduzi ao criar a seção
(usei o gutter de mobile no desktop). Corrigido; a faixa nova nasceu já alinhada. Os quatro blocos
agora batem em 92px.
**Redundância que a aproximação expõe** (avisada antes de mover, mantida por decisão de olhar
primeiro): "canais oficiais" aparece no passo 1 e na garantia 1; "loja/canal" reaparece em quase
todas. Continua em aberto.
**Nota de processo, por honestidade:** fiz o recorte do bloco com regex e **corrompi o markup** —
itens ficaram órfãos dentro da seção e sobrou `</div>` solto. Detectado por asserção de DOM (3
`.trust__item` na página, 1 dentro da faixa), não por acaso. Reescrevi o trecho inteiro à mão e
validei o balanceamento (51 `<div>` / 51 `</div>`). Lição: recorte estrutural de HTML por regex em
arquivo com indentação irregular é frágil — reescrever o bloco sai mais barato que remendar.

[2026-08-13] [fase 06 · ciclo 3] **TESTE: coluna esquerda inteira dentro de um card** (pedido do
designer). `.hero-card` envolve título + foto + campo de CEP, com fundo `neutral-50`, borda
`neutral-300` e raio `--r-500`. Para não virar card dentro de card, o card do CEP **achatou**
(fundo transparente, sem borda, sem padding — vira só o campo) e a foto perdeu a borda própria.
Bug corrigido na verificação: no mobile o card nascia com **375px**, encostado nas duas bordas e com
o raio cortado — o respiro lateral vinha do padding do `.hero`, que eu zerei ao encapsular. Ganhou
`margin:0 var(--sp-400)` no mobile (343px, gutter 16/16) e `margin:0` no desktop, onde o `.page`
já dá o gutter. Aguardando veredicto do designer sobre adotar ou reverter o card.

[2026-08-13] [fase 06 · ciclo 3] **Faixa das garantias ganhou tom próprio: `neutral-200`.** O
designer apontou que branco sobre branco não destacava — a seção "Como funciona" também é branca.
Escolha feita com medição, não no olho: distância de luminância até o branco de cada token
candidato — `neutral-100` 4,9% (some), `club-50` 10,1%, **`neutral-200` 16,5%**, `neutral-300`
24,3% (pesa como bloco). `neutral-200` vence porque é **o tom que o fundo da página já alcança**:
a faixa lê como a página aparecendo entre dois blocos sólidos, não como cor nova — e não gasta o
rosa, que a direção reserva para CTA e veredicto. Ganhou padding em cima também (`sp-1200`), já que
virou bloco próprio e não mais o rodapé da seção.
Sequência de fundos da página agora: gradiente (comparação) → **branco** (como funciona) →
**cinza claro** (garantias) → **preto** (rodapé).

[2026-08-13] [fase 06 · ciclo 3] **Respiro entre o card da coluna esquerda e "Onde comprar" no
mobile.** Estava em **0px** — regressão do encapsulamento: os 20px vinham do `padding-bottom` do
`.cep-wrap`, zerado ao achatá-lo dentro do `.hero-card`. Corrigido com `margin-bottom` de 32px na
`.col-left` (zerada no desktop, onde as colunas são lado a lado). Medido depois: **44px**, somando o
gutter do bloco de comparação.

[2026-08-13] [fase 06 · ciclo 3] **Faixa das garantias: `neutral-200` → SEM fundo próprio.** O
designer achou o cinza escuro demais e pediu "o mesmo tom do topo do site". Em vez de escolher um
token que se pareça com aquele tom, tirei o fundo da faixa: o gradiente do `body` (que é `fixed`)
atravessa. É literalmente o mesmo fundo, não uma aproximação — e acompanha o gradiente em vez de
brigar com ele quando a página rola. Medido no ponto da faixa: **#F8F7FA**, contra o branco puro da
seção acima. A separação vem da troca de opaco para o fundo da página, o mesmo contraste que a área
de comparação já usa.
Fica registrado que este é o **terceiro tratamento** da mesma faixa em poucas rodadas (dentro do
rodapé escuro → faixa branca → cinza → sem fundo). O que estabilizou foi parar de escolher cor e
passar a usar o fundo que a página já tem.

[2026-08-13] [fase 06 · ciclo 3] **Estados vazios: pin removido e peso aliviado** (designer).
Reverte, por decisão dele, a distinção criada horas antes: o `Informe o CEP` perdeu o pin e a tinta
cheia (`neutral-900`), e os três estados vazios voltaram a ser idênticos — a diferença entre
"falta ação sua" e "o dado não existe" agora vive só na copy. Classe `.await` eliminada junto,
para não deixar CSS morto. **Registrado como escolha, não como descuido**, para o achado não
reaparecer numa crítica futura como se tivesse passado despercebido.
Sobre "não devem ficar pretos nem cinza escuro": o preto saiu (todos em `neutral-600`), e em vez de
descer a cor aliviei o **peso** de 600 para 400 — deixa o texto mais leve sem custar contraste. O
degrau abaixo de `neutral-600` é `neutral-500` = **2,18:1**, que reprova AA de texto e é exatamente
o tom que o designer mandou corrigir mais cedo hoje, pelo mesmo motivo. Fica em aberto se o peso 400
resolveu; se ele pedir o tom mais claro, entra como segunda decisão consciente contra AA, junto com
a borda do campo, e as duas apontam para o mesmo item 6 de `pendencias-tokens.md`: a rampa neutral
não tem degrau utilizável entre 2,18:1 e 5,30:1.

- **[2026-08-14] [fase 02 · ciclo 3] Largura e respiro do topo no mobile corrigidos** — a pedido
  do designer, a partir de um print real de iPhone 16 Pro Max. Eram **dois** defeitos, não um:
  (a) `.page` tinha `max-width:390px`, a largura do iPhone 12–15. Num aparelho de 430pt isso
  deixava 20px mortos de cada lado e empurrava o `.hero-card` para **36px de margem** — o dobro
  dos 16px que a composição pede. Medido: card de 358px numa tela de 430. Passou para
  `max-width:430px`, que cobre os celulares grandes atuais; acima disso continua coluna centrada,
  então tablet não estica (conferido em 768px: coluna de 430 centrada, como antes).
  (b) `padding-top` era `--sp-800` (32px); virou `--sp-400` (16px), como o designer pediu.
  Depois: 430pt → página 430px, card 398px com 16px de margem, respiro do topo 16px, sem
  rolagem horizontal. Conferido também em 375px (card 343px, margem 16px) e 768px.
  Espelho `10-elevada.html` sincronizado. **Não passou pelo portão.**

- **[2026-08-14] [organização] Peças intermediárias movidas para `componentes/`.** A pedido do
  designer, que não estava conseguindo achar qual arquivo era a peça atual entre 12 HTMLs
  numerados — e com razão: havia dois arquivos começando em `10-`. Agora a pasta tem **um**
  HTML na raiz, `10-elevada.html`, e as 11 peças dos ciclos 1 e 2 ficam em `componentes/`.
  Movidas com `git mv` (histórico preservado) e com `assets/` reescrito para `../assets/` —
  as 82 referências de imagem do projeto foram conferidas uma a uma e todas resolvem.
  As entradas antigas deste Rastro citam os caminhos de antes; foram deixadas como estavam,
  porque são registro do que aconteceu, não instrução de onde procurar. Este item é o mapa.
  Somado a isso, um `LEIA-ME.md` em cada pasta de peça diz qual arquivo abrir.

- **[2026-08-14] [organização] Espelho renomeado: `10-elevada.html` →
  `hub-comparador-publico.html`,** dentro do padrão `hub-<superfície>` adotado para as três
  peças finais. O comando de sincronização com o `index.html` foi atualizado no `LEIA-ME.md`
  da pasta, e os dois seguem byte a byte idênticos (conferido).
  **O `<title>` NÃO foi mexido, e isso é um defeito conhecido, não um esquecimento:** a página
  em produção ainda se chama "Peça 10 · elevada (craft dentro dos tokens)" na aba do navegador.
  É nome interno de trabalho exposto ao cliente final em `hub1-drab.vercel.app`. Corrigir é
  mudar copy de página viva — fica para decisão do designer, não para um ajuste de arrumação.

- **[2026-08-16] [fase 01 · ciclo 4] Ciclo aberto por divergência achada pelo designer entre as
  peças:** o comparador mostrava frete da Shopee de R$ 22,90 (CEP genérico) e o painel admin
  dizia R$ 19,90 — as três peças precisam contar a mesma verdade, e não contavam. Ao investigar,
  o número era só o sintoma: **o comparador está no modelo anterior ao Brief v1.10**, em que o
  frete de todo canal recalcula por CEP. O v1.10 (Q-E/Q-F, a partir da avaliação de Engenharia)
  fechou outra taxonomia: **só a Wake cota pelo CEP real**; a **Shopee** vem de
  `estimated_shipping_fee`, que **não usa o CEP do comprador** — daí a tag "Aproximado"
  obrigatória; o **TikTok** não tem frete por API nenhuma.
- **[2026-08-16] [fase 01 · ciclo 4] Segundo defeito, achado no mesmo caminho: frete fantasma do
  TikTok.** O card do TikTok não exibia frete ("Calculado no checkout") mas o **total somava um
  frete invisível**: sem CEP, preço 184,90 e total 206,90 (R$ 22 ocultos); no CEP genérico, R$ 19.
  Além de mentir no total, isso fazia o canal competir no ranking com número que ninguém vê —
  exatamente o que a coordenada de ordenação do v1.10 proíbe. Terceiro achado: no CEP de Rio
  Branco o TikTok aparecia como "A loja não entrega neste CEP" — conhecimento que **não existe**,
  porque o canal não expõe frete nem cobertura; era dado inventado.
- **[2026-08-16] [fase 01 · ciclo 4] Resposta de Design ao H-UX-16** (a pergunta que o brief
  deixou para Design e que estava em aberto): **canal sem frete continua visível e comprável, mas
  fora do ranking** — fica por último depois dos canais completos, nunca recebe a faixa "Melhor
  oferta", mostra "Não informado" no frete e ganha uma linha explicando por que não entra na
  comparação por preço + frete. O total dele deixa de ser "Total da compra" e passa a "A partir
  de" + preço do produto, porque somar um frete que não existe seria inventar. Razão da escolha:
  esconder o canal puniria o cliente que talvez preferisse comprar lá (e o brief só manda ocultar
  canal sem estoque/preço/vínculo, não sem frete); deixá-lo no ranking distorceria a comparação a
  favor de quem não mostra o custo todo. Sobre a tag: **"Aproximado" em pílula neutra e pequena,
  ao lado do valor** — visível para cumprir a transparência (RNF-Transparência), discreta para não
  competir com o preço, que é a informação principal do card.
- **[2026-08-16] [fase 01 · ciclo 4] Escopo deste ciclo:** (1) frete da Shopee constante em todos
  os estados de CEP, com tag "Aproximado"; (2) TikTok sem frete — total honesto, fora do ranking,
  com a linha explicativa; (3) remoção do estado "não entrega neste CEP" do TikTok; (4) Wake
  intocada (cotação real por CEP é o comportamento correto). **Fora deste ciclo:** imagem por
  canal e o disclaimer de variação de preço (Tela 7) — seguem pendentes, cada um com o próprio
  peso, e nenhum deles é causa da divergência que abriu este ciclo.

- **[2026-08-16] [fase 02 · ciclo 4] Implementado.** (1) `CH.shopee` ganhou `aprox:true` e o frete
  dela virou **R$ 22,90 fixo nos quatro estados** (sem CEP, São Paulo, Rio Branco, CEP genérico),
  com total 202,80 em todos — deixou de fingir cotação por CEP; a pílula **"Aproximado"** sai ao
  lado do valor. (2) TikTok: frete passou de "Calculado no checkout" (que prometia cálculo
  adiante) para **"Não informado"**, o total deixou de somar o frete invisível (era 206,90 sobre
  preço de 184,90) e agora mostra **"A partir de R$ 184,90"**; ganhou a linha *"TikTok Shop não
  informa o frete, então não entra na comparação por preço + frete"* e nunca recebe a faixa
  "Melhor oferta" (`isBest` passou a exigir `!ch.noFrete`). (3) Saiu o estado inventado "A loja
  não entrega neste CEP" do TikTok em Rio Branco. (4) Wake intocada. As ordens já existentes
  seguiram corretas com os números novos — conferido estado por estado.
- **[2026-08-16] [fase 03 · ciclo 4] Verificado por medição nos quatro estados:**
  sem CEP → ordem por preço (Shopee 179,90 · TikTok 184,90 · Ybera 189,90), TikTok participa
  normalmente porque antes do CEP o ranking é só preço, e a linha de exclusão **não** aparece;
  São Paulo → Ybera grátis é a melhor (189,90), Shopee 22,90 "Aproximado" (202,80), TikTok fora;
  Rio Branco → Shopee vira a melhor (202,80 contra 224,80 da Ybera), TikTok fora, sem card de
  "não entrega"; CEP genérico → Ybera 199,80 melhor, Shopee 202,80. Contraste da pílula
  "Aproximado" e da linha de exclusão: **8,04** sobre o fundo real (a primeira medição deu 2,07
  porque pegou a moldura escura do card "melhor" em vez do painel branco que fica atrás).
  Mobile 375px: sem rolagem lateral, pílula na mesma linha do valor, linha de exclusão visível.
  Console limpo. **Artefato de ambiente registrado para não virar caça a fantasma:** no painel de
  automação a página fica `visibilityState: 'hidden'`, então o `requestAnimationFrame` do FLIP não
  dispara e os cards mantêm o `translateY` invertido — a ordem visual sai trocada enquanto a
  ordem do DOM está certa. Para usuário real resolve sozinho quando a aba volta a ficar visível;
  não é defeito da peça.
- **[2026-08-16] [ciclo 4] Espelho `pecas/comparador-publico/hub-comparador-publico.html`
  ressincronizado** pelo comando do LEIA-ME e conferido idêntico ao `index.html`.

- **[2026-08-16] [Δspec · decisão de produto do designer] Shopee e TikTok passam a se comportar
  igual no frete: o TikTok herda a MESMA estimativa da Shopee, automática.** Pedido do designer
  ("tanto Shopee quanto TikTok o frete vai ser da mesma forma, pode colocar frete automático no
  TikTok também, no mesmo valor da Shopee"). Encaixa no brief sem forçar: a Q-F já previa
  "referenciar o frete de outro canal disponível para aquele produto" — a diferença é que aqui
  isso vira **regra automática**, não ação manual do admin. Para o cliente é indistinguível: os
  dois saem rotulados "Aproximado", como a Q-E exige de quem não cota pelo CEP real. Consequência
  de ordenação: o TikTok **volta a entrar** na comparação preço + frete (207,80 = 184,90 + 22,90).
  Em Rio Branco isso reordena a lista — TikTok (207,80) passa a Ybera (224,80).
  **O caminho "canal sem frete" continua implementado** (frete "Não informado", total como "A
  partir de", linha explicando a exclusão do ranking, nunca "Melhor oferta"): é a resposta ao
  H-UX-16 e volta a valer se o admin remover o valor de um canal. Nenhum estado da demonstração
  o exercita agora — está registrado aqui para não parecer código morto.
  **Para o Produto:** o DRP v2.7 descreve o TikTok como "sem frete, admin insere ou referencia";
  esta regra automática é decisão de Design/Produto do designer e precisa ser referendada.
- **[2026-08-16] [fase 03] Verificado nos quatro estados após a mudança:** sem CEP → ordem por
  preço, todos com "Informe o CEP" e "A partir de"; São Paulo → Ybera grátis melhor (189,90),
  Shopee 202,80, TikTok 207,80, ambos "Aproximado"; Rio Branco → Shopee melhor (202,80), TikTok
  (207,80), Ybera (224,80) — reordenado corretamente; CEP genérico → Ybera melhor (199,80).
  Nenhum card "não entrega neste CEP", nenhuma linha de exclusão de ranking, console limpo.
  No admin: Shopee e TikTok mostram "Automático · R$ 22,90 · Aproximado", a Wake segue "Exato,
  pelo CEP do cliente" sem ação, e a opção "usar o frete de outro canal" ficou alcançável nos
  dois marketplaces (antes só aparecia para canal sem valor, o que a mudança tornaria inalcançável
  — `podeRef` passou a depender de o frete ser estimado, não de estar vazio).

- **[2026-08-16] [dado] Frete de Shopee e TikTok: R$ 22,90 → R$ 19,90** (pedido do designer).
  Totais refeitos: Shopee 199,80 · TikTok 204,80. **Efeito colateral achado na verificação e
  resolvido:** com a Shopee em 199,80, o frete genérico da Wake (R$ 9,90 → total 199,80) criava
  **empate exato de total** entre dois canais, e a faixa "Melhor oferta" ficaria arbitrária aos
  olhos do cliente. Ajustei o frete genérico da Wake para R$ 7,90 (total 197,80), o que **mantém
  o mesmo vencedor de antes** e desfaz o empate. É dado de demonstração de um CEP não mapeado,
  reversível — se o Produto quiser tratar empate como regra (ex.: em caso de igualdade, prefere
  o canal de frete exato), aí é decisão de produto, não de dado.
  Conferido: nenhum dos três estados de CEP tem dois totais iguais.

- **[2026-08-16] [ajuste visual] "Aproximado" deixou de ser pílula: virou texto simples ao lado do
  valor, sem caixa alta.** Pedido do designer olhando o card do TikTok em produção. Ficou 12px,
  peso 600, `neutral-700`, na mesma linha do valor, contraste 8,04. Aplicado também no admin
  (`.tag-aprox`), para as duas telas que falam do mesmo dado não divergirem no tratamento.
- **[2026-08-16] [craft] Sombra na foto do produto, copiada de referência real.** O designer
  apontou `hublinks-ybera.vercel.app` como referência; medi a sombra lá em vez de estimar:
  `0 0 8px rgba(5,5,5,.10)` aplicada na própria imagem. **Coincidência que virou guardrail:** esse
  é exatamente o valor do nosso token `--shadow-sm` — então a aplicação foi `box-shadow:
  var(--shadow-sm)`, sem valor novo no CSS. Conferido por medição que o valor computado nas duas
  páginas é idêntico. Decisão de onde aplicar: no contêiner `.hero__media`, **não** no `<img>` —
  o contêiner tem `overflow:hidden` para o zoom do hover, e a sombra da imagem interna sairia
  recortada. Escopo: só a foto grande do comparador (o elemento equivalente ao da referência); as
  miniaturas de 72px do admin e os cards do catálogo da influenciadora ficaram de fora, onde um
  halo de 8px não aparece e só sujaria a densidade.
