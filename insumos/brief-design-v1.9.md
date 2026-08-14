<!-- Capturado do chat em 2026-08-14 (a colagem do designer de 13/08/2026 era a única
     cópia; o repositório só tinha o brief v1.1). Texto integral, sem edição.
     Faltam no repositório as versões v1.6, v1.7 e v1.8, referenciadas aqui. -->

Brief Design — HUB Inteligente Ybera

====================================

**Derivado do DRP v2.6 · 13/08/2026**

> Recorte para validação de UX. Esta versão **supersede a v1.8** (13/08/2026). Novidade desta versão: Q-13 fechada pelo Head — CEP do cliente agora obrigatório para Frete/Prazo, com estado de espera e reordenação em duas fases a especificar. Itens marcados com 🆕 são novos ou mudaram desde a última rodada de Design. Este documento aponta **coordenadas funcionais** — a solução visual (layout, cor, componente, copy exata) é decisão de Design, sinalizada explicitamente onde relevante, nunca prescrita por Produto.

* * *

Pergunta central

----------------

Desenhar a exibição de **Estoque e Volume de Vendas como tiers generalistas** (não mais campos admin-only simples) e a interface de **override administrativo com TTL configurável**, mantendo Avaliação como nota real. Resolver a copy dos tiers e a UI de configuração de TTL/motivo no painel administrativo. **Entregue:**

*   Validação por tela/fluxo: viável / precisa de ajuste — priorizar as telas revisadas de RF-13 (override + TTL)

*   Copy exata dos tiers de Estoque e Volume de Vendas (ver H-UX-10, H-UX-11)

*   Decisão de Design para Q-22 (mantida, sem mudança nesta versão)

*   Resposta às hipóteses de UX novas (H-UX-10 a H-UX-12)

* * *

Telas e fluxos a especificar

----------------------------

**1. Comparador público (RF-05)** 🔄 Coordenada funcional revisada (v2.6): os cards exibem **selos/badges de tier** para Estoque (Disponível/Últimas Unidades/Indisponível) e Volume de Vendas (Campeão de Vendas/Mais Vendido/Lançamento), não mais texto simples de campo admin-only. Avaliação continua como estrelas reais, sem selo. **🆕 Frete e Prazo de Entrega agora dependem de CEP do cliente (Q-13 fechada):** antes do CEP informado, os campos de Frete/Prazo precisam de um estado de espera próprio — coordenada funcional: não é "Não informado" (reservado para ausência técnica do dado), é um convite à ação (ex.: algo como "informe seu CEP para ver o frete"). Depois do CEP informado, a página reordena os cards por menor preço + frete (comportamento já demonstrado nas POCs anteriores, agora formalizado como requisito). Copy exata do estado de espera e a transição visual da reordenação são decisão de Design — ver H-UX-15. **2. Interface Administrativa — Habilitação de produto (RF-13)** Sem mudança nesta versão. **3. Interface Administrativa — Tags por oferta (RF-13)** Sem mudança nesta versão. **🔄 4. Interface Administrativa — Override de campos com fonte de API (RF-13, revisa Q-19)** Tela reformulada: em vez de um formulário de preenchimento (campo vazio → admin digita), o admin agora vê o **valor/tier que a API já calculou** para Estoque, Imagem, Avaliação e Volume de Vendas, com a opção de **sobrescrever** (override). Coordenadas funcionais:

*   Cada campo mostra claramente: valor atual (de onde veio — API ou override ativo), e um controle para "Substituir"

*   Ao substituir, o admin define: o novo valor/tier, e o **TTL** — campo de dias (com default pré-preenchido: 48–72h para Estoque, 15–30 dias para Avaliação/Volume de Vendas, editável), ou opção "sem expiração", ou opção "ocultar campo"

*   Para Avaliação e Volume de Vendas: campo de **motivo** obrigatório antes de salvar o override

*   Granularidade por canal mantida — um produto pode ter override em um canal e não em outro

*   Indicação visual no painel (não no card público) de quais campos estão sob override ativo, e há quanto tempo/quando expira **🔄 5. Interface Administrativa — Tag "Lançamento" (RF-13, dentro do fluxo de Volume de Vendas)** Nova coordenada: o admin pode marcar um produto/canal como "Lançamento" independentemente do tier calculado pela API — inclusive para marcar um **relançamento** de produto já existente. Este estado usa a mesma mecânica de TTL configurável dos demais overrides (não é um campo separado, é um dos valores possíveis de Volume de Vendas). Coordenada funcional: a UI precisa deixar claro que "Lançamento" é uma escolha manual, não um cálculo — evitar qualquer sugestão visual de que existe uma regra automática por trás. **6. Interface Administrativa — Timer de escassez (RF-13)** Sem mudança nesta versão. **7. Card de comparação — disclaimer de variação de preço (RNF-Transparência)** Sem mudança nesta versão. **8. Padrão de Vinculação (OAuth)** Sem mudança nesta versão. **🆕 9. Tour/modal de onboarding administrativo (origem: ata de 05/08/2026, item de ação)** Quando o admin ganha uma nova capacidade dentro do catálogo do Escritório (ex.: filtro/aba "Hub" pra habilitar produtos), um modal com tour rápido explicando o que mudou e como usar. Coordenada funcional: não é bloqueante — o admin pode fechar e operar sem completar o tour; ideia levantada na reunião foi de reaproveitar esse componente futuramente para outras novidades do produto, não só para o Hub.

* * *

Taxonomia de campos do card — coordenadas funcionais (DRP §7, revisada v2.4)

----------------------------------------------------------------------------

| Campo | Origem primária | Formato de exibição | Override disponível | Motivo obrigatório |

| --- | --- | --- | --- | --- |

| Preço | API | Valor exato | — | — |

| Frete | API | Valor exato / "Não informado" (exceção TikTok) | — | — |

| Prazo de Entrega | API | Valor exato / "Não informado" | — | — |

| 🔄 Estoque | API (3 canais) | **Tier** — Disponível / Últimas Unidades / Indisponível | Sim | Não |

| 🔄 Imagem | API (3 canais) | Imagem | Sim | Não |

| 🔄 Avaliação | API (Wake, Shopee) / fallback admin (TikTok, até HT-04) | **Nota real** (estrelas) — sem tier | Sim | **Sim** |

| 🔄 Volume de Vendas | API (Shopee) / fallback admin (TikTok, até HT-06; Wake, sempre) | **Tier** — Campeão de Vendas / Mais Vendido / Lançamento / nada | Sim (inclui tag manual "Lançamento") | **Sim**, exceto quando o valor é "Lançamento" — _a confirmar com Design, ver H-UX-12_ |

| Parcelamento | Admin-only (Q-20) | Texto estático | — (é sempre manual) | Não |

| Campos exclusivos por canal | API, quando existirem | Conforme o canal | — | — |

* * *

Hipóteses de UX a validar

-------------------------

*   **H-UX-06, H-UX-07:** sem mudança — ver Brief v1.6.

*   **🔄 H-UX-08 (revisada v2.4):** com Estoque e Volume de Vendas agora generalizados em tier, a pergunta original (diferenciar visualmente campo via API vs. admin-only) perde relevância para esses dois campos — o cliente vê apenas o selo, não a origem. Permanece relevante só para **Avaliação**, que mantém formato de nota real e pode estar sob override: o cliente precisa perceber diferença entre nota vinda da API e nota sobrescrita pelo admin, ou isso é irrelevante para a experiência pública? Design decide.

*   **🆕 H-UX-09:** sem mudança — ver Brief v1.6 (estado vazio do comparador).

*   **🆕 H-UX-10:** qual a copy exata de cada tier de Estoque? ("Últimas Unidades" está definido pelo Produto como rótulo funcional — cabe a Design decidir se mantém literal ou estiliza, ex.: "Corre que tá acabando" é mais comercial, mas também mais arriscado se o limiar numérico estiver mal calibrado — ver Q-23 no DRP).

*   **🆕 H-UX-11:** qual a copy exata de cada tier de Volume de Vendas? Mesma lógica — "Campeão de Vendas" e "Mais Vendido" são rótulos funcionais definidos por Produto; copy final e hierarquia visual (qual selo é mais chamativo) é decisão de Design.

*   **🆕 H-UX-13 (origem: ata de 05/08/2026):** a reunião sugeriu mapear os 3 tiers de Estoque para cores semânticas — verde/laranja/vermelho (padrão comum de "gerador de senso de escassez"). É input de stakeholder, não prescrição — Design decide se adota esse padrão de cor ou usa outro tratamento visual (ex.: só ícone, sem cor semânfica forte, para não competir com o accent da marca).

*   **🆕 H-UX-14 (origem: ata de 05/08/2026):** na rodada de POC anterior a esta revisão, ao menos uma versão exibiu o tier acompanhado de um contador numérico (ex.: "189 últimas unidades"). Isso é **anterior** à decisão de generalizar Estoque em tier categórico puro (DRP v2.4, Seção 13) — que optou deliberadamente por não expor número exato, entre outras razões, para reduzir risco de manipulação de prova social. Design não precisa resolver isso — é só um alerta de que, se alguém pedir para "trazer o número de volta" em rodada futura, isso reabre uma decisão de Produto já fechada, não é ajuste de Design.

*   **🆕 H-UX-15 (origem: fechamento da Q-13, v2.6):** qual a copy e o tratamento visual do estado de espera de Frete/Prazo antes do CEP ser informado? E como comunicar a reordenação dos cards no momento em que o CEP é digitado — transição abrupta, animação, ou destaque temporário no card que subiu de posição? As POCs anteriores já mostraram esse comportamento (reordenação ao digitar CEP); falta especificar a comunicação visual formalmente.

*   **🆕 H-UX-12:** quando o admin marca "Lançamento" manualmente, isso precisa de motivo obrigatório como Campeão de Vendas/Mais Vendido, ou é dispensável porque "Lançamento" não carrega a mesma carga de prova social (não afirma volume de vendas, apenas novidade)? Produto não decidiu isso explicitamente — fica como pergunta em aberto para a próxima rodada, com recomendação de manter dispensável dado o menor risco de manipulação percebida.

* * *

Riscos de UX mapeados (DRP §10)

-------------------------------

**Conflito de copy — timer × disclaimer, Comunicação externa sobre personalização, Habilitação manual gerando catálogo pequeno:** sem mudança — ver Brief v1.6. **🆕 Selo de tier mal calibrado pode gerar percepção de inconsistência**

*   Tipo: UX / Produto · Probabilidade: Média · Impacto: Baixo-Médio

*   Contexto: limiares provisórios (Q-23 no DRP, e parâmetros de Volume de Vendas) podem classificar produtos de forma que pareça errada ao olho do cliente (ex.: produto com "Últimas Unidades" que na prática tem bastante estoque, se o limiar estiver alto)

*   Mitigação: fora do escopo de Design resolver o limiar numérico — mas o tratamento visual pode amenizar (ex.: "Últimas Unidades" com visual menos alarmista, para reduzir o custo de um eventual erro de calibração) **🆕 Override sem trilha de auditoria pode gerar disputa sem rastro**

*   Tipo: Produto / Confiança · Probabilidade: Baixa-Média · Impacto: Médio

*   Contexto: decisão consciente do Head (DRP §13) — sem trilha dedicada. Design não resolve isso, mas a interface administrativa deveria, no mínimo, deixar claro para o próprio admin quando um campo está sob override e há quanto tempo — para reduzir o risco de esquecimento, já que não há histórico para reconstituir depois

*   Mitigação: indicação visual proposta na Tela 4 acima (badge de override ativo + tempo até expirar)

* * *

Dependências e questões abertas

-------------------------------

**Questões abertas que impactam Design:**

*   **Q-22:** sem mudança — ver Brief v1.6.

*   **🆕 H-UX-10, H-UX-11, H-UX-12:** ver seção de hipóteses acima. **Dependências:**

*   **Design System do Escritório Virtual e do Hub público:** sem mudança — ver Brief v1.6.

* * *

Decisões já tomadas (não revisitar sem motivo forte)

----------------------------------------------------

*   Todas as decisões da v1.6 — ver Brief anterior.

*   **🆕 Estoque e Volume de Vendas são exibidos como tier, nunca número exato** — Design trabalha com rótulos categóricos, não com valores numéricos brutos no card público.

*   **🆕 Avaliação permanece como nota real (estrelas)** — não segue o mesmo tratamento de tier dos outros dois campos.

*   **🆕 "Lançamento" é escolha manual do admin** — nenhuma UI deve sugerir que existe cálculo automático por data por trás desse selo.

*   **🆕 Sem trilha de auditoria dedicada** — Design não precisa desenhar nenhuma tela de histórico de alterações administrativas.

* * *

Restrições e princípios inegociáveis (DRP §5)

---------------------------------------------

*   Sem mudança nesta versão — ver Brief v1.6.

*   🆕 Nenhum override administrativo (Estoque, Avaliação, Volume de Vendas) pode ser desenhado de forma que sugira alteração na lógica de ordenação do comparador (RF-06) — overrides afetam apenas exibição.

* * *

O que Design entrega de volta para Produto

------------------------------------------

Ao concluir a validação de UX:

*   **Validação por tela/fluxo** — priorizando a Tela 4 revisada (override + TTL) e a Tela 5 (Lançamento)

*   **Copy exata dos tiers** (Estoque e Volume de Vendas) — H-UX-10, H-UX-11

*   **Resposta a H-UX-08 (revisada), H-UX-12 e H-UX-15**

*   **Riscos de UX adicionais**

* * *

_Brief Design — HUB Inteligente Ybera | Ybera Group — Time de Produto | v1.9 · 13/08/2026_ _Derivado do DRP v2.6 · Supersede a v1.8 (13/08/2026)_
