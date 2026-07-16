# Base de Conhecimento — Ybera Group
### Extraída da Wiki B2C | Azure DevOps

---

## 1. Template Oficial de PBI

História de Usuário
Como [ator]
Quero [ação/funcionalidade]
Para [benefício/objetivo]

Delimitação / DoR
- Projeto: Ex: PRO, Ybera Club, Loja Ybera.com
- Sistema: Ex: Escritório Ybera Club, Academy, App, Wake, Shopify
- País: Ex: Brasil, EUA, ou Global
- Roles Impactadas: Para Ybera Club: Influencer, Gestor, G20. Para ecommerce: Não se aplica.
- Dependências e riscos: integrações com sistemas, plataforma ou conexões externas
- Testes e validação: principais testes que a PBI precisa passar para ser considerada pronta
- Expectativa de Entrega: obrigatório para ecommerce; opcional para Ybera Club (segue versionamento)

Regras de Negócio
- Especificar o comportamento esperado da funcionalidade
- Responder: Quem pode fazer? Quando? Onde? (incluir rota/URL quando aplicável)
- Se há configuração por admin, descrever o comportamento esperado

---

## 2. Fluxo de Concepção de Produto

Etapa 1 - Especificações Mínimas | Responsável: Produto | Ação: Elaborar Briefing Document
Etapa 2 - Priorização no Backlog | Responsável: Produto | Ação: Avaliar e priorizar a demanda
Etapa 3 - Repasse ao PD | Responsável: Produto | Ação: Abrir Feature no DevOps + criar PBIs + descrever EMs (Epic Milestones)
Etapa 4 - Classificação PD | Responsável: Design | Ação: Classificar tipo de demanda de design
Etapa 5 - Prototipação | Responsável: Design | Ação: Criar protótipo no Figma
Etapa 6 - Validação do Protótipo | Responsável: Produto + Stakeholder | Ação: Aprovar ou solicitar ajustes
Etapa 7 - Refinamento | Responsável: Produto + Dev | Ação: Refinamento técnico da PBI para desenvolvimento

---

## 3. Business Value Score (BVS)

Calculado no momento em que a demanda entra no backlog estratégico. O PO define os parâmetros:
- Impacto: impacto esperado no negócio e nos usuários
- Urgência: necessidade temporal da entrega
- Confiança: nível de certeza sobre o valor da entrega
- Valor Estratégico: alinhamento com os objetivos estratégicos do Grupo

Calculado via planilha "Novo Business Value". Exposto na Agenda Pública (Notion/Sheets).

---

## 4. Regras de Negócio — Ybera PRO

### 4.1 Roles PRO
- Representante: possui link de divulgação para cadastro de Representantes e Profissionais
- Profissional: pode vender/comprar na loja externa; possui link de divulgação da loja
- Embaixador: mescla de Representante e Profissional; atingido com compra de R$3.000 de um Representante, ou promovido por Admin
- Distribuidor: nova role prevista no Novo Sistema PRO (em desenvolvimento)

### 4.2 Cadastro PRO
1. Requer link de indicação de um Representante ou Embaixador já cadastrado
2. O link é referente ao escritório logado
3. Pré-cadastro: username, nome, sobrenome, e-mail, senha e confirmação
4. Valida se login ou e-mail já existem na plataforma
5. E-mail de confirmação enviado após pré-cadastro
6. No primeiro login: documentos validados — Brasil: CPF (PF) ou CNPJ (PJ) | USA: Id Number
7. PJ exige: CNPJ, nome da empresa, dados do representante legal (CPF, nome completo, nascimento, gênero, contato)
8. Endereço: CEP via API com autopreenchimento

### 4.3 Comissionamento PRO
Estrutura de 5 níveis:
- Vendedor: 60%
- N1: 20% | N2: 8% | N3: 4% | N4: 4% | N5: 4%

Regras especiais:
- Prime: comissão incide 100% na primeira parcela; sem comissão na recorrência (2ª parcela em diante)
- Embaixador vendendo fora da rede: recebe 15%; bônus NÃO sobe para a rede
- Venda de Prime para membro da rede PRO: prevalece o vínculo PRO existente

### 4.4 Inativação de Usuário PRO na Wake
Para inativar (3 passos):
1. Na Wake: filtrar por nome/número de parceiro, confirmar escopo PRO ou B2C, inativar usuário PRO
2. No sistema: filtrar por nome/email/CNPJ/CPF, confirmar parceiro PRO, remover usuário
3. No sistema: filtrar por nome/email/CNPJ/CPF, editar usuário, remover tipo de perfil e salvar

---

## 5. Regras de Negócio — Ecommerce Brasil

### 5.1 Exibição de Produtos PRO
- Categoria Profissional: visível para qualquer usuário
- Usuário não PRO na PDP: preço "Sob consulta"; botão de compra bloqueado; PDP informa exclusividade PRO
- Usuário PRO: preço real; fluxo normal de compra habilitado
- Tentativa de compra sem elegibilidade: bloqueada inclusive via API/integrações externas

### 5.2 Promoções de Brinde
- Gerenciadas pelo motor promocional nativo da Wake
- Brindes enviados ao ERP com valor zerado pela Wake
- Dependem do middleware para tratamento fiscal
- Validação dinâmica no carrinho e checkout (não pode depender exclusivamente de cache)
- Promoções de brindes podem ser cumulativas
- Se o item principal for removido, os brindes vinculados também são removidos
- Configuração admin na Wake: produto gatilho, produto brinde, período, cumulatividade e critérios mínimos

---

## 6. Regras B2C — Connect

### Cadastro de Novo Influencer
- Gestora faz pré-cadastro do lead na plataforma Connect
- Admin analisa, aprova, reprova ou adapta o perfil
- Aprovado: lead notificado e completa o cadastro tornando-se Influencer ativo
- Reprovado: lead notificado com justificativa

### Fluxo de Compra de Conexão
- Precificação do Lead: valor definido por critérios de perfil e relevância
- Limite Mensal: Gestora possui controle de limite mensal de compras de conexão
- Saldo na Carteira Connect: Gestora pode adicionar saldo para comprar conexões
- Pós-Compra: Gestora e Lead recebem comunicação de confirmação

---

## 7. DoR — Definition of Ready

Checklist mínimo antes de uma PBI entrar em desenvolvimento:

1. Países/Projetos Afetados: Global, Brasil, EUA ou países específicos; se afeta PRO; comportamento de subcontas
2. Roles Afetadas: Admin e Admin2 podem fazer alterações; TeamManager (Gestor de Equipe) tem bônus de Rede afetados se Não Exclusivo
3. Comunicação: disparos de notificação seguem fluxo padrão, salvo especificação contrária

---

## 8. Categorização de Valor das PBIs

- Valor de Negócio: impacto direto em receita, retenção ou crescimento
- Valor Técnico: melhoria de qualidade, performance ou arquitetura
- Valor de Inovação: novas ideias ou tecnologias que geram diferenciação, novos mercados ou vantagem competitiva
- Valor de Suporte: redução de chamados, melhoria de operação interna

---

## 9. Glossário de Termos Internos

- Feature: documento-mãe de implementação; desmembrada em PBIs
- PBI: Product Backlog Item; unidade de desenvolvimento derivada de uma Feature
- EM: Epic Milestone; marco de alto nível associado a uma Feature
- BVS: Business Value Score; pontuação de priorização de features no backlog
- DoR: Definition of Ready; checklist que define quando uma PBI está pronta para desenvolvimento
- DoD: Definition of Done; checklist que define quando uma entrega está concluída
- Lyberas: moeda interna do ecossistema PRO
- Prime: produto/plano de assinatura recorrente do Ybera Club
- Connect: módulo de captação e gestão de leads (Influencers) pelas Gestoras
- Lybera Shop: módulo de loja dentro do Club Brasil (não é sistema externo)
- Wake: plataforma de ecommerce utilizada para o Ecommerce Brasil
- Squad X: squad reservada para urgências e demandas emergenciais
- Escritório Virtual: espaço digital do usuário no Club, concentrando metas, comissões e rede
- Exclusivo/Não Exclusivo: configuração do Gestor de Equipe que afeta o cálculo de bônus de rede