# Spec — override-administrativo

status: ativa
ciclo: 1
atualizada: 2026-08-14
insumo-de-referencia: Brief Design v1.9 (13/08/2026, derivado do DRP v2.6) —
`insumos/brief-design-v1.9.md`, Telas 4 e 5. As versões v1.6, v1.7 e v1.8 que ele
referencia NÃO existem no repositório
specs-irmas: `comparador-publico.md` (a superfície pública que este painel governa) ·
`atualizacao-poc-referencia.md` (precedente de réplica do Escritório Virtual)

## Resultado esperado
O admin de catálogo, dentro do Escritório Virtual, vê para um produto o valor que a API já
calculou em Estoque, Imagem, Avaliação e Volume de Vendas — canal a canal — e substitui o que
precisar com prazo de validade, sem perder de vista o que está sob override e quando expira.

Critério de sucesso observável: olhando a tela, o admin distingue campo vindo de API de campo
sob override ativo e lê quando cada override expira, sem abrir outra tela; ao substituir
Avaliação ou Volume de Vendas, não consegue salvar sem escrever o motivo; ao marcar
"Lançamento", nada na tela sugere que existe cálculo automático por trás; e um override
aplicado em um canal não altera o mesmo campo nos outros canais do mesmo produto.

## Usuário primário
Admin de catálogo da Ybera — operação interna, logada no Escritório Virtual, em desktop,
corrigindo o que o cliente final vê no comparador público. **Não é a influenciadora** (usuária
da Tela A) nem o cliente final (usuário do comparador): é a terceira pessoa da jornada, a que
edita o que as outras duas veem. Trabalha por exceção — abre a tela porque um dado veio errado
ou porque quer destacar algo, não como rotina diária.

## Escopo
- Dentro (ciclo 1 — Telas 4 e 5 do brief v1.9, RF-13):
  - **Estado de leitura por campo**: para cada um dos 4 campos overridáveis (Estoque, Imagem,
    Avaliação, Volume de Vendas), o valor atual, **de onde ele veio** (API ou override ativo)
    e, se override, quando expira
  - **Controle de substituição** por campo e **por canal** — o mesmo produto pode ter override
    em um canal e não em outro (granularidade explícita do brief)
  - **Formulário de override**: novo valor/tier + **TTL** em dias com default pré-preenchido
    (48–72h para Estoque; 15–30 dias para Avaliação e Volume de Vendas), + opção "sem
    expiração" + opção "ocultar campo"
  - **Motivo obrigatório** antes de salvar override de Avaliação e de Volume de Vendas
  - **"Lançamento"** (Tela 5) como um dos valores possíveis de Volume de Vendas — inclusive
    para relançamento de produto existente —, com a mesma mecânica de TTL e com tratamento que
    deixe claro ser escolha manual
  - **Estados da tela**: campo sem override (só API) · override ativo · override perto de
    expirar · campo oculto por override · campo sem dado de API para exibir · **salvando** ·
    **erro de salvamento** (os dois últimos entraram no portão do ciclo 1, item 1).
    O estado "override expirado" foi REMOVIDO no portão do ciclo 1: sem trilha de auditoria
    (decisão do Head, DRP §13), expirar É voltar ao estado "só API" — não existe informação
    para desenhá-lo. Se o Produto quiser um rastro transitório ("voltou para a API há N dias"),
    isso é dado novo e volta como premissa — ver Rastro
  - Moldura do Escritório Virtual (sidebar + navegação do catálogo), como réplica
- Dentro (ciclo 2 — 2026-08-16, a pedido do designer: "a tela completa seguindo o brief mais
  atual, exatamente o que o brief pede"):
  - **Tela 9 — tour/modal de onboarding administrativo** (🆕 no v1.9, com coordenadas
    completas): quando o admin ganha uma capacidade nova dentro do catálogo do Escritório,
    um modal com tour rápido explicando o que mudou e como usar. **Não bloqueante** — dá para
    fechar e operar sem completar. Componente pensado para reúso em novidades futuras, não só
    no Hub (ata de 05/08/2026). A razão do ciclo 1 para deixá-la fora ("não tem o que
    ensinar") caducou: as Telas 4 e 5 existem, e são exatamente a capacidade que o tour ensina
- Dentro (ciclo 3 — 2026-08-16, desbloqueado pela chegada do Brief v1.10 + DRP v2.7):
  - **Tela 2 — Produtos no Hub** (DRP §7/RF-13): habilitar/desabilitar produto individualmente
    para o comparador — gate opt-in obrigatório; nenhum produto aparece sem habilitação. Métrica
    operacional associada: taxa de habilitados sobre o catálogo (DRP §9)
  - **Tela 3 — Tags por oferta** (DRP §7/RF-13): cadastrar tags configuráveis por
    oferta/plataforma — exemplos do próprio DRP: "desconto no Pix", "mais brinde", "desconto
    progressivo"
  - **Tela 6 — Timer de escassez** (DRP §7/RF-13): configurar timer por oferta (tempo de
    permanência exibido no card público); **sem vínculo com garantia de preço**; coexiste com o
    disclaimer de variação (Q-22, decisão de Design)
  - **Revisão da Tela 4 pelo v1.10/v2.7:** (a) **Frete vira campo overridável** em Shopee/TikTok
    (sem motivo) — Wake é exato via CEP real, sem override; Shopee sempre "Aproximado"; TikTok:
    valor manual "Aproximado", OU referenciar o frete de outro canal, OU sem informação;
    (b) badge de override ganha **quem inseriu** (HT-08: autoria+timestamp no registro);
    (c) **Avaliação no TikTok é manual definitiva** (Q-H/HT-04: não existe API em lugar nenhum) —
    com motivo obrigatório também na inserção; a copy "a API ainda não envia" (transitória) fica
    errada; (d) **Volume de Vendas unificado**: TikTok agora TEM API (Open Collaboration,
    acumulado); Wake NUNCA tem (gap real, sempre manual); (e) **Estoque via API no TikTok é
    booleano** — "Últimas unidades" é inalcançável pelo cálculo automático nesse canal (só
    Disponível/Indisponível); o dado da peça não pode mostrar o que a API não produz
- Fora (nota histórica): estas três telas estiveram bloqueadas por documento entre 2026-08-16
  (manhã) e a chegada do DRP v2.7 — ver premissa 11, resolvida
- Fora (da demanda):
  - **Trilha de auditoria / histórico de alterações** — decisão fechada do Head (DRP §13):
    não existe. Design não desenha tela de histórico
  - **Qualquer indicação de override no card público** — inegociável do brief; a indicação é
    do painel, nunca do card (já respondido como premissa 12 da spec do comparador)
  - **O limiar numérico que classifica cada tier** (Q-23) — Produto/Engenharia; a tela recebe
    o tier já resolvido, igual ao comparador
  - **Backend do TTL** — expiração, job de reversão, cache, endpoint de override: Engenharia
  - **Permissão e papel** de quem pode sobrescrever (Admin vs. Admin2 da Wiki B2C) — ver
    premissa 7; a peça assume um único perfil autorizado
  - **Parcelamento** — é admin-only (Q-20), mas não está na lista de campos overridáveis do
    brief, e foi removido do card público em 2026-08-13
  - **Ordenação do comparador** — override afeta exibição, nunca ranking (RF-06)

## Restrições
- **Visual: réplica fiel do Escritório Virtual**, não o visual do comparador público. Tokens
  `b2c-*` capturados do bundle real (precedente registrado em `atualizacao-poc-referencia.md`),
  com o Theme mode "Escritório" do `tokens.json` como fallback. Nenhum valor de cor, espaço ou
  tipografia inventado — a mesma regra do processo, com outra fonte de verdade
- **Nenhuma UI pode sugerir que override altera a ordenação** do comparador (RF-06)
- **Nenhuma UI pode sugerir cálculo automático por trás de "Lançamento"**
- **Sem trilha de auditoria**: a tela é a única memória do que foi sobrescrito e por quem.
  Isso eleva o peso da indicação de override ativo — ela não é enfeite, é o substituto do
  histórico que o produto decidiu não ter
- Estoque e Volume de Vendas são **tier**, nunca número. Avaliação é **nota real** (estrelas)
- **Desktop-first** — inverte o mobile-first do comparador, porque é ferramenta de operação
  interna. Mas não pode quebrar em viewport estreito (mesma restrição da POC irmã)
- WCAG AA — texto 4.5:1, componente 3:1, alvo **24px** (2.5.8, o critério AA). Aqui **não**
  vale o 44px que o comparador usa: aquele é o AAA (2.5.5), adotado lá por ser mobile-first
  com o dedo como único apontador. Esta é ferramenta de desktop com mouse e alta densidade —
  44px por alvo inflaria a matriz e atrapalharia a varredura, que é a tarefa real

## Direção estética
Decidida na entrada da fase 02 (2026-08-14) via `frontend-design`, dentro do chassi herdado
do Escritório Virtual. A identidade não está em jogo — a aposta é sobre **procedência e tempo**.

- **Produtos-régua:** o *diff* de um code review (o valor original nunca é apagado; fica ao
  lado do que o substituiu) e o painel de variáveis de ambiente da Vercel (valor efetivo +
  origem + override, com o tempo restante legível de relance). Deliberadamente **não** é
  dashboard de BI: o admin não está analisando, está procurando o que está fora do lugar.
- **Personalidade:** factual · reversível · datada · sóbria · sem drama. "Datada" no sentido
  literal — tudo que foi tocado por mão humana carrega carimbo de quando vence.
- **Composição:** **matriz campo × canal** (4 campos × 3 canais = 12 células), não uma lista
  de campos por canal. O admin trabalha por exceção: ele varre a tela procurando o que está
  diferente. A matriz torna a granularidade por canal literal — "override no TikTok e não no
  Shopee" é visível de relance, sem abrir nada. Densidade a favor da varredura; nada de card
  arejado com muito respiro entre poucos dados.
- **A ideia forte — o valor da API nunca some.** Onde há override, a célula mostra os dois:
  o que está sendo exibido ao cliente e o que a API diz por baixo. Como o Produto decidiu não
  ter trilha de auditoria (DRP §13), a tela é a única memória — esconder o valor original
  atrás de um clique transformaria "de onde veio isso?" numa investigação.
- **Expiração escrita como futuro, não como prazo:** "volta para *Disponível* em 2 dias", não
  "expira em 48h". O admin lê o que vai acontecer com a célula, não um cronômetro. É a
  pergunta que vem logo depois de "até quando vale", e a ausência de histórico a torna crítica.
- **Uso da marca:** o rosa Ybera fica reservado para **ação** (botão, link). Estado nunca usa
  rosa — se override fosse rosa, competiria com o que se pode fazer. Override reaproveita o
  âmbar que o painel de vínculos já usa para "conexão expirada": mesmo significado, algo
  temporário que vai vencer.
- **Motion:** quase nenhum, por decisão. Nada pulsa, nada pisca — alarme é ruído para quem
  trabalha por exceção. A única animação com função é a transição da célula ao salvar um
  override, para o admin ver o valor da API descer para a linha de baixo em vez de sumir.

## Decisões anteriores
Do brief v1.9, §"Decisões já tomadas (não revisitar sem motivo forte)":
- Estoque e Volume de Vendas exibidos como tier, nunca número exato
- Avaliação permanece nota real (estrelas), fora do tratamento de tier
- "Lançamento" é escolha manual do admin — nenhuma UI sugere cálculo automático por data
- Sem trilha de auditoria dedicada
- Override afeta apenas exibição, nunca a lógica de ordenação (RF-06)

Da spec do comparador (ciclo 3), que este painel governa:
- O card público **não distingue** nota de API de nota sob override (premissa 12, respondida
  em 2026-08-13) — a distinção é responsabilidade desta tela
- Rótulos de tier já decididos e no ar: `Disponível` · `Últimas unidades` · `Indisponível` ·
  `Campeão de vendas` · `Mais vendido` · `Lançamento`. **Esta tela usa os mesmos rótulos** —
  se o admin lê um nome e o cliente vê outro, o override vira adivinhação

## Premissas por risco
| # | Premissa | Criticidade | Evidência | Dono | Prazo |
|---|----------|-------------|-----------|------|-------|
| 1 | O painel vive **dentro do Escritório Virtual**, sob o DS do Escritório — e não como tela própria do HUB | alta (define toda a peça) | inferência forte: a Tela 9 situa a capacidade "dentro do catálogo do Escritório"; o brief lista os dois DS como dependência sem dizer qual rege esta tela. Decisão do designer em 2026-08-14 | Produto/Engenharia referendar | antes do handoff |
| 2 | Os tokens `b2c-*` capturados em 2026-07-15 ainda descrevem o app real | média | dado, mas com um mês de idade | Designer — recapturar via `dev-mode-virtual-office` na entrada da fase 02 | fase 02 |
| 3 | **O chassi do Escritório já existe replicado; a navegação do admin, não.** `pecas/influenciadora/componentes/05-tela-a-completa.html` traz sidebar, tokens `b2c-*` e estrutura de página verificados contra o app real — a peça herda essa moldura. Mas é a conta da INFLUENCIADORA (Meus saques, Minhas metas, botão "Comprar"); o menu que o admin vê ao entrar é desconhecido | média (era alta antes de 2026-08-14 — o chassi apareceu) | dado, para a moldura; palpite, para a navegação do admin | Designer herda o chassi; Produto confirma o menu do admin | menu do admin: antes do handoff. Não trava a fase 02 |
| 4 | **"Ocultar campo" tem contrato indefinido com o comparador.** O brief oferece "ocultar" como opção do override, mas não diz o que o card público mostra no lugar. A spec do comparador tem estados de vazio com causa declarada (`Não informado` = dado não veio) — um campo ocultado de propósito não é nenhum dos casos previstos | **alta** (contrato entre as duas telas; falso, a tela mente para o cliente) | achado desta leitura cruzada, verificado nas duas specs | Produto + Design | antes da fase 02 fechar |
| 5 | **Imagem sob override por canal contradiz o comparador atual.** O brief lista Imagem como campo overridável por canal; a peça pública mantém UMA imagem de produto no hero (premissa 13 da spec irmã), não imagem por canal. Ou o card ganha imagem por canal, ou o override de Imagem não tem onde aparecer | **alta** | achado desta leitura cruzada, verificado nas duas specs | Produto | antes da fase 02 fechar |
| 6 | Os defaults de TTL do brief são **faixas** (48–72h, 15–30 dias), mas o campo pré-preenchido precisa de UM número | baixa-média | dado (o brief é explícito na faixa e omisso no valor) | Produto — a peça assume o menor da faixa (48h / 15 dias) como padrão conservador até resposta | próxima rodada de brief |
| 7 | O "admin" é operador interno de catálogo da Ybera, não o papel Admin/Admin2 da rede Club descrito na Wiki B2C | média (muda linguagem e modelo de permissão) | palpite | Produto | antes do handoff |
| 8 | **H-UX-12 — "Lançamento" dispensa motivo obrigatório.** Produto não decidiu; o próprio brief recomenda dispensar, por não afirmar volume de vendas | média (é entregável de Design deste ciclo) | recomendação registrada no brief | Design responde neste ciclo; Produto referenda | fim do ciclo 1 |
| 9 | **A documentação do repositório contradiz o brief.** DRF, DRP e brief v1.1 — os únicos insumos completos que existem aqui — marcam "Painel de admin no HUB" como **Won't Have / fora de escopo**; o brief v1.9 o trata como prioridade desde a v1.7. Provável defasagem (DRF/DRP derivam do DRP v1.8; o brief, do v2.6), mas as versões que resolveriam isso (v1.6–v1.8, DRP v2.x) não estão no repositório | média (não muda a peça; muda a autoridade do contrato) | contradição verificada nos três insumos (achado do portão do ciclo 1, item 7) | Produto — reconciliar e versionar os insumos | próxima rodada de brief |
| 10 | **Rastro transitório pós-expiração.** Ao remover o estado "override expirado" (irrepresentável sem trilha — portão, item 2), fica a pergunta: o Produto quer que a tela diga "voltou para a API há N dias" por um período? Isso exige guardar um mínimo de histórico, o que tangencia a decisão do Head de não ter trilha | baixa-média (a tela funciona sem; muda o quanto o admin percebe reversões) | pergunta aberta pelo portão | Produto | próxima rodada de brief |
| 11 | **Telas 2, 3 e 6 não têm especificação disponível.** O brief v1.9 as marca "sem mudança — ver Brief v1.6"; v1.6, v1.7, v1.8 e o DRP v2.6 (fonte do RF-13) não existem no repositório, e o DRP local (v1.8, 10/07) termina no RF-11 | **alta** (bloqueia o "painel completo" pedido pelo designer em 2026-08-16) | verificada por busca em todos os insumos do repositório | Designer/Produto — obter o Brief v1.6 ou o DRP v2.6 (colar no chat resolve, como foi feito com o v1.9) | antes de abrir os ciclos das Telas 2, 3 e 6 |

**Resoluções de premissas (2026-08-16 — chegada do Brief v1.10 + DRP v2.7, salvos em `insumos/`):**
- ✅ **Premissa 1 resolvida:** confirmado pelo DRP (Persona 5, decisão do Head, v2.3): a interface administrativa
  é **alocada no Escritório Virtual**, roles Admin/Admin2. A aposta da superfície estava certa.
- ✅ **Premissa 4 respondida pelo Produto:** DRP §7, literal — ocultar = "não exibe nem o valor da API nem um
  valor manual — **o campo simplesmente não aparece no card**". Não é "Não informado". A copy da peça ("some do
  comparador") já estava compatível. A pendência migra para a spec do comparador: o card precisa suportar ausência
  de campo sem rótulo de vazio.
- ✅ **Premissa 5 respondida:** DRP §7 — imagem é **por canal** nos 3 canais, com fallback para a imagem do produto
  de referência (Wake) no topo. O contrato existe; quem está divergente é o card público (uma imagem só) — pendência
  migra para a spec do comparador.
- ✅ **Premissa 7 resolvida — a suposição estava ERRADA:** o admin é exatamente o papel **Admin/Admin2 do
  Escritório Virtual** (Persona 5 do DRP), não um "operador interno" distinto. JTBD registrado no DRP §4.
- ✅ **Premissa 9 esclarecida:** a linhagem completa chegou (v1.10 ← DRP v2.7; RF-13 nasceu na v2.3 do DRP,
  05/08/2026). O "Won't Have" do brief v1.1 era de antes do RF-13 existir. Reconciliada.
- ✅ **Premissa 11 resolvida:** o DRP v2.7 §7 + RF-13 trazem as coordenadas funcionais das Telas 2, 3 e 6 —
  habilitação (gate opt-in por produto), tags por oferta/plataforma (exemplos: "desconto no Pix", "mais brinde",
  "desconto progressivo") e timer de escassez por oferta (tempo de permanência no card, sem vínculo com garantia
  de preço, coexiste com o disclaimer — Q-22). Ciclos desbloqueados.
- ⏳ Premissas 2, 3 (menu real), 6 (TTL: faixas seguem sem número único), 8 (H-UX-12 segue aberta no v1.10) e 10
  permanecem como estavam.
- 🆕 **Premissa 12 — TTL de frete não especificado.** O v1.10 lista Frete como overridável (Shopee/TikTok, sem
  motivo), mas a mecânica de TTL é descrita só para os 4 campos originais. A peça assume a MESMA mecânica de prazo
  (coerência do painel) | média | lacuna do brief v1.10, verificada | Produto | próxima rodada |

## Quebra de tarefas
De dentro pra fora, uma peça por vez:
1. **Linha de campo** — o átomo: valor + procedência (API/override) + expiração. É o que
   carrega o peso de não haver histórico
2. **Controle de substituição** — o formulário: novo valor/tier, TTL, "sem expiração",
   "ocultar campo", motivo (obrigatório em Avaliação e Volume de Vendas)
3. **Volume de Vendas com "Lançamento"** — o caso especial da Tela 5, onde a UI precisa dizer
   "isto é escolha sua", não "isto foi calculado"
4. **Bloco de canal** — os 4 campos de um canal, com override independente dos demais
5. **Tela do produto** — cabeçalho do produto + os 3 canais
6. **Ficha de estados** — sem override · ativo · perto de expirar · expirado · oculto · sem
   dado de API
7. **Tela completa na moldura do Escritório** — sidebar + navegação

## Critérios de verificação
O portão (fase 03) confere, olhando a peça renderizada:
1. Para qualquer campo, dá para responder "de onde veio esse valor?" e "até quando ele vale?"
   sem abrir outra tela nem passar o mouse em nada
2. Salvar override de Avaliação ou de Volume de Vendas sem motivo é impossível — e o motivo
   da impossibilidade é legível antes da tentativa, não só depois
3. "Lançamento" não aparece em nenhum lugar como resultado de cálculo, data ou regra
4. Override em um canal é visivelmente independente dos outros dois canais do mesmo produto
5. Nada na tela sugere que sobrescrever muda a posição do canal no comparador
6. Os rótulos de tier são **os mesmos** que estão no ar no comparador público
7. Tokens: todo valor de cor/espaço/tipografia rastreável ao `b2c-*` capturado ou ao Theme
   "Escritório" do `tokens.json`; nenhum inventado
8. WCAG AA em texto, componente e alvo de toque
9. A peça parece o Escritório Virtual — e a comparação é feita contra captura real, não
   contra memória (ver premissa 3)

## Rastro
- **[2026-08-14] [fase 01] Spec criada.** Demanda aberta a pedido do designer ("agora preciso
  atuar na outra página, a do admin"). É a demanda que a spec do comparador declarou fora do
  escopo dela em três ciclos seguidos, e que o brief marca como prioridade do Produto desde a
  v1.7.
- **[2026-08-14] [fase 01] Recorte: Telas 4 e 5, e só.** O designer respondeu "faz o que
  estiver seguindo o brief" — e o brief é explícito: "priorizar as telas revisadas de RF-13
  (override + TTL)". A Tela 5 entra junto porque **não é tela separada**: o próprio brief diz
  que "Lançamento" "não é um campo separado, é um dos valores possíveis de Volume de Vendas".
  Somá-las não fere a regra de 1 demanda = 1 tarefa; separá-las é que quebraria o fluxo em dois.
- **[2026-08-14] [fase 01] Telas 2, 3 e 6 ficaram fora** por decisão do brief, não minha: as
  três estão marcadas "Sem mudança nesta versão". A Tela 9 (tour) ficou fora por outro motivo —
  é o mesmo usuário em outro momento (aprendendo, não operando) e não tem o que ensinar
  enquanto estas telas não existirem.
- **[2026-08-14] [fase 01] Superfície decidida: réplica do Escritório Virtual** (escolha do
  designer entre as três opções apresentadas). Consequência registrada como premissa 1: o brief
  não afirma isso — lista os dois design systems como dependência sem dizer qual rege a tela.
  A inferência vem da Tela 9, que situa a capacidade "dentro do catálogo do Escritório".
- **[2026-08-14] [fase 01] Achado ao cruzar as duas specs — "ocultar campo" (premissa 4).**
  O brief oferece "ocultar campo" como opção de override e para por aí. A spec do comparador
  fechou, no ciclo 3, que a copy de estado vazio segue a **causa** (`Informe o CEP` = falta
  entrada · `Não informado` = dado não veio · `Calculado no checkout` = o canal só revela
  adiante). Um campo escondido de propósito pelo admin não é nenhuma dessas causas — hoje ele
  cairia em `Não informado`, que é mentira. É contrato entre as duas telas, não detalhe de UI.
- **[2026-08-14] [fase 01] Achado ao cruzar as duas specs — Imagem por canal (premissa 5).**
  O brief lista Imagem entre os campos com override por canal. A peça pública tem UMA imagem
  no hero e nenhuma imagem por canal (premissa 13 da spec do comparador). Sobrescrever a imagem
  do TikTok hoje não tem onde aparecer. Ou o card muda, ou o campo sai da lista.
- **[2026-08-14] [fase 01] Brief v1.9 salvo em `insumos/brief-design-v1.9.md`.** Ele só existia
  colado no chat; o repositório tinha apenas a v1.1. As versões v1.6, v1.7 e v1.8 continuam
  ausentes — e o v1.9 delega a elas várias seções ("sem mudança — ver Brief v1.6"), o que
  significa que partes do contrato desta demanda não estão legíveis em lugar nenhum.
- **[2026-08-14] [fase 01] Premissa 3 rebaixada de alta para média — o chassi já existe.** Eu
  havia declarado que nada no repositório mostrava o Escritório replicado; o designer apontou
  `pecas/influenciadora/`. Verificado renderizando a peça 05: a moldura (sidebar,
  tokens `b2c-*` do bundle real, estrutura de página) está lá e a peça deste ciclo **herda** essa
  moldura em vez de recriá-la. O que segue desconhecido é só a navegação do admin — a peça é a
  conta da influenciadora (Meus saques, Minhas metas, botão "Comprar" nos cards), e não existe
  nela nenhuma tela de override, TTL, motivo ou tag. Isso destrava a fase 02: começamos pelo
  conteúdo da tela, não pela casa.
- **[2026-08-14] [fase 02] Pasta `pecas/admin/` criada** a pedido do designer, com os assets e
  uma cópia intacta do chassi em `00-chassi-herdado.html`. O nome da pasta é `admin` (e não o
  slug da demanda, `override-administrativo`) por pedido explícito: ela é a casa da terceira
  peça do projeto, e as Telas 2, 3, 6 e 9 entram nela em ciclos seguintes.
- **[2026-08-14] [fase 02] Direção estética decidida e registrada** (ver seção própria).
  A decisão que carrega a peça: **o valor da API nunca some**. Onde há override, a célula
  mostra os dois — o que o cliente vê e o que a API diz por baixo. Sem trilha de auditoria
  (DRP §13), esconder o original atrás de um clique transformaria "de onde veio isso?" numa
  investigação. A expiração é escrita como futuro ("volta para *Mais vendido* amanhã"), não
  como cronômetro.
- **[2026-08-14] [fase 02] Peça 01 gerada — `01-tela-override.html`.** Composição em **matriz
  campo × canal** (4 × 3 = 12 células), escolhida porque torna a granularidade por canal
  literal: "override no TikTok e não no Shopee" fica visível sem abrir nada, que é o critério
  de verificação 4. Modal de substituição funcional: valor por tipo de campo (select de tier /
  nota numérica / imagem), TTL com default por campo (2 dias Estoque, 15 dias Avaliação e
  Volume), "sem expiração", "ocultar campo", e motivo com bloqueio real do botão Salvar.
- **[2026-08-14] [fase 02] H-UX-12 respondida na peça: "Lançamento" dispensa motivo.** Ao
  escolher Lançamento no seletor, o campo de motivo vira opcional e aparece a nota que o brief
  exige — "Lançamento é uma marcação sua, não existe cálculo por data por trás". Segue a
  recomendação do próprio brief; falta referendo do Produto.
- **[2026-08-14] [fase 02] Dataset amarrado ao que está no ar.** A peça usa o mesmo produto e
  os mesmos números do comparador em produção (Óleo de Mirra Reparador 90ml, SKU 150264,
  Ybera 4,8 · Shopee 4,6 · TikTok 4,3, TikTok em "Últimas unidades" e "Lançamento", Shopee em
  "Campeão de vendas"). Aplicação direta do aprendizado do ciclo 1 do comparador (peça-fonte
  única de dados) e do critério 6 (rótulos idênticos aos do público).
- **[2026-08-14] [fase 02] Duas correções de contraste feitas na geração,** medidas no
  renderizado: `.hint` sobre `neutral-20` estava em 4,40:1 (subiu para 7,03 com `neutral-70`)
  e o link de ação rosa sobre o âmbar do override estava em 4,41:1 (subiu para 6,04 com
  `primary-40`). Nenhum valor novo — os dois vieram de degraus que a captura já tinha.
- **[2026-08-14] [fase 02] Restrição de alvo corrigida na spec: 24px, não 44px.** Eu havia
  copiado o 44px do comparador na fase 01 sem pensar; 44 é AAA (2.5.5), adotado lá por ser
  mobile. O AA é 24px (2.5.8) e é o que cabe numa ferramenta densa de desktop. Alvos da peça:
  36×34px.
- **[2026-08-14] [fase 02] A premissa 4 ("ocultar campo") aparece renderizada na peça,** de
  propósito, em Imagem × TikTok: a célula diz "Oculto no comparador" e "a API envia uma imagem
  — ela está escondida do cliente". Não inventei o que o card público faz nesse caso, porque
  isso é decisão do Produto. Deixar o estado visível na peça é o que torna a pergunta
  discutível em vez de esquecida.
- **[2026-08-14] [fase 02] Repasse da peça contra o brief, item por item — 3 faltas reais
  corrigidas.** O designer pediu a conferência; o que estava faltando:
  1. **"há quanto tempo"** — o brief pede a indicação de override "e há quanto tempo/quando
     expira", e repete a exigência na mitigação do risco *Override sem trilha de auditoria*
     ("deixar claro para o próprio admin quando um campo está sob override e há quanto tempo,
     para reduzir o risco de esquecimento"). A peça só respondia *quando expira*. Toda célula
     sob override ganhou **"Ativo desde 02/08 · há 12 dias"**. É a metade da exigência que
     mais importa justamente nos overrides *sem* prazo, que são os que ficam esquecidos.
  2. **Imagem abria o modal sem controle de valor** — defeito, não escolha: `md-val` e
     `md-num` ficavam escondidos e nada tomava o lugar, então "Novo valor" aparecia vazio.
     Agora tem miniatura do que está no ar + botão de escolher arquivo com preview.
  3. **Relançamento** — a Tela 5 diz que "Lançamento" serve "inclusive para marcar um
     relançamento de produto já existente", e isso não aparecia em lugar nenhum. Entrou na
     nota que já explicava a marcação manual.
- **[2026-08-14] [fase 02] Duas adições que NÃO são do brief, e ficam sujeitas a rejeição:**
  (a) contagem no cabeçalho da matriz ("4 campos substituídos · 1 vence em até 3 dias ·
  2 sem prazo para voltar") — o brief pede a indicação de *quais* campos, que a matriz já dá;
  a contagem responde antes da varredura e nomeia o que vence; (b) campo de motivo disponível
  em **todos** os campos, opcional onde o brief não exige. Sem trilha de auditoria, é a única
  linha onde o admin registra por que fez o que fez. As duas mitigam o risco que o próprio
  brief registrou, mas nenhuma foi pedida.
- **[2026-08-14] [fase 02] Contrastes dos elementos novos medidos no renderizado:** `.since`
  7,24:1 · contagem 7,73:1 · destaque da contagem 5,07:1. Nenhum valor novo de token.
- **[2026-08-14] [fase 02] Pasta do admin ficou com um arquivo só.** O `00-chassi-herdado.html`
  — a cópia intacta da Tela A da influenciadora, de onde parti — foi removido a pedido do
  designer, depois de cumprir a função. Ele era byte a byte igual a um arquivo que continua
  existindo em `pecas/influenciadora/`, e sua presença fazia a pasta do admin parecer ter duas
  peças. O comentário no topo de `01-tela-override.html` continua nomeando a origem do chassi.
- **[2026-08-14] [fase 02] Referências de caminho atualizadas** após o designer renomear
  `pecas/atualizacao-poc-referencia/` para `pecas/influenciadora/`. O nome da DEMANDA irmã
  (`atualizacao-poc-referencia`) permanece — é ela que aparece em `specs-irmas` e nas
  Restrições como precedente de captura dos tokens `b2c-*`. O que mudou foi só o endereço das
  peças. Mesma situação já registrada aqui para `pecas/admin/` vs. a demanda
  `override-administrativo`: neste projeto a pasta passa a nomear a superfície, e a spec
  continua nomeando a demanda.
- **[2026-08-14] [fase 01] Portão de saída da fase 01:** critério de sucesso checável olhando ✔ ·
  nenhuma premissa crítica sem dono ✔ · fronteira explícita do que está fora ✔. Spec **ativa**.
  A fase 02 pode começar: a moldura vem herdada da peça 05 de `pecas/influenciadora/`.
  As premissas 4 e 5 (ocultar campo · imagem por canal) seguem como as duas que precisam de
  resposta do Produto antes do ciclo fechar — são contrato com o comparador que já está no ar.

- **[2026-08-14] [organização] `LEIA-ME.md` na pasta e caminho do chassi corrigido.** Quando as
  peças intermediárias das outras duas superfícies foram para `componentes/`, o chassi herdado
  mudou de endereço: agora é `pecas/influenciadora/componentes/05-tela-a-completa.html`. O
  comentário no topo de `01-tela-override.html` e a premissa 3 apontam para o lugar certo.

- **[2026-08-14] [organização] Arquivo final renomeado para o padrão `hub-<superfície>`:**
  `01-tela-override.html` → **`hub-painel-administrativo.html`**. A numeração era resto da
  sequência de peças e não dizia nada a quem recebe o arquivo solto. O `<title>` acompanhou:
  de "Peça 01 — Override de campos com TTL" para **"HUB Ybera — Painel administrativo de
  catálogo"**, que é o que aparece na aba do navegador de quem abrir.

- **[2026-08-14] [fase 03] PORTÃO RODADO — primeiro do ciclo 1. Veredicto do designer: EDITAR.**
  Rubric v4 + crivo de acessibilidade aplicados sobre o renderizado, por medição (screenshots
  intermitentemente pretos nesta sessão — artefato já registrado). Aprovado no diagnóstico:
  percurso principal completo, rótulos idênticos ao comparador no ar, contrastes ≥ 4,5:1,
  alvos 36×34, zero valor inventado, direção estética cumprida. Reprovado: 7 itens — (1) sem
  estado de salvando/erro [3.2, bloqueio]; (2) estado "override expirado" irrepresentável
  [1.2/5.1 → Δspec]; (3) foco perdido após salvar/remover + modal sem trava de Tab [4.3];
  (4) matriz sem semântica de tabela + contagem sem aria-live [fora do rubric — candidato a
  Δrubric na fase 04]; (5) links mortos no menu e no breadcrumb [3.3/3.4]; (6) Google Fonts
  sem comentário-pendência [7.1, nota]; (7) insumos do repositório marcam o painel admin como
  Won't Have, contradizendo o brief v1.9 [nota → premissa 9].
- **[2026-08-14] [fase 02] Rota EDITAR executada — correções cirúrgicas dos itens 1, 3, 4, 5
  e 6, verificadas no renderizado:**
  (1) Salvar virou assíncrono (~650ms simulados): botão "Salvando…", Cancelar e Esc travados
  durante a espera, e **nada é aplicado ao dado antes da resposta**; erro de salvamento com
  `role="alert"` ("Não foi possível salvar. Nada mudou no comparador — tente de novo."),
  contraste 7,78:1 em club-700/club-50 — valores capturados da marca, porque **a captura b2c
  não tem token de erro** (pendência anotada aqui; candidata ao item de captura no fechamento
  do ciclo). Demo do erro: `#falha` na URL (hash, não query — o servidor estático descarta a
  query no redirect de `.html`; descoberto no teste, primeira tentativa com `?falha` falhou).
  (2 → fase 01) Estado "override expirado" removido do escopo com justificativa; estados
  "salvando" e "erro de salvamento" adicionados; premissa 10 aberta (rastro transitório
  pós-expiração — Produto).
  (3) Trava de Tab no modal (testada nos dois sentidos) e foco devolvido à célula editada após
  salvar/remover (testado: foco termina no botão da célula reconstruída).
  (4) Matriz com `role="table"` real — linhas em wrappers `display:contents` (role=row),
  4 columnheaders + 4 rowheaders + 12 cells, layout pixel-idêntico (células da mesma linha
  conferidas no mesmo topo); contagem com `aria-live="polite"`.
  (5) Menu: Telas 2, 3 e 6 viram itens inertes com selo "em breve" (contraste 7,03:1) e a
  Tela 3 (Tags por oferta) entrou no mapa — o menu agora espelha as 4 telas navegáveis do
  brief; a Tela 9 (tour) fica fora por ser modal, não destino. Breadcrumb-mãe virou texto.
  Os links da moldura (Produtos, Marcas, Usuários) permanecem como réplica inerte, mesma
  convenção da peça da influenciadora.
  (6) Comentário-pendência do Google Fonts adicionado (mesma convenção da peça irmã).
  Reverificado após tudo: percurso com sucesso e com falha, dado intacto na falha, mobile
  375px sem rolagem lateral e com o canal rotulado em cada célula, console limpo.
- **[2026-08-14] [fase 03] Reverificação pós-edição: itens 1, 3, 4, 5 e 6 fechados por
  medição; item 2 resolvido por Δspec; item 7 vira premissa 9 (dono: Produto).** Diagnóstico
  desta rodada: **sem bloqueios remanescentes conhecidos**. O veredicto de aprovação é do
  designer — pendente. Candidatos a Δrubric na fase 04: semântica de tabela/aria-live em
  ferramenta de operação (item 4) e "estado listado na spec precisa ser representável com a
  informação que existe" (item 2).

- **[2026-08-14] [fase 03] Reauditoria a pedido do designer ("certeza que ficou tudo correto?")
  — a rodada anterior NÃO tinha pego 4 defeitos,** todos no caminho imagem/erro, achados
  tentando quebrar as combinações não testadas: (a) banner de erro de uma falha anterior
  persistia ao abrir o modal de OUTRO campo — toda abertura agora limpa o erro; (b) destravar
  a imagem oculta sem escolher arquivo salvava `src=null` (imagem quebrada) — agora cai para a
  imagem da API; (c) a copy "ela está escondida do cliente" aparecia com a imagem visível —
  agora distingue oculta de visível; (d) "Volta para assets/produto.jpg em 15 dias" vazava
  caminho de arquivo — agora "Volta para a imagem da API". Regressão completa reexecutada
  após as correções: sucesso, falha (#falha), dado intacto na falha, trap de Tab nos dois
  sentidos, foco devolvido à célula, roles de tabela, 375px, zero imagem quebrada visível,
  console limpo. Lição para o rubric (Δrubric candidato, fase 04): o portão testou cada
  estado isolado, mas não as TRANSIÇÕES entre estados (falha→outro campo; oculto→visível) —
  foi nas transições que os 4 moravam.

- **[2026-08-16] [fase 01] Mudança de escopo a pedido do designer: "a tela completa seguindo
  o brief mais atual — exatamente o que o brief pede, sem decidir nada diferente".** Releitura
  integral do v1.9 contra o pedido: das seis telas administrativas, o brief só carrega
  coordenadas funcionais para as Telas 4 e 5 (feitas no ciclo 1) e para a **Tela 9** (🆕, tour
  de onboarding). As Telas 2, 3 e 6 remetem ao Brief v1.6, ausente do repositório junto com
  v1.7, v1.8 e o DRP v2.6 — e o DRP local (v1.8) termina antes do RF-13 existir.
  Consequência registrada: **Tela 9 entra no escopo (ciclo 2)**; Telas 2, 3 e 6 ficam
  bloqueadas por documento (premissa 11) — segui-las "exatamente" é impossível sem o texto
  que as especifica, e inventá-las violaria o próprio pedido.

- **[2026-08-16] [fase 01] Chegaram o Brief v1.10 e o DRP v2.7** (colados no chat pelo designer;
  salvos em `insumos/brief-design-v1.10.md` e `insumos/drp-v2.7.md` — extraídos do transcript da
  sessão, verificados íntegros do título à nota final). O v1.10 **supersede o v1.9**, que era o
  contrato deste ciclo até aqui. Efeitos: premissas 1, 4, 5, 7, 9 e 11 resolvidas (ver bloco de
  resoluções na tabela); premissa 12 aberta (TTL de frete); **ciclo 3 aberto** — Telas 2, 3 e 6
  (coordenadas do DRP §7/RF-13) + revisão da Tela 4 (frete overridável com "Aproximado",
  quem inseriu, Avaliação TikTok definitiva, Volume unificado, estoque TikTok booleano).
  Consequências para a OUTRA demanda registradas lá: o comparador público ganhou coordenadas
  novas (tag "Aproximado", exclusão do ranking sem frete — H-UX-16, imagem por canal, campo
  ocultado sem rótulo de vazio) — fora do escopo desta spec.

- **[2026-08-16] [fase 02] Ciclo 3 gerado na mesma peça** — as 4 telas do menu Hub viraram
  **vistas navegáveis** (a Tela 4 deixou de ser a única; os "em breve" saíram do menu; o
  breadcrumb "Produtos no Hub" virou link de verdade; no mobile o menu Hub vira barra
  horizontal, para as telas continuarem alcançáveis). O que cada tela seguiu do DRP §7/RF-13:
  Tela 2 com gate opt-in explícito (nota: "produto desabilitado não existe para o cliente") e
  contagem habilitados/total (métrica do DRP §9); Tela 3 com as três sugestões literais do
  DRP como atalhos; Tela 6 com o aviso "não segura o preço" convivendo com o disclaimer
  (Q-22). Revisão da Tela 4: linha de **Frete** (Wake exata sem controle; Shopee "Aproximado"
  substituível; TikTok manual OU referência a outro canal OU sem informação — e a célula avisa
  que sem frete o canal sai do ranking); **por Ana Ribeiro** no carimbo de cada override
  (HT-08); copy do TikTok sem "ainda" (Q-H é definitiva); estoque do TikTok virou EXEMPLO de
  override ("Últimas unidades" à mão sobre API booleana que só diz "Disponível" — ressalva de
  Engenharia tornada visível); tour atualizado (sem "em breve"; cita as 4 telas). Decisões de
  Design registradas: só o Óleo de Mirra leva à tela de campos (link honesto — os demais
  produtos não têm matriz nesta POC); nomes de produto do catálogo são fictícios plausíveis.
- **[2026-08-16] [fase 03] Verificação do ciclo 3, por medição:** matriz 5 rowheaders + 15
  cells (roles de tabela preservados); frete Wake sem ação, Shopee com "Aproximado", TikTok
  Definir → radio valor/referência (foco inicial no radio; "Usar o frete de outro canal"
  esconde o campo R$ e mostra o select com "Shopee (R$ 19,90)"); salvar referência fecha,
  marca âmbar, "Frete da Shopee · Aproximado", autoria "por Ana Ribeiro", foco devolvido à
  célula; Remover devolve ao vazio (ref e por limpos); resumo recontou 5→6→5. Telas novas:
  toggle habilitar/desabilitar recontando "3 de 6"→"4 de 6" com foco preservado; tag adicionar
  (sugestão e input+Enter) e remover com foco no input do canal; timer ligar/remover por
  canal. Contrastes novos AA: aviso do timer 4,75 · chip "Fora do comparador" 7,03 ·
  sugestões 7,73 · tagchip 7,78 · "Aproximado" 7,73. Mobile 375px: barra Hub horizontal
  visível, moldura escondida, sem rolagem lateral, vistas trocam. Regressões: `#falha` mostra
  erro sem aplicar (dado conferido intacto), tour abre/percorre/fecha com a copy nova,
  console limpo nas duas cargas. Screenshots desktop (Tela 2) e mobile conferidos.
  **Pendências deste ciclo para o veredicto do designer:** premissa 12 (TTL de frete —
  assumida a mecânica comum) e a nota de que Telas 2/3/6 seguem coordenadas estratégicas do
  DRP (o brief de Design nunca as detalhou além dele).
- **[2026-08-16] [fase 03] VEREDICTO DO DESIGNER: APROVADO** ("ta tudo aprovado") — cobre os
  ciclos 1, 2 e 3 (Telas 2, 3, 4, 5, 6 e 9). Ciclos fechados; a demanda segue para a fase 04
  (entrega e roteamento dos aprendizados) quando o trabalho subir para o git.

- **[2026-08-16] [fase 02 · ciclo 4] O canal futuro (Mercado Livre) entrou na origem de
  canais do admin** — extensão da decisão do designer na peça da influenciadora ("conteúdo
  com origem"): a lista de canais é UMA, com "em breve" como estado no dado (`breve:true`),
  e cada tela decide a apresentação. Na **matriz**, o canal futuro NÃO vira coluna (seriam 5
  células mortas na varredura do operador) — vira uma nota de rodapé gerada do dado
  ("Mercado Livre chega na próxima fase..."). Em **Tags** e **Timer**, que são listas por
  canal, ele aparece como linha inerte com selo "em breve", sem controles falsos. Fora do
  alcance dele: matriz, resumo e a referência de frete filtram por `CANAIS_ATIVOS`.
- **[2026-08-16] [fase 03 · ciclo 4] Verificado por medição:** matriz intacta (15 células,
  resumo inalterado); nota do canal futuro renderizada do dado; Tags com 4 blocos (ML inerte,
  sem input); Timer com 4 linhas (ML sem botão); o modal de frete do TikTok NÃO oferece o ML
  como referência (só Shopee); salvar/desfazer regredidos verdes; selo "em breve" com
  contraste 7,03; zero erros de console. Aguardando o veredicto do designer.
- **[2026-08-16] [fase 03 · ciclo 4] VEREDICTO DO DESIGNER: APROVADO** ("ok"). Publicado em
  produção (commit 2195d20).

- **[2026-08-16] [correção de fidelidade] Moldura destravada: o conteúdo era limitado a
  1160px; o app real é fluido.** Achado pelo designer comparando print de produção (conta
  admin real) com o nosso protótipo, os dois no mesmo monitor largo (~2530px de viewport):
  em produção o conteúdo ocupa 100% da largura ao lado da sidebar; aqui parava em 1400px e
  deixava ~45% da tela vazia. O `max-width:1160px` do `.main` veio da captura de julho e
  passou por três ciclos sem ser questionado, porque toda verificação anterior rodou em
  viewport de 800–1280px, onde o teto não aparece. Corrigido nas DUAS peças (admin e
  influenciadora) para `width:100%; min-width:0` — o `min-width:0` impede que os grids
  estourem a coluna do layout. **Lição para o rubric (Δrubric candidato, fase 04): verificar
  também em viewport maior que o teto de largura da peça — um `max-width` só se revela acima
  dele.** Verificado a 2400px (matriz 3 colunas de 636px, células alinhadas, zero sobra à
  direita), 1440px (colunas de 316px, as 4 vistas e o modal de frete intactos) e 680/375px
  (matriz em 1 coluna com o canal rotulado, barra Hub horizontal) — sem rolagem lateral em
  nenhum, console limpo.
- **[2026-08-16] [premissa 3 — evidência nova, decisão pendente] O menu real do admin foi
  capturado.** O print de produção enviado pelo designer é de uma conta ADMIN ("Admin Nivello
  PRO"), o que resolve a evidência que faltava: o menu real do admin é **Lojas** (Ybera.com,
  Loja Interna — com submenu) · **Financeiro** (Desbloqueio, Sacar, Meus saques, Transferir,
  Extrato) · **Performance** (Minhas metas, Relatórios) · **Suporte** (Atualizações com selo
  "Novo", Material de Apoio, Ybera Academy, Central de Ajuda). Não existe a seção "Rede" (que
  aparece na conta da influenciadora — o menu varia por papel), nem as seções "Catálogo" e
  "Operação" que esta peça propôs. **Consequência: a sidebar do admin está em drift declarado.**
  O que a evidência NÃO resolve: onde a seção "Hub" se encaixa na IA real, e onde o admin
  gerencia produtos hoje (provavelmente dentro do submenu de "Ybera.com", que o print mostra
  fechado). Realinhar exige essa decisão — registrado para o designer, não executado.

- **[2026-08-16] [fase 02 · ciclo 5] Três correções pedidas pelo designer ao revisar a peça
  contra produção.**
  **(a) Jargão no menu.** "Campos e overrides" → **"Informações do produto"** (escolha do
  designer entre três opções apresentadas). O achado nasceu de uma pergunta dele — "o que quer
  dizer overrides?" —, que é o próprio defeito: a interface dizia "Substituir/Substituído por
  você" em todo lugar, e a palavra em inglês do brief só tinha sobrado nos rótulos de
  navegação. Trocada nos 3 pontos (menu, link da lista de produtos, copy do tour). A palavra
  segue nos comentários, no nome da demanda e nas specs — ali é linguagem de projeto.
  **(b) Subtítulos de formato removidos** ("tier", "nota real", "depende do CEP" sob o nome de
  cada campo): repetiam em vocabulário de documento o que a célula já mostra — "Disponível" se
  lê como categoria, "★ 4,8" como nota. Tirei os três (não só os dois citados): manter apenas
  o do Frete deixaria um resto órfão, e a informação já está na célula da Wake.
  **(c) O produto virou contexto explícito — defeito de arquitetura.** O designer notou que
  entrar em "Tags por oferta" pelo menu já mostrava o Óleo de Mirra sem ele ter escolhido nada,
  e sem caminho para trocar. Causa: **três das quatro telas do Hub são de UM produto**
  (Informações, Tags, Timer), mas o menu as tratava como destino de topo. Correção: bloco de
  contexto (breadcrumb + cabeçalho do produto + **seletor "Produto aberto"**) comum às três
  telas, escondido na lista; cada produto passou a ter **estado próprio** de campos, tags e
  timer; "Abrir informações" na lista escolhe o produto; trocar pelo seletor **mantém a tela**
  em que a pessoa está. O seletor lista só produtos habilitados (o gate da Tela 2 vem antes), e
  desabilitar o produto aberto move o contexto para outro habilitado, em vez de deixar a tela
  apontando para fora do comparador.
  Consequências de dado: só o Mirra tem o cenário rico; os outros habilitados começam como a
  maioria começa em produção — **tudo vindo da API, nada substituído** (estado que a peça nunca
  havia mostrado e que o `resumo()` já sabia escrever: "Nenhum campo substituído — tudo vem da
  API"). Foto: placeholder declarado (`assets/produto-placeholder.svg`) para os produtos sem
  asset real, em vez de repetir o frasco do Mirra — mesma decisão já tomada na peça irmã.
  **Defeito latente que isso expôs e corrigi:** `celula()` imprimia "★ null" para campo de nota
  sem valor — estado real em produção (TikTok, onde a nota é sempre manual: Q-H). Agora mostra
  "Sem nota".
- **[2026-08-16] [fase 03 · ciclo 5] Verificado por medição:** contexto visível nas três telas
  por produto e ausente na lista; seletor com os 3 habilitados; abrir pela lista troca nome,
  SKU, foto e os três conjuntos de dados; trocar pelo seletor preserva a tela (testado em
  Timer); isolamento conferido nos dois sentidos (tag e timer criados no Kit Gloss não vazam
  para a Máscara; override salvo na Máscara não altera o Mirra); desabilitar o produto aberto
  reduz o seletor a 2 e move o contexto; breadcrumb volta para a lista; "Sem nota" no TikTok do
  produto limpo; subtítulos ausentes; rótulo novo no menu; zero imagem quebrada visível (a
  única `img` sem `src` é a miniatura oculta do modal, de propósito); zero erros de console.
  Aguardando o veredicto do designer.

- **[2026-08-16] [fase 02 · ciclo 6] "API" saiu da interface** — segundo jargão vazado do brief
  (o primeiro foi "override"), apontado pelo designer: *"quem entrar no painel não vai saber do
  que se trata 'da API', é muito técnico"*. A palavra descrevia procedência em 20 pontos
  visíveis. Trocas: legenda "Valor da API" → **"Automático, do canal"**; carimbo da célula
  "Da API" → **"Automático"**; "A API diz X" → **"O TikTok Shop informa X"** (nome do canal, em
  vez de abstração); "não envia este campo por API" → **"não informa este campo"**; "volta para
  o valor da API" → **"do canal"**; "tudo vem da API" → **"tudo vem automático dos canais"**;
  título do tour "Cada campo mostra o que a API calculou" → **"Cada campo mostra de onde o
  valor veio"**. Zero ocorrência de "API" no texto renderizado (medido por `innerText`); a
  palavra segue nos comentários e na chave interna do dado (`fonte:'api'`), que é código.
- **[2026-08-16] [fase 02 · ciclo 6] Imagem por canal: a tela não dizia que é uma só.**
  Pergunta do designer ("se subir mais de uma, qual aparece?") — o dado sempre guardou UM valor
  por campo × canal e o `input` nunca aceitou múltiplos arquivos, mas nada na tela dizia isso.
  Adicionada a linha **"Cada canal mostra uma imagem só: escolher outra substitui esta."** no
  seletor de imagem. Verificado: `input.multiple === false`, aviso presente, modais de tier,
  frete e sem-valor com a copy nova, produto limpo com o resumo novo, zero erros de console.
  **Nota de contrato (premissa 5, segue com o Produto/comparador):** mesmo com uma imagem por
  canal, o card público hoje tem UMA imagem no hero — então a substituição de imagem por canal
  ainda não tem onde aparecer para o cliente. O DRP v2.7 já diz que deve ser por canal com
  fallback para a imagem do produto de referência; falta o ciclo do comparador implementar.
- **[2026-08-16] [fase 02] Tela 9 gerada dentro da peça existente** (um modal não merece
  arquivo próprio — é a mesma superfície). Coordenadas do brief cumpridas literalmente:
  gatilho "capacidade nova no catálogo" (a seção Hub), tour rápido de 3 passos explicando o
  que mudou e como usar, **não bloqueante** (Fechar, Esc e clique fora funcionam em qualquer
  passo; nada da tela depende de completar), componente genérico para reúso (passos são
  dados, mecanismo é neutro). Decisões de Design, como o brief delega: 3 passos (seção nova →
  como ler a matriz → prazo e motivo), copy com as palavras da própria tela, passo final
  "Começar a usar". A copy do passo 1 admite os itens "em breve" do menu — o tour não promete
  o que o menu não abre. Aparece uma vez (localStorage) e `#tour` na URL reabre — com
  `hashchange` ouvido, porque digitar um hash em página aberta não recarrega nada (defeito
  achado e corrigido na verificação; o `#falha` nunca sofreu disso por ser checado no salvar).
- **[2026-08-16] [fase 03] Verificação do ciclo 2, tudo por medição:** abre na primeira
  visita e não volta depois de visto; `#tour` reabre no load E via hashchange; 3 passos com
  contador visível ("passo 1 de 3"); Esc, clique no fundo e botão Fechar encerram; trap de
  Tab nos dois sentidos (só 2 focáveis); foco devolvido ao título da matriz ao fechar;
  contraste kicker 6,45 · corpo 7,73 · negrito 14,89 (AA folgado); 375px sem rolagem lateral
  (modal 327px, botões 40px ≥ alvo 24px); regressão do modal de substituição verde (abre,
  fecha, não coexiste com o tour); console limpo. Screenshot desktop conferido visualmente.

- **[2026-08-16] [Δspec · divergência intencional do brief] O campo Imagem saiu do painel.**
  Decisão do designer, escolhida entre três saídas apresentadas (só ocultar · só leitura ·
  tirar a linha): **tirar a linha inteira**. A matriz passa a ter 4 campos — Estoque, Volume de
  Vendas, Avaliação e Frete. **A divergência é consciente e precisa chegar ao Produto:** o DRP
  v2.7 §7 e o RF-13 listam Imagem como overridável nos 3 canais ("Admin pode sobrescrever se a
  imagem do canal estiver errada ou ausente"). O que sustenta a decisão: (a) premissa 5 — o card
  público tem UMA imagem no hero, então override de imagem por canal não tem onde aparecer;
  (b) upload traz armazenamento e proxy de CDN, que o próprio DRP registra como escopo real do
  v1 (R-13, proxy da CDN do TikTok); (c) sem destino, era controle que promete e não entrega.
  Se o Produto insistir no campo, ele volta — o custo é baixo e o histórico está aqui.
  Removidos junto: seletor de arquivo e pré-visualização, CSS `.imgpick*`, os três ramos de
  imagem em `celula()`, os ramos de `abrir()` e de salvar, o estado `oculto` de demonstração do
  TikTok, e a menção a Imagem na copy do tour. **Preservado de propósito:** a opção "ocultar
  campo" do prazo, que é do brief e vale para QUALQUER campo — testada depois da remoção
  (ocultar Volume de Vendas na Shopee renderiza "Oculto no comparador" com a linha do canal
  intacta). `FOTO_PLACEHOLDER` segue em uso, agora só na foto do cabeçalho do produto.
- **[2026-08-16] [fase 02] "Timer de escassez" → "Timer da oferta"** (proposta do designer).
  Terceiro jargão de documento saindo da interface, depois de "override" e "API": "escassez" é
  como o Produto descreve o mecanismo (gerador de senso de escassez, DRP §7), não como a
  operadora chama a coisa. O rótulo novo diz o que o controle faz — marca por quanto tempo a
  oferta fica no ar. Trocado no menu, no título da tela e na copy do tour; os comentários do
  código mantêm "Tela 6 — Timer de escassez" para rastrear até o brief. O aviso de que o timer
  **não segura o preço** (Q-22) continua igual, e fica ainda mais necessário: "oferta" pode
  sugerir preço garantido, e a tela precisa negar isso explicitamente.
- **[2026-08-16] [fase 03] Verificado após remoção da Imagem e renome do timer:** 4 campos × 3
  canais = 12 células; resumo recontou para "4 campos substituídos"; zero menção a "Imagem" no
  texto renderizado e nenhum `input[type=file]` na página; modais de tier, nota e frete abrem
  com o controle certo; salvar frete aplica ("R$ 24,90 · Aproximado"); "ocultar campo" funciona
  em campo de tier; rótulos "Timer da oferta" no menu e no título; zero erros de console.
  Aguardando o veredicto do designer sobre este lote (ciclos 5 e 6).

- **[2026-08-16] [correção de dado] Frete da Shopee alinhado ao comparador: R$ 19,90 → R$ 22,90.**
  O designer achou a divergência comparando as duas peças (comparador mostrava 22,90, admin dizia
  19,90) — as três superfícies precisam contar a mesma verdade, e o valor daqui estava solto. O
  19,90 foi reaproveitado nos produtos de estado limpo, onde faz sentido serem fretes diferentes
  por produto. A investigação abriu o ciclo 4 do comparador (frete da Shopee não pode variar por
  CEP, frete fantasma do TikTok, H-UX-16) — registrado em `comparador-publico.md`.

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
