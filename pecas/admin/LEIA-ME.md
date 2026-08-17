# Painel administrativo — peça da operação de catálogo

**Abra `hub-painel-administrativo.html`.** É a única peça da pasta, e a peça completa e atual.

Cobre **todas as telas administrativas do Brief Design v1.10 / DRP v2.7**, como vistas
navegáveis pelo menu lateral (seção Hub):

- **Tela 2 — Produtos no Hub**: o gate opt-in — só o que for habilitado aqui aparece no
  comparador público.
- **Tela 3 — Tags por oferta**: etiquetas por canal (sugestões do próprio DRP: "desconto no
  Pix", "mais brinde", "desconto progressivo").
- **Telas 4 e 5 — Informações do produto**: a matriz campo × canal (Estoque, Volume de Vendas,
  Avaliação e Frete), com substituição, prazo de volta, motivo, "Lançamento" manual e **quem
  inseriu** cada substituição. O **Frete** entrou no v1.10 (sempre "Aproximado" em
  Shopee/TikTok; no TikTok dá para referenciar o frete de outro canal). O campo **Imagem foi
  removido por decisão de Design** — divergência consciente do brief, registrada na spec.
- **Tela 6 — Timer da oferta**: o prazo de urgência do card, por canal — com o aviso de que
  timer não segura preço.

Os rótulos da interface não usam as palavras do brief ("override", "API", "escassez"): a tela
fala como quem opera o catálogo. A rastreabilidade até o brief está nos comentários do código
e nas specs.
- **Tela 9 — Tour de onboarding**: o modal da primeira visita.

O chassi (sidebar, topbar, tokens `b2c-*`) é herdado de
`pecas/influenciadora/componentes/05-tela-a-completa.html`. Os itens do menu na seção Hub são
as telas reais da peça; o resto do menu (Catálogo, Operação) é **réplica inerte** — ninguém
capturou a navegação real do admin (premissa 3 da spec).

## Estados de demonstração

- **Salvando**: qualquer salvamento simula ~650ms de rede, com o botão em "Salvando…".
- **Erro de salvamento**: abra a peça com `#falha` no fim da URL — todo salvamento falha,
  mostrando o erro sem aplicar nada. Tire o `#falha` para voltar ao normal.
- **Tour de onboarding (Tela 9)**: aparece sozinho na primeira visita e não volta (fica
  guardado no navegador). Para vê-lo de novo, adicione `#tour` ao fim da URL — funciona
  inclusive com a página já aberta.
- No mobile, o menu Hub vira uma barra horizontal no topo — as quatro telas continuam
  alcançáveis.

Só o Óleo de Mirra tem a tela de campos nesta POC — os outros produtos da Tela 2 são
habilitáveis, mas não têm matriz própria (um produto basta para demonstrar o fluxo).

Contrato da peça: `specs/override-administrativo.md` — a spec mantém o nome da demanda; a
pasta se chama pela superfície.
