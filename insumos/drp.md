DRP — HUB Inteligente Ybera
===========================

**Ybera Group · Club Brasil — Crescimento e Canais**

> O DRP (Documento de Requisitos de Produto) é o PRD do Ybera Group — adaptado à nossa realidade de produto. É o artefato motor do fluxo de concepção: antecede a Feature e é o insumo direto para abertura de Features + PBIs + EMs no DevOps.

* * *

**Produto:** HUB Inteligente Ybera · **Versão:** 1.8 · **Autor:** Victor Lima (Produto) · Conduzido por Monteirinho · **Data:** 10/07/2026 · **Status:** Em revisão — retorno de Engenharia incorporado · **BVS:** 180

* * *

1.  Visão e Posicionamento

* * *

**O que é:** O HUB Inteligente é uma camada de crescimento sobre os canais de venda já operacionais da Ybera. Centraliza em um ponto único como a rede de influenciadoras do Club Brasil divulga produtos e como o cliente final compra — com comparação de preço e frete entre canais (Loja Ybera / Wake, Shopee e TikTok Shop) e geração de links com vínculo de parceiro garantido, independentemente do canal escolhido pelo cliente. **Para quem:** Influenciadoras e Gestores da rede Club Brasil que vendem via múltiplos canais, e clientes finais que recebem links e querem comprar no canal de sua preferência. **Por que existe:** A estratégia multicanal da Ybera expandiu para marketplaces sem um desenho unificado de como a influenciadora divulga, o cliente compra e a venda é atribuída. O HUB existe para organizar essa experiência e garantir que a comissão da influenciadora não dependa do canal escolhido pelo cliente.

* * *

2.  Problema e Oportunidade

* * *

**Dor identificada:** ⚠️ _hipótese não validada — percepção da Diretoria, não confirmada com influenciadoras, clientes ou dados de operação._ As formas de venda estão fragmentadas entre múltiplos canais — Loja Ybera (Wake), Shopee, TikTok Shop e Mercado Livre — cada um com preço, frete, condições e regras de atribuição próprios. Não existe um ponto único que organize a jornada para a influenciadora e para o cliente final. **Causa raiz:** A expansão para marketplaces foi adicionada sem um desenho unificado de divulgação, compra e atribuição. Cada canal cresceu de forma isolada, sem que a camada de influenciadora fosse conectada a todos eles de forma estruturada. **Evidências:** ⚠️ Não há dados quantitativos nem qualitativos estruturados que confirmem a dor. Levantar baselines é pré-requisito para fixar metas numéricas — registrado como Q-01 e Q-07 na seção 11. **Impacto de não agir:** A rede continua orientando clientes manualmente para um único canal (Loja Ybera); atribuição é perdida sempre que o cliente compra fora do link direto; GMV potencial dos canais já operacionais (Shopee, TikTok Shop) fica subaproveitado; risco de queda de engajamento da rede pela percepção de desorganização. **Paliativo atual:** Orientação manual — influenciadoras são instruídas a direcionar o cliente à Loja Ybera, único canal onde a atribuição funciona hoje. **Oportunidade:** O quadrante "comparação multi-canal × comissão garantida pela marca" está vazio no Brasil. A Ybera é parceira oficial de TikTok e Shopee, o que viabiliza acesso às APIs de afiliado e torna o HUB tecnicamente possível agora.

* * *

3.  Hipóteses e Premissas

* * *

*   ⚠️ Existe dor real de desorganização dos canais sentida por influenciadoras e/ou clientes. Toda a demanda depende desta hipótese — o 1º ciclo é o teste.
*   A Ybera conseguirá credenciar acesso às APIs de afiliado gated (Shopee AMS e TikTok Affiliate Seller API) em tempo hábil para o v1.
*   O Escritório Virtual consegue fornecer identidade (chave da rede Club) e catálogo via API para o HUB consumir.
*   O padrão de identity resolution (creator_id / affiliate_id → identidade Club) pode ser resolvido com chave única (e-mail/documento) coletada no onboarding.
*   As influenciadoras farão o onboarding como creator TikTok e afiliada Shopee em volume suficiente para atingir a meta de ≥ 700 no 1º ciclo. ⚠️ _Premissa sob pressão adicional desde a validação técnica: com Shopee confirmada via Affiliates API (Q-10), a autorização individual OAuth passou a valer para os dois canais gated — não apenas TikTok. Ver risco novo na seção 10 e Q-11/Q-12 na seção 11._
*   O Escritório Virtual manterá o domínio de comissionamento, cálculo e payout — o HUB não precisará replicar essa lógica.
*   O SKU interno Ybera é o mesmo produto nos três canais (Wake, Shopee, TikTok Shop) — premissa confirmada pela operação, base para a resolução de identidade de produto no comparador.

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
*   JTBD: "Quando recebo a indicação de um produto, quero comparar preço e frete entre os canais disponíveis e comprar no que me for mais conveniente, para que eu não precise pesquisar por conta própria nem abrir mão das condições de quem me indicou." **Persona 4 — Escritório Virtual (sistema interno)**
*   Quem é: Sistema interno responsável por comissionamento, conciliação, payout e front da influenciadora. É a fonte de identidade e catálogo para o HUB.
*   JTBD: "Quando a influenciadora precisa do link de um produto, quero consultar um endpoint simples do HUB e receber o link pronto para exibir, para que eu não precise replicar a lógica de geração de links nem manter dados de canal."

* * *

5.  Princípios de Produto

* * *

**Inegociável:**
*   O acesso do cliente ao comparador é público — sem autenticação, sem fricção
*   A influenciadora não tem área logada no HUB; opera no front do Escritório Virtual, que consome endpoints do HUB
*   O HUB não calcula comissão, não processa pagamento e não exibe ganhos — domínio exclusivo do Escritório Virtual
*   O vínculo do parceiro (creator/affiliate) deve ser garantido em qualquer canal que o cliente escolher
*   O HUB compõe o vínculo de cada canal automaticamente — a influenciadora não gera nem registra links manualmente
*   O v1 é Brasil apenas, roles Influenciadora e Gestor apenas **Fora do produto:**
*   Cálculo, exibição ou pagamento de comissão (Escritório Virtual)
*   Checkout ou processamento de pagamento (plataformas de destino)
*   Reconciliação de venda e atribuição financeira (B2C existente)
*   Feed push de links ao Escritório (substituído por consulta sob demanda a endpoint simples)
*   Painel de admin no HUB
*   Notificações próprias do HUB
*   Integração com Mercado Livre (fase 2)
*   Internacionalização (Club Internacional / Shopify)
*   Antifraude avançado (Escritório Virtual / fase 2)

* * *

6.  Proposta de Valor

* * *

Enquanto o modelo atual obriga a influenciadora a direcionar manualmente o cliente para um único canal (Loja Ybera) e perde a atribuição em qualquer venda fora desse fluxo, o HUB Inteligente entrega para a influenciadora um link único com vínculo de parceiro garantido em qualquer canal, e para o cliente a liberdade de comparar preço e frete e comprar onde preferir — sem retrabalho, sem perda de comissão, sem depender do canal.

* * *

7.  Escopo de Capacidades

* * *

> Macro-funcionalidades do produto. O detalhamento técnico vive nas Features derivadas.

**Comparador público (cliente anônimo)** Comparação de preço e frete do mesmo produto entre os 3 canais disponíveis (Wake, Shopee, TikTok Shop), ordenada por menor custo-benefício, acessível via link sem login. Canais indisponíveis são ocultados graciosamente. A resolução de qual produto exibir em cada canal usa o SKU interno Ybera como chave única — o mesmo SKU vale nos três canais. 

**Link encurtado de compartilhamento** A influenciadora compartilha um único link curto (ex.: `hub.ybera.com/r/abc123`) que carrega apenas dois parâmetros: produto e influenciadora. Canal não faz parte do link. Ao abrir, o cliente cai na página de comparação; o HUB resolve os parâmetros e gera os links de destino por canal com a atribuição correta embutida. A abordagem encurtada evita quebra de URL em redes sociais e elimina risco de parâmetro faltando no compartilhamento. ✅ _Embalagem do link fechada como slug encurtado (Q-09) — ver seção 11._ 

**Geração de links com vínculo de parceiro** Quando a página de comparação carrega, o HUB gera os links de destino para cada canal carregando o vínculo correto do parceiro — TikTok (Creator, via Affiliate API obrigatória), Shopee (Affiliate, via Affiliates API — ✅ decisão fechada, ver Q-10 na seção 11), Wake (atribuição nativa via montagem de URL). Link bloqueado para canais onde a influenciadora não possui vínculo ativo. 

**Endpoint de link para o Escritório Virtual** O Escritório Virtual consome um único endpoint do HUB — `GET /link?produto=X&influenciadora=Y` — e recebe o link de compartilhamento pronto para exibir à influenciadora. O HUB é responsável por toda a lógica: geração do link, busca de dados nos canais e montagem da página de comparação. Não há feed: o Escritório apenas consulta sob demanda quando precisa exibir o link. ⚠️ _SLA de resposta (p95 < 500ms) depende de resolução de arquitetura entre cache pré-aquecido e busca sob demanda — decisão técnica a fechar no desenho da Feature, não neste DRP._ 

**Sincronização periódica de preço e frete (cache)** Sincronização automática via APIs de seller dos canais, preferencialmente sobre Cloudflare. Defasagem máxima de 30 min por canal. Atualização manual disponível via endpoint consumível pelo Escritório. ⚠️ _Escala por catálogo × canais, não por catálogo × nº de influenciadoras — correção de premissa confirmada na validação técnica (ver RNF-Escalabilidade, seção 8)._ 

**Status de integração por canal** Exposição via endpoint do status de vínculo da influenciadora por canal (integrado, pendente onboarding, inativo, erro). Consumido pelo front do Escritório para montar o componente de status. 

**Onboarding e validação de vínculo** Registro e validação do vínculo da influenciadora como creator TikTok (sob seller Ybera) e afiliada Shopee (sob hub Ybera). Comportamento gracioso para quem ainda não completou o onboarding. **Renovação de autorização do afiliado (novo, origem: validação técnica)

** Manutenção da autorização OAuth do afiliado ao longo do tempo, sem exigir reautorização manual a cada expiração de token. Capacidade de sustentação técnica do vínculo já descrito acima — não uma nova funcionalidade visível ao usuário final, mas pré-requisito para que a geração de links comissionáveis em Shopee e TikTok continue funcionando de forma contínua. Ver RF-11 na seção 8.

* * *

8.  Requisitos Funcionais e Não Funcionais

* * *

> Nível estratégico — o que o produto precisa fazer e quais restrições técnicas são inegociáveis. O detalhamento técnico (RFs granulares, Gherkin, RNs por módulo) vive nas Features derivadas.

**Requisitos Funcionais**
*   **RF-01 — Endpoint de link para o Escritório:** expor endpoint `GET /link?produto=X&influenciadora=Y` devolvendo o link de compartilhamento pronto; o HUB detém toda a lógica de geração e dados — o Escritório é apenas consumidor sob demanda · Must
*   **RF-02 — Geração de link encurtado:** gerar link curto (produto × influenciadora) persistido no backend; resolver o slug na abertura da página e compor os links de destino por canal com a atribuição correta · Must
*   **RF-03 — Bloqueio por ausência de vínculo:** bloquear a geração de link de um canal quando não há vínculo ativo · Must
*   **RF-04 — Composição de link por canal:** compor automaticamente o link de destino de cada canal com o vínculo correto do parceiro (Wake URL direta, Shopee via Affiliates API — ✅ fechado, ver Q-10, TikTok Affiliate API) · Must
*   **RF-05 — Comparador público:** comparar o mesmo produto entre canais (preço, frete, condições) para o cliente anônimo, sem login · Must
*   **RF-06 — Ordenação e ocultação:** esconder canal sem preço/estoque/vínculo válido e ordenar por menor preço + frete · Must
*   **RF-07 — Sincronização periódica:** sincronizar preço/frete via API dos canais (cache, preferencialmente Cloudflare) · Must
*   **RF-08 — Redirecionamento:** redirecionar o cliente à página do produto no canal escolhido com vínculo preservado · Must
*   **RF-09 — Onboarding e validação de vínculo:** registrar e validar o vínculo da influenciadora por canal · Must
*   **RF-10 — Endpoint de status de integração:** expor via endpoint o status de integração por canal · Must
*   **RF-11 — Renovação de token OAuth do afiliado (novo, origem: validação técnica com Engenharia, 09/07/2026):** manter o token de autorização do afiliado renovado automaticamente, sem exigir reautorização manual a cada expiração, para os afiliados vinculados em Shopee e TikTok. Sem este requisito, o link comissionável desses dois canais deixa de funcionar quando o token expira — identificado pela Engenharia como pré-requisito de go-live, não como hipótese. · Must **Requisitos Não Funcionais**
*   **RNF-Performance:** comparador mobile-first (4G); LCP < 2,5s · TTI < 3,5s · resposta do comparador (cache) p95 < 500ms — _condicionado à decisão de arquitetura entre cache pré-aquecido e busca sob demanda, confirmada como necessária na validação técnica_
*   **RNF-Segurança:** integridade do link via assinatura/HMAC; endpoints autenticados (token/mTLS), idempotentes e rate-limited; segredos de API em cofre; sem dados de pagamento no HUB
*   **RNF-Privacidade / LGPD:** comparador não coleta dado pessoal; CEP transitório, não armazenado; sem fingerprinting; métricas agregadas/anônimas; dado de venda/atribuição tratado no Escritório, não no HUB. Gatilho de revisão com DPO se passar a armazenar PII
*   **RNF-Disponibilidade:** degradação graciosa — se um canal cai, esconder e servir cache; alvo 99% no comparador público; o HUB não depende de um único canal
*   **RNF-Escalabilidade:** suportar catálogo completo × canais de venda na geração de links e na resposta ao endpoint de consulta. ⚠️ _Premissa corrigida na validação técnica: a carga de sincronização de preço/frete escala pelo catálogo multiplicado pelo número de canais, não pelo número de influenciadoras — frete não é calculado por afiliado neste contexto. A escala por volume de influenciadoras (≥ 700) segue relevante para a geração de links e para o endpoint de status, mas não para a sincronização de preço/frete._
*   **RNF-Resiliência:** sincronização periódica (não tempo real); retry/backoff e circuit breaker por canal; tolerância a rate limits e a mudanças de API
*   **RNF-Frescor de dados:** defasagem máxima de 30 min por canal; atualização manual via endpoint consumível pelo Escritório

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
*   Meta: A definir após baseline **% de vendas fora da Loja Ybera via HUB**
*   Como medir: Affiliate reporting Shopee + TikTok reconciliados no Escritório
*   Meta: A definir — indicador primário de validação da hipótese-mãe **Custo de comissão complementada por canal**
*   Como medir: Escritório Virtual / Financeiro
*   Meta: A definir — guarda-corpo de margem **Taxa de erro de atribuição**
*   Como medir: % de links sem retorno de atribuição no affiliate reporting
*   Meta: < 2% (P0 de operação) **Meta do 1º Ciclo:** ≥ 700 influenciadoras usando o HUB em ≈ 30 dias, com primeiras vendas rastreadas fora da Loja Ybera e hipótese-mãe respondida. Ao fim do ciclo, a decisão é: escala, pivota ou para.

> ⚠️ **Ponto de atenção sobre a meta de ≥ 700:** com a autorização OAuth individual agora confirmada para Shopee e TikTok (não apenas TikTok), a % real da rede que vai ativar os dois canais gated no 1º ciclo é incerta — ver risco novo e Q-12 (seção 11). A meta de adoção pode ser atingida via Wake (sem exigência de OAuth) mesmo que a cobertura de Shopee/TikTok fique abaixo do esperado; isso não invalida a meta de adoção, mas pode limitar a validação da hipótese-mãe nos canais gated especificamente.

### BVS — Business Value Score

_BVS = Impacto × Urgência × Confiança × Valor Estratégico (faixa 1–375)_
*   **Impacto:** 4/5 — camada de crescimento sobre canais que já vendem; impacto forte e direto na receita, sem ser load-bearing
*   **Urgência:** 5/5 — diretriz direta da Diretoria/sócios + quadrante de mercado vazio
*   **Confiança:** 3/5 — requisitos mapeados, atribuição mitigada e baseline acessível; hipótese-mãe ainda não validada impede nota 4. _Mantida em 3, não elevada nesta versão: a validação técnica reduziu incerteza de arquitetura, mas abriu dois riscos novos de escalonamento (seção 10) que compensam o ganho._
*   **Valor Estratégico:** 3/3 — origem na Diretoria/sócios; alinhamento direto com a estratégia multicanal
*   **BVS Total: 180** · **T-Shirt: GG** (2–4 meses a validar com Engenharia)

> ⚠️ BVS subiu de 120 (preliminar) para 180 pela Confiança (2→3): atribuição mitigada + baseline acessível. O teto da Confiança fica reservado para após a validação da hipótese-mãe no 1º ciclo **e** após a resolução dos riscos de escalonamento abertos nesta versão (ver seção 10).

* * *

10.  Riscos Estratégicos e Mitigações

* * *

**Hipótese-mãe não validada**
*   Tipo: Negócio · Probabilidade: Média · Impacto: Alto
*   Mitigação: O 1º ciclo é o teste — dados do HUB + escuta estruturada respondem a hipótese. Ao fim do ciclo, decisão formal: escala / pivota / para. **APIs de afiliado gated (critical path)**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Alto
*   Mitigação: Iniciar credenciamento imediatamente (Shopee AMS e TikTok Affiliate Seller API). Sem esse acesso, a atribuição de Shopee e TikTok não fecha. **Identity resolution falha**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Alto
*   Mitigação: Chave única (e-mail/documento) coletada no onboarding. Reconciliação manual no Escritório como fallback. **Atribuição vem do affiliate reporting, não do pedido de seller**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Alto
*   Mitigação: Retry/backoff automático na leitura periódica do affiliate reporting. Conciliação periódica com fallback operacional definido antes do go-live. **Refresh de token OAuth ausente na B2C-BackEnd (novo — origem: validação técnica, 09/07/2026)**
*   Tipo: Técnico · Probabilidade: Confirmada (não é mais hipótese — comportamento atual do sistema verificado pela Engenharia) · Impacto: Alto
*   Mitigação: A B2C-BackEnd hoje só valida se a conta pertence ao afiliado, mas não renova o token de autorização. Sem renovação automática, o link comissionável de Shopee e TikTok para de funcionar quando o token expira. Já endereçado como requisito confirmado (RF-11, seção 8) — passa a ser trabalho de implementação, com prioridade de pré-requisito de go-live, não apenas risco monitorado. **🚨 Autorização individual de afiliado (OAuth) agora exigida em dois canais gated, não um (risco ampliado — origem: validação técnica, 09/07/2026)**
*   Tipo: Operacional / Comercial · Probabilidade: Alta · Impacto: Alto
*   Contexto: com a decisão técnica de usar a Shopee Affiliates API (Q-10 fechada), a exigência de autorização individual do afiliado — que antes valia apenas para TikTok — passa a valer também para Shopee. Isso dobra o volume de afiliadas que precisam reautorizar o app para os canais gated funcionarem, e não há hoje estimativa de quantas irão de fato completar essa autorização.
*   **Ponto de atenção — escalonamento necessário.** Este risco requer contato ativo com a Shopee (via canal de parceria oficial) para entender viabilidade e prazo de suporte à autorização em massa, e comunicação formal à liderança antes do refinamento técnico da Feature. Rolim é responsável pelo escalonamento, com envio em paralelo a **Romulo Alves** (Comercial — dimensiona impacto na campanha de reautorização e no relacionamento com a rede) e **Vinícius Graff** (CTO — avalia viabilidade técnica de suporte a autorização em massa e volume de retrabalho na B2C-BackEnd). Ver Q-11 na seção 11. **🚨 Incerteza sobre cobertura real de afiliadas nos dois canais gated (risco novo — origem: validação técnica, 09/07/2026)**
*   Tipo: Negócio · Probabilidade: Alta · Impacto: Médio-Alto
*   Contexto: não há hoje forma de estimar com confiança qual % da rede de ≥ 700 influenciadoras vai de fato autorizar e ativar Shopee e TikTok no 1º ciclo. Isso afeta diretamente o dimensionamento da meta (o quanto da meta de adoção pode ser atendida só por Wake, sem depender de OAuth) e o cálculo de carga técnica da geração de links e do onboarding.
*   **Ponto de atenção — escalonamento necessário, sem resposta de Produto no momento.** Não é uma decisão que Produto pode responder isoladamente sem dado — precisa ser escalado para leitura conjunta com liderança antes de virar meta oficial. Rolim escalona para **Romulo Alves** e **Vinícius Graff** em paralelo. Ver Q-12 na seção 11. **Shopee — URL pattern não documentado para latência e rate limit**
*   Tipo: Técnico · Probabilidade: Média · Impacto: Médio
*   ✅ Superado — Engenharia decidiu ir direto pela Affiliates API (Q-10 fechada), eliminando a necessidade de testar o URL pattern. Risco mantido no histórico por rastreabilidade; não é mais ativo. **Pré-requisito de onboarding não atendido por toda a rede**
*   Tipo: Operacional · Probabilidade: Média · Impacto: Médio
*   Mitigação: Comportamento gracioso (oculta canal / bloqueia link). Campanha de onboarding antes do go-to-market. _Ver também os dois riscos ampliados acima — este risco geral de onboarding se intensifica especificamente pela exigência dobrada de OAuth._ **Políticas dos marketplaces mudam unilateralmente**
*   Tipo: Externo · Probabilidade: Alta · Impacto: Médio
*   Mitigação: Sincronização periódica resiliente. Circuit breaker por canal. Monitorar changelogs das plataformas. **Reabertura LGPD**
*   Tipo: Legal · Probabilidade: Baixa · Impacto: Médio
*   Mitigação: v1 mantém postura mínima (sem PII de cliente no HUB). Gatilho de revisão com DPO já previsto. **Riscos descartados:** _dupla comissão (domínio do Escritório); regressão no comissionamento Club (domínio do Escritório); T&Cs / tráfego pago (Ybera é parceira oficial de TikTok/Shopee e não faz divulgação paga)._

* * *

11.  Questões Abertas e Dependências

* * *

> O que ainda não está respondido e precisa de decisão antes da Feature.

**Questões Abertas**
*   **Q-01 — Hipótese-mãe é dor real?** (escala / pivota / para) · Decide: Produto + Diretoria · Prazo: Fim do 1º ciclo
*   **Q-07 — Dimensionamento da meta:** total de influenciadoras ativas e % já vinculadas · Decide: Produto · Prazo: Antes do go-to-market
*   **🚨 Q-11 — Campanha de reautorização Shopee + TikTok (novo, origem: validação técnica — Q-A da Avaliação de Engenharia):** com a autorização OAuth individual agora valendo para os dois canais gated, como será a campanha para levar a rede a reautorizar o app em ambos? Requer contato com a Shopee para entender suporte a autorização em massa. **Escalado como risco de alta severidade — ver seção 10.** · Decide: Rolim, em conjunto com Romulo Alves (Comercial) e Vinícius Graff (CTO) · Prazo: Antes do refinamento técnico da Feature
*   **🚨 Q-12 — Cobertura real esperada de canal (novo, origem: validação técnica — Q-B da Avaliação de Engenharia):** qual % realista da rede de ≥ 700 afiliadas vai ativar Shopee e TikTok no 1º ciclo, dado que ambos exigem autorização individual? Alimenta o dimensionamento da meta (Q-07) e o cálculo de carga da sincronização. **Escalado como risco de alta severidade — ver seção 10. Rolim não responde isoladamente; requer leitura conjunta com liderança.** · Decide: Rolim, em conjunto com Romulo Alves e Vinícius Graff · Prazo: Antes do refinamento técnico da Feature **Questões Fechadas**
*   ✅ **Q-02 — Equidade de comissão entre canais:** o HUB não tem lógica de comissão — domínio exclusivo do Escritório Virtual, já resolvido pelo B2C. Os bônus são iguais entre canais; o HUB trata todos como equivalentes. A página é pública e não exibe % de comissão.
*   ✅ **Q-03 — Granularidade do feed HUB → Escritório:** não há feed. O Escritório consome um endpoint simples do HUB (`GET /link?produto=X&influenciadora=Y`) e recebe o link pronto. Toda a lógica de dados e geração é responsabilidade do HUB.
*   ✅ **Q-04 — Chave de reconciliação no Escritório:** fora do escopo do HUB. Reconciliação e pagamento já funcionam no B2C. Responsabilidade do HUB é apenas garantir que o link de destino de cada canal carregue o identificador correto da afiliada — o marketplace registra a venda e o B2C cuida do resto.
*   ✅ **Q-05 — Fallback de atribuição:** fora do escopo do HUB. Se o cliente não passar pelo link, o marketplace não registra atribuição — limitação estrutural do modelo de afiliado. A única mitigação técnica possível (cookie/sessão por dispositivo) vai contra a postura LGPD-mínima do v1 (Seção 13) e foi descartada. Aceito como perda inerente ao modelo.
*   ✅ **Q-06 — Composição do link:** o HUB compõe o vínculo automaticamente — a influenciadora não gera nem registra link manualmente. Para cada produto × afiliada, o HUB gera os links de destino de cada canal. Detalhamento técnico confirmado por canal:
    *   **Wake (ybera.com):** montagem de URL direta com o código do parceiro, **sem chamada de API**. Os influencers já estão cadastrados como Parceiros na Wake (`GET /parceiros/{parceiroId}`); o vínculo é passado via query param `?parceiro={codigo}` na URL do produto. Formato confirmado: `https://www.ybera.com/produto/{slug-do-produto}?parceiro={codigo}` (ex.: `.../produto/escova-progressiva-500g-fashion-gold-150264?parceiro=52154`). Não depende de permissão do afiliado nem de OAuth — basta o código de parceiro já existente no B2C
    *   **Shopee:** ✅ **Decisão fechada (Q-10) — Affiliates API** (GraphQL + HMAC-SHA256), não URL pattern. Gera shortlink oficial rastreável, mas exige que **cada afiliado** habilite a API na própria conta do Shopee Affiliates Program e forneça credenciais individuais (`affiliate_id` + chave de acesso) — não as credenciais da Ybera, garantindo a atribuição correta da comissão. A validação técnica (09/07/2026) confirmou este caminho como definitivo, superando a necessidade de testar o URL pattern com compra real.
    *   **TikTok Shop:** não existe URL pattern — **chamada de API obrigatória**. Fluxo encadeado: (1) a Ybera, como `affiliate_seller`, prepara a colaboração do produto (Open Collaboration — qualquer creator promove — ou Target Collaboration — seller convida creators específicos); (2) o HUB chama o endpoint do lado `affiliate_creator` (Creator Generate Publisher Link, material do tipo PRODUCT, com o `publisher_id` da afiliada) usando o token OAuth da própria influenciadora para gerar o link comissionável. O link é sempre gerado sob a identidade do creator, não da Ybera
    *   ⚠️ **Implicação de pré-requisito externo (ampliada nesta versão):** com a decisão de Q-10, **tanto Shopee quanto TikTok** exigem que o próprio afiliado conceda permissão para que o HUB gere os links em seu nome — cada influenciadora precisa reautorizar o app incluindo os escopos `affiliate_creator`. Antes desta versão, essa exigência era tratada como condicional em Shopee; agora é confirmada para os dois canais. Sem essa autorização individual, não é possível gerar o link comissionável. É dependência externa no caminho crítico — ver **D-07** e os riscos ampliados na seção 10 (Q-11)
*   ✅ **Q-08 — Mapeamento de SKU entre canais:** resolvido. O SKU interno Ybera é o mesmo produto nos três canais — vira invariante do produto. O comparador resolve a identidade do produto pela chave de SKU única. Guarda-corpo: se o SKU não retornar em um canal, o canal é ocultado no comparador (degradação graciosa) em vez de exibir produto divergente. Sem necessidade de planilha de mapeamento ou matching automático.
*   ✅ **Q-09 — Embalagem do link:** **Fechada — slug encurtado**, conforme decisão já registrada na seção 13. Confirmado na validação técnica (09/07/2026); não retorna ao Head de Engenharia.
*   ✅ **Q-10 — Shopee, URL pattern vs. Affiliates API:** **Fechada — Affiliates API**, decisão da Engenharia na validação técnica (09/07/2026). Motivo: rastreamento oficial confiável, sem necessidade de testar latência/rate limit do URL pattern. Consequência aceita: autorização OAuth individual do afiliado em Shopee, além de TikTok — ver Q-11 e risco ampliado na seção 10. **Dependências**
*   **D-01 — Escritório Virtual** · Responsável: Escritório / Produto · Status: Ativa — contrato de interface a formalizar (ponto único de criticidade)
*   **D-02 — Engenharia Ybera** · Responsável: Engenharia · Status: Refinamento técnico pendente (integrações, credenciais, composição de links por canal)
*   **D-03 — APIs de afiliado gated** · Responsável: Engenharia + plataformas · Status: A iniciar — critical path
*   **D-04 — Identidade + catálogo via API** · Responsável: Escritório / Engenharia · Status: Disponível via API do back-end do Escritório
*   **D-05 — Baseline de métricas** · Responsável: Produto · Status: Viável; não bloqueia
*   **D-06 — Onboarding de creator/afiliada** · Responsável: Produto / Operação · Status: A planejar antes do go-to-market
*   **D-07 — Autorização individual dos afiliados (OAuth)** · Responsável: Produto / Operação + cada afiliado · Status: A planejar — **critical path, agora confirmado para Shopee E TikTok** (era tratado como condicional em Shopee; a decisão de Q-10 fechou a condição). Shopee e TikTok exigem que cada influenciadora conceda permissão na própria conta para o HUB gerar links comissionáveis em seu nome (escopos `affiliate_creator`). Sem autorização individual, o HUB não gera o link daquele canal para aquela afiliada. No TikTok é inescapável (não há URL pattern); em Shopee, é consequência direta da decisão de usar a Affiliates API. Muda o fluxo de login dos afiliados — a experiência de reautorização será tratada no design após a POC. **Ver escalonamento em Q-11, seção 10.**

* * *

12.  Roadmap Macro

* * *

> Horizontes de entrega — não datas fixas.

**H1 — Curto prazo (v1 · ≈ 30 dias)**
*   Comparador público (3 canais: Wake, Shopee, TikTok Shop)
*   Geração de link encurtado (produto × influenciadora) com resolução server-side
*   Geração de links de destino por canal com vínculo de parceiro garantido
*   Endpoint de link consumível pelo Escritório Virtual (`GET /link`)
*   Sincronização periódica de preço e frete (cache)
*   Status de integração por canal
*   Onboarding e validação de vínculo
*   Renovação de token OAuth do afiliado (RF-11 — novo, pré-requisito de go-live confirmado na validação técnica)
*   Critério de gate: ≥ 700 influenciadoras ativas + hipótese-mãe respondida → decisão de escala / pivota / para **H2 — Médio prazo (v1.1 · condicional ao H1)**
*   Integração com Mercado Livre (4º canal)
*   Histórico de links por influenciadora
*   Refinamento de identity resolution
*   Notificações de venda atribuída
*   Análise de comportamento de cliente (data team) **H3 — Longo prazo (v2+ · condicional ao H2)**
*   Expansão para Club Internacional / Shopify Global
*   Demais roles (Gestor, G20)
*   Inteligência de canal (sugestão automática de melhor canal por perfil de cliente)
*   APIs de seller em substituição às APIs de afiliado onde viável

* * *

13.  Decisões Tomadas

* * *

**HUB é headless para a influenciadora — sem front-end próprio**
*   Opções avaliadas: HUB com área logada vs. HUB expondo endpoints consumidos pelo Escritório
*   Escolha: HUB expõe apenas endpoints + comparador público; área da influenciadora fica no Escritório
*   Razão: Evita duplicação de front-end, reusa a arquitetura existente e mantém o domínio de comissão centralizado
*   Trade-off aceito: O HUB depende do Escritório Virtual para qualquer evolução que envolva a experiência da influenciadora **Escritório consome endpoint sob demanda — sem feed push**
*   Opções avaliadas: HUB envia feed de links ao Escritório (push) vs. Escritório consulta endpoint quando precisa (pull)
*   Escolha: Pull — o Escritório consome `GET /link?produto=X&influenciadora=Y` e recebe o link pronto; o HUB detém toda a lógica
*   Razão: O Escritório só precisa do link no momento de exibir à influenciadora; um feed push criaria sincronização de estado desnecessária entre dois sistemas
*   Trade-off aceito: O link é gerado/resolvido sob demanda; latência da consulta precisa ficar dentro do SLA de exibição do front do Escritório **Link de compartilhamento encurtado — parâmetros produto + influenciadora apenas**
*   Opções avaliadas: URL longa com todos os parâmetros explícitos vs. link encurtado com slug que resolve no backend
*   Escolha: Link encurtado (ex.: `hub.ybera.com/r/abc123`) persistindo produto + influenciadora no backend. Canal não é parâmetro do link — os links de destino por canal são gerados pelo HUB quando a página de comparação carrega
*   Razão: Redes sociais podem quebrar ou truncar URLs longas com múltiplos parâmetros, comprometendo a atribuição. Com o slug, todos os parâmetros ficam no backend e não há risco de link incompleto por cópia ou compartilhamento
*   Trade-off aceito: Requer persistência de um registro por link gerado no backend do HUB
*   ✅ Confirmado na validação técnica (09/07/2026) — Q-09 fechada, sem retorno ao Head de Engenharia **Geração de link de destino por canal — abordagem distinta por plataforma**
*   Escolha: Cada canal tem uma abordagem técnica própria, sem URL pattern universal. **Wake:** montagem de URL com código do parceiro já cadastrado no B2C (`?parceiro={codigo}`), sem API e sem autorização do afiliado. **Shopee:** ✅ Affiliates API (decisão fechada na validação técnica, Q-10) — não URL pattern. **TikTok Shop:** Affiliate API obrigatória (fluxo encadeado affiliate_seller prepara colaboração + affiliate_creator gera o link sob a identidade do creator, via OAuth da influenciadora)
*   Razão: TikTok não disponibiliza URL pattern; Shopee via Affiliates API garante rastreamento oficial confiável, superando o risco de latência/rate limit não documentado do URL pattern; Wake já tem parceiros cadastrados no B2C com vínculo via query param
*   Trade-off aceito: Complexidade de implementação distinta por canal. **Shopee e TikTok exigem autorização individual de cada afiliado** (escopos `affiliate_creator`) — dependência externa no caminho crítico (D-07) que altera o fluxo de login dos afiliados, **agora confirmada para os dois canais** (antes, condicional em Shopee). Wake não tem essa exigência. Este trade-off ampliado gerou os riscos de escalonamento registrados na seção 10 (Q-11, Q-12) **Refresh de token OAuth dos afiliados na B2C-BackEnd (novo — origem: validação técnica, 09/07/2026)**
*   Opções avaliadas: manter apenas validação de conta existente (sem renovação) vs. implementar renovação automática de token
*   Escolha: Implementar renovação automática de token na B2C-BackEnd, cobrindo os afiliados autorizados em Shopee e TikTok
*   Razão: A B2C-BackEnd hoje só valida se a conta pertence ao afiliado, mas não renova o token. Sem renovação, o link comissionável para de funcionar quando o token expira — identificado pela Engenharia como pré-requisito de go-live, não hipótese a testar
*   Trade-off aceito: Escopo de trabalho adicional em B2C-BackEnd (RF-11), não estimado na versão original do DRP. Responsável: Engenharia **SKU interno Ybera como chave única de produto entre canais**
*   Opções avaliadas: assumir SKU padronizado vs. planilha de mapeamento administrável vs. matching automático por EAN/similaridade
*   Escolha: SKU interno único — o mesmo SKU identifica o produto nos três canais (premissa confirmada pela operação). Vira invariante do produto
*   Razão: O SKU já é o mesmo nos três canais na operação real; não há necessidade de camada de mapeamento ou matching
*   Trade-off aceito: Guarda-corpo obrigatório — se o SKU não retornar em um canal, ocultar o canal no comparador em vez de exibir produto divergente **Remoção do Middleware como camada intermediária**
*   Opções avaliadas: HUB → Middleware → Escritório vs. HUB → Escritório (back-end a back-end)
*   Escolha: Integração direta HUB ↔ Escritório via API, sem Middleware dedicado
*   Razão: O HUB consome apenas identidade + catálogo do Escritório — sem complexidade que justifique uma camada intermediária
*   Trade-off aceito: HUB acoplado diretamente ao contrato de API do Escritório. Confirmado como viável na validação técnica (HT-05); formalização do `contract.yaml` do Escritório segue como pré-requisito antes de codar **Postura LGPD-mínima no v1**
*   Opções avaliadas: Coletar e armazenar dados do cliente vs. dados mínimos (métricas agregadas/anônimas)
*   Escolha: Dados mínimos — cliente anônimo, CEP transitório, sem fingerprinting, sem rastreio individual
*   Razão: Elimina gate jurídico no v1 e mantém o dado de venda/atribuição centralizado no Escritório
*   Trade-off aceito: Analytics de cliente limitados no v1; evolução futura exige revisão com DPO **Atribuição via affiliate reporting, não via order API de seller**
*   Opções avaliadas: Capturar atribuição no pedido de seller vs. ler affiliate reporting das plataformas
*   Escolha: Affiliate reporting — o dado de atribuição não vem no pedido de seller em Shopee e TikTok
*   Razão: É como as plataformas disponibilizam o dado de afiliado/creator; não há alternativa técnica válida
*   Trade-off aceito: Leitura periódica (não tempo real); necessidade de retry/backoff e reconciliação manual **APIs gated de afiliado como critical path inegociável do v1**
*   Opções avaliadas: Lançar v1 com APIs públicas vs. aguardar credenciamento nas APIs gated
*   Escolha: Credenciamento nas APIs gated é pré-requisito inegociável
*   Razão: Sem as APIs de afiliado, a atribuição de Shopee e TikTok não fecha e o HUB perde seu diferencial central
*   Trade-off aceito: Risco de atraso se o credenciamento demorar; iniciar imediatamente para mitigar **Frente jurídica descartada como risco ativo**
*   Opções avaliadas: Validação jurídica formal dos T&Cs vs. confiar no status de parceria oficial
*   Escolha: Frente jurídica descartada — Ybera é parceira oficial de TikTok e Shopee e não faz tráfego pago
*   Razão: Parceria oficial implica uso validado pelos próprios parceiros; ausência de tráfego pago elimina o principal vetor de risco
*   Trade-off aceito: Decisão baseada em fontes secundárias (2025–2026); monitorar mudanças de política

* * *

14.  F4P — Fit for Purpose

* * *

> Leitura analítica das seções 1–13. Decisão final é do PM/PO.

**1. Adequação ao Uso**
*   Parecer: Cliente final: jornada anônima, mobile-first, sem login, redirect direto — baixo atrito, sem necessidade de treinamento. Influenciadora e Gestor: não operam no HUB diretamente; usam o front do Escritório (ambiente familiar), que consome os endpoints — loop simples. Canal indisponível é tratado com degradação graciosa. Ponto de atenção: UX do comparador a validar no design antes do desenvolvimento.
*   Resultado: ⚠️ Aprovado com ressalvas (UX a validar no design) **2. Adequação ao Mundo**
*   Parecer: Econômico: modelo de comissão complementar do Escritório controla o custo; margem por canal é guarda-corpo do Financeiro; viável com o modelo atual. Legal: sem gate jurídico — parceria oficial com TikTok/Shopee, sem tráfego pago, LGPD-mínima preservada. Político: dependência de plataformas externas é tensão real e assumida conscientemente — **intensificada nesta versão pela exigência de OAuth individual em dois canais gated em vez de um** (ver seção 10). Tom: invisível para o cliente.
*   Resultado: ⚠️ Aprovado com ressalvas (dependência de autorização individual do afiliado ampliada — escalonamento em curso, Q-11/Q-12) **3. Adequação ao Propósito**
*   Parecer: Alinhamento direto com a estratégia multicanal declarada pela Diretoria. Organiza o core do Club Brasil sem criar novo domínio. Reusa arquitetura existente (Escritório Virtual, identidade, catálogo). Preenche o quadrante de mercado vazio. A tensão é de execução, não de propósito.
*   Resultado: ✅ Aprovado **4. Adequação à Percepção de Valor**
*   Parecer: Cliente: valor imediato e tangível — compara e compra onde quer, sem entender o mecanismo. Influenciadora e Gestor: confiança de atribuição + clareza de status de integração por canal. Ressalva crítica: ganhos e comissão por canal são domínio do Escritório — a comunicação dessa distinção no onboarding é obrigatória para não gerar expectativa errada. Ressalva adicional: se a cobertura real de Shopee/TikTok ficar abaixo do esperado (Q-12), a percepção de valor do HUB para a influenciadora pode ficar concentrada em Wake, reduzindo o diferencial multicanal percebido no 1º ciclo.
*   Resultado: ⚠️ Aprovado com ressalvas (comunicação do escopo HUB vs. Escritório no onboarding é crítica; cobertura real de canais gated é incerta) **Parecer Geral**

> ⚠️ **DRP aprovado com ressalvas, revisadas nesta versão:**
> *   UX do comparador a validar no design antes da Feature
> *   Comunicação do escopo HUB vs. Escritório no onboarding da Influenciadora e do Gestor é crítica para alinhamento de expectativas
> *   **Novo:** dois riscos de alta severidade (Q-11, Q-12) foram escalados nesta versão para Comercial (Romulo Alves) e CTO (Vinícius Graff) em paralelo, sob responsabilidade de Rolim. Recomenda-se aguardar retorno inicial do escalonamento antes de avançar o refinamento técnico da Feature, dado que ambos afetam diretamente o dimensionamento da meta e a viabilidade operacional do H1 em dois dos três canais.

A decisão final é do PM/PO. O DRP pode avançar para Feature derivada, condicionado ao acompanhamento do escalonamento acima.

* * *

**Links relacionados:**
-----------------------

*   Workflow Excalidraw - https://link.excalidraw.com/l/7ZkUiAcVfSa/9Y873A2kX8D
*   Brief de Engenharia v1.1 (10/07/2026) — incorpora a Avaliação de Engenharia (Matheus, 09/07/2026) que originou as atualizações desta versão do DRP

As 3 POCs do experimento
------------------------

| # | Abordagem | Identidade do Hub | Link |
| --- | --- | --- | --- |
| **1** | Com Designer | Landing conversiva (off-white, premium) | [https://vo-hub-catalogo.vercel.app](https://vo-hub-catalogo.vercel.app/) |
| **2** | POC do Stakeholder | Comparador (padrão do reference) | [https://vo-hub-comparador.vercel.app](https://vo-hub-comparador.vercel.app/) |
| **3** | Só DRP | **Comparador ** (champagne/Fraunces) | [https://vo-hub-v4.vercel.app/](https://vo-hub-v4.vercel.app/ "https://vo-hub-v4.vercel.app/")) |

* * *

Histórico de Atualizações
-------------------------

| Versão | Data | Autor | Alteração |
| --- | --- | --- | --- |
| v1.0 | 22/06/2026 | Victor Lima / Monteirinho | Criação do documento (conduzido pelo Monteirinho no Claude Code) |
| v1.1 | 23/06/2026 | Monteirinho | Refatoração para o padrão DRP v2.0 (13 seções) |
| v1.2 | 24/06/2026 | Monteirinho | Adição da seção 8 (Requisitos Funcionais e Não Funcionais) — template v2.0 com 14 seções |
| v1.3 | 25/06/2026 | Matheus / Claude | Link encurtado (produto + influenciadora); geração de links por canal; Q-06 reformulado; Q-08 adicionado (mapeamento de SKU); RF-02 atualizado |
| v1.4 | 25/06/2026 | Matheus / Claude | Q-02 e Q-03 respondidas; RF-04 e Seção 7 atualizados para refletir que o Escritório é consumidor de endpoint simples, sem feed; decisão de encurtamento de link pendente com head de engenharia |
| v1.5 | 25/06/2026 | Matheus / Claude | Q-04 fechada — fora do escopo do HUB; reconciliação e pagamento são responsabilidade do B2C existente |
| v1.6 | 25/06/2026 | Matheus / Claude · consolidado por Monteirinho | Q-05 fechada (fallback fora do escopo, cookie descartado por LGPD); Q-08 fechada (SKU único como invariante de produto + guarda-corpo de ocultação); consolidação de metadados (cabeçalho/rodapé para v1.6); limpeza de resquícios de "feed" nas seções 8, 11 e 12; Q-09 e Q-10 abertas (embalagem do link e Shopee URL-vs-API); RF-04 da seção 8 passa a refletir composição de link por canal |
| v1.7 | 25/06/2026 | Monteirinho | Q-06 detalhada com formato técnico confirmado por canal (Wake `?parceiro={codigo}`, Shopee URL pattern vs. Affiliates API, TikTok fluxo encadeado affiliate_seller→affiliate_creator); nova dependência **D-07** (autorização individual dos afiliados via OAuth, critical path); novo risco operacional/técnico de autorização não concedida; decisão de geração de link por canal (Seção 13) atualizada com a implicação de dependência externa |
| v1.8 | 10/07/2026 | Rolim / Monteirinho | Retorno da validação técnica de Engenharia (Matheus, 09/07/2026) incorporado via Brief de Engenharia v1.1. Q-09 e Q-10 fechadas (slug encurtado; Shopee via Affiliates API). D-07 ampliada — autorização OAuth individual confirmada para Shopee **e** TikTok (era condicional em Shopee). **RF-11 adicionado (Must):** renovação de token OAuth do afiliado na B2C-BackEnd — pré-requisito de go-live, não hipótese. RNF-Escalabilidade corrigido (catálogo × canais, não × nº de influenciadoras). Dois riscos novos de alta severidade escalados: Q-11 (campanha de reautorização em dois canais) e Q-12 (cobertura real esperada de canal) — ambos escalonados por Rolim para Romulo Alves (Comercial) e Vinícius Graff (CTO) em paralelo, antes do refinamento técnico da Feature. F4P (seção 14) e Parecer Geral atualizados para refletir os riscos ampliados. |

* * *

_DRP — Documento de Requisitos de Produto (PRD Ybera) | Ybera Group — Time de Produto | v1.8 · Template v2.0_