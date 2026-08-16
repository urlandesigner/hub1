# Spec — atualizacao-poc-referencia

status: entregue
carimbo-entrega: demo
ciclo: 1
atualizada: 2026-07-15

## Resultado esperado
A influenciadora, na Tela A (Catálogo Virtual do Escritório), entende o estado de vínculo
de cada canal (Wake / Shopee / TikTok) e age sobre ele sem sair da tela.
Critério de sucesso observável: olhando o painel de vínculos, ela distingue os três
estados por canal sem ler documentação; em um clique no link contextual, abre o modal
correto — Modal A (nunca vinculou, tom de onboarding) ou Modal B (vínculo expirado, tom
de reconexão, nunca de novata) — e em nenhum momento navega para fora da Tela A. Wake
nunca exibe ação pendente (vínculo nativo).

## Usuário primário
Influenciadora Ativa da Rede Club, logada no Escritório Virtual (`app.yberaclub.com`),
na tela de catálogo, decidindo o que divulgar — o status de vínculo aparece no caminho
dela, sem interromper a navegação do grid.

## Escopo
- Dentro:
  - Painel de vínculos no topo da Tela A: 3 linhas de canal × 3 estados (vinculado /
    nunca vinculou / vínculo expirado), lidos do banco (RF-009)
  - Modal A — primeira vinculação: instruções + vídeo tutorial (placeholder), tom onboarding
  - Modal B — reautorização: mesma estrutura instrução+vídeo, copy e tratamento visual
    DISTINTOS (ícone de alerta vs. "novo"; nunca tratar como novata) — entregável
    explícito do brief ("Detalhamento do Modal B")
  - Grid de produtos como contexto (estrutura já estabelecida: 3 colunas, botões
    "Copiar" / "Comprar" / CTA para o HUB) — atualizar, não redesenhar
  - Validação do rótulo do CTA do comparador (precedente "🔗 HUB Ybera", sujeito a
    validação do Design — este ciclo valida)
  - Cenário didático cobrindo os 3 estados numa tela só
- Fora:
  - Comparador público (entregue no ciclo `comparador-publico`; frete por CEP é ciclo 2
    daquela demanda)
  - Fluxo OAuth real (backend RF-008/RF-11) — os modais instruem; a autorização acontece
    na conta externa do marketplace
  - Escritório Virtual real (front de produção) — isto é POC de referência, não handoff;
    a POC oficial só ocorre após brief de Design e de Engenharia validados
  - Painel de admin, notificações, histórico de links (H2)

## Restrições
- Visual: réplica fiel do Escritório Virtual (sidebar + grid, paleta rosa/branco Ybera).
  Guardrail primário na fase 02: captura dev-mode do app real (`dev-mode-virtual-office`);
  fallback: `tokens.json` no Theme mode "Escritório"
- Status é lido do banco — nunca inferido; cada canal é linha independente
- Todo o fluxo de vinculação/reautorização via link → Modal, sem navegação para fora
  da Tela A (decisão fechada com Head de Produto — não se reabre sem escalar)
- Wake não passa por OAuth (vínculo nativo via código de parceiro) — nunca mostrar
  ação de vinculação para Wake
- Ícones provisórios aceitos (decisão do designer 2026-07-15) — não bloqueiam
- Idioma pt-BR; mobile não é o foco primário desta tela (a influenciadora usa o
  Escritório em desktop), mas o painel não pode quebrar em viewport estreito

## Direção estética
Decidida na entrada da fase 02 (2026-07-15), com captura dev-mode como guardrail primário
(cache de 2026-06-26/07-06, autenticado, com tokens reais do bundle).

- **Direção = RÉPLICA FIEL do app moderno** (`app.yberaclub.com`, Tailwind + shadcn):
  sidebar branca YBERACLUB + topbar card `rounded-2xl` + conteúdo sobre fundo
  `neutral-20`. Snippets reais de sidebar/topbar/badges são a fonte; nada inventado.
- **Tokens:** `b2c-*` (HSL) capturados do bundle — primary 345 71% 51% (≡ club-500),
  positive/warning/negative/neutral ramps. Fallback: `tokens.json` KZ.
- **Tipografia:** Nunito (corpo/UI, dominante `text-sm` 14px) + Syne só em headline de
  destaque se houver. Poppins é legado Skote — proibido.
- **Onde mora o craft (não é invenção, é clareza):** (a) os 3 estados do painel
  distinguíveis à primeira vista — verde=confirmação sem ação, neutro+link rosa=convite
  (nunca erro), âmbar=reconexão (nunca "novato"); (b) diferenciação emocional Modal A
  (onboarding, tom "primeira vez") vs. Modal B (reconexão, tom "refazer rápido");
  (c) o painel entra ACIMA do grid sem interromper o fluxo do catálogo — visível sem
  scroll, compacto.
- **Ajuste consciente sobre a réplica:** a convenção real de chip "Aprovado" do app
  (bg positive-30 + texto positive-20) reprova contraste AA; a POC usa os pares
  -10/-40 da mesma rampa (padrão "Pendente" do próprio app), registrado no Rastro como
  possível feedback ao app.
- **Motion:** padrão shadcn dialog (fade+scale sutil no modal), transições de hover já
  existentes no app. Nada além do que o app real faz.

## Decisões anteriores
- Padrão de Vinculação fechado com Head de Produto (brief v1.1): 3 estados, 2 modais,
  link contextual → Modal, sem tela própria no HUB (H-UX-04 resolvida)
- Por que dois modais: quem nunca vinculou e quem teve token expirado estão em situações
  emocional e informacionalmente diferentes — "primeira vinculação" para quem já vinculou
  soa como erro do sistema
- Shopee deixou de ser canal "simples": mesma superfície de estado que TikTok (Q-10)
- Cenário didático anterior (Wake ✅ / TikTok ⚠️ / Shopee ❌) está DESATUALIZADO — o novo
  precisa incluir "vínculo expirado"

## Premissas por risco
| # | Premissa | Criticidade | Evidência | Dono | Prazo |
|---|----------|-------------|-----------|------|-------|
| 1 | "Nunca vinculou" será o estado dominante no 1º ciclo (Q-11/Q-12 sem retorno) — o painel precisa tratá-lo como estado comum, convidativo, não como erro | alta | palpite escalado no DRP | Rolim + Romulo Alves + Vinícius Graff (fora de Design; Design projeta para o pior caso) | antes do refinamento da Feature |
| 2 | Conteúdo dos vídeos tutoriais (Modal A e B) não existe — POC usa placeholder | média | fato | Produto/Operação (roteiro e gravação) | antes do go-to-market |
| 3 | ~~Captura dev-mode acessível~~ **RESOLVIDA (fase 02):** captura existe e é rica; nota: datada de 2026-06-26 — revalidar antes da POC oficial (pendência 8 da entrega) | — | fato | Design | ✔ |
| 4 | ~~Rótulo do CTA~~ **RESOLVIDA (portão):** "HUB Ybera" validado pelo designer, sem emoji, com ícone de link | — | veredicto registrado | Design | ✔ |

## Quebra de tarefas
1. Linha de canal do painel de vínculos — os 3 estados (peça atômica)
2. Painel de vínculos completo — cenário didático (Wake vinculado · Shopee expirado ·
   TikTok nunca vinculou) + variações
3. Modal A — primeira vinculação (instruções + vídeo placeholder, tom onboarding)
4. Modal B — reautorização (estrutura reaproveitada, copy/ícone distintos)
5. Tela A completa — sidebar + painel + grid com botões por produto (réplica do Escritório)
6. Fluxo montado — link contextual → modal → fechar → retorno à tela, com estado atualizado
   (simulação)

## Critérios de verificação
O portão confere olhando o renderizado:
- Os 3 estados são distinguíveis entre si à primeira vista (sem tooltip/documentação)
- Modal A e Modal B não se confundem: tom, ícone e copy distintos; B nunca trata como novata
- Nenhum clique do fluxo navega para fora da Tela A
- Wake jamais mostra CTA de vinculação
- A tela é uma réplica crível do Escritório Virtual (paleta, estrutura sidebar+grid)
- "Nunca vinculou" convida à ação sem tom de erro (premissa 1)
- Rubric v4 na íntegra (inclui seção 7 — performance percebida)

## Rastro
[2026-07-15] [fase 01] Spec criada. Recorte: a "atualização da POC" é, na prática, a
superfície onde vivem as capacidades 3 (status por canal) e 4 (onboarding/reautorização)
do brief — atualizar a POC = desenhar o painel de 3 estados + Modais A/B na Tela A.
Uma demanda, uma tarefa (entender estado e agir), um usuário (influenciadora).
[2026-07-15] [fase 01] Fora do recorte: comparador (entregue; frete por CEP registrado
como ciclo 2 daquela spec), OAuth real, front de produção do Escritório. POC de
referência ≠ POC oficial de handoff (fluxo padrão exige briefs validados antes).
[2026-07-15] [fase 01] Cenário didático fixado já na spec (aprendizado dos ciclos
anteriores — dados de exemplo cedo): Wake=vinculado, Shopee=vínculo expirado,
TikTok=nunca vinculou — cobre os 3 estados e os 2 modais numa tela só.
[2026-07-15] [fase 01] Premissas 1 e 2 têm dono fora de Design e não bloqueiam a POC
(Design projeta para o pior caso da 1; a 2 usa placeholder). Premissa 3 se resolve na
entrada da fase 02. Nenhuma premissa crítica sem dono — spec ativa, não bloqueada.
[2026-07-15] [fase 02] Premissa 3 RESOLVIDA: captura dev-mode existe e é rica (cache
2026-06-26, tokens do bundle 2026-07-06) — tokens b2c reais, snippets de sidebar/topbar/
badges, screenshot da Tela A real (`/catalog`): sidebar YBERACLUB + busca + filtros de
marca + grid 3 col com chips Comissão/Vendas e botões Copiar/Comprar. O painel de
vínculos NÃO existe no app hoje — é adição desta POC. Nota: captura tem ~3 semanas;
aceitável para réplica de referência.
[2026-07-15] [fase 02] Direção Estética registrada (réplica fiel; craft na clareza dos
estados). Desvio consciente registrado: convenção de chip "Aprovado" do app real
(bg positive-30 + texto positive-20) reprova contraste AA — POC usa pares -10/-40 da
mesma rampa (padrão "Pendente" do próprio app). Candidato a feedback para o time do app.
[2026-07-15] [fase 02] Peça 01 (linha de canal, 3 estados) gerada em `pecas/
atualizacao-poc-referencia/01-linha-canal.html`. Decisões: (a) anatomia logo + nome +
frase de estado + chip + ação; (b) estado "nunca vinculou" SEM cor de erro — chip neutro
+ link contextual rosa (primary) no padrão do brief ("Como vincular TikTok ao seu Hub");
(c) "expirado" em âmbar com frase "Sua conexão com a Shopee expirou — refaça a
autorização" e ação "Reconectar Shopee" — vocabulário de reconexão, não de onboarding;
(d) "vinculado" com frase de tranquilidade ("já contam para a sua comissão" — comissão é
domínio do Escritório, onde este painel vive; ok pela restrição) e sem ação; (e) ícones
FontAwesome inline (set real do app — dentro da pendência provisória aceita). Fontes:
Nunito via Google Fonts na POC com estratégia declarada no arquivo (produção usa o
self-host do app) — rubric 7.1 atendido. Aguardando veredicto.
[2026-07-15] [fase 02] Peça 01 ACEITA pelo designer ("pode seguir com todas" — autorizado
lote sem parada por peça). Peças 02–06 geradas em sequência:
— Peça 02 (painel completo): cabeçalho "Meus canais de venda" + contador "N de 3 canais
recebendo suas vendas pelo link do Hub" (progresso convida à ação sem tom de erro) +
variação estado-alvo (3 de 3). Ordem das linhas: Ybera.com, Shopee, TikTok.
— Peça 03 (Modal A): eyebrow "Primeira vinculação", badge rosa (faísca=novidade), intro
"você só faz uma vez... a Ybera nunca vê sua senha", vídeo placeholder CARIMBADO
("em produção — Produto/Operação", premissa 2), 3 passos, nota de revogação, CTAs
"Deixar para depois"/"Iniciar vinculação".
— Peça 04 (Modal B): DIFERENCIAÇÃO deliberada — eyebrow "Reautorização", badge âmbar
(seta circular=renovar), intro "Você já fez essa autorização antes — ela só expirou...
por segurança", 2 passos (vs 3 do A: quem já fez precisa de menos), nota tranquilizadora
("suas vendas nos outros canais não são afetadas"). Nunca trata como novata.
— Peça 05 (Tela A completa): réplica do app real a partir do screenshot da captura —
sidebar YBERACLUB (logo png real, seções Lojas/Financeiro/Rede/Performance, pill "Novo",
card de usuária fictícia "Camila Duarte" com avatar-inicial — sem dados reais de
funcionários), topbar com sino 9+, busca + thumbs de marca reais, PAINEL DE VÍNCULOS novo
acima do grid (visível sem scroll, exigência do brief) e grid 3 col com chips
Comissão/Vendas e botões Copiar/Comprar + NOVO CTA "HUB Ybera" (outline rosa, full-width;
rótulo do precedente SEM o emoji 🔗 — substituído por ícone de link SVG, coerente com a
pendência de ícones; validação do rótulo segue para o portão). Ícones da sidebar são
aproximações em SVG stroke (pendência provisória aceita).
— Peça 06 (fluxo montado): 05 + modais A/B integrados + simulação de estado. VERIFICADO
no browser de ponta a ponta: "Reconectar Shopee"→Modal B→"Reautorizar agora"→linha vira
"Vinculado", ação some, contador 1→2 de 3; "Como vincular TikTok"→Modal A→"Iniciar
vinculação"→3 de 3 (estado-alvo). Esc/overlay/botões fecham; foco retorna ao gatilho;
nenhum clique navega para fora da Tela A. Na produção o botão de autorizar abre a URL
OAuth do canal (RF-008) — comentado no código.
Lote aguardando veredicto do designer; depois, portão (fase 03).
[2026-07-15] [fase 02] Lote 02–06 ACEITO pelo designer.
[2026-07-15] [fase 03] PORTÃO rodado (rubric v4) — veredicto do designer: EDITAR. 8 itens
acionáveis (6 bloqueios + 2 ajustes): 5× contraste (4.1 — incl. rótulos de sidebar a
1.48:1, herdados do app real que também reprovaria), 1× estados do painel ausentes (3.2 —
loading + erro de leitura), 1× emoji ✔ residual (2.4), 1× tamanhos fora da escala (2.1).
Notas: rótulo "HUB Ybera" VALIDADO pelo designer (premissa 4 fechada); craft ok; 7.1/7.2
ok. Contrastes documentados por cálculo (b2c-primary/branco = 4.71 PASS — o HSL real é
mais escuro que o hex KZ equivalente).
[2026-07-15] [fase 02·editar] Correções aplicadas: #1 rótulos de seção → neutral-60 com
comentário de desvio consciente (app real usa tom que reprova AA — feedback candidato ao
time do app, 2º caso; ver Direção Estética); #2 contador → neutral-60; #3 chip "Não
vinculado" → neutral-70; #4 chip Comissão → information-50 (token real da captura); #5
item ativo da sidebar → primary-40 (5.82 PASS); #6 painel ganhou LOADING (skeleton 3
linhas espelhando a anatomia — rubric 7.2) e ERRO DE LEITURA (aviso tracejado discreto
"Não conseguimos carregar o status... Seus links e o catálogo continuam funcionando",
catálogo intacto, contador oculto) — documentados como variações na peça 02 e em contexto
na 06 via barra dev-only de estados; #7 emoji removido da 03; #8 botões 13→14px, chips
11→12px, badge do sino 9→10px. VERIFICADO no browser: erro e loading renderizando
graciosos na 06; fluxo de modais preservado. Aguardando re-rodada do portão.
[2026-07-15] [fase 03] PORTÃO re-rodado sobre as peças corrigidas — veredicto do designer:
APROVAR. Bloqueios saneados com evidência (contrastes calculados PASS; estados do painel
verificados no browser; percurso completo já verificado na geração da 06). Ciclo segue
para a entrega (fase 04).
[2026-07-15] [fase 04] ENTREGA fechada, carimbo DEMO. Pacote em `pecas/
atualizacao-poc-referencia/entrega/` (6 peças + assets reais da captura + spec + LEIA-ME
com 8 pendências carimbadas, cada uma com dono). Corrigido no empacotamento: peça 01
referenciava assets do ciclo anterior por caminho relativo — apontada para os assets
locais. Aprendizados roteados: Δtokens → item 3 novo em `design-system/
pendencias-tokens.md` (2 convenções do app real reprovam AA — feedback ao time do
Escritório, com evidência calculada); Δspec → premissas 3 e 4 marcadas resolvidas na
tabela; Δrubric → NENHUM (o rubric v4 cobriu todas as falhas encontradas — o item 7 de
performance, criado no ciclo anterior, já foi exercitado e funcionou); notas → nenhuma
sem destino. Status da spec: entregue. Fim do ciclo 1.
