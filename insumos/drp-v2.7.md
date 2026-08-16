DRP — HUB Inteligente Ybera
===========================

**Ybera Group · Club Brasil — Crescimento e Canais**

> O DRP (Documento de Requisitos de Produto) é o PRD do Ybera Group — adaptado à nossa realidade de produto. É o artefato motor do fluxo de concepção: antecede a Feature e é o insumo direto para abertura de Features + PBIs + EMs no DevOps.

* * *

**Produto:** HUB Inteligente Ybera · **Versão:** 2.7 · **Autor:** Victor Lima (Produto) · Conduzido por Monteirinho · **Data:** 15/08/2026 · **Status:** Avaliação de Engenharia recebida (Souza, 14/08/2026) e incorporada — **8 decisões de Produto fechadas nesta versão** (Q-18, Q-23, Q-D, Q-H, Q-E, Q-F, Q-G; Q-C sem ação, aguarda checagem trivial de Engenharia) · **BVS:** 180 · **T-Shirt: GG confirmado por Engenharia** (2–4 meses)

> **Nota da v2.7:** o Souza entregou a avaliação de Engenharia completa do Brief v1.7 (`avaliacao-engenharia.md`, 14/08/2026). Veredito: **viável com ajuste**, Porte G, confirma o GG do BVS. Três tipos de conteúdo incorporados nesta versão: (1) **correções factuais** que revertem premissas anteriores — refresh de token OAuth já existe pronto (R-01 retratado, era risco Alto); Shopee não é repo separado; sync do TikTok cai de ~24.000 para ~740 chamadas/dia usando o endpoint certo; SKU de-para pode vir de graça no mesmo payload do sync (pendente confirmação trivial, DSC-04); (2) **hipóteses técnicas fechadas** — HT-04 (Avaliação TikTok: negativa, definitiva, sem API), HT-06 (Volume de Vendas TikTok: caminho melhor encontrado, unifica com a lógica da Shopee), HT-08 (correção grave: não existe trilha de auditoria herdável nenhuma, só autenticação/roles — estampar autoria+timestamp no próprio registro do override), HT-09 (correção de arquitetura: sync sempre grava o valor da API, override só na composição — expiração fica instantânea), HT-10 (recomendação: não construir cadeado de preço no HUB, os 3 canais já agendam nativamente), HT-11 (resolvido por canal, ver Q-E/Q-F); (3) **oito decisões de Produto**, batidas nesta versão com o Head — Q-18 (Open Collaboration), Q-23 (confirmado, com override do admin e duas ressalvas técnicas), Q-D (frescor por campo), Q-H (Avaliação TikTok: admin insere manualmente, definitivo), Q-E+Q-F (nova lógica de frete e ordenação, ver Seção 7), Q-C (sem ação, aguarda Engenharia), Q-G (Head mantém a meta de ~30 dias conscientemente, mesmo com o GG de 2–4 meses confirmado — risco aceito, não reconciliado). **Novos riscos registrados:** contenção de QPS com a integração de pedidos já em produção (R-08); colisão de nome de schema no banco (R-12); proxy de imagem da CDN do TikTok vira escopo real do v1 (R-13). O Discovery de Engenharia v0.5 (Souza) precisa de atualização própria — quatro afirmações propagadas dele para o DRP e para os Briefs estavam incorretas (ver Brief de Engenharia v1.8 para a tabela de correções); isso não é ação desta versão, é item de ação do próprio Souza.

> **Nota da v2.6:** duas decisões do Head sobre itens da rodada anterior. (1) **Q-13 fechada:** o CEP do cliente passa a ser obrigatório para exibir Frete e Prazo de Entrega — sem CEP, esses dois campos específicos não aparecem (produto, preço e comparação continuam visíveis normalmente). Esta decisão é **mais estreita** que a proposta de "forçar CEP antes de qualquer informação" já discutida e recusada na apresentação de POC (05/08/2026, ver Seção 13 v2.3) — aquela bloqueava a página inteira; esta gate apenas os dois campos logísticos. Consequência técnica direta: o Frete deixa de ser um valor único por produto×canal (cacheável de forma genérica) e passa a variar por produto×canal×CEP — reabre a relevância da sugestão de simulação de POST com CEP real (nota histórica atribuída a Vinícius Graff, Brief de Engenharia) como candidata de arquitetura, registrada como nova hipótese técnica (HT-11), sem prescrever a solução. (2) **Q-18 permanece aberta** — uma resposta anterior do Head descrevia o gate de habilitação de produto no catálogo do Hub (já decidido como RF-13), que é diferente da pergunta real de Q-18 (modelo de colaboração Open × Target especificamente para o TikTok). Nota de esclarecimento registrada na Seção 11 para evitar que a diferença entre as duas coisas se perca no histórico.

> **Nota da v2.5:** esta versão incorpora a leitura da transcrição integral da apresentação de POC ao Stakeholder (05/08/2026), até então disponível apenas como ata resumida. Três tipos de achado: (1) **confirmações** — o que a ata resumida já registrava se confirma linha a linha (timer sem cobertura financeira, ordenação sem viés comercial, parcelamento estático só na Wake); (2) **correção de atribuição** — a sugestão de webscraping/Data Lake de frete (Brief de Engenharia, nota histórica) estava anônima ("um Stakeholder") e passa a ser atribuída a **Vinícius Graff (CTO)**; (3) **itens genuinamente novos**, não capturados na ata resumida, registrados como abertos ou pendentes nesta versão — nenhum foi fechado unilateralmente pelo Monteirinho: **Q-24** (janela de atribuição estendida, 60 dias, debatida sem resolução na própria reunião), o mecanismo de "cadeado" de preço para promoções agendadas (nova hipótese técnica), o botão de atualização manual de preço pelo cliente (pendente de confirmação do Head — distinto da sugestão de fetch síncrono já recusada), e o problema de upsell/cross-sell entre versões de produto (novo risco, reconhecido como não resolvido na própria reunião).

> **Nota da v2.4:** esta versão reabre e revisa a resolução da **Q-19** (v2.3), a partir de uma comparação entre as decisões do DRP e o Discovery de Engenharia (Souza, v0.5), que revelou que os campos declarados "sem fonte de API" (avaliação, volume de vendas, estoque, imagem) **estão, na maioria dos casos, disponíveis via API** — o racional original ("elimina dependência de evolução futura de API") não se sustentava para Estoque e Imagem (disponíveis nos 3 canais) nem para Avaliação (disponível em Wake e Shopee). A v2.4 substitui o modelo "tudo admin-only" por um modelo misto: **API como fonte primária onde disponível, com possibilidade de override administrativo configurável (TTL próprio, incluindo permanente ou oculto)**. Estoque e Volume de Vendas passam a ser exibidos como **tiers generalistas** (não números exatos) — decisão que também mitiga o risco de manipulação de prova social identificado nesta rodada. Avaliação **não** entra em tier — mantém-se como estrelas reais. A capacidade "Lançamento" (dentro do tier de Volume de Vendas) passa a ser **estritamente administrativa** — tag manual do admin (inclui casos de relançamento), sem qualquer cálculo automático por data. A trilha de auditoria dedicada, chegou a ser proposta nesta rodada e foi **descartada** — reafirma-se a decisão original (Seção 13, v2.3): sem RNF de auditoria dedicado, herdando o mecanismo já existente no Escritório Virtual; o que se mantém é o campo de **motivo obrigatório** no próprio registro do override (Avaliação e Volume de Vendas), não uma trilha histórica de alterações.

> **Nota da v2.3 (mantida por histórico, parcialmente superada pela v2.4):** a apresentação de POC do Hub ao Stakeholder (05/08/2026) trouxe a proposição de maior impacto daquela rodada — uma **interface administrativa alocada no Escritório Virtual** (roles Admin/Admin2), e não no HUB. Ela resolveu **Q-19** e **Q-20** via fallback manual, introduziu a **Persona 5**, tornou o contrato **D-01 bidirecional**, e adicionou **RF-13**. 🔄 A resolução original de Q-19 (100% admin-only, sem qualquer fonte de API) é **superada pela v2.4** — ver nota acima. Q-20 (Parcelamento) **não muda** nesta versão — continua admin-only, tipicamente Wake, sem contestação técnica levantada.

> **Nota da v2.2 (mantida por histórico, parcialmente superada):** confirmação do Head, mesmo dia da v2.1 — **Parcelamento não fazia parte do comparador nesta versão.** Nenhum dos três canais (Wake, Shopee, TikTok) trazia esse dado via API. Campos comuns do card eram três: Preço, Frete, Prazo de Entrega. 🔄 **Revisado na v2.3** — ver Q-20 na Seção 11: Parcelamento retorna ao escopo como campo admin-only da Wake. A constatação técnica original (nenhum canal traz via API) permanece verdadeira; a revisão reconhece uma segunda fonte (editorial/manual) que a v2.2 não havia considerado.

> **Nota da v2.1 (mantida por histórico):** esta versão reconciliou o DRP com o Brief de Design v1.4 (mesma data). Três mudanças: (1) **Q-15 e Q-17 resolvidas** — política única de campo ausente por canal definida como copy "Não informado" para os campos comuns do comparador, com a exceção já registrada do tratamento de Frete no TikTok. (2) **Taxonomia de campos do comparador definida:** substituiu a lista aberta de 9 campos do "card expandido" (Discovery §4) por uma estrutura fixa — campos comuns (na época, quatro, incluindo Parcelamento — corrigido na v2.2) + campos exclusivos por canal. (3) **Duas questões novas abertas (Q-19, Q-20)**, derivadas da própria definição da taxonomia — Q-20 fechada na v2.2, revisada na v2.3. Nenhuma decisão anterior foi invalidada; RF-12 e as demais decisões da v2.0 permanecem de pé.

* * *

1.  Visão e Posicionamento

* * *

**O que é:** O HUB Inteligente é uma camada de crescimento sobre os canais de venda já operacionais da Ybera. Centraliza em um ponto único como a rede de influenciadoras do Club Brasil divulga produtos e como o cliente final compra — com comparação de preço e frete entre canais (Loja Ybera / Wake, Shopee e TikTok Shop), identificação de quem indicou o produto e geração de links com vínculo de parceiro garantido, independentemente do canal escolhido pelo cliente. **Para quem:** Influenciadoras e Gestores da rede Club Brasil que vendem via múltiplos canais, e clientes finais que recebem links e querem comprar no canal de sua preferência. **Por que existe:** A estratégia multicanal da Ybera expandiu para marketplaces sem um desenho unificado de como a influenciadora divulga, o cliente compra e a venda é atribuída. O HUB existe para organizar essa experiência e garantir que a comissão da influenciadora não dependa do canal escolhido pelo cliente.

* * *

2.  Problema e Oportunidade

* * *

**Dor identificada:** ⚠️ _hipótese não validada — percepção da Diretoria, não confirmada com influenciadoras, clientes ou dados de operação._ As formas de venda estão fragmentadas entre múltiplos canais — Loja Ybera (Wake), Shopee, TikTok Shop e Mercado Livre — cada um com preço, frete, condições e regras de atribuição próprios. Não existe um ponto único que organize a jornada para a influenciadora e para o cliente final. **Causa raiz:** A expansão para marketplaces foi adicionada sem um desenho unificado de divulgação, compra e atribuição. Cada canal cresceu de forma isolada, sem que a camada de influenciadora fosse conectada a todos eles de forma estruturada. **Evidências:** ⚠️ Não há dados quantitativos nem qualitativos estruturados que confirmem a dor. Levantar baselines é pré-requisito para fixar metas numéricas — registrado como Q-01 e Q-07 na seção 11. **Impacto de não agir:** A rede continua orientando clientes manualmente para um único canal (Loja Ybera); atribuição é perdida sempre que o cliente compra fora do link direto; GMV potencial dos canais já operacionais (Shopee, TikTok Shop) fica subaproveitado; risco de queda de engajamento da rede pela percepção de desorganização. **Paliativo atual:** Orientação manual — influenciadoras são instruídas a direcionar o cliente à Loja Ybera, único canal onde a atribuição funciona hoje. **Oportunidade:** O quadrante "comparação multi-canal × comissão garantida pela marca" está vazio no Brasil. A Ybera é parceira oficial de TikTok e Shopee, o que viabiliza acesso às APIs de afiliado e torna o HUB tecnicamente possível agora.

* * *

3.  Hipóteses e Premissas

* * *

*   ⚠️ Existe dor real de desorganização dos canais sentida por influenciadoras e/ou clientes. Toda a demanda depende desta hipótese — o 1º ciclo é o teste.
*   A Ybera conseguirá credenciar acesso às APIs de afiliado gated (Shopee AMS e TikTok Affiliate Seller API) em tempo hábil para o v1.
*   O Escritório Virtual consegue fornecer identidade (chave da rede Club) e catálogo via API para o HUB consumir. Ampliada na v2.0: o mesmo contrato passa a fornecer os dados de exibição do influencer (nome, foto, status) para a seção de identificação no comparador (RF-12). Ampliada na v2.3: o contrato (D-01) passa a ser bidirecional — o Escritório também grava, via Interface Administrativa (RF-13), configuração que o HUB consome (habilitação de produto, tags, campos admin-only/override, timer de escassez).
*   O padrão de identity resolution (creator_id / affiliate_id → identidade Club) pode ser resolvido com chave única (e-mail/documento) coletada no onboarding.
*   As influenciadoras farão o onboarding como creator TikTok e afiliada Shopee em volume suficiente para atingir a meta de ≥ 700 no 1º ciclo. ⚠️ _Premissa sob pressão adicional desde a validação técnica: com Shopee confirmada via Affiliates API (Q-10), a autorização individual OAuth passou a valer para os dois canais gated — não apenas TikTok. Ver risco novo na seção 10 e Q-11/Q-12 na seção 11._
*   O Escritório Virtual manterá o domínio de comissionamento, cálculo e payout — o HUB não precisará replicar essa lógica.
*   O SKU interno Ybera é o mesmo produto nos três canais (Wake, Shopee, TikTok Shop) — premissa confirmada pela operação, base para a resolução de identidade de produto no comparador. ⚠️ _Nota v2.4: o Discovery de Engenharia (Souza, v0.5) registra esta questão como pergunta em aberto (não confirmada naquele documento) — a confirmação operacional (Q-08) tem origem em validação separada, não documentada no Discovery. Não invalida a decisão, mas reduz a rastreabilidade — se a fonte da confirmação puder ser referenciada formalmente, recomenda-se anexar aqui._
*   🆕 _v2.4: com a revisão da Q-19, Estoque e Imagem passam a ter fonte de API confirmada nos três canais (Souza, Seções 7.1/8.1/9.1) — a premissa "HUB não replica lógica de terceiros para estes campos" fica mais forte para estes dois, e mais frágil para Avaliação/Volume de Vendas apenas no canal TikTok (pendente HT-04/HT-06)._
*   ⚠️ A Shopee Affiliates API (GraphQL + HMAC-SHA256) não tem latência ou rate limit críticos para geração de link em tempo real de carregamento do comparador — **não testada em campo**. A Q-10 descartou o risco equivalente do URL pattern, mas isso não valida que a API escolhida está livre do mesmo problema. Ver HT-06 no Brief de Engenharia e risco correspondente na seção 10. _Origem: Discovery de Engenharia (Wake/Shopee/TikTok), consolidado 16/07/2026._
*   🔄 _Nota v2.3, mantida na v2.4 com escopo restrito: o escopo OAuth `review.read` (ou equivalente) permanece relevante apenas para o campo Avaliação no canal **TikTok** (HT-04) — para Wake e Shopee, Avaliação já é confirmada via API sem escopo adicional documentado (Souza, Seções 7.1/9.1)._

* * *

4.  Personas e Jobs to be Done

* * *

> **Framework:** Persona (quem) + JTBD (qual progresso busca). JTBD protagonista; persona é contexto. Produto novo em ecossistema conhecido — JTBD completo aplicável.

**Persona 1 — Influenciadora Ativa da Rede Club**
*   Quem é: Parceira da rede Club Brasil que já tem catálogo de produtos e canal de suporte, vende via múltiplos canais e monitora ganhos no Escritório Virtual.
*   JTBD: "Quando quero divulgar um produto para minha audiência em múltiplos canais, quero compartilhar um único link que garanta minha comissão independentemente de onde o cliente comprar, para que eu possa focar em vendas sem me preocupar com qual canal o cliente vai escolher." **Persona 2 — Gestor**
*   Quem é: Acumula a role de Influenciadora. Comportamento idêntico no HUB — acessa e gera links da mesma forma.
*   JTBD: "Quando quero divulgar um produto para minha audiência em múltiplos canais, quero compartilhar um único link que garanta minha comissão independentemente de onde o cliente comprar, para que eu possa focar em vendas sem me preocupar com qual canal o cliente vai escolher." **Persona 3 — Cliente Final (consumidor anônimo)**
*   Quem é: Consumidor que recebe o link da influenciadora via redes sociais, WhatsApp ou lives e quer comprar pelo canal mais vantajoso.
*   JTBD: "Quando recebo a indicação de um produto, quero comparar preço e frete entre os canais disponíveis e comprar no que me for mais conveniente, para que eu não precise pesquisar por conta própria nem abrir mão das condições de quem me indicou." A seção de identificação do influencer (RF-12) atende diretamente a segunda metade deste JTBD — "sem abrir mão das condições de quem me indicou" — dando ao cliente a confirmação visual de que a indicação está preservada. **Persona 4 — Escritório Virtual (sistema interno)**
*   Quem é: Sistema interno responsável por comissionamento, conciliação, payout e front da influenciadora. É a fonte de identidade e catálogo para o HUB.
*   JTBD: "Quando a influenciadora precisa do link de um produto, quero consultar um endpoint simples do HUB e receber o link pronto para exibir, para que eu não precise replicar a lógica de geração de links nem manter dados de canal." **Persona 5 — Admin / Admin2 do Escritório Virtual (origem: apresentação de POC + decisão do Head de Produto, 05/08/2026)**
*   Quem é: Roles administrativas já existentes no Club Brasil (Admin, Admin2), que passam a operar também a configuração do HUB através de uma interface alocada no Escritório Virtual — não é uma persona nova para o Club, é uma capacidade nova para uma persona já existente, aplicada a este produto.
*   JTBD: "Quando preciso que um produto apareça corretamente no comparador do HUB, quero habilitá-lo e, quando necessário, ajustar o que a integração automática trouxe — corrigindo um dado desatualizado, generalizando em tiers ou marcando um lançamento — para que o cliente final veja uma página completa e confiável, mesmo com as limitações técnicas atuais das integrações." 🔄 _JTBD ajustado na v2.4 — antes o admin "preenchia" um campo vazio; agora o admin, na maioria dos casos, tem um valor automático já disponível e decide se mantém ou sobrescreve (override), não parte de uma tela em branco._

* * *

5.  Princípios de Produto

* * *

**Inegociável:**
*   O acesso do cliente ao comparador é público — sem autenticação, sem fricção
*   A influenciadora não tem área logada no HUB; opera no front do Escritório Virtual, que consome endpoints do HUB. A seção de dados do influencer no comparador (RF-12) é exibição pública ao cliente — não é área logada nem interface operacional da influenciadora; não altera este princípio.
*   O HUB não calcula comissão, não processa pagamento e não exibe ganhos — domínio exclusivo do Escritório Virtual
*   O vínculo do parceiro (creator/affiliate) deve ser garantido em qualquer canal que o cliente escolher
*   O HUB compõe o vínculo de cada canal automaticamente — a influenciadora não gera nem registra links manualmente
*   O v1 é Brasil apenas, roles Influenciadora e Gestor apenas
*   O HUB continua headless e sem front-end próprio para nenhum operador — incluindo o admin.
*   🆕 _v2.4: a ordenação do comparador (RF-06) permanece imune a qualquer override administrativo — Estoque, Avaliação e Volume de Vendas podem ser sobrescritos pelo admin para fins de exibição, mas **nenhum override altera a lógica de ordenação por menor preço + frete**. Overrides de exibição e critério de ranqueamento são eixos independentes; misturá-los reabriria o mesmo risco já descartado na decisão de RF-06 (Seção 13, v2.3)._ **Fora do produto:**
*   Cálculo, exibição ou pagamento de comissão (Escritório Virtual)
*   Checkout ou processamento de pagamento (plataformas de destino)
*   Reconciliação de venda e atribuição financeira (B2C existente)
*   Feed push de links ao Escritório (substituído por consulta sob demanda a endpoint simples)
*   Painel de administração **próprio do HUB** — o HUB não ganha front-end direto para nenhum operador. Uma interface administrativa existe no Escritório Virtual (roles Admin/Admin2), consumida pelo HUB via extensão do contrato D-01 (bidirecional). Ver RF-13 e decisão registrada na Seção 13.
*   Notificações próprias do HUB
*   Integração com Mercado Livre (fase 2)
*   Internacionalização (Club Internacional / Shopify)
*   Antifraude avançado (Escritório Virtual / fase 2)
*   Personalização visual avançada por influenciadora (cores, tema) — fora do v1
*   Rastreio individual de clique/acesso do cliente (UTM, pixel, analytics identificável) — vetado até decisão de Q-16
*   🔄 _v2.4: **trilha de auditoria dedicada** para ações administrativas do HUB — avaliada nesta rodada e descartada; decisão consciente do Head, reafirmando a posição original (Seção 13, v2.3). O que permanece: motivo obrigatório no registro do override para Avaliação e Volume de Vendas (campo do registro atual, não histórico)._

* * *

6.  Proposta de Valor

* * *

Enquanto o modelo atual obriga a influenciadora a direcionar manualmente o cliente para um único canal (Loja Ybera) e perde a atribuição em qualquer venda fora desse fluxo, o HUB Inteligente entrega para a influenciadora um link único com vínculo de parceiro garantido em qualquer canal, e para o cliente a liberdade de comparar preço e frete e comprar onde preferir — com a indicação de quem recomendou visível na página — sem retrabalho, sem perda de comissão, sem depender do canal. Onde a integração dos marketplaces ainda não expõe determinado dado, ou onde o dado bruto não é a melhor forma de comunicar ao cliente (caso de Estoque e Volume de Vendas, generalizados em tiers), o Hub garante que a página comparativa chegue completa e legível ao cliente, com curadoria editorial do time Ybera disponível como camada de ajuste sobre a integração automática — sem depender exclusivamente da evolução das APIs de terceiros para lançar com uma experiência completa.

* * *

7.  Escopo de Capacidades

* * *

> Macro-funcionalidades do produto. O detalhamento técnico vive nas Features derivadas.

**Comparador público (cliente anônimo)** Comparação do mesmo produto entre os 3 canais disponíveis (Wake, Shopee, TikTok Shop), ordenada por menor custo-benefício, acessível via link sem login. Canais indisponíveis são ocultados graciosamente. A resolução de qual produto exibir em cada canal usa o SKU interno Ybera como chave única — o mesmo SKU vale nos três canais. A exibição de um produto no comparador depende de **habilitação individual pelo admin** (RF-13) — opt-in por produto, controlado via Interface Administrativa no Escritório Virtual. 🔄 **Taxonomia de campos do card de comparação (v2.4 — revisa v2.3, reabre e fecha novamente Q-19):**
*   🔄 **Preço — sem mudança.** **Frete e Prazo de Entrega — revisados (v2.6, fecha Q-13):** dependem de **CEP informado pelo cliente**. Antes do CEP ser informado, os dois campos exibem um estado de espera (ex.: "Informe seu CEP para ver o frete") — não é o mesmo estado de "Não informado" (que continua reservado para quando o canal genuinamente não expõe o dado via API, ex.: Prazo de Entrega ausente em qualquer canal, ou Frete no TikTok). Depois do CEP informado: resolve normalmente pela taxonomia já existente — valor da API quando disponível, "Não informado" quando o canal não expuser, exceção de Frete no TikTok mantida. Decisão fecha a Q-13 — sem CEP, não há tentativa de usar CEP fixo de referência.
*   🔄 **Estoque — fechado na v2.7 (Q-23).** Disponível via API confirmada nos **3 canais**. Exibido no comparador **não como número exato**, mas como **tier generalista**: **Disponível · Últimas Unidades · Indisponível**. Limiares configuráveis (não hardcoded), por canal — proposta provisória em "Limiares de tier de Estoque" abaixo, a validar com dado real. O admin pode sobrescrever o tier calculado automaticamente (override), com TTL próprio configurável — ver "Interface Administrativa" abaixo. Sem motivo obrigatório no override deste campo. ⚠️ **Ressalva técnica confirmada por Engenharia:** no TikTok, o lado que também traz Volume de Vendas (Open Collaboration, `has_inventory`) só devolve estoque **booleano** — sem o lado seller (`Search Products`/`Get Product`, numérico), o tier "Últimas Unidades" é inalcançável para esse canal, restando só Disponível/Indisponível. O tier completo no TikTok exige combinar as duas fontes. Estoque também pode vir repartido por armazém (`warehouse_id`) — regra de agregação (somar tudo, ou só armazéns que atendem o CEP do cliente) precisa existir antes do primeiro cálculo de tier.
*   🔄 **Imagem — revisado (v2.4, resolve parte da Q-19):** disponível via API confirmada nos **3 canais** (mesma chamada de Preço em Shopee/TikTok; já usada para o produto de referência na Wake). Admin pode sobrescrever (override) se a imagem do canal estiver errada ou ausente; se ausente e sem override, usa a imagem do produto de referência (Wake) já exibida no topo da página. Sem motivo obrigatório.
*   🔄 **Avaliação — fechada na v2.7 (Q-H, a partir de HT-04).** Disponível via API confirmada em **Wake e Shopee** (estrelas reais — nota média). No **TikTok, não existe fonte de API em lugar nenhum** — HT-04 varreu a API Reference completa do Partner Center e confirmou ausência definitiva, não é mais "pendente de validação". **Decisão do Head: admin insere manualmente no TikTok, de forma permanente** — não é mais um fallback temporário "até HT-04 fechar". **Sem tier** — exibida sempre como nota real (estrelas), nunca generalizada. Admin pode sobrescrever o valor vindo da API em Wake/Shopee, ou inserir diretamente no TikTok — **motivo obrigatório em ambos os casos**, dado o risco de manipulação de prova social. TTL default mais longo (ver "Interface Administrativa" abaixo), configurável.
*   🔄 **Volume de Vendas — fechado na v2.7 (a partir de HT-06 e da decisão de Q-18 = Open Collaboration).** Disponível via API confirmada na **Shopee** (`sale`, total acumulado) e agora também no **TikTok**, via o endpoint de Open Collaboration (`units_sold`, também total acumulado — sem janela de período). **A assimetria de janela entre Shopee e TikTok, que exigia limiares de tier diferentes por canal, deixou de existir** — os dois canais agora usam a mesma lógica de acumulado. Na **Wake**, sem fonte de API (gap real, confirmado pelo Discovery) — sempre manual. Exibido como **tier**: **Campeão de Vendas · Mais Vendido · Lançamento · (nada)** — nunca como número exato. Hierarquia entre os tiers calculados automaticamente: Campeão de Vendas > Mais Vendido > (nada). **Lançamento é uma tag estritamente administrativa** — não é calculada por data nem por volume; o admin a atribui manualmente a qualquer produto/canal, inclusive para marcar um **relançamento**, independentemente do histórico real de vendas. Override de Campeão de Vendas/Mais Vendido sobre um valor que a API já calculou — **motivo obrigatório**. Limiares numéricos de conversão para Campeão de Vendas/Mais Vendido: ver "Parâmetros do Tier de Volume de Vendas" abaixo — hipótese provisória, a validar no 1º ciclo com dado real de catálogo, agora com base unificada entre Shopee e TikTok.
*   **Parcelamento (Q-20, sem mudança na v2.4):** campo admin-only, tipicamente Wake, texto estático (ex.: "Parcelamento sem juros"). Sem fonte de API em nenhum canal, conforme decisão do Head (v2.3) — nota: esta constatação não tem lastro direto no Discovery de Engenharia (Souza, v0.5), que não pesquisou este campo especificamente; mantida por decisão de Produto, sem contestação técnica levantada nesta rodada.
*   **Campos exclusivos por canal (via API), sem fallback:** aparecem apenas no card do canal que os expuser via integração, sem fallback (ex.: cupom, voucher). Distintos dos campos acima. **Interface Administrativa do HUB — capacidade revisada na v2.4** Tela alocada no **Escritório Virtual** (roles Admin/Admin2), consumida pelo HUB via extensão do contrato D-01 (bidirecional). Permite:
*   Habilitar/desabilitar produtos individualmente para exibição no comparador — gate obrigatório
*   Cadastrar tags configuráveis por oferta/plataforma (ex.: "desconto no Pix", "mais brinde", "desconto progressivo")
*   🔄 **Override de campos com fonte de API** (Estoque, Imagem, Avaliação, Volume de Vendas) — o admin visualiza o valor/tier que a API/cálculo automático produziu e pode substituí-lo. Cada override tem:
    *   **TTL configurável pelo próprio admin no momento do override** — não é mais um valor fixo de sistema. Opções: número de dias específico (default sugerido: 48–72h para Estoque; 15–30 dias para Avaliação e Volume de Vendas — pré-preenchido, editável), **sem expiração** (permanente até remoção manual), ou **ocultar o campo** enquanto o override estiver ativo (não exibe nem o valor da API nem um valor manual — campo simplesmente não aparece no card).
    *   **Motivo obrigatório** apenas para override de Avaliação e Volume de Vendas (campos de prova social). Não obrigatório para Estoque e Imagem.
    *   Ao expirar o TTL, o override é descartado automaticamente e o campo volta a refletir o valor/tier calculado pela API — sem necessidade de ação do admin.
*   Preencher manualmente Parcelamento (Q-20, sempre admin-only, sem override de API porque não há fonte de API)
*   Configurar um **timer de escassez** por oferta (tempo de permanência exibido no card) — mecanismo de conversão, **sem vínculo com garantia de preço**. Coexiste com o disclaimer de variação de preço (RNF-Transparência); ver Q-22 na Seção 11 No v1, os campos com fonte de API (Estoque, Imagem, Avaliação, Volume de Vendas em Shopee) já chegam preenchidos automaticamente — o admin intervém por excepcionalidade (override), não por obrigação de preenchimento. Apenas Volume de Vendas na Wake e, condicionalmente, Avaliação/Volume de Vendas no TikTok (até HT-04/HT-06 fecharem) dependem de preenchimento manual como única fonte. **Parâmetros do Tier de Volume de Vendas (v2.4 — hipótese provisória, a validar no 1º ciclo com dado real de catálogo):**
*   **Shopee (fonte: API, total acumulado):** Campeão de Vendas ≥ 500 unidades · Mais Vendido 100–499 unidades · (nada) < 100 unidades
*   **TikTok (fonte: API, janela de período — pendente HT-06):** Campeão de Vendas ≥ 100 unidades no período · Mais Vendido 30–99 · (nada) < 30 — thresholds relativos à janela, não ao acumulado; sujeitos a ajuste quando HT-06 fechar
*   **Wake (sem API):** admin escolhe o tier manualmente, ou deixa sem selo
*   **Lançamento:** disponível em qualquer canal, sempre manual, independente dos limiares acima **Limiares de tier de Estoque (v2.4 — proposta provisória, ver Q-23):**
*   **Disponível:** > 5 unidades (ou flag "disponível" quando o canal só retornar booleano, sem quantidade)
*   **Últimas Unidades:** 1 a 5 unidades
*   **Indisponível:** 0 unidades, ou flag "disponível: não" **Produto de referência no topo da página (origem: Discovery §2)** O topo da página exibe o produto base usado para localizar e comparar as informações nos marketplaces: **nome do produto, imagem, SKU/identificador interno** — origem dos dados: plataforma Wake (ybera.com). A chave de correspondência entre canais é o SKU interno Ybera (invariante — Q-08 fechada; ver nota de rastreabilidade na Seção 3). **Identificação do Influencer na página (origem: Discovery §3 + decisão de escopo do Head de Produto, 24/07/2026)** A página do comparador exibe a seção de quem indicou o produto ao cliente: **nome do influencer · foto · @ (handle, quando houver) · status (ex.: PRO, ativo) · link de indicação rastreável**. Os dados são consumidos do **B2C existente**, via o mesmo contrato de API do Escritório Virtual (D-01, ampliado). Degradação graciosa: se os dados de exibição não retornarem, a página carrega sem a seção, sem bloquear a comparação e a compra. **Link encurtado de compartilhamento** A influenciadora compartilha um único link curto (ex.: `hub.ybera.com/r/abc123`) que carrega apenas dois parâmetros: produto e influenciadora. Canal não faz parte do link. Ao abrir, o cliente cai na página de comparação; o HUB resolve os parâmetros e gera os links de destino por canal com a atribuição correta embutida. ✅ _Embalagem do link fechada como slug encurtado (Q-09)._ **Geração de links com vínculo de parceiro** Quando a página de comparação carrega, o HUB gera os links de destino para cada canal carregando o vínculo correto do parceiro — TikTok (Creator, via Affiliate API obrigatória), Shopee (Affiliate, via Affiliates API — ✅ Q-10 fechada), Wake (atribuição nativa via montagem de URL). Link bloqueado para canais onde a influenciadora não possui vínculo ativo. _Nota v2.0: no TikTok, o produto precisa estar elegível para afiliados antes da geração de link — via Open Collaboration ou Target Collaboration. ✅ **Fechado na v2.7: Open Collaboration adotado (Q-18)** — qualquer creator do TikTok pode promover o produto habilitado, sem convite individual; consequência direta: destrava o endpoint que também resolve Volume de Vendas (ver taxonomia abaixo)._ **🔄 Mecanismo de frete por canal — fechado na v2.7 (Q-E + Q-F, a partir da avaliação de Engenharia, Souza 14/08/2026)** Com o CEP do cliente obrigatório (Q-13), a resolução de Frete passou a ser específica por canal, fechada nesta versão:
*   **Wake — resolvido, implementação direta.** `POST /fretes/cotacoes` aceita o CEP real e devolve valor + prazo + transportadora numa chamada. Cache técnico recomendado por Engenharia: por SKU × faixa de CEP de 5 dígitos (não CEP completo), TTL 12–24h, single-flight por chave, entrega assíncrona como 2ª fase da UI (o comparador renderiza sem frete, a cotação chega depois — não compete com LCP/TTI).
*   **Shopee — via API, sempre rotulado "Aproximado".** `estimated_shipping_fee` vem no mesmo payload já consumido para Preço/Estoque/Imagem, sem custo adicional de chamada — mas não usa o CEP real do comprador, por isso o rótulo é obrigatório.
*   **TikTok — sem API. Admin pode inserir manualmente** (rotulado "Aproximado" quando inserido). Se não inserido, opção de referenciar o frete de outro canal disponível para aquele produto. Sem nenhum dos dois, o campo fica sem informação.
*   **Simulação de POST / scraping — descartada para o v1**, para Shopee e TikTok. Posição de Engenharia: o caminho não-oficial já documentado (Discovery, Shopee) tem latência perceptível e rate limit não documentado — desproporcional ao ganho de precisão em 2 de 3 canais, dado que a viabilidade inteira do produto depende de parceria oficial com esses marketplaces. Se a imprecisão for considerada inaceitável no futuro, a rota é uma POC dedicada de rate limit antes de virar escopo.
*   **Ordenação (RF-06) — só combina canais com informação mínima de frete.** Canais sem nenhuma informação de frete (nenhuma das fontes acima) ficam fora da comparação combinada "menor preço + frete" — evita que a ausência de frete distorça artificialmente o ranking a favor de um canal.

**Endpoint de link para o Escritório Virtual** O Escritório Virtual consome um único endpoint do HUB — `GET /link?produto=X&influenciadora=Y` — e recebe o link de compartilhamento pronto para exibir à influenciadora. ⚠️ _SLA de resposta (p95 < 500ms) depende de resolução de arquitetura entre cache pré-aquecido e busca sob demanda — decisão técnica a fechar no desenho da Feature._ **🆕 Agendamento de mudança de preço ("cadeado") — origem: ata da apresentação de POC, 05/08/2026** Cenário levantado na reunião: quando uma promoção está programada para começar em um horário específico (ex.: meio-dia), o preço novo precisa estar pronto no sistema antes, mas "trancado" (não exibido) até o horário de início — para não expor o preço da promoção antes da hora nem depender de uma atualização manual exatamente no momento do lançamento. **Não decidido nesta versão** — registrado como nova hipótese técnica para Engenharia dimensionar (ver Brief de Engenharia, HT-10). **🆕 Botão de atualização manual de preço pelo cliente — origem: ata da apresentação de POC, 05/08/2026** Distinto da sugestão de fetch síncrono já avaliada e recusada (Seção 13, v2.3): aqui, o comparador continua servido por cache/sincronização periódica (RF-07 inalterado), mas o **cliente**, ao ver um preço potencialmente desatualizado no seu próprio cache local, teria um botão para forçar um novo fetch. A reunião mostrou concordância verbal sobre a ideia, mas isso **não foi registrado como decisão formal de Produto** em nenhuma rodada até esta versão. Fica pendente de confirmação explícita do Head antes de entrar como RF novo — ver nota na Seção 13. **Sincronização periódica de dados via API (cache)** 🔄 _v2.4: escopo ampliado — a sincronização agora cobre, além dos três campos comuns via API (Preço, Frete, Prazo de Entrega): **Estoque e Imagem nos 3 canais**; **Avaliação em Wake e Shopee**; **Volume de Vendas na Shopee**. **Não cobre**: Volume de Vendas na Wake (sem fonte de API — sempre manual); Avaliação e Volume de Vendas no TikTok enquanto HT-04/HT-06 não fecharem (tratamento manual provisório); Parcelamento (sempre admin-only, Q-20)._ Defasagem máxima de 30 min por canal para os campos cobertos pelo sync. Atualização manual disponível via endpoint consumível pelo Escritório. **Status de integração por canal** Exposição via endpoint do status de vínculo da influenciadora por canal. **Onboarding e validação de vínculo** Registro e validação do vínculo da influenciadora como creator TikTok e afiliada Shopee. **Renovação de autorização do afiliado** Manutenção da autorização OAuth do afiliado ao longo do tempo, sem exigir reautorização manual a cada expiração de token. Ver RF-11.

* * *

8.  Requisitos Funcionais e Não Funcionais

* * *

> Nível estratégico — o que o produto precisa fazer e quais restrições técnicas são inegociáveis. O detalhamento técnico (RFs granulares, Gherkin, RNs por módulo) vive nas Features derivadas.

**Requisitos Funcionais**
*   **RF-01 — Endpoint de link para o Escritório:** expor endpoint `GET /link?produto=X&influenciadora=Y` devolvendo o link de compartilhamento pronto · Must
*   **RF-02 — Geração de link encurtado:** gerar link curto persistido no backend · Must
*   **RF-03 — Bloqueio por ausência de vínculo:** bloquear a geração de link de um canal quando não há vínculo ativo · Must
*   **RF-04 — Composição de link por canal:** compor automaticamente o link de destino de cada canal com o vínculo correto do parceiro · Must
*   **RF-05 — Comparador público:** comparar o mesmo produto entre canais para o cliente anônimo, sem login · Must. 🔄 Escopo revisado (v2.7): Preço via API com fallback "Não informado"; **Frete depende de CEP e é rotulado por canal** (Wake exato; Shopee "Aproximado"; TikTok "Aproximado" se admin inserir, ou referência a outro canal, ou sem informação — Q-E/Q-F fechadas); **Estoque e Volume de Vendas exibidos como tier** (não número), calculados automaticamente via API onde disponível (Volume de Vendas agora unificado Shopee+TikTok via Open Collaboration), com override administrativo configurável (TTL próprio); **Avaliação exibida como estrelas reais**, via API em Wake/Shopee, com override (motivo obrigatório); no **TikTok, admin insere manualmente de forma definitiva** (motivo obrigatório também, HT-04 fechada sem API); Parcelamento admin-only (Q-20); campos exclusivos por canal via API quando existirem. Exibição de qualquer produto depende de habilitação prévia pelo admin (RF-13).
*   **RF-06 — Ordenação e ocultação:** esconder canal sem preço/estoque/vínculo válido e ordenar por menor preço + frete · Must. Reafirmado sem viés comercial (v2.3) — nenhum override administrativo altera a lógica de ordenação. Ordenação em duas fases mantida (antes do CEP: só preço; depois do CEP: preço + frete). 🔄 **Q-E fechada (v2.7):** só entram na comparação combinada "menor preço + frete" os canais com informação mínima de frete (exata, aproximada, ou referenciada — ver Seção 7); canal sem nenhuma informação de frete fica fora dessa comparação combinada, para não distorcer o ranking a favor de um canal sem esse dado.
*   **RF-07 — Sincronização periódica:** sincronizar via API dos canais (cache) os dados que possuem fonte de API · Must. 🔄 _Escopo v2.7: **frescor por campo (Q-D fechada)** — Preço, Estoque e Frete (Wake) a cada 30 min; Imagem, Avaliação e Volume de Vendas em ciclo diário. No TikTok, usar `Search Products` paginado para o ciclo de 30 min (Preço/Estoque/de-para SKU), não `Get Product` por SKU — reduz o ciclo de ~500 para ~5 chamadas. Não cobre Volume de Vendas na Wake (sempre manual), nem Parcelamento (sempre manual). 🔄 **Correção de arquitetura (HT-09, Souza):** o sync sempre grava o valor da API no cache — o override é aplicado apenas na camada de composição/exibição, nunca suprime a escrita do sync. Isso torna a expiração do TTL instantânea, sem a janela de até 30 min sem dado que a formulação anterior criava._
*   **RF-08 — Redirecionamento:** redirecionar o cliente à página do produto no canal escolhido com vínculo preservado · Must
*   **RF-09 — Onboarding e validação de vínculo:** registrar e validar o vínculo da influenciadora por canal · Must
*   **RF-10 — Endpoint de status de integração:** expor via endpoint o status de integração por canal · Must
*   **RF-11 — Renovação de token OAuth do afiliado:** manter o token de autorização do afiliado renovado automaticamente para Shopee e TikTok · Must
*   **RF-12 — Exibição de dados do Influencer no comparador:** exibir nome, foto, @, status do influencer, consumidos do B2C via contrato do Escritório (D-01) · Must
*   **RF-13 — Interface administrativa do HUB no Escritório Virtual:** 🔄 _Revisada v2.4._ Expor no Escritório Virtual (roles Admin/Admin2): habilitação de produto; tags configuráveis; **override de Estoque, Imagem, Avaliação e Volume de Vendas** sobre o valor/tier já calculado automaticamente, com **TTL configurável pelo admin** (dias específicos, permanente, ou ocultação do campo) e **motivo obrigatório** apenas para Avaliação e Volume de Vendas; preenchimento manual de Parcelamento (sempre admin-only); tag manual de **Lançamento** (Volume de Vendas — inclui relançamento, sem cálculo automático); timer de escassez por oferta. O contrato D-01 permanece bidirecional. 🔄 _v2.4: RNF de auditoria dedicada foi avaliada e **descartada** — o mecanismo herda a autenticação e trilha já existente no Escritório Virtual, sem histórico próprio de alterações administrativas do HUB. Motivo obrigatório (Avaliação/Volume de Vendas) é um campo do registro atual, não uma trilha histórica._ · Must **Requisitos Não Funcionais**
*   **RNF-Performance:** comparador mobile-first (4G); LCP < 2,5s · TTI < 3,5s · resposta do comparador (cache) p95 < 500ms — condicionado à decisão de arquitetura entre cache pré-aquecido e busca sob demanda. 🔄 _v2.4: imagens agora vêm via API nos 3 canais (não mais admin-only) — a nota anterior sobre proxy de imagem para CDN do TikTok volta a ser relevante para o v1, não apenas para automação futura._
*   **RNF-Segurança:** integridade do link via assinatura/HMAC; endpoints autenticados, idempotentes e rate-limited; segredos de API em cofre; sem dados de pagamento no HUB. 🔄 **Correção factual v2.7 (HT-08, Souza):** a premissa "herda trilha de auditoria do Escritório" estava **pela metade** — o Escritório herda **autenticação e roles**, mas **não existe trilha de auditoria genérica herdável nenhuma**; o que existe lá é um padrão caso a caso, tabela por domínio (ex.: `USR.UserAccountLog`, com autor/timestamp/motivo). Sem trilha dedicada continua sendo a decisão do Head — mas a forma de mitigar mudou: **estampar autoria (`ExecutorUserId`) e timestamp (`DateActionUTC`) no próprio registro do override**, seguindo o mesmo padrão já usado no repo. Isso não é trilha histórica (não guarda valor anterior, não cria tabela de histórico) e não reabre a decisão do Head — resolve a órfandade do motivo obrigatório, que hoje ficaria sem autor nem data. Custo de implementação: praticamente zero.
*   **RNF-Escalabilidade:** carga de sincronização escala por catálogo × canais, não por nº de influenciadoras. 🔄 _v2.4: o escopo de sync ampliado (Estoque/Imagem/Avaliação/Volume de Vendas) precisa ser dimensionado — para Shopee e TikTok, Estoque e Imagem vêm no mesmo endpoint já usado para Preço (sem custo adicional de chamada); Avaliação e Volume de Vendas na Shopee usam endpoint adicional (`get_item_extra_info`); Volume de Vendas no TikTok, se/quando habilitado, usa Analytics API com custo de chamada próprio._
*   **RNF-Resiliência:** sincronização periódica (não tempo real); retry/backoff e circuit breaker por canal; tolerância a rate limits e a mudanças de API.
*   **RNF-Privacidade / LGPD:** comparador não coleta dado pessoal do cliente; CEP transitório, não armazenado; sem fingerprinting; sem rastreio individual até decisão de Q-16. Campos de Estoque/Avaliação/Volume de Vendas (tier ou override) não são dado pessoal — atributos de produto/oferta.
*   **RNF-Disponibilidade:** degradação graciosa — se um canal cai, esconder e servir cache; alvo 99% no comparador público.
*   **RNF-Frescor de dados — fechado na v2.7 (Q-D).** Não é mais um valor único de 30 min para tudo. **Preço, Estoque e Frete (Wake):** 30 min. **Imagem, Avaliação e Volume de Vendas:** ciclo diário. Corte segue o custo real de chamada — os três primeiros vêm do endpoint barato e paginado do sync; os três últimos exigem chamada própria por produto ou endpoint separado, e não mudam em 30 minutos. Volume de Vendas na Wake e campos sob override administrativo não têm defasagem por sync — o override é aplicado na camada de composição (não suprime a escrita do sync), e expira instantaneamente quando o TTL vence.
*   **RNF-Transparência de Preço e Condições:** o comparador deve informar de forma visível que preços e condições exibidos estão sujeitos a alterações nas plataformas de origem sem aviso prévio. Coexiste com o timer de escassez configurável (RF-13). Texto exato e posicionamento visual são decisão de Design — ver Q-22.

* * *

9.  Métricas de Sucesso e BVS

* * *

### North Star

*   **Métrica:** GMV da rede via HUB (origem rastreada, todos os canais)
*   **Como medir:** Affiliate reporting das plataformas reconciliado no B2C/Escritório Virtual
*   **Meta:** A definir após consolidação do baseline — sem baseline hoje

### Métricas de Suporte

**Adoção da rede**
*   Como medir: Influenciadoras que geraram ≥ 1 link via HUB no período
*   Meta: ≥ 700 influenciadoras ativas no 1º ciclo (≈ 30 dias) **Conversão do comparador**
*   Como medir: Visitas → clique em canal → compra confirmada (via affiliate reporting)
*   Meta: A definir após baseline. **% de vendas fora da Loja Ybera via HUB**
*   Como medir: Affiliate reporting Shopee + TikTok reconciliados no Escritório
*   Meta: A definir — indicador primário de validação da hipótese-mãe **Custo de comissão complementada por canal**
*   Como medir: Escritório Virtual / Financeiro
*   Meta: A definir — guarda-corpo de margem **Taxa de erro de atribuição**
*   Como medir: % de links sem retorno de atribuição no affiliate reporting
*   Meta: < 2% (P0 de operação) **Taxa de produtos habilitados sobre catálogo total**
*   Como medir: produtos habilitados no HUB via Interface Administrativa ÷ catálogo total elegível
*   Meta: A definir — indicador operacional de adoção da curadoria pelo admin **🆕 Precisão dos limiares de tier (Estoque e Volume de Vendas) — origem: v2.4**
*   Como medir: frequência de override administrativo sobre Estoque e Volume de Vendas nos canais com fonte de API confirmada (Shopee, e Wake/TikTok quando aplicável) — override recorrente sobre o mesmo produto/tier é sinal de limiar mal calibrado (Q-23 e parâmetros de Volume de Vendas, Seção 7)
*   Meta: A definir — indicador de calibração, não de sucesso do produto em si; usar para revisar os limiares provisórios ao fim do 1º ciclo **Meta do 1º Ciclo:** ≥ 700 influenciadoras usando o HUB em ≈ 30 dias, com primeiras vendas rastreadas fora da Loja Ybera e hipótese-mãe respondida. Ao fim do ciclo, a decisão é: escala, pivota ou para.

### BVS — Business Value Score

_BVS = Impacto × Urgência × Confiança × Valor Estratégico (faixa 1–375)_
*   **Impacto:** 4/5 — camada de crescimento sobre canais que já vendem; impacto forte e direto na receita, sem ser load-bearing
*   **Urgência:** 5/5 — diretriz direta da Diretoria/sócios + quadrante de mercado vazio
*   **Confiança:** 3/5 — requisitos mapeados, atribuição mitigada e baseline acessível; hipótese-mãe ainda não validada impede nota 4. 🆕 _Nota v2.4, não decidida — apenas sinalizada: a revisão da Q-19 **reduz** o esforço manual do RF-13 (a maioria dos campos passa a vir de API automaticamente, admin intervém por excepcionalidade), o que tenderia a aumentar a Confiança isoladamente. Em contrapartida, a arquitetura de override com TTL configurável e a lógica de tier (Estoque/Volume de Vendas) são escopo técnico novo, não validado por Engenharia até este momento — o efeito líquido não foi calculado automaticamente; fica para o Head avaliar se o saldo justifica revisão da nota, após retorno de Engenharia sobre viabilidade do TTL configurável (ver HT-09 no Brief de Engenharia)._
*   **Valor Estratégico:** 3/3 — origem na Diretoria/sócios; alinhamento direto com a estratégia multicanal
*   **BVS Total: 180** · **T-Shirt: GG — confirmado por Engenharia (Souza, 14/08/2026), 2–4 meses.** Validação por capacidade e por repo entregue (ver Brief de Engenharia v1.8). ⚠️ **Tensão registrada, não reconciliada:** o horizonte H1 de "~30 dias" (Seção 12) não comporta este T-Shirt — o Head decidiu manter a meta de ~30 dias como aposta consciente (Q-G, Seção 11), não como estimativa revisada.

* * *

10.  Riscos Estratégicos e Mitigações

* * *

**Hipótese-mãe não validada**
*   Tipo: Negócio · Probabilidade: Média · Impacto: Alto
*   Mitigação: O 1º ciclo é o teste — dados do HUB + escuta estruturada respondem a hipótese. **APIs de afiliado gated (critical path)**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Alto
*   Mitigação: Iniciar credenciamento imediatamente (Shopee AMS e TikTok Affiliate Seller API). **Identity resolution falha**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Alto
*   Mitigação: Chave única (e-mail/documento) coletada no onboarding. Reconciliação manual no Escritório como fallback. **🔄 Refresh de token OAuth — retratado na v2.7 (R-01, Souza).** *Tipo: Técnico · Probabilidade: Baixa (era "Confirmada") · Impacto: Baixo (era "Alto").*
*   A premissa anterior estava errada: o ciclo completo de refresh **já existe pronto e maduro** — Shopee no B2C-BackEnd (autorização, callback, refresh com lock distribuído em Redis, expiração e status persistidos) e TikTok no B2C-OrderHub. O que falta é bem menor que "construir o refresh": trocar a chave de `ShopId` para a identidade da afiliada, mais cobrir o `affiliate_creator`. Deixa de ser caminho crítico e deixa de ser pré-requisito de go-live no sentido em que estava registrado.
*   Mitigação: estender o padrão existente para a identidade de afiliado — RF-11 permanece Must, mas com esforço P–M, não M como antes. **✅ TikTok Shop não expõe frete nem prazo de entrega via API — mitigação decidida**
*   Tipo: Técnico / Produto · Probabilidade: Confirmada · Impacto: Baixo-Médio
*   Mitigação decidida: Frete no TikTok usa nota específica; Prazo de Entrega ausente usa fallback "Não informado". **Autorização individual de afiliado (OAuth) exigida em dois canais gated**
*   Tipo: Operacional / Comercial · Probabilidade: Alta · Impacto: Alto
*   Mitigação: escalonamento em curso — Rolim, Romulo Alves e Vinícius Graff. Ver Q-11. **Incerteza sobre cobertura real de afiliadas nos dois canais gated**
*   Tipo: Negócio · Probabilidade: Alta · Impacto: Médio-Alto
*   Mitigação: escalonamento em curso. Ver Q-12. **Rastreabilidade de clique/acesso tensiona a postura LGPD-mínima**
*   Tipo: Legal / Produto · Probabilidade: — (decisão pendente) · Impacto: Alto se aprovada sem revisão
*   Mitigação: nenhum mecanismo de rastreio entra antes de Q-16. **Preço "de" no TikTok disponível apenas via fluxo composto**
*   Tipo: Técnico · Probabilidade: Confirmada · Impacto: Médio
*   Mitigação: quando não houver promoção ativa, não exibir linha de desconto. **Políticas dos marketplaces mudam unilateralmente**
*   Tipo: Externo · Probabilidade: Alta · Impacto: Médio
*   Mitigação: sincronização resiliente, circuit breaker, monitorar changelogs. **Reabertura LGPD**
*   Tipo: Legal · Probabilidade: Baixa (condicional a Q-16) · Impacto: Médio
*   Mitigação: v1 mantém postura mínima quanto ao cliente. Campos de Estoque/Avaliação/Volume de Vendas (tier ou override) não acionam o gatilho — não são dado pessoal. **🔄 Integridade de dados administrativos — reforçada na v2.4**
*   Tipo: Operacional / Produto · Probabilidade: Média · Impacto: Médio
*   Contexto: 🔄 _v2.4: o risco muda de natureza — antes, o admin apenas preenchia um campo vazio (sem dado concorrente); agora, com API como fonte primária, o admin pode **sobrescrever um valor que a própria API já trouxe correto**. Isso é uma superfície de risco maior que a original, especialmente em Avaliação e Volume de Vendas (campos de prova social)._
*   Mitigação: motivo obrigatório no override de Avaliação e Volume de Vendas (registro atual, não histórico); TTL configurável com expiração automática reduz o tempo de exposição a um override desatualizado; responsabilização do admin pela precisão do dado (decisão do Head). **Uma trilha de auditoria dedicada foi avaliada nesta rodada e descartada por decisão do Head** — risco mantido sem mitigação técnica adicional de rastreabilidade histórica; ponto a reavaliar se o volume de reclamações/disputas justificar mecanismo próprio. **🆕 Manipulação de prova social via override de Avaliação/Volume de Vendas (origem: discussão desta rodada, v2.4)**
*   Tipo: Produto / Ético-Comercial · Probabilidade: Baixa-Média · Impacto: Médio
*   Contexto: sem trilha de auditoria dedicada, um override de Avaliação ou Volume de Vendas que infle a percepção do produto (ex.: marcar "Campeão de Vendas" sem base real, ou aumentar a nota exibida) tensiona a mesma lógica que já levou à decisão de manter RF-06 sem viés comercial (Seção 13, v2.3) — só que por um campo diferente do ranqueamento.
*   Mitigação: motivo obrigatório funciona como fricção mínima, não como controle forte. Recomendação registrada (não decisão): considerar, em versão futura, algum teto de variação entre valor exibido e valor de API para Avaliação/Volume de Vendas, se o volume de overrides desse tipo se mostrar alto. **🆕 Limiares de tier sem baseline real (origem: v2.4)**
*   Tipo: Produto · Probabilidade: Alta · Impacto: Baixo-Médio
*   Contexto: os limiares numéricos propostos para os tiers de Estoque e Volume de Vendas (Seção 7) são hipótese provisória, sem validação contra o catálogo real. Podem gerar excesso de produtos em "Últimas Unidades" ou nenhum "Campeão de Vendas" se mal calibrados.
*   Mitigação: métrica de acompanhamento registrada na Seção 9 (frequência de override sobre tier calculado); revisão prevista ao fim do 1º ciclo. **🆕 Upsell/cross-sell entre versões do produto — não resolvido conceitualmente (origem: ata da apresentação de POC, 05/08/2026)**
*   Tipo: Produto / UX · Probabilidade: Alta · Impacto: Médio
*   Contexto: reconhecido na própria reunião como problema ainda sem solução — se o cliente quer comprar uma versão/variação diferente da que veio no link (ex.: outra cor, outro tamanho), ele precisa voltar à página inicial do comparador e refazer o fluxo, exceto dentro da Wake (ybera.com), onde o domínio do preço permite navegação nativa entre versões. Isso obriga o cliente a "fazer duas contas" em alguns casos (ex.: pedido dividido entre versões em canais diferentes).
*   Mitigação: nenhuma decidida até o momento. Registrado aqui para não se perder — decisão de arquitetura de informação (Produto + Design) fica para rodada futura, fora do escopo do v1 conforme discutido na própria reunião. **🆕 Contenção de QPS com a integração de pedidos em produção (origem: avaliação de Engenharia, Souza 14/08/2026)**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Alto
*   Contexto: a unidade mínima de isolamento de rate limit do TikTok é `App ID × Loja Autorizada` — o HUB usaria a mesma app key e a mesma loja da integração de pedidos que já roda hoje. Os dois disputam a mesma capacidade; um 429 de um pode aparecer no outro. Risco não mapeado até esta versão.
*   Mitigação: medir a taxa de requisição atual da integração de pedidos antes de fechar o escopo do sync (pré-requisito antes de codar); fila de dispatch suavizada, nunca disparo paralelo sobre o catálogo; considerar app separado se a contenção aparecer na prática. **🆕 De-para SKU Wake → identificador de canal, sem RF que o preveja (origem: avaliação de Engenharia)**
*   Tipo: Técnico · Probabilidade: Confirmada (ausência de mapeamento) · Impacto: Alto → provavelmente Baixo
*   Contexto: sem esse mapeamento, o sync não sabe qual `item_id` (Shopee) ou `product_id` (TikTok) consultar para cada SKU da Wake. Boa notícia: o campo (`seller_sku` no TikTok, `item_sku` na Shopee) pode já vir de graça no mesmo payload que o sync consome para Preço/Estoque — falta só confirmar se está preenchido com o SKU da Wake (checagem trivial, ver DSC-04 no Brief de Engenharia).
*   Mitigação: aguardar a checagem de Engenharia (DSC-04). Só se o campo vier vazio é que o de-para vira escopo de tela na Interface Administrativa — decisão de Produto nesse caso (Q-C), sem ação necessária agora. **🆕 Colisão de nome de schema no banco (origem: avaliação de Engenharia)**
*   Tipo: Técnico · Probabilidade: Confirmada · Impacto: Baixo
*   Contexto: o schema `HUB` já existe no `B2C-DataBase`, de outro domínio (leads, connect). Precisa de outro nome para o HUB Inteligente.
*   Mitigação: escolher nome de schema alternativo antes de codar — barato agora, caro depois. **🆕 Proxy de imagem da CDN do TikTok vira escopo real do v1 (origem: avaliação de Engenharia)**
*   Tipo: Técnico · Probabilidade: Alta · Impacto: Médio
*   Contexto: com Imagem via API confirmada nos 3 canais (não mais hipótese futura), o RNF-Performance passa a exigir proxy da CDN do TikTok — banda, custo e impacto direto em LCP num comparador mobile-first em 4G.
*   Mitigação: dimensionar CDN/proxy junto com o RNF-Performance, não tratar como detalhe de implementação. **Riscos descartados:** _dupla comissão (domínio do Escritório); regressão no comissionamento Club (domínio do Escritório); T&Cs / tráfego pago; exposição financeira da "garantia de oferta por X minutos" (substituída por timer sem cobertura financeira)._

* * *

11.  Questões Abertas e Dependências

* * *

**Questões Abertas**
*   **Q-01 — Hipótese-mãe é dor real?** · Decide: Produto + Diretoria · Prazo: Fim do 1º ciclo
*   **Q-07 — Dimensionamento da meta** · Decide: Produto · Prazo: Antes do go-to-market
*   **🚨 Q-11 — Campanha de reautorização Shopee + TikTok** · Decide: Rolim, Romulo Alves e Vinícius Graff · Prazo: Antes do refinamento técnico da Feature
*   **🚨 Q-12 — Cobertura real esperada de canal** · Decide: Rolim, Romulo Alves e Vinícius Graff · Prazo: Antes do refinamento técnico da Feature
*   **Q-16 — Rastreabilidade de clique/acesso** · Decide: Produto, com revisão DPO se necessário · Prazo: Antes do refinamento técnico
*   **Q-22 — Timer de escassez × disclaimer de variação de preço** · Decide: Design · Prazo: Antes de fechar o Brief de Design
*   **🆕 Q-23 — Limiares de conversão número → tier para Estoque (origem: revisão de Q-19, v2.4):** proposta provisória registrada na Seção 7 (Disponível > 5 · Últimas Unidades 1–5 · Indisponível 0). Precisa de validação contra o catálogo real — quantidade típica de estoque pode variar por categoria de produto e por canal. · Decide: Produto/Operação, com apoio de dado real de catálogo · Prazo: Antes do refinamento técnico, ou tratar como hipótese a validar no 1º ciclo se não houver dado disponível agora
*   **🆕 Q-24 — Janela de atribuição estendida sem novo clique no link (origem: ata da apresentação de POC, 05/08/2026):** debate levantado na reunião — se um cliente já identificado como indicado por uma influenciadora (ex.: comprou uma vez via link do Hub) comprar novamente em qualquer canal, dentro de uma janela de tempo (a própria reunião oscilou entre 7 e 60 dias, sem fechar), **sem passar pelo link de novo**, a comissão seria garantida à influenciadora mesmo assim? A reunião chamou isso de mecanismo "extraordinário" — hoje (baseline) a atribuição segue estritamente as regras locais de cada marketplace (só conta o que passou pelo link, ver Q-05 fechada). Esta é uma proposta de **ampliação** da postura atual, não uma correção de bug — precisa de decisão explícita de Produto, não apenas de Engenharia, porque tensiona a postura LGPD-mínima (Seção 5/RNF-Privacidade) se a correspondência de identidade do cliente exigir armazenar mais dado do que hoje, e tem implicação comercial direta (quem paga a comissão de uma venda sem clique). · Decide: Produto (Rolim), com Comercial (Romulo Alves) e revisão LGPD se a mecânica exigir armazenar identidade do cliente · Prazo: Antes do refinamento técnico, se for seguir adiante — senão, registrar como descartada explicitamente **Questões Fechadas — rodada v2.7 (avaliação de Engenharia, Souza 14/08/2026)**
*   ✅ **🆕 Q-18 — Modelo de colaboração TikTok (Open × Target) — fechada, decisão do Head.** **Open Collaboration** adotado. Razão dupla, de Engenharia: custo operacional de Target seria convite por creator×produto (2.000 influenciadoras × 500 SKUs, passivo permanente); e só Open destrava o endpoint que devolve Volume de Vendas de graça (`open_collaborations/products`) — o que também faz a assimetria de janela entre Shopee e TikTok desaparecer, unificando os limiares de tier da Seção 7. Contrapartida aceita: qualquer creator do TikTok, mesmo fora da rede Club, pode promover o produto.
*   ✅ **🆕 Q-23 — Limiares de tier de Estoque configuráveis — fechada, decisão do Head.** Confirmado: limiares em configuração (não hardcoded), por canal. **Admin pode sobrescrever o tier calculado** via painel administrativo (mesma mecânica de override já existente, RF-13). Duas ressalvas técnicas de Engenharia que seguem junto: no TikTok, a fonte que também traz Volume de Vendas (lado creator) só devolve estoque booleano — "Últimas Unidades" fica inalcançável por esse caminho, exigindo combinar com o lado seller para o tier completo; e o estoque pode vir repartido por `warehouse_id` — precisa de regra de agregação (somar tudo, ou considerar só armazéns que atendem o CEP do cliente) definida antes do primeiro cálculo de tier.
*   ✅ **🆕 Q-D — RNF-Frescor por campo, não 30 min único — fechada, decisão do Head.** Preço, Estoque e Frete: 30 min (endpoint barato e paginado). Imagem, Avaliação e Volume de Vendas: ciclo diário (exigem chamada própria por produto ou endpoint separado, e não mudam em 30 min). Ver RNF-Frescor revisado, Seção 8.
*   ✅ **🆕 Q-H — Avaliação no TikTok: manual ou remove o campo — fechada, decisão do Head.** **Admin insere manualmente.** Definitivo — HT-04 confirmou que não existe rota de API para este dado em nenhum lugar da TikTok Shop Partner Center API, não é uma questão de escopo ou credencial. Motivo obrigatório estendido para este preenchimento (mesmo risco de manipulação de prova social que motivou a exigência nos demais canais, mesmo não sendo tecnicamente uma sobrescrita de valor de API).
*   ✅ **🆕 Q-E + Q-F — Frete: precisão, rótulo e ordenação — fechadas juntas, decisão do Head.** Nova taxonomia de Frete por canal: **Wake** — valor exato via API com CEP real do cliente, sem rótulo. **Shopee** — valor via API (`estimated_shipping_fee`), sem CEP real do comprador, sempre rotulado **"Aproximado"**. **TikTok** — sem API; admin pode inserir manualmente (rotulado **"Aproximado"** também, quando inserido); se não inserido, opção de referenciar o frete de outro canal disponível para aquele produto; se nenhuma das duas, campo fica sem informação. Disclaimer geral de variação de preço/condições (RNF-Transparência) aplica-se a todos, independente do rótulo. **Ordenação (RF-06):** só entram na comparação combinada de "menor preço + frete" os canais com informação mínima de frete (de qualquer fonte — exata, aproximada ou referenciada); canal sem nenhuma informação de frete fica fora dessa comparação combinada. Simulação de POST/scraping para frete em Shopee ou TikTok **descartada para o v1** — mesma posição de Engenharia (HT-11): risco de latência e rate limit não documentado, desproporcional ao ganho.
*   ✅ **🆕 Q-G — Horizonte H1 de "~30 dias" — decisão do Head: mantido conscientemente.** Engenharia confirmou T-Shirt GG (2–4 meses) e sinalizou que o horizonte de ~30 dias (Seção 12) está inconsistente com essa estimativa. O Head decide manter a meta de ~30 dias como aposta — risco aceito conscientemente, não reconciliado com o T-Shirt. Registrado como tensão explícita, não como erro de documento.
*   ✅ **🆕 Q-13 — CEP de referência para frete Wake — fechada na v2.6, decisão do Head.** Descartada a opção de CEP fixo nacional — o CEP do cliente é obrigatório para exibir Frete e Prazo de Entrega. Sem CEP informado, esses dois campos ficam em estado de espera (não em "Não informado" — este último reservado para ausência técnica do dado no canal). Consequência técnica: reabre a relevância da simulação de POST com CEP real (nota histórica, Vinícius Graff) como candidata de arquitetura — ver HT-11, Brief de Engenharia.
*   ✅ **Q-02 a Q-06, Q-08 a Q-10, Q-15, Q-17** — sem alteração nesta versão, ver histórico de versões anteriores.
*   ✅ **🔄 Q-19 — Escopo de avaliação, volume de vendas, estoque e imagem por marketplace — revisada e fechada novamente na v2.4.** Resolução anterior (v2.3): 100% admin-only, sem fonte de API para nenhum destes campos. Resolução atual (v2.4), a partir da comparação com o Discovery de Engenharia (Souza, v0.5): **modelo misto** — API como fonte primária onde confirmada (Estoque e Imagem: 3 canais; Avaliação: Wake e Shopee; Volume de Vendas: Shopee), com override administrativo configurável por TTL. Volume de Vendas na Wake permanece sem fonte de API (gap real, confirmado pelo Discovery) — sempre manual. Avaliação e Volume de Vendas no TikTok ficam condicionados a HT-04/HT-06. Estoque e Volume de Vendas passam a ser exibidos como **tier** (não número exato); Avaliação mantém-se como nota real. Ver taxonomia completa na Seção 7 e decisão registrada na Seção 13.
*   ✅ **Q-20 — Disponibilidade de Parcelamento — sem alteração na v2.4.** Mantido admin-only, tipicamente Wake, conforme decisão do Head (v2.3).
*   ✅ **Q-21 — Precedência de dado quando API e fonte administrativa coexistirem — revisada implicitamente na v2.4.** Anteriormente não se aplicava (nenhuma fonte de API concorrente). Com a revisão da Q-19, a regra de precedência agora é explícita: **API é a fonte padrão; o valor administrativo, quando existir um override ativo (dentro do TTL configurado), tem precedência sobre a API.** Ao expirar o TTL, a API volta a prevalecer automaticamente. **Dependências**
*   **D-01 — Escritório Virtual** · Status: Ativa — contrato bidirecional a formalizar, agora incluindo o mecanismo de override com TTL configurável (novo escopo desde a v2.4).
*   **D-02 — Engenharia Ybera** · Status: Refinamento técnico pendente — inclui, a partir da v2.4, a validação do mecanismo de expiração automática de override (job/scheduler) e o dimensionamento das chamadas de API ampliadas (Estoque/Imagem/Avaliação/Volume de Vendas).
*   **D-03 — APIs de afiliado gated** · Status: A iniciar — critical path
*   **D-04 — Identidade + catálogo via API** · Status: Disponível via API do back-end do Escritório
*   **D-05 — Baseline de métricas** · Status: Viável; não bloqueia
*   **D-06 — Onboarding de creator/afiliada** · Status: A planejar antes do go-to-market
*   **D-07 — Autorização individual dos afiliados (OAuth)** · Status: A planejar — critical path, confirmado para Shopee E TikTok. Ver escalonamento em Q-11, seção 10.
*   **D-08 — Interface Administrativa no Escritório Virtual** · Status: A especificar. 🔄 _v2.4: escopo ampliado — inclui agora o mecanismo de override com TTL configurável e a lógica de expiração automática, além da habilitação de produto, tags e Parcelamento já previstos._

* * *

12.  Roadmap Macro

* * *

> Horizontes de entrega — não datas fixas.

**H1 — Curto prazo (v1 · ≈ 30 dias — meta mantida conscientemente, Q-G, v2.7)**

> ⚠️ **Tensão registrada, não reconciliada:** Engenharia confirmou T-Shirt GG (2–4 meses, Seção 9) para o escopo desta versão. O Head decidiu manter a meta de ~30 dias como aposta, ciente da inconsistência — não é erro de documento, é risco aceito conscientemente (Q-G, Seção 11).

*   Comparador público (3 canais) — com taxonomia de campos revisada: Preço/Frete/Prazo via API com fallback textual; **Estoque e Volume de Vendas via API + tier + override**; **Avaliação via API (Wake/Shopee) + override**; Parcelamento admin-only
*   Produto de referência no topo da página + seção de identificação do Influencer (RF-12)
*   Interface administrativa do HUB no Escritório Virtual (RF-13) — habilitação de produto, tags, **override com TTL configurável**, Parcelamento, timer de escassez
*   Geração de link encurtado, links de destino por canal, endpoint de link, status de integração, onboarding, renovação de token (RF-11)
*   Sincronização periódica ampliada (Estoque/Imagem/Avaliação/Volume de Vendas onde houver API)
*   Critério de gate: ≥ 700 influenciadoras ativas + hipótese-mãe respondida → decisão de escala / pivota / para **H2 — Médio prazo (v1.1 · condicional ao H1)**
*   Integração com Mercado Livre (4º canal)
*   Histórico de links por influenciadora
*   Refinamento de identity resolution
*   Notificações de venda atribuída
*   Análise de comportamento de cliente (data team) — condicionada a Q-16
*   Personalização visual por influenciadora — se aprovada por Produto + Design
*   Campos exclusivos por canal via API que não fecharem escopo a tempo do H1
*   🔄 _v2.4: **automação futura via API** — item herdado da v2.3, agora com escopo drasticamente reduzido. Restam apenas: **Avaliação e Volume de Vendas no TikTok** (condicionados a HT-04/HT-06) e **Volume de Vendas na Wake** (gap real, sem fonte de API conhecida — permanece sem prazo definido). Estoque, Imagem e Avaliação/Volume de Vendas na Shopee **já entram no v1**, não são mais item de roadmap futuro._
*   Possível evolução da Lojinha da Influencer como fonte de catálogo do Hub — sem escopo, dono ou prazo definidos **H3 — Longo prazo (v2+ · condicional ao H2)**
*   Expansão para Club Internacional / Shopify Global
*   Demais roles (Gestor, G20)
*   Inteligência de canal
*   APIs de seller em substituição às APIs de afiliado onde viável

* * *

13.  Decisões Tomadas

* * *

> Decisões de v1.0 a v2.3 mantidas por histórico — não reproduzidas na íntegra aqui; ver versões anteriores do documento. Abaixo, apenas as decisões novas ou revisadas na v2.4.

**🆕 Revisão da Q-19 — modelo misto API + override administrativo, substituindo "tudo admin-only" (decisão do Head de Produto, 12/08/2026)**
*   Opções avaliadas: (a) manter a resolução da v2.3 (100% admin-only, sem fonte de API para nenhum dos 4 campos); (b) usar API como fonte primária onde o Discovery de Engenharia (Souza, v0.5) confirma disponibilidade, com override administrativo como camada de ajuste, não de preenchimento obrigatório
*   Escolha: opção (b). Estoque e Imagem via API nos 3 canais; Avaliação via API em Wake e Shopee (TikTok condicionado a HT-04); Volume de Vendas via API na Shopee (TikTok condicionado a HT-06; Wake permanece sempre manual — gap real confirmado pelo Discovery)
*   Razão: a resolução da v2.3 partiu da premissa de que nenhum canal expunha esses dados via API — o Discovery técnico já disponível (Souza) contradiz essa premissa para a maioria dos casos. Manter a versão anterior significaria ignorar dado técnico já levantado e sobredimensionar o esforço de RF-13/D-08 desnecessariamente
*   Trade-off aceito: escopo de RF-05/RF-07 aumenta (mais chamadas de API a integrar); escopo de RF-13 muda de natureza (de preenchimento para override excepcional) mas ganha complexidade nova (TTL configurável, expiração automática) **🆕 Estoque e Volume de Vendas generalizados em tiers, não exibidos como número exato (decisão do Head de Produto, 12/08/2026)**
*   Opções avaliadas: exibir valor numérico exato (quando vindo de API) vs. generalizar em tiers (Disponível/Últimas Unidades/Indisponível para Estoque; Campeão de Vendas/Mais Vendido/Lançamento/nada para Volume de Vendas)
*   Escolha: tiers para os dois campos
*   Razão: reduz o risco de manipulação de prova social por comparação numérica direta entre canais (ex.: "2.847 vendas" fabricado é mais verossímil que um selo categórico); simplifica a leitura do cliente; permite tratamento uniforme entre canais com fontes de dado assimétricas (acumulado vs. por janela vs. sem API)
*   Trade-off aceito: perda de granularidade informativa para o cliente; necessidade de definir e validar limiares de conversão (Q-23 e parâmetros da Seção 7, ambos hipótese provisória) **🆕 Avaliação mantém-se como nota real, não entra em tier (decisão do Head de Produto, 12/08/2026)**
*   Opções avaliadas: generalizar Avaliação em tier, como Estoque e Volume de Vendas, vs. manter como estrelas reais
*   Escolha: manter estrelas reais
*   Razão: decisão explícita do Head — avaliação é um dado cujo formato (estrelas) já é universalmente reconhecido pelo cliente; generalizar perderia informação sem ganho equivalente de proteção contra manipulação (o risco de manipulação já é endereçado por outro mecanismo — motivo obrigatório no override)
*   Trade-off aceito: Avaliação continua exposta a override de valor exato — mitigado por motivo obrigatório, não por generalização **🆕 Tag "Lançamento" é estritamente administrativa, sem cálculo automático por data (decisão do Head de Produto, 12/08/2026)**
*   Opções avaliadas: calcular "Lançamento" automaticamente com base na data de habilitação do produto no comparador (proposta inicial do Monteirinho) vs. deixar como tag manual, sem qualquer lógica de data
*   Escolha: tag manual, aplicável pelo admin a qualquer produto/canal, incluindo casos de relançamento
*   Razão: o admin tem contexto de negócio (campanha, relançamento, sazonalidade) que uma regra de data não captura; forçar uma data-gatilho geraria falsos positivos (produto antigo recém-habilitado no Hub apareceria como "Lançamento") e falsos negativos (relançamento de produto antigo não seria capturado por nenhuma data disponível)
*   Trade-off aceito: sem controle automático sobre o uso do selo — decisão de manter "Lançamento" fora da hierarquia de Campeão de Vendas/Mais Vendido (não compete no mesmo eixo, é um estado alternativo escolhido pelo admin) **🆕 TTL de override configurável pelo admin, não fixo por sistema (decisão do Head de Produto, 12/08/2026)**
*   Opções avaliadas: TTL fixo por tipo de campo (proposta inicial do Monteirinho: 48–72h Estoque, 15–30 dias Avaliação/Volume de Vendas) vs. TTL configurável pelo próprio admin no momento do override, com valores sugeridos como default
*   Escolha: configurável, com os valores acima como default pré-preenchido, editável; inclui opção de "sem expiração" (permanente) e opção de "ocultar o campo" enquanto o override estiver ativo
*   Razão: casos reais de override (ex.: relançamento que dura mais que 30 dias, ou correção pontual que deveria ser permanente) não cabem bem em um TTL único; dar controle ao admin evita necessidade de reconfiguração manual repetida
*   Trade-off aceito: mais complexidade de UI na Interface Administrativa (campo de TTL por override, não um valor implícito do sistema); Engenharia precisa validar viabilidade de um job de expiração que rode sobre TTLs variáveis por registro, não um único cron fixo (ver HT-09, Brief de Engenharia) **🆕 Trilha de auditoria dedicada avaliada e descartada — reafirma decisão original (decisão do Head de Produto, 12/08/2026)**
*   Opções avaliadas: construir uma trilha de auditoria dedicada para overrides administrativos do HUB (quem alterou, quando, valor anterior/novo) vs. manter a posição original (sem RNF de auditoria dedicado, herdando o mecanismo do Escritório Virtual)
*   Escolha: manter a posição original — sem trilha dedicada
*   Razão: decisão do Head, alinhada ao desejo já expresso do Diretor Estratégico de minimizar fricção de governança sobre a Interface Administrativa; motivo obrigatório no registro do override (Avaliação/Volume de Vendas) cobre parte da necessidade de rastreabilidade sem o custo de uma trilha histórica completa
*   Trade-off aceito: risco "Integridade de dados administrativos" e o novo risco "Manipulação de prova social" (Seção 10) permanecem sem mitigação técnica de rastreabilidade histórica — aceito conscientemente; plano de transparência: a decisão e o risco associado devem ficar explicitamente documentados nas POCs de handoff, para que quem constrói e quem revisa entenda que é decisão consciente, não descuido

**🆕 Itens da ata de 05/08/2026 explicitamente NÃO fechados nesta versão (registro de transparência, v2.5)**
*   **Botão de atualização manual de preço pelo cliente** — teve concordância verbal na reunião, mas nunca virou decisão formal de Produto em nenhuma versão anterior deste DRP. Não incorporado como RF nesta versão — aguardando confirmação explícita do Head.
*   **Janela de atribuição estendida (60 dias, Q-24)** — debatida sem resolução na reunião. Não incorporada, não descartada — permanece aberta.
*   **Mecanismo de "cadeado" de preço para promoções agendadas** — levantado como necessidade operacional, sem desenho de solução. Registrado como hipótese técnica nova (HT-10, Brief de Engenharia), não como RF.
*   **Reforço de decisão já fechada:** a ideia de forçar o preenchimento do CEP antes de exibir qualquer informação na página foi levantada e **explicitamente recusada** na mesma reunião ("não faria não") — reforça a decisão já registrada de acesso sem fricção (Seção 5). Sem mudança, apenas rastreabilidade adicional.
*   **Correção de atribuição:** a sugestão de webscraping/simulação de POST e download diário de tabela de frete para Data Lake (nota histórica, Brief de Engenharia) tinha origem registrada como "um Stakeholder" — a transcrição confirma que a origem é **Vinícius Graff (CTO)**. Corrigido no Brief de Engenharia v1.6.

**🆕 Q-13 fechada — CEP do cliente obrigatório para Frete/Prazo, sem fallback de CEP fixo (decisão do Head de Produto, 13/08/2026)**
*   Opções avaliadas: (a) CEP fixo nacional de referência (proposta original: 01310-100, São Paulo) — mais simples, sem fricção adicional, porém impreciso; (b) exigir CEP do cliente — mais preciso, com uma etapa extra de interação, mas restrita apenas aos campos de Frete e Prazo (produto, preço e comparação continuam acessíveis sem CEP)
*   Escolha: opção (b)
*   Razão: precisão da informação logística prevalece sobre a fricção adicional, que fica isolada em dois campos específicos, não na página como um todo — mantém coerente com o princípio de acesso sem fricção (Seção 5), que segue valendo para o restante da experiência
*   Trade-off aceito: Frete deixa de ser um valor único e cacheável por produto×canal — passa a depender do CEP do cliente, o que exige uma solução de arquitetura ainda não decidida (ver HT-11, Brief de Engenharia) para não sobrecarregar as APIs dos marketplaces a cada acesso individual
*   Nota de rastreabilidade: esta decisão é distinta da proposta de forçar o CEP antes de exibir qualquer informação na página, levantada e recusada na mesma apresentação de POC (05/08/2026) — aquela bloqueava toda a página; esta gate apenas Frete e Prazo

**🆕 Decisões de arquitetura registradas a partir da avaliação de Engenharia (Souza, 14/08/2026) — v2.7**
*   **Expiração de override é resolvida na leitura** (`expires_at` anulável) — não precisa de cron nem de fila com delay. Job de limpeza existe só por higiene, não por corretude.
*   **O sync sempre grava o valor da API; o override é aplicado só na composição/exibição.** Substitui a regra anterior do Brief/RNF-Frescor ("retoma na próxima execução do sync"), que deixaria até 30 min sem dado correto após expirar.
*   **Frescor por campo, não 30 min único para tudo** (Q-D, ver RNF-Frescor).
*   **No TikTok, o sync de 30 min usa `Search Products` paginado, não `Get Product` por SKU** — reduz o ciclo de ~500 para ~5 chamadas; `Get Product` fica reservado ao ciclo diário de Imagem.
*   **Cadeado de preço não construído no HUB** (HT-10) — os 3 canais já agendam promoção nativamente; agendar no canal, o sync reflete a virada automaticamente.
*   **Autoria e timestamp estampados no próprio registro do override**, não em trilha histórica separada — não reabre a decisão de não ter auditoria dedicada (HT-08).
*   **Schema próprio para o HUB Inteligente no banco** — `HUB` já está ocupado por outro domínio.
*   **O HUB acessa a Shopee através do B2C-BackEnd, não direto** — é lá que já vivem credenciais, HMAC e ciclo de OAuth; evita duplicar credencial e lock de refresh.
*   **Reuso do ciclo de OAuth existente para a identidade de afiliado**, em vez de construir um novo — extensão de chave, não de mecanismo.
*   **[Em aberto, não desta rodada]** Onde reside o registro de override — Escritório como fonte de verdade com cópia local no HUB, ou HUB como dono com escrita via contrato D-01. Trade-off entre latência/acoplamento e duplicação de estado — decisão da entrevista de arquitetura técnica, não deste DRP.

* * *

14.  F4P — Fit for Purpose

* * *

> Leitura analítica das seções 1–13. Decisão final é do PM/PO.

**1. Adequação ao Uso**
*   Parecer: mantido da v2.3, com ajuste: 🔄 _v2.4 — Admin/Admin2 agora opera majoritariamente por excepcionalidade (override sobre dado já correto), não por preenchimento obrigatório de campo vazio — reduz a carga operacional estimada anteriormente, mas introduz uma decisão nova por interação (mantém o automático ou sobrescreve?) que a interface precisa comunicar com clareza (H-UX-08, Brief de Design)._
*   Resultado: ⚠️ Aprovado com ressalvas (UX do override e da configuração de TTL a validar no design) **2. Adequação ao Mundo**
*   Parecer: mantido da v2.3. 🔄 _v2.4 — o novo risco de manipulação de prova social (Seção 10) é um vetor de percepção pública que precisa de atenção; mitigado parcialmente por motivo obrigatório, sem trilha de auditoria dedicada (decisão consciente)._
*   Resultado: ⚠️ Aprovado com ressalvas **3. Adequação ao Propósito**
*   Parecer: sem alteração — alinhamento direto com a estratégia multicanal permanece.
*   Resultado: ✅ Aprovado **4. Adequação à Percepção de Valor**
*   Parecer: mantido da v2.3, com reforço: 🔄 _v2.4 — a generalização em tiers (Estoque, Volume de Vendas) é, em si, uma decisão de percepção de valor: comunica menos precisão numérica, mas reduz o risco de o cliente perceber inconsistência entre canais com fontes de dado assimétricas. A ausência de trilha de auditoria é um ponto que, se algum override gerar disputa visível (cliente ou imprensa), precisa estar bem documentado como decisão consciente — não como falha de processo._
*   Resultado: ⚠️ Aprovado com ressalvas **Parecer Geral**

> ⚠️ **DRP aprovado com ressalvas, revisadas nesta versão:**
> *   🔄 **Q-19 revisada e fechada novamente (v2.4)** — modelo misto API + override, substituindo "tudo admin-only" da v2.3.
> *   🆕 **Q-23 aberta** — limiares de tier de Estoque, hipótese provisória a validar.
> *   Q-22 permanece aberta (Design) — sem bloqueio do refinamento técnico.
> *   Dois riscos de alta severidade (Q-11, Q-12) seguem escalados para Comercial e CTO.
> *   Trilha de auditoria dedicada avaliada e descartada — decisão consciente, documentar explicitamente nas POCs de handoff.
> *   T-Shirt e Confiança (BVS) precisam de reavaliação formal pelo Head e por Engenharia à luz do escopo revisado desta versão — sinalizado, não decidido automaticamente.

A decisão final é do PM/PO. O DRP pode avançar para Feature derivada, condicionado à validação de Engenharia do escopo revisado (RF-05, RF-07, RF-13) e à resposta de HT-04/HT-06/HT-09.

* * *

**Links relacionados:**
-----------------------

*   Workflow Excalidraw - https://link.excalidraw.com/l/7ZkUiAcVfSa/9Y873A2kX8D
*   Avaliação de Engenharia (Souza, 14/08/2026) — `avaliacao-engenharia.md` — insumo primário desta v2.7
*   Brief de Engenharia v1.8 (15/08/2026) — deriva desta v2.7 do DRP
*   Brief de Design v1.10 (15/08/2026) — deriva desta v2.7 do DRP
*   Brief de Engenharia v1.7 e Brief de Design v1.9 (13/08/2026) — versões imediatamente anteriores, ver histórico
*   Transcrição integral da apresentação de POC ao Stakeholder (05/08/2026)
*   Brief de Engenharia v1.6 e Brief de Design v1.8 (13/08/2026) — versões imediatamente anteriores, ver histórico
*   Discovery de Engenharia — Hub de Comparação de Produtos nos Marketplaces (v0.5, Souza) — fonte técnica que motivou a revisão da Q-19 nesta versão
*   Brief de Engenharia v1.4 e Brief de Design v1.6 (05/08/2026) — versões anteriores, ver histórico
*   Ata da apresentação de POC do Hub ao Stakeholder (05/08/2026)

* * *

Histórico de Atualizações
-------------------------

| Versão | Data | Autor | Alteração |
| --- | --- | --- | --- |
| v1.0 a v2.3 | 22/06/2026 a 05/08/2026 | Victor Lima / Rolim / Monteirinho / Matheus | Ver versões anteriores do documento para o histórico completo. |
| 🆕 v2.7 | 15/08/2026 | Rolim / Monteirinho | **Avaliação de Engenharia recebida (Souza, 14/08/2026) — 8 decisões de Produto fechadas.** (1) **Q-18 fechada:** Open Collaboration no TikTok. (2) **Q-23 fechada:** limiares configuráveis, com override do admin e duas ressalvas técnicas (estoque booleano no lado creator do TikTok; agregação por armazém). (3) **Q-D fechada:** frescor por campo (30 min Preço/Estoque/Frete; diário Imagem/Avaliação/Volume de Vendas). (4) **Q-H fechada:** Avaliação no TikTok é admin manual, definitivo (HT-04 fechou negativo — sem API em lugar nenhum). (5) **Q-E + Q-F fechadas:** nova taxonomia de frete (Wake exato; Shopee e TikTok "Aproximado"; ordenação só combina canais com informação mínima de frete); simulação de POST/scraping descartada para o v1. (6) **Q-G:** Head mantém meta de ~30 dias conscientemente, apesar do T-Shirt GG (2–4 meses) confirmado por Engenharia — tensão registrada, não reconciliada. (7) **Correções factuais:** refresh de token OAuth já existe (R-01 retratado, Alto→Baixo); Shopee não é repo separado; sync do TikTok ~97% mais barato usando `Search Products`; SKU de-para pode vir de graça (pendente checagem trivial, DSC-04); trilha de auditoria do Escritório não existe de fato — só autenticação/roles (HT-08), mitigado por estampar autoria/timestamp no próprio registro do override. (8) **Correção de arquitetura (HT-09):** sync sempre grava o valor da API, override só na composição — expiração instantânea. (9) **Novos riscos:** contenção de QPS com integração de pedidos (R-08); colisão de nome de schema (R-12); proxy de imagem da CDN do TikTok vira escopo real (R-13). (10) RF-05, RF-06, RF-07, RNF-Segurança, RNF-Frescor, BVS/T-Shirt, Roadmap H1 e novas decisões de arquitetura (Seção 13) atualizados. |
| v2.6 | 14/08/2026 | Ledger de Artefatos (Claude Code) | **Sincronização da Ledger:** conteúdo do artefato atualizado diretamente de v2.3 para v2.6, após identificação de que a cópia na Ledger estava defasada em relação à evolução real do documento. As versões intermediárias (v2.4, v2.5) evoluíram fora da Ledger — estão documentadas nas notas de versão do topo e nas entradas abaixo, sem reconstrução linha a linha, por decisão do Rolim. Sem alteração de conteúdo além do estado v2.6. |
| 🆕 v2.6 | 13/08/2026 | Rolim / Monteirinho | **Duas decisões do Head sobre itens abertos da rodada anterior.** (1) **Q-13 fechada:** CEP do cliente obrigatório para Frete e Prazo de Entrega — sem CEP, esses dois campos ficam em estado de espera (distinto de "Não informado"); produto/preço/comparação continuam acessíveis sem CEP. Descartada a opção de CEP fixo. Consequência técnica: Frete passa a variar por CEP, não mais valor único cacheável por produto×canal — nova hipótese técnica **HT-11** registrada (mecanismo de cálculo por CEP real, candidata: simulação de POST, nota histórica de Vinícius Graff). RF-05, RF-06 (ordenação em duas fases: antes/depois do CEP) atualizados. (2) **Q-18 permanece aberta, com nota de esclarecimento:** uma resposta anterior confundia o gate de habilitação de produto no catálogo do Hub (já fechado, RF-13) com a pergunta real da Q-18 (modelo de colaboração Open × Target, específico do TikTok) — nenhuma decisão foi tomada sobre Q-18 nesta versão, apenas a distinção entre as duas coisas foi registrada para não se perder no histórico. |
| 🆕 v2.5 | 13/08/2026 | Rolim / Monteirinho | **Incorporação da transcrição integral da ata de 05/08/2026** (antes disponível só como resumo). (1) **Q-24 aberta:** janela de atribuição estendida (60 dias), debatida sem resolução na reunião. (2) Novo risco: upsell/cross-sell entre versões de produto, reconhecido como não resolvido. (3) Nova hipótese técnica registrada (não decidida): mecanismo de "cadeado" de preço para promoções agendadas. (4) Registrado como pendente de confirmação do Head (não incorporado): botão de atualização manual de preço pelo cliente. (5) Correção de atribuição: sugestão de webscraping/Data Lake de frete passa de "Stakeholder anônimo" para **Vinícius Graff (CTO)**. (6) Reforço de rastreabilidade: recusa de forçar CEP antes de exibir informação, já decidida, confirmada como discutida-e-recusada na própria reunião. Nenhuma decisão fechada anteriormente foi revisitada ou alterada nesta versão — apenas itens novos, registrados como abertos ou pendentes. |
| 🆕 v2.4 | 12/08/2026 | Rolim / Monteirinho | **Revisão de Q-19 a partir de comparação com o Discovery de Engenharia (Souza, v0.5).** (1) **Q-19 reaberta e refechada:** modelo misto API + override administrativo substitui "tudo admin-only" — Estoque e Imagem via API nos 3 canais; Avaliação via API em Wake/Shopee (TikTok condicionado a HT-04); Volume de Vendas via API na Shopee (TikTok condicionado a HT-06; Wake sempre manual — gap real). (2) **Estoque e Volume de Vendas passam a tier** (Disponível/Últimas Unidades/Indisponível; Campeão de Vendas/Mais Vendido/Lançamento/nada) — Avaliação permanece como nota real. (3) **Q-23 aberta:** limiares de tier de Estoque, hipótese provisória. (4) **Parâmetros de tier de Volume de Vendas registrados** como hipótese provisória, a validar no 1º ciclo. (5) **Tag "Lançamento" definida como estritamente administrativa**, sem cálculo por data, aplicável inclusive a relançamentos. (6) **Override administrativo com TTL configurável pelo próprio admin** (dias, permanente, ou ocultação do campo) — substitui a ideia de TTL fixo por sistema. (7) **Motivo obrigatório mantido** para override de Avaliação e Volume de Vendas. (8) **Trilha de auditoria dedicada avaliada e descartada** — reafirma decisão original (sem RNF de auditoria dedicado), com plano de documentar a decisão explicitamente nas POCs de handoff. (9) **Q-21 revisada implicitamente:** regra de precedência agora explícita (override ativo > API; API prevalece após expiração do TTL). (10) Novo risco: manipulação de prova social via override de Avaliação/Volume de Vendas. Novo risco: limiares de tier sem baseline real. (11) RF-05, RF-07, RF-13, RNF-Performance, RNF-Segurança, RNF-Escalabilidade, RNF-Frescor de dados atualizados. (12) Roadmap H2 — escopo de "automação futura" drasticamente reduzido (Estoque/Imagem/Avaliação(Wake,Shopee)/Volume(Shopee) já entram no v1). (13) F4P, BVS (nota de Confiança sinalizada, não decidida) e Parecer Geral atualizados. |

* * *

_DRP — Documento de Requisitos de Produto (PRD Ybera) | Ybera Group — Time de Produto | v2.7 · Template v2.0_

> **Nota separada (não relacionada a esta atualização de conteúdo):** este documento segue no formato herdado do Template v2.0. A migração formal para o `templates__DRP_Template_v3.md` vigente segue pendente como tarefa separada, já identificada em sessão anterior.
