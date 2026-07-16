Brief Design — HUB Inteligente Ybera
====================================

**Derivado do DRP v1.8 · 10/07/2026**

> Recorte para validação de Design. Leia este documento, valide as hipóteses de experiência e entregue: fluxos de usuário revisados + estados de tela por capacidade + decisões registradas para a seção 12 da Feature.

> **Nota de versão (v1.1):** este Brief incorpora o retorno da validação técnica de Engenharia (Matheus, 09/07/2026, via Brief de Engenharia v1.1) e decisões de UX fechadas diretamente com o Head de Produto nesta rodada. A mudança central: a autorização OAuth individual do afiliado passou a valer para **dois canais gated (Shopee e TikTok), não um** — isso amplia a superfície do componente de status e resolve H-UX-04 com um padrão concreto, deixando de ser hipótese em aberto. Ver **Histórico de Atualização** ao final.

* * *

Pergunta central
----------------

Valide estas hipóteses de experiência e proponha os fluxos candidatos. **Entregue:**
*   Fluxos de usuário por jornada (Influenciadora via Escritório + Cliente Final via comparador)
*   Estados de tela por capacidade: vazio, loading, sucesso, erro, canal indisponível, sem vínculo, **vínculo expirado (novo)**
*   Decisões de UX → registrar na seção 12 da Feature HUB-001

* * *

Personas e JTBD
---------------

**Influenciadora Ativa da Rede Club**
*   Quem é: Parceira da rede Club Brasil que já vende via múltiplos canais e monitora ganhos no Escritório Virtual. **Não acessa o HUB diretamente** — opera via front do Escritório, que consome endpoints do HUB.
*   JTBD: "Quando quero divulgar um produto para minha audiência em múltiplos canais, quero compartilhar um único link que garanta minha comissão independentemente de onde o cliente comprar, para que eu possa focar em vendas sem me preocupar com qual canal o cliente vai escolher." **Gestor**
*   Quem é: Acumula a role de Influenciadora. Comportamento idêntico no HUB.
*   JTBD: Idêntico ao da Influenciadora. **Cliente Final (consumidor anônimo)**
*   Quem é: Consumidor que recebe o link via redes sociais, WhatsApp ou lives. Sem login, sem cadastro.
*   JTBD: "Quando recebo a indicação de um produto, quero comparar preço e frete entre os canais disponíveis e comprar no que me for mais conveniente, para que eu não precise pesquisar por conta própria nem abrir mão das condições de quem me indicou."

* * *

Hipóteses de UX a validar
-------------------------

As hipóteses abaixo são previsões do Produto. Design valida, contesta ou expande.
*   **H-UX-01:** O comparador mobile-first com ordenação por menor custo-benefício (preço + frete) é suficiente para o cliente decidir sem fricção — sem necessidade de filtros ou mais informações.
*   **H-UX-02:** A influenciadora não precisa de área logada no HUB. O componente de status de integração por canal no Escritório Virtual é suficiente para ela entender o estado de cada canal.
*   **H-UX-03:** Ocultar graciosamente um canal (sem vínculo ou indisponível) é preferível a exibir o canal com estado de erro — não gera confusão para o cliente.
*   ✅ **H-UX-04 — RESOLVIDA (não é mais hipótese em aberto).** Pergunta original: _"O fluxo de onboarding OAuth (autorização individual por canal) pode ser conduzido via Escritório Virtual sem tela própria no HUB?"_ — escrita quando a exigência de OAuth valia para um canal só (TikTok). Com a validação técnica confirmando que **Shopee também exige autorização individual** (via Affiliates API, decisão Q-10 do DRP), o espaço de estados cresceu: a influenciadora pode estar com nenhum, um ou os dois canais gated autorizados, de forma independente. **Padrão de solução já decidido — ver seção "Padrão de Vinculação (decidido)" abaixo.** Resposta à pergunta original: **sim**, é conduzido inteiramente no Escritório Virtual, sem tela própria no HUB — via link contextual + Modal, sem navegação para fora da tela de origem.
*   **H-UX-05:** O cliente não precisa saber que está acessando um HUB da Ybera — a experiência pode ser transparente (sem branding HUB explícito) e ainda assim converter.

* * *

Padrão de Vinculação (decidido)
-------------------------------

> Esta seção documenta uma decisão de UX já fechada com o Head de Produto — não é mais hipótese a validar, é ponto de partida para o Design detalhar.

**Origem do dado:** o status de vínculo por canal é lido diretamente do banco (não inferido, não calculado por heurística). Cada canal — Wake, Shopee, TikTok — é uma linha independente no painel de vínculos, com seu próprio estado.
**Três estados possíveis por canal:**
| Estado | Quando ocorre | O que a influenciadora vê |
| --- | --- | --- |
| **Vinculado** | Autorização ativa e válida | Confirmação visual (ex.: ✅), sem ação pendente |
| **Nunca vinculou** | Influenciadora ainda não autorizou o canal | Link contextual — ex.: _"Como vincular Shopee ao seu Hub"_ — abre **Modal A** |
| **Vínculo expirado** (novo — origem RF-11) | Token de OAuth não foi renovado automaticamente (falha de refresh, ver RF-11 do DRP) | Aviso distinto — ex.: _"Sua conexão com Shopee expirou"_ — abre **Modal B** |
**Modal A — Primeira vinculação:**
*   Acionado pelo link de canais em estado "nunca vinculou"
*   Conteúdo: instruções + vídeo tutorial explicando o que a influenciadora precisa fazer **externamente** (na própria conta do marketplace) para autorizar o acesso e permitir que a Ybera vincule o perfil dela ao HUB
*   Tom: onboarding — ela está fazendo isso pela primeira vez
**Modal B — Reautorização (token expirado):**
*   Acionado pelo aviso de canais em estado "vínculo expirado"
*   Conteúdo e tom **distintos do Modal A** — a influenciadora já passou por essa autorização antes; o modal não deve tratá-la como novata. Comunicar que a conexão precisa ser refeita, não que ela nunca vinculou
*   Design deste modal ainda a detalhar — reaproveita a estrutura de instrução+vídeo do Modal A, mas com copy e possivelmente estado visual (ex.: ícone de alerta vs. ícone de "novo") diferenciados
**Por que dois modais, não um:** um afiliado que nunca vinculou e um afiliado cujo token expirou estão em situações emocionalmente e informacionalmente diferentes — o segundo pode interpretar uma mensagem de "primeira vinculação" como um erro do sistema ("mas eu já fiz isso!"). Distinguir os dois evita esse atrito.
**Sem navegação para fora da tela:** todo o fluxo de vinculação/reautorização acontece via link → Modal, na própria Tela A (Catálogo). Não há painel de configurações separado nem redirecionamento de página para iniciar o processo — o Modal _é_ o mecanismo de entrada. Isso responde H-UX-04 diretamente: sim, o onboarding OAuth é conduzido via Escritório Virtual sem tela própria no HUB.

* * *

Telas de referência
-------------------

> Esta seção consolida as duas superfícies de tela que já existem como referência concreta para o Design partir — não são propostas novas, são o estado atual a ser refinado.

### Tela A — Catálogo Virtual da Influenciadora

Localização: Escritório Virtual (`app.yberaclub.com`), acessada pela influenciadora logada.
**Estrutura já estabelecida:**
*   **Grid de produtos** — catálogo em 3 colunas, com os produtos que a influenciadora pode divulgar
*   **Painel de vínculos no topo** — acima do grid, visível sem scroll, sem interromper o fluxo de navegação do catálogo. É aqui que vive o componente de status por canal (Wake / Shopee / TikTok) com os três estados descritos na seção "Padrão de Vinculação" acima
*   **Botões por produto:**
    *   **"Copiar"** — copia o link para compartilhamento externo (hoje aponta para o link do HUB, não mais para o link direto de um canal específico)
    *   **"Comprar"** — abre a PDP do produto no canal com vínculo garantido
    *   **CTA para o HUB** — leva ao comparador multi-canal; a POC de referência já usa o rótulo **"🔗 HUB Ybera"** como precedente de nome, sujeito a validação do Design
**O que muda nesta versão:** o painel de vínculos precisa agora comunicar three estados por canal (antes eram efetivamente dois: vinculado / pendente), com os dois modais diferenciados descritos acima. Shopee deixa de ser tratado como canal "simples" (sem OAuth) e passa a ter a mesma superfície de estado que TikTok.

### Tela da POC — Comparador (referência publicada)

*   URL de referência: `poc-hub-ybera.vercel.app` (POC #2 do DRP, "POC do Stakeholder")
*   Visual: réplica do Escritório Virtual (sidebar + grid, paleta rosa/branco Ybera), com o painel de status acima do grid de produtos
*   Estados de vínculo já demonstrados na POC anterior: Wake ✅ vinculado, TikTok ⚠️ autorização pendente, Shopee ❌ sem vínculo — cenário didático que **precisa ser atualizado** para refletir os três estados desta versão (incluindo o estado de token expirado, que a POC anterior não contemplava)
*   Esta POC é referência de estilo e estrutura, não POC oficial de handoff — a POC oficial só ocorre depois que este Brief de Design e o Brief de Engenharia voltarem validados, conforme o fluxo padrão (`instrucoes__POC_Navegavel_Handoff_v1.md`)

* * *

Proposta de valor a comunicar
-----------------------------

Enquanto o modelo atual obriga a influenciadora a direcionar manualmente o cliente para um único canal (Loja Ybera) e perde a atribuição em qualquer venda fora desse fluxo, o HUB entrega:
*   Para a **influenciadora:** um link único com vínculo de parceiro garantido em qualquer canal — sem retrabalho, sem perda de comissão.
*   Para o **cliente:** liberdade de comparar preço e frete e comprar onde preferir — sem pesquisar por conta própria, sem abrir mão do vínculo de quem indicou.

* * *

Capacidades a prototipar (H1)
-----------------------------

**1. Comparador público** Página acessível via link encurtado (`hub.ybera.com/r/{slug}`), sem login. Exibe o mesmo produto nos três canais (Wake, Shopee, TikTok Shop) com preço, frete e total. Ordena por menor custo-benefício. Oculta canal sem estoque, sem preço ou sem vínculo da influenciadora. **2. Link encurtado de compartilhamento** A influenciadora vê e compartilha um único link curto (gerado e exibido pelo Escritório Virtual, que consulta o HUB). Canal não faz parte do link — o HUB resolve no carregamento. **3. Status de integração por canal** Componente no Escritório Virtual (Tela A, painel de vínculos) mostrando o estado de vínculo da influenciadora por canal: **vinculado / nunca vinculou / vínculo expirado** (três estados — ver "Padrão de Vinculação" acima; substitui a lista original de quatro estados genéricos). Design deste componente é responsabilidade do Design; o HUB expõe apenas o endpoint de status (RF-10), lido diretamente do banco. **4. Onboarding e autorização de vínculo** Fluxo para a influenciadora autorizar o HUB nos canais que exigem OAuth individual — **Shopee (via Affiliates API, decisão Q-10 do DRP) e TikTok, ambos confirmados nesta versão** (antes, a exigência em Shopee era tratada como condicional). Conduzido inteiramente via link → Modal na Tela A, com dois modais distintos conforme o estado (primeira vinculação vs. reautorização) — ver "Padrão de Vinculação" acima. Esta é a resolução de H-UX-04, não mais um ponto em aberto.

* * *

Restrições de design (inegociáveis)
-----------------------------------

*   O acesso do cliente ao comparador é **público** — sem autenticação, sem fricção, sem login.
*   A influenciadora **não tem área logada no HUB**. Tudo o que ela vê está no Escritório Virtual.
*   O HUB **não exibe comissão, ganhos ou dados financeiros** — domínio exclusivo do Escritório Virtual.
*   O comparador é **mobile-first** — 4G como referência de performance (LCP < 2,5s, TTI < 3,5s).
*   Canal indisponível ou sem vínculo é **ocultado no comparador do cliente**, nunca exibido com dado vazio ou mensagem de erro visível ao cliente final. _(No Escritório Virtual, para a influenciadora, o estado é o oposto: precisa ser visível e acionável — ver Padrão de Vinculação.)_
*   CEP do cliente é **transitório** — sem armazenamento, sem fingerprinting. Postura LGPD-mínima.
*   **v1 é Brasil apenas** — sem internacionalização, sem Club Internacional.
*   O fluxo de vinculação/reautorização **não navega para fora da Tela A** — é resolvido via Modal, na própria tela de origem.

* * *

Critério de sucesso (métricas que o design precisa suportar)
------------------------------------------------------------

*   **North Star:** GMV da rede via HUB (todos os canais rastreados)
*   **Meta do 1º ciclo:** ≥ 700 influenciadoras usando o HUB em ≈ 30 dias
*   **Conversão do comparador:** visitas → clique em canal → compra confirmada (via affiliate reporting)
*   **Taxa de erro de atribuição:** < 2% de links sem retorno de atribuição (P0 de operação) O design precisa suportar rastreamento de clique por canal sem coletar dado pessoal do cliente.

> **Ponto de atenção herdado do DRP (não é decisão de Design, mas afeta o que a Tela A vai mostrar na prática):** a cobertura real de influenciadoras que vão autorizar Shopee e TikTok no 1º ciclo é incerta e está escalada como risco de alta severidade (Q-11, Q-12 do DRP, com retorno pendente de Comercial e CTO). Isso significa que o painel de vínculos pode passar a maior parte do tempo mostrando "nunca vinculou" para uma fatia grande da rede — o estado "sem vínculo" deve ser tratado como **estado comum a projetar bem**, não como exceção rara.

* * *

Faseamento (H1 — v1 · ≈ 30 dias)
--------------------------------

O que entra em H1 e precisa de design agora:
*   Comparador público (3 canais: Wake, Shopee, TikTok Shop)
*   Componente de status de integração por canal (Tela A — painel de vínculos, três estados)
*   Fluxo de onboarding/reautorização OAuth via Modal (dois modais distintos — ver Padrão de Vinculação) O que **não** entra em H1:
*   Histórico de links por influenciadora (H2)
*   Integração com Mercado Livre (H2)
*   Notificações próprias do HUB
*   Painel de admin

* * *

O que Design entrega de volta para Produto
------------------------------------------

Ao concluir o Discovery:
*   **Seção 7 da Feature HUB-001 revisada** — fluxos de usuário validados + estados de tela por capacidade (incluindo o estado novo de vínculo expirado)
*   **Decisões de UX** registradas na **seção 12 da Feature** (Histórico de Decisões), com motivo e responsável
*   **Detalhamento do Modal B** (reautorização) — copy e tratamento visual que o diferenciem do Modal A sem duplicar a estrutura de instrução+vídeo
*   Sinalização de qualquer hipótese de UX confirmada, contestada ou expandida

* * *

Histórico de Atualização
------------------------

**v1.1 · 10/07/2026** — Incorporado o retorno da validação técnica de Engenharia (Matheus, 09/07/2026, via Brief de Engenharia v1.1) e decisões de UX fechadas com o Head de Produto:
*   H-UX-04 marcada como **resolvida**: a exigência de OAuth individual passou a valer para Shopee **e** TikTok (era condicional em Shopee) — decisão Q-10 do DRP v1.8.
*   Nova seção **"Padrão de Vinculação (decidido)"**: três estados por canal (vinculado / nunca vinculou / vínculo expirado), lidos diretamente do banco, com dois modais distintos (Modal A — primeira vinculação; Modal B — reautorização, origem RF-11 do DRP).
*   Nova seção **"Telas de referência"**: Tela A (Catálogo Virtual, com estrutura de grid + painel de vínculos já estabelecida em rodada anterior de POC) e Tela da POC (referência publicada em `poc-hub-ybera.vercel.app`, a atualizar com os três estados).
*   Capacidade 3 (Status de integração por canal) e Capacidade 4 (Onboarding) atualizadas para refletir os três estados e o padrão de Modal.
*   Adicionado ponto de atenção herdado do DRP sobre incerteza de cobertura real (Q-11/Q-12) — não é decisão de Design, mas informa que "nunca vinculou" deve ser tratado como estado comum, não exceção.
*   Restrições de design: adicionada a distinção entre ocultação no comparador do cliente (canal escondido) e visibilidade no Escritório Virtual (canal precisa ser visível e acionável para a influenciadora).
**v1.0 · 26/06/2026** — Versão original, derivada do DRP v1.7.

* * *

_Brief Design — HUB Inteligente Ybera | Ybera Group — Time de Produto | v1.1 · 10/07/2026_ _Derivado do DRP v1.8 · Protocolo AI First Ybera — Etapa 2a · Validação técnica de Engenharia incorporada_