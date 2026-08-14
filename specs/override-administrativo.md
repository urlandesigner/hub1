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
    expirar · override expirado (o campo voltou para a API) · campo oculto por override ·
    campo sem dado de API para exibir
  - Moldura do Escritório Virtual (sidebar + navegação do catálogo), como réplica
- Fora (deste ciclo, mas do mesmo domínio — candidatos a ciclos seguintes):
  - **Tela 2 — habilitação de produto no Hub** e **Tela 3 — tags por oferta**: o brief marca
    ambas "sem mudança nesta versão". São o passo anterior da jornada e outra tarefa principal
  - **Tela 6 — timer de escassez**: sem mudança no brief
  - **Tela 9 — tour/modal de onboarding administrativo**: outro momento do mesmo usuário (ele
    está aprendendo, não operando) e depende destas telas existirem para ter o que ensinar
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
| 3 | **O chassi do Escritório já existe replicado; a navegação do admin, não.** `pecas/atualizacao-poc-referencia/05-tela-a-completa.html` traz sidebar, tokens `b2c-*` e estrutura de página verificados contra o app real — a peça herda essa moldura. Mas é a conta da INFLUENCIADORA (Meus saques, Minhas metas, botão "Comprar"); o menu que o admin vê ao entrar é desconhecido | média (era alta antes de 2026-08-14 — o chassi apareceu) | dado, para a moldura; palpite, para a navegação do admin | Designer herda o chassi; Produto confirma o menu do admin | menu do admin: antes do handoff. Não trava a fase 02 |
| 4 | **"Ocultar campo" tem contrato indefinido com o comparador.** O brief oferece "ocultar" como opção do override, mas não diz o que o card público mostra no lugar. A spec do comparador tem estados de vazio com causa declarada (`Não informado` = dado não veio) — um campo ocultado de propósito não é nenhum dos casos previstos | **alta** (contrato entre as duas telas; falso, a tela mente para o cliente) | achado desta leitura cruzada, verificado nas duas specs | Produto + Design | antes da fase 02 fechar |
| 5 | **Imagem sob override por canal contradiz o comparador atual.** O brief lista Imagem como campo overridável por canal; a peça pública mantém UMA imagem de produto no hero (premissa 13 da spec irmã), não imagem por canal. Ou o card ganha imagem por canal, ou o override de Imagem não tem onde aparecer | **alta** | achado desta leitura cruzada, verificado nas duas specs | Produto | antes da fase 02 fechar |
| 6 | Os defaults de TTL do brief são **faixas** (48–72h, 15–30 dias), mas o campo pré-preenchido precisa de UM número | baixa-média | dado (o brief é explícito na faixa e omisso no valor) | Produto — a peça assume o menor da faixa (48h / 15 dias) como padrão conservador até resposta | próxima rodada de brief |
| 7 | O "admin" é operador interno de catálogo da Ybera, não o papel Admin/Admin2 da rede Club descrito na Wiki B2C | média (muda linguagem e modelo de permissão) | palpite | Produto | antes do handoff |
| 8 | **H-UX-12 — "Lançamento" dispensa motivo obrigatório.** Produto não decidiu; o próprio brief recomenda dispensar, por não afirmar volume de vendas | média (é entregável de Design deste ciclo) | recomendação registrada no brief | Design responde neste ciclo; Produto referenda | fim do ciclo 1 |

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
  `pecas/atualizacao-poc-referencia/`. Verificado renderizando a peça 05: a moldura (sidebar,
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
- **[2026-08-14] [fase 01] Portão de saída da fase 01:** critério de sucesso checável olhando ✔ ·
  nenhuma premissa crítica sem dono ✔ · fronteira explícita do que está fora ✔. Spec **ativa**.
  A fase 02 pode começar: a moldura vem herdada da peça 05 de `atualizacao-poc-referencia`.
  As premissas 4 e 5 (ocultar campo · imagem por canal) seguem como as duas que precisam de
  resposta do Produto antes do ciclo fechar — são contrato com o comparador que já está no ar.
