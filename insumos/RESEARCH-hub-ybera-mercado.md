# Pesquisa de Mercado — HUB Inteligente Ybera

Data: 2026-06-11 | Solicitante: Victor (Produto) | Objetivo: quem resolve problema similar ao HUB e como funcionam atribuição e políticas dos marketplaces-alvo (Shopee, TikTok Shop, Mercado Livre)?

**Escopo alinhado com o usuário:** benchmark competitivo + atribuição/políticas de marketplaces, profundidade completa. Frente regulatória (LGPD/CONAR) **fora desta rodada** por decisão do usuário — recomenda-se cobrir antes da Etapa 7 do DRP.

> ⚠️ **Limitação de fonte:** as páginas oficiais de Termos e Condições da Shopee (help.shopee.com.br art. 124094) e do Mercado Livre (ajuda/30228) bloquearam acesso automatizado. Os achados de política vêm de fontes secundárias datadas de 2025–2026 e devem ser **conferidos nos termos oficiais antes de virar requisito** — registrado como pendência.

---

## 1. Sumário Executivo

- **Nenhum player encontrado combina o que a POC propõe** — comparação de preço/frete multi-canal + rastreamento de influencer + comissão equalizada entre canais. Há players em cada peça isolada, mas não na junção. Isso é diferencial *e* sinal de alerta: a junção esbarra em barreiras de atribuição dos marketplaces.
- **A atribuição nativa dos marketplaces não enxerga o influencer da Ybera.** Shopee, TikTok Shop e Mercado Livre atribuem comissão ao **afiliado deles** (last click, janelas de 7 a 30 dias). A Ybera, como seller, não recebe do marketplace o dado de qual influencer originou a venda — a promessa de "comissão igual em qualquer canal" depende de resolver esse rastreio.
- **Preço em tempo real é viável sem scraping** porque a Ybera é a vendedora nos 4 canais: Mercado Livre tem APIs públicas de itens/preços/frete; Shopee e TikTok Shop dão acesso via APIs de seller ao próprio catálogo. Frete por CEP do cliente é o ponto mais frágil fora do ML.
- **O modelo mais próximo do HUB é o LTK** (hub de produtos de múltiplos varejistas com comissão ao creator) somado à **Vitrine do Afiliado da Shopee** (um link → vitrine → comissão sobre qualquer compra). Nos comparadores (Buscapé/Zoom), o que se aproveita é a UX de comparação, não o modelo de negócio (CPC).
- **Comissão absorvida pela Ybera = margem diferente por canal.** As taxas de cada marketplace variam (e mudaram em 2026 na Shopee); equalizar a comissão do influencer significa aceitar margens desiguais por canal — precisa entrar na conta de viabilidade (Etapa 3/8).

## 2. Perguntas de Pesquisa e Respostas

**P1. Quem resolve problema similar?** Por peça: link-in-bio com monetização (Linktree, Beacons), hubs de afiliados de creators (LTK, Squid), agregadores de links multi-marketplace (Divulgador Inteligente), vitrines nativas dos marketplaces (Vitrine do Afiliado Shopee, Vitrine TikTok Shop, programa de influencers do Mercado Livre) e comparadores B2C (Buscapé/Zoom). Ninguém junta as peças. → §3

**P2. Quais modelos de atribuição cross-channel existem?** Last click é o padrão de mercado (Hotmart, Shopee, ML). Janelas: Shopee 7 dias, ML 30 dias, TikTok Shop atribuição in-app. Rastreio por sub-IDs em links (Shopee) e por painel/canal (ML). Não existe atribuição *entre* marketplaces — cada um fecha a janela dentro do próprio domínio. → §4

**P3. Políticas dos marketplaces-alvo?** Resumidas em §4, com a ressalva de fonte secundária.

**P4. Restrições legais/regulatórias?** Fora do escopo desta rodada (decisão do usuário, 2026-06-11). Um achado incidental: identificação obrigatória de link de afiliado (#publicidade) já aparece como exigência do próprio ML.

**P5. O que o benchmark sugere para o nosso modelo?** → §6 e §7.

## 3. Benchmark Competitivo

| Player | Tipo | O que faz | Modelo de receita | O que falta p/ o problema do HUB |
|---|---|---|---|---|
| **Linktree** | Link-in-bio | Página única de links; 35M+ usuários; embed Shopify | Freemium (planos pagos) | Não compara preço, não atribui venda, não paga comissão |
| **Beacons** | Link-in-bio + loja | Loja do creator, mídia kit, vendas diretas | Planos US$ 8–30/mês + taxa de 9% sobre vendas (0% no plano topo) | Venda direta do creator, não multi-canal de uma marca |
| **LTK (rewardStyle)** | Hub de afiliados de creators | Vitrine do creator com produtos de múltiplos varejistas; comissão 10–18% por venda | Comissão sobre vendas (rede de afiliados) | **Modelo mais próximo**; mas não compara preço entre canais nem equaliza comissão |
| **Squid (ex-Wake Creators, UNLK)** | Plataforma de influencer mktg | 300 mil influencers; gestão de campanhas, métricas via API | SaaS/serviço para marcas | Campanhas e medição, não venda multi-canal com atribuição |
| **Divulgador Inteligente** | Ferramenta BR p/ afiliados | Gera/organiza links de afiliado de Amazon, Magalu, ML, Shopee, Awin etc. | Assinatura | Serve o afiliado individual; sem comparação de preço nem comissão própria |
| **Vitrine do Afiliado (Shopee)** | Vitrine nativa | Um link → vitrine; comissão sobre **qualquer** produto comprado a partir dela | Comissão do programa Shopee | Preso ao canal Shopee; comissão variável da Shopee |
| **Programa de influencers ML** | Programa nativo | Influencer lucra divulgando dentro do ML | Comissão do programa ML | Preso ao canal ML |
| **Buscapé / Zoom (Mosaico/Banco PAN)** | Comparador de preços B2C | Compara preço entre lojas; cupons e cashback | CPC pago pelo lojista + comissão marketplace | Sem influencer, sem atribuição de rede — referência só de UX de comparação |

**Inferência:** o espaço "comparação multi-canal + atribuição de influencer + comissão equalizada pela marca" está vazio no Brasil. A hipótese mais plausível é que o vazio existe porque os marketplaces não expõem atribuição de terceiros (§4), não por falta de demanda — o que reforça que o risco central do HUB é técnico-operacional, não competitivo.

## 4. Políticas e Restrições de Plataformas

*Fontes secundárias, acesso 2026-06-11 — validar nos termos oficiais (pendência).*

### Shopee (programa de afiliados)
- Comissão base 2–14% por categoria; cookie de **7 dias, last click**; suporte a **sub-IDs** por canal nos links.
- Mudança de política de comissão de vendedores em **mar/2026**: estrutura variável por faixa de preço + taxa por item, distinção CNPJ × CPF (afeta o custo da Ybera como seller, não a comissão de afiliado).
- Tráfego pago para a marca/domínio é apontado como proibido por fontes da comunidade (**baixa confiança — confirmar no T&C**).
- Open API: acesso **restrito a sellers** (pedidos, logística, catálogo próprio). Não há API pública de preços para terceiros; como seller, a Ybera acessa o próprio catálogo.

### TikTok Shop
- Lançado no Brasil em **mai/2025**. Comissão de afiliado definida pelo seller, faixa praticada 5–20% (efetiva 15–20%). Entrada a partir de 1.000 seguidores; CPF aceito para afiliado sem loja.
- Operação **fechada no app**: links de produto vivem em vídeos, lives e na Vitrine do criador; atribuição e carteira são in-app. Deep link externo leva para dentro do app.
- TikTok anunciou **APIs de afiliados para desenvolvedores** (2024, anúncio global) — disponibilidade e termos no Brasil a confirmar.

### Mercado Livre (programa de afiliados e criadores)
- Comissão por categoria ~7–16% (**Moda/Beleza: 14–16%** — categoria da Ybera). Janela de atribuição de **30 dias a partir do clique**.
- Pagamento automático no **Mercado Pago**, a partir de R$ 30, com validação de até 60 dias após o mês da venda.
- Proibições reportadas: tráfego pago apontando para o domínio do ML, autocompra pelo próprio link, pop-ups; exigência de identificar link de afiliado (#publicidade).
- **Não há API do programa de afiliados** (reclamação recorrente de afiliados); mas o ML tem **APIs públicas de itens, preços e custos de envio** (developers.mercadolivre.com.br) — único dos três com preço/frete consultável oficialmente por aplicação externa.

### Loja Ybera (Wake)
- Canal próprio: preço, frete, atribuição e comissão 100% sob controle da Ybera. É o único canal onde a promessa da POC já funciona hoje.

## 5. Análise

**JTBD do influencer:** "quando vou divulgar um produto, quero um link único que não me faça escolher entre comissão e conveniência do meu seguidor, para não perder venda nem comissão." Hoje o job é resolvido a favor da comissão (orientar para a Loja Ybera) à custa da conversão.

**Matriz de posicionamento** (eixo X: nº de canais cobertos; eixo Y: quem garante a comissão do influencer):
- Vitrines nativas (Shopee, ML, TikTok): 1 canal × comissão do marketplace.
- LTK/Squid: multi-varejista × comissão via rede de afiliados.
- Linktree/Beacons: multi-link × sem comissão de venda física.
- **HUB Ybera (proposta): 4 canais × comissão garantida pela marca — quadrante vazio.**

**Forças competitivas relevantes (Porter, parcial):** o poder está nos marketplaces — eles controlam atribuição, APIs e regras de comissão, e mudam políticas unilateralmente (Shopee mar/2026). O HUB nasce dependente de plataformas que não devem nada a ele.

## 6. Riscos e Oportunidades Identificados

**Riscos (alimentam a Etapa 8):**
1. **Atribuição cega nos marketplaces** — sem mecanismo confiável de ligar venda no marketplace ao influencer, o payout quinzenal da POC vira conciliação manual (custo operacional + disputas).
2. **Dependência de políticas voláteis** — Shopee mudou comissionamento em mar/2026; janelas e regras podem mudar sem aviso.
3. **Dupla comissão** — se o influencer também for afiliado nativo do marketplace, pode receber do marketplace E da Ybera pela mesma venda (ou a Ybera paga comissão sobre venda que o marketplace já comissionou a outro afiliado).
4. **Margens desiguais por canal** — comissão equalizada + taxas diferentes por canal = rentabilidade por canal diferente; o HUB pode direcionar volume justamente para o canal de pior margem.
5. **TikTok Shop fechado no app** — comparação de preço externa com deep link é possível, mas rastreio externo é o mais limitado dos três.

**Oportunidades:**
1. Quadrante vazio no mercado BR (§5) — primeiro a resolver atribuição cross-channel para rede própria cria vantagem real.
2. ML tem APIs públicas de preço/frete — canal ideal para o MVP técnico da comparação.
3. Vitrine do Afiliado (Shopee) e programa de influencers do ML podem ser **componentes** da solução (usar a atribuição nativa de cada canal) em vez de competir com ela.
4. Squid pertence ao ecossistema UNLK (ex-Wake) — possível atalho de parceria/tecnologia dado que a Ybera já opera Wake.

## 7. Recomendações (sugestões — decisão é do PM/PO)

1. **Tratar a atribuição como a questão de viabilidade nº 1 do DRP** — antes de desenhar UX de comparação. Hipótese a explorar na Etapa 6/7: usar o influencer como afiliado nativo em cada marketplace (links de afiliado dele, com sub-ID da Ybera) e a Ybera **complementar** a diferença de comissão, em vez de absorver tudo.
2. **MVP de comparação começando por Loja Ybera + Mercado Livre** (únicos com preço/frete oficialmente consultáveis), com Shopee/TikTok em fase 2 via APIs de seller.
3. **Validar juridicamente os T&Cs oficiais** dos três programas antes da Feature (pendência desta pesquisa).
4. Levar para a Etapa 3 a pergunta de negócio: qual o custo anual estimado da comissão absorvida por canal, dado o diferencial de taxas?

## 8. Fontes (acesso 2026-06-11)

**Benchmark:**
- Beacons vs Linktree 2026 — https://linke.ro/blog/beacons-vs-linktree e https://whop.com/blog/linktree-vs-beacons/
- LTK (como funciona, comissões) — https://company.shopltk.com/pt-br/how-it-works-creators e https://company.shopltk.com/pt-br/faqs
- Squid volta a ser Squid (UNLK, R$ 45M) — https://mundodomarketing.com.br/wake-creators-volta-a-ser-squid-e-foca-em-projeto-de-aceleracao-em-2026
- Divulgador Inteligente — https://www.divulgadorinteligente.com/
- Vitrine do Afiliado Shopee — https://help.shopee.com.br/portal/10/article/124098-O-que-%C3%A9-o-Programa-de-Criadores-e-Afiliados-Shopee e https://affiliate.shopee.com.br/
- Programa de influencers do Mercado Livre — https://www.meioemensagem.com.br/marketing/mercado-livre-cria-programa-para-que-influencers-lucrem-na-plataforma
- Buscapé/Zoom (modelo CPC) — https://neofeed.com.br/blog/home/buscape-o-quase-fim-de-um-icone-da-internet-brasileira/ e https://www.linksexperts.com.br/blog/como-anunciar-no-buscape/

**Políticas e APIs:**
- Shopee afiliados (T&C oficial — não acessado, pendência) — https://help.shopee.com.br/portal/10/article/124094
- Shopee afiliados 2026 (cookie 7d, sub-ID, comissões) — https://kildaryoliver.com.br/como-funciona-programa-afiliados-shopee/ e https://agenciajatemmais.com.br/programa-de-afiliados-shopee-como-funciona-e-como-extrair-o-maximo-em-2026/
- Shopee mudança de comissão mar/2026 — https://abaccus.com.br/blog-posts/shopee-mudou-as-regras-de-comissao-2026 e https://seller.shopee.com.br/edu/article/26839
- Shopee Open API (acesso seller) — https://seller.shopee.com.br/edu/article/3445
- TikTok Shop afiliados BR — https://blog.arcosscale.com.br/como-funciona-programa-afiliados-tiktok-shop-criadores/ e https://gosmarter.com.br/comissoes-tiktok-shop-brasil-custos-margem-seller/
- TikTok Shop affiliate APIs (developers) — https://developers.tiktok.com/blog/2024-tiktok-shop-affiliate-apis-launch-developer-opportunity
- Mercado Livre afiliados (T&C oficial — não acessado, pendência) — https://www.mercadolivre.com.br/ajuda/30228
- ML afiliados (comissões, janela 30d, Mercado Pago) — https://hunterhub.com.br/blog/programa-de-afiliados-mercado-livre-como-funciona-comissao-afiliados-ml/ e https://capturama.com.br/comissao-de-afiliado-do-mercado-livre/
- ML sem API de afiliados — https://www.reclameaqui.com.br/mercado-livre/programa-de-afiliados-do-mercado-livre-nao-tem-uma-api_-lfESpIamuDGm2ro/
- ML APIs públicas de preço/itens/frete — https://developers.mercadolivre.com.br/pt_br/api-de-precos e https://developers.mercadolivre.com.br/pt_br/itens-e-buscas
- Atribuição last click (referência Hotmart) — https://help.hotmart.com/pt-br/article/360016601731
