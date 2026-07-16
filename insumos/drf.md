DRF — HUB Inteligente Ybera
===========================

**Ybera Group | Time de Produto & Engenharia** **Versão:** 0.4-aifirst · **Data:** 25/06/2026 · **Status:** Rascunho **Produto:** Club Brasil — Crescimento e Canais **DRP de origem:** DRP — HUB Inteligente Ybera v1.7 **Autor:** Victor Lima · **Revisor técnico:** [A DEFINIR — Engenharia] **Squad:** Squad X (kick-off) · **Sprint alvo:** [A DEFINIR] **Links:** DevOps [A DEFINIR] · Figma [A DEFINIR]

* * *

CONTEXTO GLOBAL
---------------

> Leia esta seção uma vez antes de implementar qualquer RF. Ela define invariantes que se aplicam a todo o sistema.

### O que é o HUB

Camada de crescimento sobre os canais de venda já operacionais da Ybera. Centraliza como a rede de influenciadoras do Club Brasil divulga produtos e como o cliente final compra — com comparação de preço e frete entre canais (Wake, Shopee, TikTok Shop) e geração de links com vínculo de parceiro garantido, independentemente do canal escolhido pelo cliente.

### Arquitetura essencial (mudança estrutural na v1.6 do DRP)

O HUB **detém toda a lógica**: geração de link, busca de dados nos canais e montagem da página de comparação. O Escritório Virtual **não recebe feed** — ele apenas **consulta** um endpoint simples quando precisa exibir o link à influenciadora (`GET /link?produto=X&influenciadora=Y`). Não há push, não há notificação, não há sincronização de estado entre HUB e Escritório.

### Invariantes do sistema (aplicam-se a todos os RFs)

*   O HUB **não** calcula, exibe nem processa comissão — domínio exclusivo do Escritório Virtual / B2C
*   O HUB **não** faz checkout nem processa pagamento — domínio das plataformas de destino
*   O HUB **não** faz reconciliação de venda nem atribuição financeira — já funciona no B2C existente
*   A influenciadora **não** opera no HUB diretamente — toda interação passa pelo front do Escritório Virtual
*   **Nenhum link de canal** é gerado quando a influenciadora não possui vínculo ativo validado naquele canal
*   O comparador público **não** coleta PII do cliente — sem autenticação, sem fingerprinting, sem armazenamento de IP
*   **O SKU interno Ybera é a chave única de produto entre Wake, Shopee e TikTok Shop** — mesmo SKU em todos os canais
*   Wake **não** exige onboarding adicional — vínculo nativo ao Club Brasil
*   Todos os endpoints expostos são **autenticados** (token / mTLS), **idempotentes** e **rate-limited**
*   Todos os links gerados têm **integridade verificável** (assinatura / HMAC)

### Atores

| ID | Ator | Tipo | Papel |
| --- | --- | --- | --- |
| A-01 | Influenciadora | Usuário Final | Compartilha link gerado pelo HUB; opera via front do Escritório, não no HUB |
| A-02 | Gestor | Usuário Final | Acumula role de Influenciadora — comportamento idêntico no HUB |
| A-03 | Cliente Final | Usuário Final (anônimo) | Abre link curto, compara canais, é redirecionado ao canal escolhido |
| A-04 | Escritório Virtual | Sistema Interno | Consome `GET /link` para exibir o link à influenciadora; consome status de integração |
| A-05 | Shopee | Sistema Externo (API gated) | Fornece preço/frete; gera link de afiliada (URL pattern ou Affiliates API) |
| A-06 | TikTok Shop | Sistema Externo (API gated) | Fornece preço/frete; gera link de creator (Affiliate API obrigatória) |
| A-07 | Wake | Sistema Externo | Fornece preço/frete; link via montagem de URL com código de parceiro (sem API) |

### Estados de vínculo por canal

    não_registrado → pendente_onboarding → aguardando_autorizacao → integrado
                                                                  ↘ erro → aguardando_autorizacao (retry)
    integrado → inativo (desativação manual ou revogação pelo canal)
    inativo → aguardando_autorizacao (reautorização)
    

> `aguardando_autorizacao` aplica-se a Shopee (via API) e TikTok — aguarda a concessão OAuth do afiliado. Wake não passa por `aguardando_autorizacao` (vínculo nativo, sem autorização). Estados `pendente_onboarding`, `aguardando_autorizacao`, `erro`, `inativo` e `não_registrado` bloqueiam a geração de link do canal (RF-003) — só `integrado` libera.

### Composição de link de destino por canal (Q-06 resolvida e detalhada no DRP v1.7)

O HUB compõe o vínculo automaticamente — a influenciadora não gera nem registra link manualmente. Abordagem e formato confirmados por canal:
| Canal | Abordagem | Formato / Fluxo | API? | Autorização do afiliado? |
| --- | --- | --- | --- | --- |
| Wake | Montagem de URL com código de parceiro | `https://www.ybera.com/produto/{slug}?parceiro={codigo}` — parceiros já cadastrados no B2C (`GET /parceiros/{parceiroId}`) | Não | **Não** |
| Shopee | URL pattern **ou** Affiliates API — **BLOCKED-02** | URL pattern: `s.shopee.com.br/an_redir?origin_link={URL_ENCODED}&affiliate_id={ID}&sub_id={...}` · API: GraphQL+HMAC-SHA256, shortlink oficial | Depende | **Sim, se via API** (credenciais individuais do afiliado) |
| TikTok Shop | Affiliate API obrigatória — fluxo encadeado | (1) Ybera (affiliate_seller) prepara colaboração (Open ou Target); (2) HUB chama affiliate_creator (Creator Generate Publisher Link, material PRODUCT, publisher_id da afiliada) com token OAuth da influenciadora | Sim (obrigatória) | **Sim, obrigatória** (escopos affiliate_creator) |

> **Wake é o canal-base garantido:** não exige API nem autorização individual — basta o código de parceiro já existente no B2C. Shopee (via API) e TikTok exigem autorização individual de cada afiliado (ver dependência externa abaixo). O link TikTok é sempre gerado sob a identidade do creator, nunca da Ybera.

### Dependência externa no caminho crítico — autorização individual do afiliado

Shopee (quando via Affiliates API) e TikTok (sempre) só geram link comissionável se a influenciadora **autorizar o app na própria conta**, concedendo os escopos `affiliate_creator`. Sem essa autorização individual, o HUB não consegue gerar o link daquele canal para aquela afiliada — o canal é ocultado para ela (degradação graciosa). Isso **altera o fluxo de login dos afiliados** e é pré-requisito externo, não capacidade do HUB. A experiência de reautorização será desenhada no design após a POC. Tratado no RF-008 como pré-condição externa e na dependência D-07 do DRP.

### Fora do escopo deste DRF (Won't Have)

*   Feed push HUB → Escritório (não existe — Escritório consome endpoint sob demanda)
*   Cálculo, exibição ou pagamento de comissão (Escritório / B2C)
*   Reconciliação de venda e atribuição financeira (B2C existente)
*   Fallback de atribuição quando cliente compra fora do link (perda inerente ao modelo de afiliado — ver nota)
*   Integração com Mercado Livre (H2)
*   Internacionalização — Club Internacional / Shopify Global (H3)
*   Painel de admin no HUB
*   Notificações próprias do HUB
*   Roles além de Influenciadora e Gestor no v1

> **Nota sobre fallback de atribuição (Q-05):** se o cliente não passar pelo link, o marketplace não registra atribuição. É limitação estrutural do modelo de afiliado, não bug. A única mitigação técnica (cookie/sessão por dispositivo) foi descartada por conflitar com a postura LGPD-mínima do v1. Aceito como perda inerente.

### Itens bloqueados — não implementar até resolução

| ID | Questão em aberto | Responsável | Impacto |
| --- | --- | --- | --- |
| BLOCKED-01 | Embalagem final do link: encurtado (slug) vs. URL com parâmetros explícitos. RF-02 gerado assumindo encurtado; lógica idêntica nos dois casos | Head de Engenharia | RF-002 (embalagem apenas) |
| BLOCKED-02 | Shopee: URL pattern vs. Affiliates API — pendente de teste com compra real para validar latência e rate limit do URL pattern | Engenharia | RF-002 (canal Shopee), INT-01 |
| BLOCKED-03 | Critério de desempate na ordenação quando preço+frete empatam | Produto + Engenharia | RF-006 |
| BLOCKED-04 | N de falhas consecutivas para abrir circuit breaker | Engenharia | RF-007, RF-009 |
| BLOCKED-05 | Credenciais e endpoints das APIs gated (Shopee, TikTok Affiliate) | Engenharia + plataformas | RF-009, INT-01, INT-02 |
| BLOCKED-06 | Fallback quando cache expirado em todos os canais simultaneamente | Engenharia | RF-005 |

### Referências

| Tipo | Link / Identificador |
| --- | --- |
| DRP | DRP — HUB Inteligente Ybera v1.6 |
| Feature | [A DEFINIR — Feature HUB-001 a abrir] |
| Protótipo Figma | [A DEFINIR] |
| Docs de integração | Shopee Affiliates API · TikTok Affiliate API · Wake Open API · Escritório Virtual API |

* * *

REQUISITOS FUNCIONAIS
---------------------

> Padrão de consumo para dev / LLM:
> 1.  Leia o Contexto Global uma vez.
> 2.  Filtre RFs com status `ready`.
> 3.  Implemente RF por RF usando o bloco self-contained.
> 4.  Use o Gherkin de cada RF como spec autoritativa para testes — é a única fonte.

* * *

### RF-001 — Endpoint de link para o Escritório Virtual

**Status:** ready | **MoSCoW:** Must Have | **Ator:** A-04 (Escritório Virtual)
**Contrato:**
*   `GET /hub/v1/link?produto={sku}&influenciadora={influenciadora_id}`
*   Autenticado (A-04 apenas), idempotente, rate-limited
*   Output: `{ link_compartilhamento: string, produto: sku, influenciadora: id }`
**Comportamento:** O Escritório consulta este endpoint quando precisa exibir o link de compartilhamento à influenciadora. O HUB retorna o link curto pronto (ver RF-002). Toda a lógica de geração, busca de dados e montagem da página de comparação é responsabilidade do HUB — o Escritório é apenas consumidor. Não há feed, push ou notificação: o Escritório consulta sob demanda.
**Pré-condições:**
*   `sku` existe no catálogo Ybera
*   `influenciadora_id` existe no Club Brasil
*   Escritório autenticado
**Pós-condição:** Escritório recebe o link de compartilhamento e o exibe à influenciadora no seu front.
**Exceções:**
*   `influenciadora_id` não encontrado → HTTP 404 `{"error": "influenciadora_not_found"}`
*   `sku` não encontrado no catálogo → HTTP 404 `{"error": "produto_not_found"}`
*   Influenciadora sem vínculo em nenhum canal → HTTP 200 com link gerado (a página de comparação trata a ocultação por canal em runtime)
*   Escritório sem autenticação válida → HTTP 401
**Regras inline:**
*   O link retornado é único por (produto × influenciadora) — ver RF-002 para persistência
*   O endpoint não expõe % de comissão nem dado financeiro (invariante)

    Feature: RF-001 Endpoint de link para o Escritório
    
      Scenario: Escritório consulta link de produto para influenciadora
        Given sku "SKU123" existe no catálogo Ybera
        And influenciadora_id "inf_123" existe no Club Brasil
        And Escritório autenticado com token válido
        When GET /hub/v1/link?produto=SKU123&influenciadora=inf_123
        Then HTTP 200
        And response contém link_compartilhamento não vazio
        And o link é único para o par (SKU123, inf_123)
    
      Scenario: Produto inexistente no catálogo
        Given sku "SKU999" não existe no catálogo Ybera
        When GET /hub/v1/link?produto=SKU999&influenciadora=inf_123
        Then HTTP 404
        And body contém "produto_not_found"
    
      Scenario: Requisição sem autenticação
        Given Escritório sem token válido
        When GET /hub/v1/link?produto=SKU123&influenciadora=inf_123
        Then HTTP 401
    

* * *

### RF-002 — Geração de link encurtado de compartilhamento

**Status:** blocked (BLOCKED-01, BLOCKED-02) | **MoSCoW:** Must Have | **Ator:** HUB (interno)

> ⚠️ **BLOCKED-01:** A embalagem final do link (encurtado vs. URL com parâmetros explícitos) está pendente do head de engenharia. Este RF está escrito assumindo o **encurtado** — direção detalhada no DRP v1.6. A lógica de separação de responsabilidades é idêntica nos dois casos; muda apenas a embalagem. Se a decisão mudar, ajustar apenas a forma do link, não a lógica. ⚠️ **BLOCKED-02:** Para o canal Shopee, a escolha entre URL pattern e Affiliates API depende de teste com compra real. Implementar Wake e TikTok; deixar Shopee como ponto de extensão.

**Contrato:**
*   Geração: chamado internamente ao processar RF-001
*   Persistência: registro `{ slug, sku, influenciadora_id, criado_em }` no backend do HUB
*   Resolução: `GET /r/{slug}` resolve o slug, carrega a página de comparação e gera os links de destino por canal
*   Formato do slug: `hub.ybera.com/r/{slug}` (ex.: `hub.ybera.com/r/abc123`)
**Comportamento:** Gera um link curto carregando apenas dois parâmetros — **produto (SKU) e influenciadora**. Canal **não** faz parte do link. O slug é persistido no backend; ao ser aberto pelo cliente, o HUB resolve o slug, monta a página de comparação e gera os links de destino por canal (ver tabela de composição no Contexto Global) com a atribuição correta embutida em cada um.
O encurtamento evita quebra/truncamento de URL em redes sociais e elimina risco de parâmetro faltando no compartilhamento.
**Pré-condições:**
*   `sku` e `influenciadora_id` válidos (herdado de RF-001)
**Pós-condição:** Slug persistido e resolvível; ao abrir, gera links de destino por canal para os canais com vínculo ativo.
**Exceções:**
*   Slug não encontrado na resolução → HTTP 404 página de erro amigável
*   Canal sem vínculo ativo no momento da resolução → canal ocultado na página (ver RF-003, RF-006)
*   Canal Shopee → **BLOCKED-02** (URL pattern vs. API)
**Regras inline:**
*   Um registro de slug por (produto × influenciadora) — reutilizar slug existente se já gerado
*   A composição de cada link de destino segue a abordagem por canal do Contexto Global
*   Integridade de cada link de destino verificável (invariante HMAC)

    Feature: RF-002 Link encurtado de compartilhamento
    
      Scenario: Geração de slug para par produto-influenciadora
        Given sku "SKU123" e influenciadora "inf_123" válidos
        When o HUB gera o link de compartilhamento
        Then um slug é persistido com { slug, SKU123, inf_123, criado_em }
        And o link retornado tem o formato "hub.ybera.com/r/{slug}"
        And o canal NÃO faz parte do link
    
      Scenario: Reutilização de slug existente
        Given já existe slug persistido para (SKU123, inf_123)
        When o HUB processa nova solicitação de link para o mesmo par
        Then o slug existente é reutilizado
        And nenhum registro duplicado é criado
    
      Scenario: Cliente abre slug e links de destino são gerados
        Given slug "abc123" resolve para (SKU123, inf_123)
        And a influenciadora tem vínculo integrado em Wake e TikTok, Shopee pendente
        When o cliente acessa hub.ybera.com/r/abc123
        Then a página de comparação carrega
        And links de destino Wake e TikTok são gerados com vínculo embutido
        And o canal Shopee é ocultado (sem vínculo ativo)
    
      Scenario: Slug inexistente
        Given slug "zzz999" não existe no backend
        When o cliente acessa hub.ybera.com/r/zzz999
        Then HTTP 404 com página de erro amigável
    

* * *

### RF-003 — Bloqueio de geração de link de canal por ausência de vínculo

**Status:** ready | **MoSCoW:** Must Have | **Ator:** HUB (interno)
**Comportamento:** Camada de validação chamada antes de gerar qualquer link de destino por canal (RF-002). Rejeita a geração para o canal se o vínculo da influenciadora não estiver com status `integrado`. O canal é ocultado na página de comparação (RF-006); nenhum link sem atribuição trafega.
**Estados que bloqueiam geração do link de canal:**
*   `não_registrado` · `pendente_onboarding` · `aguardando_autorizacao` · `inativo` · `erro`
*   Só `integrado` libera a geração do link do canal
**Pós-condição:** Nenhum link de canal sem atribuição válida é gerado ou exibido.

    Feature: RF-003 Bloqueio de link de canal sem vínculo
    
      Scenario: Canal sem vínculo é bloqueado e ocultado
        Given a influenciadora "inf_123" tem Shopee com status "pendente_onboarding"
        When o HUB monta a página de comparação para um produto
        Then nenhum link de destino Shopee é gerado
        And o canal Shopee é ocultado na página
    
      Scenario: Geração permitida apenas para status integrado
        Given a influenciadora "inf_123" tem Wake com status "integrado"
        When o HUB valida elegibilidade para gerar link Wake
        Then a validação passa
        And o link de destino Wake é gerado
    

* * *

### RF-004 — Comparador público de preço e frete

**Status:** blocked (BLOCKED-06) | **MoSCoW:** Must Have | **Ator:** A-03 (Cliente Final)

> ⚠️ **BLOCKED-06:** Comportamento quando cache expirado em **todos** os canais simultaneamente pendente de definição. Implementar os demais cenários; deixar este como ponto de extensão.

**Contrato:**
*   URL pública: resolução via `GET /r/{slug}` (RF-002)
*   Sem autenticação
*   Mobile-first — LCP < 2,5s | TTI < 3,5s | resposta via cache p95 < 500ms
**Comportamento:** Página pública que exibe o mesmo produto (resolvido pelo SKU único — invariante) nos canais disponíveis, com preço e frete de cada um. Oculta canais sem preço, sem estoque ou sem vínculo ativo da influenciadora. Ordena por menor preço + frete (RF-006). Não coleta PII do cliente.
**Pré-condições:**
*   Slug válido resolvido (RF-002)
*   Cache de ao menos 1 canal disponível e não expirado (defasagem máx. 30 min — RF-007)
**Pós-condição:** Cliente visualiza comparativo dos canais válidos e pode selecionar para redirecionamento (RF-008).
**Exceções:**
*   Todos os canais inválidos (sem preço/estoque/vínculo) → mensagem de indisponibilidade
*   Canal isolado inválido → ocultar silenciosamente, demais exibidos
*   SKU não encontrado em um canal → ocultar o canal (guarda-corpo da invariante de SKU único)
*   Cache expirado em todos os canais simultaneamente → **BLOCKED-06**
**Regras inline:**
*   Zero PII — CEP transitório, sem fingerprinting, sem IP
*   Métricas apenas agregadas e anônimas (RF-011)
*   Se o SKU não existir em um canal, ocultar o canal em vez de exibir produto divergente

    Feature: RF-004 Comparador público
    
      Scenario: Comparador renderizado com 3 canais disponíveis
        Given o produto SKU "SKU123" está disponível em Wake, Shopee e TikTok Shop
        And o cache de preço/frete foi atualizado há menos de 30 minutos
        And a influenciadora "inf_123" tem vínculo integrado nos 3 canais
        When o cliente acessa a página via slug
        Then os 3 canais são exibidos com preço e frete de cada um
        And nenhum dado pessoal do cliente é coletado ou armazenado
    
      Scenario: Canal Shopee indisponível — degradação graciosa
        Given a API Shopee retornando erro e cache Shopee expirado
        When o cliente acessa o comparador
        Then Wake e TikTok Shop são exibidos normalmente
        And Shopee é ocultado sem mensagem de erro ao cliente
    
      Scenario: SKU ausente em um canal — guarda-corpo
        Given o SKU "SKU123" não retorna no catálogo do TikTok Shop
        When o cliente acessa o comparador
        Then o canal TikTok Shop é ocultado
        And nenhum produto divergente é exibido no lugar
    
      Scenario: Todos os canais inválidos
        Given os 3 canais sem preço, sem estoque ou sem vínculo
        When o cliente acessa o comparador
        Then a página exibe mensagem de indisponibilidade temporária
        And nenhum botão de compra é exibido
    

* * *

### RF-005 — Sincronização periódica de preço e frete via cache

**Status:** blocked (BLOCKED-04, BLOCKED-05) | **MoSCoW:** Must Have | **Ator:** HUB (job agendado)

> ⚠️ **BLOCKED-04:** N de falhas para abrir circuit breaker pendente. ⚠️ **BLOCKED-05:** Credenciais e endpoints das APIs gated ainda não disponíveis.

**Comportamento:** Job agendado sincroniza preço e frete de cada canal via suas APIs, preferencialmente com cache em Cloudflare. Assíncrono — não impacta latência do comparador. Defasagem máxima: 30 min por canal.
**Estratégia de resiliência por canal:**
*   Falha isolada → manter último cache válido; continuar sincronizando demais canais
*   N falhas consecutivas → circuit breaker abre (N = **BLOCKED-04**); alerta interno; canal ocultado
*   Sincronização por canal — falha em um não afeta os outros

    Feature: RF-005 Sincronização de cache
    
      Scenario: Sincronização bem-sucedida nos 3 canais
        Given credenciais válidas para Wake, Shopee e TikTok
        When o job de sincronização executa
        Then o cache de preço+frete é atualizado para os 3 canais
        And o timestamp de última atualização é registrado por canal
    
      Scenario: Falha isolada no canal Shopee
        Given Shopee retornando erro durante a sincronização
        When o job executa
        Then Wake e TikTok são atualizados normalmente
        And o cache Shopee mantém o último valor válido
        And o HUB executa retry com backoff exponencial para Shopee
    
      Scenario: N falhas consecutivas — circuit breaker
        Given Shopee falhou N vezes consecutivas (N = BLOCKED-04)
        When a tentativa seguinte ocorre
        Then o circuit breaker abre para Shopee
        And alerta interno é disparado
        And Shopee é ocultado no comparador até o circuit breaker fechar
    

* * *

### RF-006 — Ordenação por menor custo e ocultação de canal inválido

**Status:** blocked (BLOCKED-03) | **MoSCoW:** Must Have | **Ator:** HUB (interno)

> ⚠️ **BLOCKED-03:** Critério de desempate quando preço+frete são iguais pendente. Implementar ordenação principal; deixar desempate como ponto de extensão.

**Comportamento:** Ordena os canais válidos por `(preço + frete)` crescente antes de renderizar o comparador. Oculta silenciosamente canais com: preço indisponível, estoque zero, vínculo não integrado, ou SKU ausente naquele canal.
**Regras inline:**
*   Ocultação silenciosa — sem mensagem de erro ao cliente
*   Se após ocultar restar zero canais → delegar para RF-004 (mensagem de indisponibilidade)
*   Critério de desempate → **BLOCKED-03**

    Feature: RF-006 Ordenação e ocultação
    
      Scenario: Ordenação por preço+frete crescente
        Given Wake R$60 total, Shopee R$63 total, TikTok R$60 total
        When o comparador renderiza
        Then Wake e TikTok (R$60) aparecem antes de Shopee (R$63)
        And o desempate entre Wake e TikTok segue BLOCKED-03
    
      Scenario: Canal com estoque zero é ocultado silenciosamente
        Given TikTok Shop retorna estoque zero para o produto
        When o comparador renderiza
        Then TikTok Shop não aparece
        And os demais canais são exibidos normalmente
        And nenhuma mensagem de erro é exposta ao cliente
    

* * *

### RF-007 — Redirecionamento do cliente ao canal escolhido

**Status:** ready | **MoSCoW:** Must Have | **Ator:** A-03 (Cliente Final)
**Comportamento:** Ao clicar em "Comprar" num canal, o HUB redireciona o cliente para a página do produto no canal escolhido, com o vínculo de parceiro da influenciadora preservado no link de destino.
**Pré-condições:**
*   Canal disponível no momento do clique
*   Link de destino com vínculo válido (gerado em RF-002)
**Pós-condição:** Cliente na página do produto no canal escolhido; vínculo preservado no link.
**Exceções:**
*   Canal ficou indisponível entre renderização e clique → mensagem de indisponibilidade; manter comparador
*   Link de destino expirado/inválido → reprocessar via RF-002 antes de redirecionar
**Regras inline:**
*   O redirecionamento é o único ponto onde o vínculo trafega para fora do HUB
*   Nenhum redirecionamento sem vínculo válido preservado

    Feature: RF-007 Redirecionamento
    
      Scenario: Redirecionamento bem-sucedido com vínculo preservado
        Given o cliente visualiza o comparador com Wake e TikTok disponíveis
        And a influenciadora "inf_123" tem creator habilitado no TikTok
        When o cliente clica em "Comprar" no canal TikTok Shop
        Then é redirecionado para a página do produto no TikTok Shop
        And o link de destino preserva o vínculo de creator da influenciadora
    
      Scenario: Canal fica indisponível entre renderização e clique
        Given o comparador foi carregado com 3 canais
        And o canal Shopee ficou indisponível após a renderização
        When o cliente clica em "Comprar" no canal Shopee
        Then o HUB exibe mensagem de indisponibilidade para Shopee
        And o cliente permanece no comparador com os canais restantes
    

* * *

### RF-008 — Onboarding e validação de vínculo da influenciadora

**Status:** blocked (BLOCKED-05) | **MoSCoW:** Must Have | **Ator:** A-01/A-02 via A-04

> ⚠️ **BLOCKED-05:** Credenciais e endpoints das APIs gated (Shopee, TikTok Affiliate) ainda não disponíveis. Implementar o fluxo, os endpoints e o callback de autorização; deixar as chamadas externas como ponto de extensão com mock.

> 🔗 **Pré-condição externa (D-07):** Shopee (via Affiliates API) e TikTok exigem que a influenciadora **autorize o app na própria conta** (escopos `affiliate_creator`), fornecendo credenciais individuais — não as da Ybera. Sem essa autorização, o HUB **não consegue** gerar link comissionável para o canal. Isso não é algo que o HUB resolve sozolo: é um gate externo no caminho crítico. A UX de reautorização (como o afiliado é levado a autorizar) será desenhada no design após a POC. O HUB expõe o fluxo e registra o resultado; a concessão em si depende do afiliado.

**Contrato:**
*   Iniciar autorização: `POST /hub/v1/onboarding/{influenciadora_id}/canal/{canal}` → retorna URL de autorização OAuth do canal
*   Callback: `GET /hub/v1/onboarding/callback/{canal}` → recebe o retorno OAuth, persiste credencial individual do afiliado, atualiza status
*   Autenticado (A-04 apenas) na iniciação
*   Input: `{ canal: "shopee" | "tiktok" }`
*   Output (iniciação): `{ status: "aguardando_autorizacao", url_autorizacao, canal }`
*   Output (callback): `{ status: "integrado" | "erro", canal, timestamp }`
**Comportamento:** O onboarding por canal é um fluxo de duas etapas, porque depende de autorização externa do afiliado:
1.  **Iniciação** — o HUB gera a URL de autorização do canal e a devolve ao Escritório, que a apresenta à influenciadora. Status passa a `aguardando_autorizacao`.
2.  **Autorização (externa, do afiliado)** — a influenciadora autoriza o app na própria conta do canal, concedendo os escopos `affiliate_creator` e as credenciais individuais.
3.  **Callback** — o canal redireciona de volta ao HUB com o resultado; o HUB persiste as credenciais individuais do afiliado e atualiza o status para `integrado` (ou `erro`).
Por canal:
*   **TikTok:** fluxo encadeado — Ybera (affiliate_seller) prepara a colaboração do produto (Open ou Target); após autorização do creator, o HUB passa a gerar o Creator Generate Publisher Link com o token OAuth da influenciadora. Autorização individual **obrigatória**.
*   **Shopee:** se o caminho final for a Affiliates API (BLOCKED-02), exige autorização individual e credenciais do afiliado. Se for URL pattern, não exige autorização — mas o caminho ainda está pendente de teste.
*   **Wake:** vínculo nativo via código de parceiro do B2C — **não passa por este endpoint** e **não exige autorização**.
**Pré-condições:**
*   `influenciadora_id` existe no Club Brasil
*   Canal é `shopee` ou `tiktok`
*   Para conclusão: autorização concedida pelo afiliado (gate externo — D-07)
**Pós-condição:** Credencial individual do afiliado persistida; status do canal `integrado`; RF-009 reflete o novo estado; links daquele canal passam a ser gerados para a afiliada.
**Exceções:**
*   Afiliado não conclui a autorização → status permanece `aguardando_autorizacao`; canal ocultado para a afiliada até autorizar (degradação graciosa)
*   Afiliado nega a autorização → status `erro`; canal ocultado; pode reiniciar o fluxo
*   API externa rejeita credencial → status `erro`; retry de validação agendado
*   API externa indisponível no callback → status permanece `aguardando_autorizacao`; sem degradar outros canais
*   Canal = `wake` → HTTP 400 `{"error": "wake_vinculo_nativo"}`
**Regras inline:**
*   A credencial persistida é a do **afiliado**, nunca a da Ybera — garante atribuição correta da comissão
*   O link comissionável é gerado sob a identidade do creator/afiliado, não da Ybera
*   Status `aguardando_autorizacao` e `erro` bloqueiam a geração de link do canal (ver RF-003); Wake não é afetado
*   Wake é o canal-base garantido — funciona sem qualquer autorização individual

    Feature: RF-008 Onboarding e autorização de vínculo
    
      Scenario: Iniciação de onboarding TikTok gera URL de autorização
        Given a influenciadora "inf_123" com conta TikTok válida
        When POST /hub/v1/onboarding/inf_123/canal/tiktok
        Then HTTP 200 com status "aguardando_autorizacao"
        And o response contém url_autorizacao do TikTok
        And nenhum link comissionável é gerado ainda
    
      Scenario: Callback TikTok após afiliado autorizar
        Given a influenciadora "inf_123" autorizou o app com escopos affiliate_creator
        And a Ybera como affiliate_seller preparou a colaboração do produto
        When o TikTok redireciona para GET /hub/v1/onboarding/callback/tiktok com retorno válido
        Then a credencial individual da afiliada é persistida
        And o status TikTok de "inf_123" passa a "integrado"
        And links de destino TikTok passam a ser gerados para ela
    
      Scenario: Afiliado não conclui a autorização
        Given a influenciadora "inf_123" iniciou o onboarding TikTok
        And não concluiu a autorização na conta TikTok
        When o cliente acessa um comparador com link de "inf_123"
        Then o canal TikTok é ocultado para essa afiliada
        And o status permanece "aguardando_autorizacao"
        And os demais canais não são afetados
    
      Scenario: Afiliado nega a autorização
        Given a influenciadora "inf_123" negou a autorização no TikTok
        When o TikTok redireciona para o callback com retorno de negação
        Then o status TikTok de "inf_123" passa a "erro"
        And o canal TikTok é ocultado para ela
        And o fluxo de onboarding pode ser reiniciado
    
      Scenario: Wake não passa por autorização
        Given canal solicitado é "wake"
        When POST /hub/v1/onboarding/inf_123/canal/wake
        Then HTTP 400
        And body contém "wake_vinculo_nativo"
        And o vínculo Wake permanece ativo via código de parceiro do B2C
    

* * *

### RF-009 — Endpoint de status de integração por canal

**Status:** ready | **MoSCoW:** Must Have | **Ator:** A-04 (Escritório Virtual)
**Contrato:**
*   `GET /hub/v1/status/{influenciadora_id}`
*   Autenticado (A-04 apenas)
*   Output: `{ wake: <status>, shopee: <status>, tiktok: <status> }`
*   Status: `integrado | pendente_onboarding | aguardando_autorizacao | inativo | erro | nao_registrado`
**Comportamento:** Retorna o mapa de status de vínculo da influenciadora por canal. Consumido pelo front do Escritório para renderizar o componente de status e CTAs de onboarding por canal.
**Exceções:**
*   `influenciadora_id` não encontrado → HTTP 404; todos os canais `nao_registrado`
*   Sem autenticação → HTTP 401

    Feature: RF-009 Status de integração
    
      Scenario: Status retornado com vínculos mistos
        Given "inf_123" tem Wake "integrado", TikTok "integrado", Shopee "pendente_onboarding"
        When GET /hub/v1/status/inf_123
        Then HTTP 200
        And { wake: "integrado", tiktok: "integrado", shopee: "pendente_onboarding" }
    
      Scenario: Influenciadora não encontrada
        Given "inf_999" não existe no Club Brasil
        When GET /hub/v1/status/inf_999
        Then HTTP 404
        And todos os canais retornam "nao_registrado"
    

* * *

### RF-010 — Endpoint de atualização manual de cache

**Status:** ready | **MoSCoW:** Should Have | **Ator:** A-04 (Escritório Virtual)
**Contrato:**
*   `POST /hub/v1/cache/refresh`
*   Autenticado (A-04 apenas)
*   Input: `{ canal: "wake" | "shopee" | "tiktok", produto?: sku }` (produto opcional — se omitido, canal inteiro)
*   Rate-limited: [A DEFINIR — janela e limite]
**Comportamento:** Força ressincronização de preço/frete para um canal ou produto fora do ciclo periódico. Útil em campanhas e lançamentos. Rate-limited para evitar abuso.
**Exceções:**
*   Rate limit atingido → HTTP 429 com header `Retry-After`
*   Canal com circuit breaker aberto → HTTP 503 `{"error": "canal_indisponivel"}`

    Feature: RF-010 Atualização manual de cache
    
      Scenario: Atualização manual bem-sucedida
        Given Escritório autenticado e rate limit não atingido
        When POST /hub/v1/cache/refresh { canal: "shopee" }
        Then HTTP 202
        And a sincronização Shopee é disparada imediatamente
        And response contém { canal: "shopee", timestamp }
    
      Scenario: Rate limit atingido
        Given N requisições já realizadas na janela de tempo
        When POST /hub/v1/cache/refresh
        Then HTTP 429 com header Retry-After
    

* * *

### RF-011 — Métricas agregadas de uso do comparador

**Status:** ready | **MoSCoW:** Should Have | **Ator:** HUB (coleta passiva)
**Comportamento:** Coleta métricas agregadas e anônimas: pageviews por produto, distribuição de cliques por canal, taxa de redirecionamento. Sem PII, sem fingerprinting. Acessível via endpoint interno para Produto.
**Regras inline:**
*   Zero PII — sem IP, sem device_id, sem user_agent
*   Dados armazenados apenas de forma agregada

    Feature: RF-011 Métricas agregadas
    
      Scenario: Clique registrado sem PII
        Given o cliente clica em "Comprar" no canal Wake
        When o HUB registra o evento
        Then o registro contém { produto, canal: "wake", timestamp }
        And NÃO contém IP, device_id, user_agent ou qualquer PII
        And o dado é armazenado apenas em forma agregada
    

* * *

RESUMO MOSCOW
-------------

| ID | Requisito | MoSCoW | Status |
| --- | --- | --- | --- |
| RF-001 | Endpoint de link para o Escritório Virtual | Must Have | ready |
| RF-002 | Geração de link encurtado de compartilhamento | Must Have | blocked (01,02) |
| RF-003 | Bloqueio de link de canal por ausência de vínculo | Must Have | ready |
| RF-004 | Comparador público de preço e frete | Must Have | blocked (06) |
| RF-005 | Sincronização periódica de preço e frete via cache | Must Have | blocked (04,05) |
| RF-006 | Ordenação por menor custo e ocultação de canal inválido | Must Have | blocked (03) |
| RF-007 | Redirecionamento do cliente ao canal escolhido | Must Have | ready |
| RF-008 | Onboarding e validação de vínculo | Must Have | blocked (05) |
| RF-009 | Endpoint de status de integração por canal | Must Have | ready |
| RF-010 | Endpoint de atualização manual de cache | Should Have | ready |
| RF-011 | Métricas agregadas de uso do comparador | Should Have | ready |
| — | Histórico de links por influenciadora | Could Have | H2 |
| — | Notificação de venda atribuída | Could Have | H2 |
| — | Integração com Mercado Livre | Won't Have | H2 |
| — | Sugestão automática de canal por perfil | Won't Have | H3 |
| — | Expansão internacional | Won't Have | H3 |
| — | Painel de admin no HUB | Won't Have | fora de escopo |
| — | Feed push HUB → Escritório | Won't Have | substituído por endpoint pull (RF-001) |

* * *

INTEGRAÇÕES
-----------

> Itens marcados BLOCKED-05 não têm credenciais — implementar com mock.

### INT-01 — Shopee

**Status:** blocked (BLOCKED-02, BLOCKED-05)
| Campo | Valor |
| --- | --- |
| Tipo | API REST (Affiliates API GraphQL+HMAC) **ou** URL pattern |
| Direção | HUB consome (entrada) |
| Endpoint | URL pattern: `s.shopee.com.br/an_redir?origin_link={URL}&affiliate_id={ID}` · API: [BLOCKED-05] |
| Autenticação | Affiliates API: OAuth individual + HMAC · URL pattern: sem auth |
| Sandbox | [BLOCKED-05] |
| Docs | Shopee Affiliates API |
| Owner técnico | [A DEFINIR — Engenharia] |
**Uso:** onboarding de afiliada (RF-008), sincronização de preço/frete (RF-005), composição de link Shopee (RF-002).
**Decisão pendente (BLOCKED-02):** URL pattern (sem API, mas latência e rate limit não documentados) vs. Affiliates API (shortlink oficial rastreável, exige OAuth individual). Validar URL pattern com compra real antes de decidir.
**Tratamento de falha:**
| Condição | Comportamento |
| --- | --- |
| HTTP 429 | Retry com backoff exponencial |
| HTTP 503 / timeout | Circuit breaker após BLOCKED-04 falhas; manter cache; alerta |
| Credencial inválida | Status do canal → erro; alerta |

* * *

### INT-02 — TikTok Shop (Affiliate API)

**Status:** blocked (BLOCKED-05)
| Campo | Valor |
| --- | --- |
| Tipo | API REST (Affiliate API — obrigatória, sem URL pattern) |
| Direção | HUB consome (entrada) |
| Endpoint | [BLOCKED-05 — credencial pendente] |
| Autenticação | OAuth do creator (escopos affiliate_creator) + Ybera como affiliate_seller |
| Sandbox | [BLOCKED-05] |
| Docs | TikTok for Business — Affiliate API |
| Owner técnico | [A DEFINIR — Engenharia] |
**Uso:** onboarding de creator (RF-008), sincronização de preço/frete (RF-005), composição de link TikTok (RF-002).
**Fluxo encadeado obrigatório:** Ybera (affiliate_seller) habilita produto → HUB chama Affiliate API com token OAuth do creator → link comissionável gerado. Sem URL pattern alternativo.
**Tratamento de falha:** idêntico ao INT-01 (sem a opção de URL pattern).

* * *

### INT-03 — Wake (Seller API + montagem de URL)

**Status:** ready (credenciais via Squad Ecommerce Brasil)
| Campo | Valor |
| --- | --- |
| Tipo | API REST (preço/frete) + montagem de URL (link de parceiro, sem API) |
| Direção | HUB consome (entrada) |
| Endpoint | [A DEFINIR — Wake Open API] |
| Autenticação | [A DEFINIR com Squad Ecommerce Brasil] |
| Owner técnico | Squad Ecommerce Brasil / Vinicius |
**Uso:** sincronização de preço/frete (RF-005); composição de link Wake via montagem de URL com código do parceiro — parceiros já cadastrados no B2C. Atribuição nativa, sem API gated.

* * *

### INT-04 — Escritório Virtual (API interna — pull)

**Status:** ready (lógica de feed eliminada na v1.6)
| Campo | Valor |
| --- | --- |
| Tipo | API REST — Escritório consome endpoint do HUB |
| Direção | Escritório → HUB (pull, sob demanda) |
| Autenticação | Token / mTLS [A DEFINIR] |
| Owner técnico | Equipe Escritório Virtual |
| Contrato formal | [A DEFINIR — D-01: formalizar antes de dev] |
**HUB expõe ao Escritório:** RF-001 (`GET /link`), RF-009 (status), RF-010 (cache manual) **HUB consome do Escritório:** identidade (chave única) e catálogo de produtos

> Mudança v1.6: não há feed push. O Escritório consulta `GET /link` sob demanda. O HUB detém toda a lógica.

* * *

REQUISITOS NÃO FUNCIONAIS
-------------------------

| ID | Categoria | Requisito | Métrica |
| --- | --- | --- | --- |
| RNF-01 | Performance | LCP do comparador mobile | < 2,5s |
| RNF-02 | Performance | TTI do comparador | < 3,5s |
| RNF-03 | Performance | Resposta comparador via cache (p95) | < 500ms |
| RNF-04 | Segurança | Integridade de links via HMAC | 100% |
| RNF-05 | Segurança | Endpoints autenticados, idempotentes, rate-limited | Token/mTLS |
| RNF-06 | Segurança | Segredos de API em cofre | Zero segredo em código/env |
| RNF-07 | Privacidade | Zero PII do cliente no comparador | Auditável — zero registros com PII |
| RNF-08 | Disponibilidade | SLA comparador público | 99% uptime |
| RNF-09 | Disponibilidade | Degradação graciosa | Comparador funciona com ≥ 1 canal |
| RNF-10 | Escalabilidade | Catálogo × influenciadoras | Catálogo completo × ≥ 700 influenciadoras sem degradação |
| RNF-11 | Resiliência | Circuit breaker por canal | Abre após BLOCKED-04 falhas; fecha após recuperação |
| RNF-12 | Frescor | Defasagem máxima de cache por canal | 30 min |

* * *

HISTÓRICO DE REVISÕES
---------------------

| Versão | Data | Autor | O que mudou |
| --- | --- | --- | --- |
| 0.1 | 25/06/2026 | Monteirinho / Victor Lima | Rascunho inicial — formato template DRF v2 (leitura humana), base DRP v1.2 |
| 0.2 | 25/06/2026 | Monteirinho | Refatoração para formato AI First, base DRP v1.2 |
| 0.3 | 25/06/2026 | Monteirinho | Regerado a partir do DRP v1.6: feed eliminado (RF-001 vira endpoint pull); Q-04/Q-05 fora de escopo; Q-06 resolvida (composição de link por canal); link encurtado (RF-002); SKU único como invariante (Q-08); bloqueios recalibrados — caem feed/reconciliação/composição, entram Shopee URL-vs-API e embalagem do link |
| 0.4 | 25/06/2026 | Monteirinho | Atualizado a partir do DRP v1.7: Q-06 detalhada com formato técnico confirmado por canal (Wake `?parceiro={codigo}`, Shopee URL pattern vs. API, TikTok fluxo encadeado); RF-008 reescrito com sub-fluxo de autorização OAuth em duas etapas (iniciação + callback) e novo estado `aguardando_autorizacao`; autorização individual do afiliado tratada como pré-condição externa (D-07) no caminho crítico; máquina de estados, RF-003 e RF-009 atualizados com o novo estado; Wake reforçado como canal-base garantido sem autorização |

* * *

_DRF — HUB Inteligente Ybera | Ybera Group — Time de Produto & Engenharia | v0.4-aifirst · 25/06/2026 · Template DRF v3_