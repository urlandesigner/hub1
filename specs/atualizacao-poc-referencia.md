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
| 5 | **O contrato do endpoint de status (RF-10) precisa listar canais futuros.** Decisão do designer (2026-08-16): o card "Em breve" do Mercado Livre não é conteúdo fixo da tela — é dado, com a mesma origem dos outros canais. Isso exige que o endpoint devolva canais ainda não integrados com um estado próprio ("em breve"), o que nenhum RF prevê hoje | média (sem isso, o anúncio vira deploy manual do front) | lacuna verificada no DRP v2.7 (RF-10 só lista integrado/pendente/inativo/erro) | Produto + Engenharia | antes do refinamento da Feature |

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
influenciadora/01-linha-canal.html`. Decisões: (a) anatomia logo + nome +
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
influenciadora/entrega/` (6 peças + assets reais da captura + spec + LEIA-ME
com 8 pendências carimbadas, cada uma com dono). Corrigido no empacotamento: peça 01
referenciava assets do ciclo anterior por caminho relativo — apontada para os assets
locais. Aprendizados roteados: Δtokens → item 3 novo em `design-system/
pendencias-tokens.md` (2 convenções do app real reprovam AA — feedback ao time do
Escritório, com evidência calculada); Δspec → premissas 3 e 4 marcadas resolvidas na
tabela; Δrubric → NENHUM (o rubric v4 cobriu todas as falhas encontradas — o item 7 de
performance, criado no ciclo anterior, já foi exercitado e funcionou); notas → nenhuma
sem destino. Status da spec: entregue. Fim do ciclo 1.

[2026-07-17] [correção pós-entrega] Designer reportou os cards de "Meus canais de venda"
colados sem respiro em `06-fluxo-completo.html`. Causa: esse é o único arquivo com a
barra de dev que alterna estados (carregado/loading/erro) — pra isso, os 3 cards reais
ficam dentro de um wrapper `#panel-rows` (e o skeleton dentro de `#panel-loading`), e o
`gap:8px` está declarado em `.links-panel` (o container-pai), que só separa esses
wrappers entre si, não os cards dentro deles. Os arquivos 01/02/05 não têm esse wrapper
(mostram os estados lado a lado, sem toggle) e por isso nunca tiveram o bug. Corrigido
com `#panel-rows:not([hidden]), #panel-loading:not([hidden]){display:flex;
flex-direction:column; gap:8px}` — o `:not([hidden])` é necessário porque uma regra sem
essa guarda venceria o `display:none` nativo do atributo `hidden` (origem autor > origem
UA no cascade, independente de especificidade), quebrando o toggle da barra de dev.
Testado nos 3 estados (carregado/loading/erro) confirmando gap presente e toggle intacto.
Aplicado em `06-fluxo-completo.html` e seu espelho em `entrega/`.

[2026-07-17] [ajuste de layout, mesmo ciclo] Designer trouxe print de referência (4
canais incl. Mercado Livre, em cards lado a lado) pedindo o painel "Meus canais de
venda" alinhado na horizontal. Duas decisões tomadas com o designer antes de implementar:
(1) escopo só em `06-fluxo-completo.html` (+ espelho `entrega/`) — 01/02/05 são peças
atômicas/referência com propósito diferente, não pertencem a este ajuste; (2) mantidos os
3 canais e o conteúdo atuais (Ybera/Shopee/TikTok, mesmos textos de status e descrição) —
Mercado Livre e os rótulos do print ("Wake · canal base", "Afiliado", "Creator",
"Parceiro") NÃO foram adotados, ficaria fora do escopo desta spec (RF-004: até 3 canais).
Implementação: `.link-row` virou CSS Grid com áreas nomeadas (logo+nome no topo, chip,
descrição, ação — cada um ocupando sua própria linha) em vez de flexbox horizontal;
`#panel-rows`/`#panel-loading` viraram `grid-template-columns:repeat(3,1fr)` (1 coluna
abaixo de 720px — painel não pode quebrar em viewport estreito, por restrição da spec).
O botão de ação (`.link-row__action`) deixou de ser link sublinhado e passou a botão
sólido rosa (reaproveita a cor de `.btn--primary`, já usada nos modais, pra não inventar
token novo). Skeleton de loading (`.sk-row`) redesenhado no mesmo grid, senão ficaria com
a forma errada (barra horizontal) num painel que agora é grade de cards. Testado: os 3
canais nos 3 estados de vínculo, toggle carregado/loading/erro, fluxo completo de
reautorização da Shopee (clique → modal → "Reautorizar agora" → card atualiza para
Vinculado, contador "2 de 3") e responsivo abaixo de 720px (1 coluna, sem espremer).
Aplicado em `06-fluxo-completo.html` e seu espelho em `entrega/` (arquivos idênticos,
confirmado por `diff`).

[2026-07-17] [mudança intencional de escopo, só nesta peça] Designer pediu explicitamente
pra adicionar o Mercado Livre como 4º canal — reverte a decisão da entrada anterior
("ficaria fora do escopo desta spec, RF-004: até 3 canais"). Como o pedido foi direto (não
uma pergunta em aberto), implementei em vez de reconfirmar. Escopo da mudança: **só
`06-fluxo-completo.html` + espelho `entrega/`** — 01/02/05 continuam com os 3 canais
originais (Wake/Ybera, Shopee, TikTok) e o restante desta spec (premissas, RF-004,
"3 canais" nas seções Resultado esperado/Escopo) segue valendo como contrato-base; esta
peça específica passa a ser uma exceção/experimento de 4 canais, não uma atualização
silenciosa do contrato. Pendência registrada: se o Mercado Livre for pra frente de
verdade, isso precisa virar mudança de escopo formal (Δspec nas seções-base, não só no
Rastro) — o que não foi feito aqui de propósito, já que o pedido foi pontual nesta
conversa, sem uma decisão de Produto por trás. Implementação: 4º card (`row-ml`) no mesmo
padrão dos demais (ícone provisório "ML" em texto — sem asset de marca disponível, mesma
caixa neutra dos outros logos); grade trocou de `repeat(3,1fr)` fixo pra
`repeat(auto-fit,minmax(220px,1fr))`, que acomoda 4 (ou mais, no futuro) canais sem
precisar editar o número de colunas a cada canal novo; Modal ML duplicado do Modal A
(mesmo padrão "primeira vinculação" usado pro TikTok) com cópia própria — Modal A tem
"TikTok" no texto, não é genérico, então duplicar foi mais seguro que parametrizar a
lógica compartilhada; contador "N de 3" virou "N de 4" (texto inicial + `setLinked`).
Achado durante o teste responsivo: `auto-fit` sozinho não bastava — a sidebar fixa
(240px) não encolhe/colapsa em viewport estreito, então o container do grid nunca fica
estreito o bastante pro auto-fit cair pra 1 coluna sozinho, e a página estourava
horizontalmente com 2 colunas espremidas no mobile. Corrigido restaurando o media query
`@media(max-width:720px){grid-template-columns:1fr}` por cima do auto-fit (baseado na
largura real do viewport, não na largura do container, então não sofre do mesmo
problema). Confirmado por `document.documentElement.clientWidth`/`scrollWidth` que o
painel em si respeita 1 coluna abaixo de 720px — o scroll horizontal residual da página
inteira nesse viewport é da sidebar fixa e do grid de produtos, pré-existente e fora do
escopo desta peça (spec já registra: "mobile não é o foco primário desta tela"). Testado:
grade com 4 cards numa linha só em 1280px, fluxo completo do Mercado Livre (clique →
modal → "Iniciar vinculação" → card atualiza pra Vinculado, contador "2 de 4"), skeleton
de loading com 4 cards, e o painel em 1 coluna em viewport estreito. Aplicado em
`06-fluxo-completo.html` e seu espelho em `entrega/` (idênticos, confirmado por `diff`).

[2026-07-17] [correção de tratamento, mesmo dia] Designer redirecionou o tratamento do
card do Mercado Livre: continua só nesta peça (`06-fluxo-completo.html` + `entrega/`),
mas deixa de simular um canal real "não vinculado ainda" e passa a ser uma **novidade —
algo que ainda vai chegar**, sem interação nenhuma disponível. Isso resolve a inconsistência
que a entrada anterior já tinha deixado como pendência aberta ("se o ML for pra frente de
verdade, isso precisa virar mudança de escopo formal") — ao tratá-lo como anúncio/prévia
em vez de canal funcional, o card não compete mais com o RF-004 (até 3 canais reais).
Mudanças: (1) chip trocou de "Não vinculado" (`chip--off`, mesmo tom dos canais reais que
só falta vincular) pra "Em breve" — nova variante `.chip--soon`, reaproveitando os tokens
`--b2c-info-10`/`--b2c-info-50` já usados em `.pchip--info` (nenhuma cor nova); (2) texto
de descrição deixou de convidar a ação ("Vincule sua conta...") e passou a avisar que a
integração ainda não existe; (3) CTA virou `<button disabled aria-disabled="true">Em
breve</button>` — sem `aria-haspopup`, sem listener de clique, com estilo próprio
`.link-row__action:disabled` (cinza neutro, `cursor:not-allowed`) pra não parecer uma ação
disponível; (4) Modal ML (duplicado do Modal A na entrada anterior) foi REMOVIDO por
inteiro — não tem mais nenhum caminho que leve até ele, ficaria morto; (5) contador
"N de 4" voltou pra "N de 3" (texto inicial + `setLinked`) — o Mercado Livre não conta
como canal disponível enquanto for só uma prévia, então ele existe visualmente no painel
mas fica de fora da métrica "canais recebendo suas vendas pelo link do Hub". Testado: CTA
não responde a clique (`button.disabled === true`), sem erros no console após remover o
modal, chip/copy/contador conferidos visualmente. Aplicado em `06-fluxo-completo.html` e
seu espelho em `entrega/` (idênticos, confirmado por `diff`).

[2026-07-17] [asset + revisão de copy, mesmo dia] Designer adicionou o logo real do
Mercado Livre (`assets/mercadolivre.png`) — substituído o selo provisório "ML" em texto
pela imagem (mesmo padrão `<img>` dos outros logos), CSS do selo de texto removido por
não ter mais uso. Asset espelhado em `entrega/assets/`. Em seguida, rodada `/ux-copy`
pra revisar todo o texto voltado à influenciadora nesta peça (painel de canais, chips,
aria-labels, conteúdo dos Modais A e B) com um objetivo explícito do designer: remover
todos os travessões do copy, reescrevendo cada frase em vez de só trocar pontuação.
Reescritas (10 trechos, todos em `link-row__hint`, `dialog__intro`, `dialog__note`,
`steps li`, `video-ph` e o `aria-label` de notificações): travessão explicativo
("frase — explicação") virou frase nova com ponto final ou dois-pontos, escolhido frase
a frase pra soar natural em vez de mecânico — ex. "Sua conexão com a Shopee expirou —
refaça a autorização..." → "Sua conexão com a Shopee expirou. Refaça a autorização...";
"Volte para cá — o status atualiza sozinho" → "Volte para cá: o status atualiza
sozinho" (dois-pontos aqui porque a segunda oração é consequência direta da primeira,
não uma frase independente — mesmo padrão aplicado nos dois modais pra manter
consistência de voz). Comentários de código (CSS/HTML) e o `<title>` da página não
foram tocados — não são copy que a influenciadora vê ou ouve. Testado: nenhum travessão
restante fora de comentário/título (`grep`), logo real carregando sem erro de console,
fluxo de reautorização da Shopee ainda funcionando (`2 de 3` após confirmar). Aplicado em
`06-fluxo-completo.html` e seu espelho em `entrega/` (HTML idêntico por `diff`, asset
copiado pros dois `assets/`).

[2026-07-17] [correção de conteúdo, mesmo dia] Designer perguntou por que o grid de
produtos (contexto herdado, "estrutura já estabelecida" — ver linha 30) tinha 3 cards e o
que significavam "Grupo"/"Você" nos preços. Resposta dada: os 3 cards são só contexto
visual, não o foco da peça (spec já registra isso); "Grupo"/"Você" não está documentado
em nenhum insumo desta demanda — resposta ficou como inferência não confirmada, não
como fato. Nessa investigação, achado um mismatch: a imagem de cada card (`produto.jpg`)
já era a garrafa do Óleo de Mirra Reparador (mesmo produto do `comparador-publico`), mas
o nome exibido dizia "Escova Progressiva {tamanho}g - Fashion Gold" — texto de placeholder
de outro SKU que sobrou de um ciclo anterior, nunca atualizado. Designer pediu a
correção: nome trocado pra "Óleo de Mirra Reparador 90ml" nos 3 cards (mantido o número
de SKU de cada um — 336774/337648/337348 — removido só o pedaço "Escova Progressiva
{tamanho}g - Fashion Gold" que estava desencontrado da imagem); `alt` da imagem
corrigido pra igual. Preços/comissão/chips não mexidos (não foi pedido, e sem definição
de "Grupo"/"Você" documentada eu não tinha base pra decidir se ainda fariam sentido pro
produto novo). Aplicado em `06-fluxo-completo.html` e seu espelho em `entrega/`
(confirmado via DOM que os 3 `.product__name` mudaram).

[2026-07-17] [correção de estrutura, mesmo dia] Designer perguntou se os 3 cards eram
produtos diferentes ou um por canal vinculado — resposta: nenhum dos dois, o grid de
produtos ("Catálogo de Produtos") é uma seção independente do painel "Meus canais de
venda", sem nenhuma ligação estrutural entre um card e um canal específico (o botão "HUB
Ybera" funciona igual pra qualquer canal vinculado). Isso expôs a consequência da
correção de nome anterior: os 3 cards agora mostravam o MESMO produto com preços
diferentes entre si (R$ 339,90/297,90 · R$ 99,90/89,90 · R$ 257,90/227,90), parecendo 3
anúncios duplicados. Perguntado como resolver — decisão: reduzir pra 1 card só (mantido
o primeiro: SKU 336774, Grupo R$ 339,90, Você R$ 297,90), removidos os outros 2 por
inteiro. Efeito colateral corrigido de novo: `.grid` era `grid-template-columns:
repeat(3,1fr)` fixo — com 1 card só, ficaria ocupando 1/3 da linha com vazio do lado
(mesmo padrão de bug já visto no painel de canais, ver entrada de 2026-07-17 sobre
`#panel-rows`). Trocado pra `repeat(auto-fill, minmax(240px,360px))`, que também deixa
o grid pronto pra acomodar mais produtos lado a lado sem editar o CSS, se o catálogo
crescer de novo no futuro. Testado: 1 card renderizando em 360px (não esticado, não
cortado), sem erros de console. Aplicado em `06-fluxo-completo.html` e seu espelho em
`entrega/` (idênticos, confirmado por `diff`).

[2026-07-17] [conteúdo fictício, mesmo dia] Designer pediu 9 produtos no catálogo,
mantendo o Óleo de Mirra Reparador na posição 1. Adicionados 8 produtos fictícios
(posições 2–9), reaproveitando `assets/produto.jpg` (único asset de produto disponível
nesta peça — nenhuma foto real pros itens novos) com nomes alinhados às marcas já
listadas no filtro do topo (Brasil Influencer, Black Diva Luxury, Spa Pet, Acquafit,
Fashion Gold), incluindo de propósito "345561 Escova Progressiva 500g - Fashion Gold"
— o texto de placeholder que existia na posição 1 antes da correção de nome, reaproveitado
aqui numa posição onde a marca realmente bate (Fashion Gold é linha de alisamento).
Comissão 15% e Minhas Vendas: 0 mantidos iguais em todos (mesmo padrão dos 3 originais,
não inventei variação sem pedido). Preços Grupo/Você inventados por faixa de categoria,
mesma proporção Você≈12% abaixo de Grupo dos cards existentes. Efeito colateral
corrigido: com 9 itens, `minmax(240px,360px)` (da entrada anterior) fechava só 2 colunas
no viewport testado, deixando o 9º item sozinho numa linha (mesmo padrão de bug de
sobra vazia já visto 2x nesta peça). Trocado pra `minmax(280px,1fr)` — calculado pra
fechar exatamente 3 colunas tanto no viewport de teste (~1040px de `.main`) quanto no
teto de 1160px (4 colunas exigiriam ≥1168px nos dois casos, nunca cabe). Testado via
DOM (screenshot da preview instável nesta sessão, mesmo bug de renderização de sessões
anteriores — não é o código): 9 cards, 3 linhas de 3, nomes corretos, Mirra em 1º,
`gridTemplateColumns` computado em 3 colunas de ~325px, sem erros de console. Aplicado
em `06-fluxo-completo.html` e seu espelho em `entrega/` (idênticos, confirmado por
`diff`).

[2026-07-17] [ícones em vez de foto, mesmo dia] Designer pediu pra trocar a imagem dos 8
produtos fictícios. Sem asset real disponível pra nenhum deles (só existe
`assets/produto.jpg`, a foto do Mirra) — reaproveitar essa foto pros 8 seria enganoso
(mostraria o frasco errado pra "Whey Protein", "Ração Premium", etc.). Substituído por
ícone SVG simples por categoria, cor por marca do filtro (reforça o agrupamento visual
mesmo sem link estrutural real entre catálogo e marca): Perfume Amazônia → ícone de
frasco, cor `--b2c-primary` (rosa, Brasil Influencer); Kit Skincare e Sérum Facial →
ícone de pote e de gota, cor `--b2c-neutral-90` (escuro, Black Diva Luxury); Shampoo Pet
e Ração → ícone de pata e de tigela, cor `--b2c-warning-40` (âmbar, Spa Pet); Whey e
Creatina → ícone de coqueteleira e de haltere, cor `--b2c-positive-40` (verde, Acquafit);
Escova Progressiva → ícone de pente, cor `--club-700` (Fashion Gold). Cada `<img>` virou
uma `<div class="product__photo" role="img" aria-label="...">` com o SVG dentro —
mantém o texto alternativo pra leitor de tela, só que como `aria-label` no container em
vez de `alt` na imagem (não tem mais imagem). Testado via DOM (screenshot da preview
seguiu instável nesta sessão — mesmo bug de renderização já visto, não é o código):
confirmado que os 8 novos têm SVG (não `img`), cor e `aria-label` corretos cada um; 2
capturas de tela que renderizaram (linha 1 e 2) confirmam visualmente ícones limpos e
distintos; sem erros de console. Aplicado em `06-fluxo-completo.html` e seu espelho em
`entrega/` (idênticos, confirmado por `diff`).

- **[2026-08-14] [pós-entrega] Pasta de peças renomeada: `pecas/atualizacao-poc-referencia/`
  → `pecas/influenciadora/`.** Decisão do designer, ao separar as três superfícies do projeto.
  O nome antigo é o da DEMANDA de julho; o novo diz de quem é a tela. Feito com `git mv`, então
  o histórico de cada arquivo segue rastreável. **A spec e o nome do ciclo não mudam** — a
  demanda continua sendo `atualizacao-poc-referencia`, e é assim que ela aparece em
  `design-system/pendencias-tokens.md` e no `aprendizados.md`.
  A entrega carimbada (`entrega/`, demo de 15/07) foi movida junto, **sem uma linha alterada**:
  o carimbo é sobre o conteúdo, não sobre o endereço.
  Consequência a saber: URLs antigas do tipo `/pecas/atualizacao-poc-referencia/...` deixam de
  existir quando isto for para produção.

- **[2026-08-14] [organização] Arquivo final renomeado para o padrão `hub-<superfície>`:**
  `06-fluxo-completo.html` → **`hub-escritorio-influenciadora.html`**, com o `<title>` virando
  **"HUB Ybera — Escritório Virtual da influenciadora"**. As peças intermediárias foram para
  `componentes/` e mantiveram os nomes numerados — lá a sequência ainda significa alguma coisa.
  O espelho carimbado em `entrega/` **não** foi renomeado: é snapshot de 15/07 e fica como está.

- **[2026-08-16] [fase 01 · ciclo 2] Repasse do fluxo inteiro contra o Brief v1.10 + DRP v2.7**
  (pedido do designer: "repassar por todo fluxo e completar com o que ainda falta"). A Tela 8
  (Padrão de Vinculação) está "sem mudança" no brief — painel de 3 estados e Modais A/B seguem
  válidos. O diff achou **dois becos sem saída no coração do JTBD** ("compartilhar um único
  link"): (1) o botão **Copiar não copia nada** — a capacidade 2 do DRP (link único
  `hub.ybera.com/r/{slug}`, gerado e exibido pelo Escritório) não tinha demonstração nenhuma;
  (2) o CTA **"HUB Ybera" não abre nada** — mesmo defeito de "link morto" que o portão do admin
  já tinha condenado. Achado menor: (3) o card do Óleo de Mirra usava SKU 336774 (placeholder
  de julho), divergindo do 150264 que o comparador e o admin usam — fere a fonte única de dados
  entre as três superfícies. Notas sem ação de UI: R-01 retratado (refresh de token já existe
  pronto) torna o estado "expirado" mais raro, não errado — Modal B continua necessário para
  revogação/falha; Q-18 (Open Collaboration) não muda esta tela; RF-12 conferido presente no
  comparador. Escopo do ciclo 2: consertar (1), (2) e (3) — só na peça viva; `entrega/` é
  snapshot congelado de 15/07 e não recebe nada.

- **[2026-08-16] [fase 02 · ciclo 2] Os três consertos aplicados.** (1) **Copiar copia de
  verdade**: o link único do produto no formato fechado pelo DRP (Q-09 — slug encurtado, canal
  fora do link: `hub.ybera.com/r/{sku}`) vai para a área de transferência onde o navegador
  permite, o botão vira "Link copiado" por 2s e um toast (`role="status"`, aria-live)
  confirma com o link — tudo sem sair da Tela A, como a spec exige. (2) **"HUB Ybera" navega**:
  no card do Óleo de Mirra virou um `<a>` de verdade para o comparador público (nova aba) —
  e o motivo de ser `<a>` está comentado no código: a peça tem uma função global `open()`
  (a dos modais) que SOMBREIA `window.open`; a primeira implementação por JS chamava o abridor
  de modal com uma string e quebrava (defeito meu, pego na verificação). Nos outros 8 produtos
  (fictícios, sem página no comparador), o botão avisa via toast "Nesta POC, só o Óleo de
  Mirra tem página no comparador" — aviso honesto em vez de link morto ou mentira de dados.
  (3) **SKU do card 1: 336774 → 150264**, o mesmo do comparador e do admin (fonte única).
  `.btn` ganhou `text-decoration:none` para o `<a>`-botão. `entrega/` intocada.
- **[2026-08-16] [fase 03 · ciclo 2] Verificado em carga limpa, por medição:** bateria
  completa sem um erro de console (listener de `error` na página + console do navegador);
  Copiar → rótulo troca e volta em 2s, toast "Link do Hub copiado: hub.ybera.com/r/150264";
  CTA do Mirra é `<a href="../../index.html" target="_blank" rel="noopener">` com o mesmo
  visual dos botões irmãos (cor, borda e altura medidas iguais; sem sublinhado) e o destino
  responde OK; aviso da POC nos produtos fictícios; toast com contraste 14,89; regressão
  completa do ciclo 1 — Modal A e B abrem/fecham, vinculação simulada atualiza card e contador
  ("3 de 3"), devbar alterna carregado/loading/erro. Aguardando o veredicto do designer.
- **[2026-08-16] [fase 03 · ciclo 2] VEREDICTO DO DESIGNER: APROVADO** ("ta tudo aprovado").
  Ciclo 2 fechado.

- **[2026-08-16] [fase 01 · ciclo 3] Decisão do designer: o painel de canais passa a ter
  ORIGEM DE DADOS** ("não é pra ser conteúdo fixo na POC, é pra ser conteúdo com origem,
  assim como os outros canais"). Contexto: ao perguntar por que o Mercado Livre aparece na
  tela da influenciadora e não no admin, ficou exposto que o card "Em breve" era HTML escrito
  à mão — um anúncio sem dono nem mecanismo. A decisão: o painel renderiza TODOS os canais a
  partir de uma estrutura de dados que espelha a resposta do endpoint de status (RF-10), e
  "em breve" vira um ESTADO de canal no contrato — não um enfeite da tela. Consequência para
  fora de Design registrada como premissa 5: o RF-10 hoje só prevê integrado/pendente/inativo/
  erro; listar canal futuro com estado próprio precisa entrar no contrato (Produto+Engenharia).
- **[2026-08-16] [fase 02 · ciclo 3] Painel refeito sobre origem de dados.** Estrutura
  `CANAIS_HUB` (id, nome, logo, estado, hint, ação/modal) espelhando a resposta do RF-10;
  `renderPainel()` desenha os cards, o skeleton (um fantasma POR CANAL, sem número mágico) e
  o contador (que só conta canais reais — `estado !== 'breve'` fica fora do "N de 3") a partir
  dela. O HTML dos 4 cards escritos à mão saiu; a ação de vincular virou delegação por
  `data-vincular`; `setLinked` agora muda o DADO e re-renderiza — e devolve o foco ao card
  atualizado, porque o botão-gatilho deixa de existir no re-render. Modais A/B intocados.
- **[2026-08-16] [fase 03 · ciclo 3] Verificado por medição, carga limpa:** 4 cards nascendo
  do dado (ML "Em breve" com botão desabilitado e logo real), contador "1 de 3"; skeleton com
  4 fantasmas gerados do mesmo dado; erro de leitura via devbar intacto; fluxo Shopee
  (expirado→Modal B→Vinculado, "2 de 3", chip trocado, botão removido, foco no card) e TikTok
  (nunca→Modal A→"3 de 3"); zero erros de console na bateria inteira. Paridade visual com o
  estado aprovado conferida por screenshot. Aguardando o veredicto do designer.
- **[2026-08-16] [fase 03 · ciclo 3] VEREDICTO DO DESIGNER: APROVADO** ("ok, e pode subir
  tudo para producao"). Ciclo 3 fechado e publicado.
