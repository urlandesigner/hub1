/* Manual de implementação — gerado do protótipo na hora em que a página abre.

   Montado a partir do `manual.js` publicado do Handoff de Checkout. Aquele lia
   três coisas que esta tela não tem, e cada seção que dependia delas mudou:

   — CONSTANTES numa camada de domínio separada (`CONSTANTS` em `data.js`).
     Aqui as regras estão no `<script>` do `index.html`, misturadas ao render.
     A seção de regras lê os objetos de dado (`CH`, `TIER`, `CEP_MAP`) e explica
     o comportamento apontando a função; a fórmula fica no código.
   — CENÁRIOS (`SCENARIOS`). Esta tela não tem; a seção vira a lista dos
     estados que o Painel alcança, mais os caminhos sem rota.
   — ANOTAÇÃO (`data-component`). Esta tela não tem; a seção de componentes
     diz isso e lista os blocos de classe que a folha declara, que é o que dá
     para medir sem inventar. O checklist sai por estado, não por componente.

   O QUE ELE NÃO FAZ: inventar. Onde o protótipo não declara, o manual diz que
   não sabe. */

const fonte = document.getElementById('fonte');
const alvo = document.getElementById('manual');
const indice = document.getElementById('indice');

/* O endereço do protótipo, relativo a esta página. */
const TELA = '../../../index.html';
/* E o do painel, para os links "abrir neste estado". */
const PAINEL = '../ferramenta.html';

/* ------------------------------------------------------------- utilidades */

const esc = (t) => String(t == null ? '' : t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* `about:blank` já é "complete" antes do `src` carregar: confiro também que a
   pilha de canais foi montada. */
function prontaAFonte() {
  return new Promise((resolve) => {
    const d = fonte.contentDocument;
    const pronta = d && d.readyState === 'complete'
      && !d.location.href.startsWith('about:')
      && d.getElementById('pilha') && d.getElementById('pilha').children.length;
    if (pronta) resolve();
    else fonte.addEventListener('load', resolve, { once: true });
  });
}

/* Os `const` de um script clássico não viram propriedade de `window`, mas um
   `eval` na janela da tela alcança o escopo global dela. */
function daTela(nome) {
  try {
    return fonte.contentWindow.eval(`typeof ${nome} !== 'undefined' ? ${nome} : null`);
  } catch {
    return null;
  }
}

/* ----------------------------------------------------- regras de negócio */

/* Escritas à mão, e cada uma aponta para onde o código a cumpre. São
   comportamento, não fórmula: a fórmula é o código, e repeti-la em prosa faria
   as duas divergirem na primeira mudança. A fonte de cada frase é o comentário
   que o próprio protótipo deixou ao lado da regra. */
const REGRAS = [
  { r: 'Sem CEP, a pilha ordena só por preço do produto e não existe "Melhor oferta".',
    onde: '<code>fillCard</code>: <code>isBest</code> exige CEP. O total mostra "A partir de" com o preço.' },
  { r: 'Com CEP, a pilha ordena por preço + frete, e o primeiro ganha a faixa "Melhor oferta".',
    onde: '<code>STATE[…].order</code> e <code>.best</code>; a troca de posição anima por FLIP em <code>applyState</code>.' },
  { r: 'Canal que não informa o frete nunca é "Melhor oferta" e sai do ranking por preço + frete, com aviso no card.',
    onde: '<code>CH[…].noFrete</code> em <code>fillCard</code> (H-UX-16). Nenhum canal usa hoje.' },
  { r: 'Frete estimado sem o CEP do comprador sai rotulado "Aproximado".',
    onde: '<code>CH[…].aprox</code>. A Shopee usa <code>estimated_shipping_fee</code>, que ignora o CEP; o TikTok usa a mesma estimativa por regra de produto.' },
  { r: '"Não informado" e "Informe o CEP" são coisas diferentes: o primeiro é o canal que não expõe o dado, o segundo é o comprador que ainda não deu o CEP.',
    onde: '<code>CH[…].noPrazo</code> e <code>noFrete</code> contra <code>hasCep</code>, em <code>fillCard</code>.' },
  { r: 'O timer diz quanto tempo a oferta fica no ar. Nunca é promessa de preço travado.',
    onde: '<code>CH[…].timer</code>, em dias.' },
  { r: 'Selos: o de volume vem antes do de estoque. Volume ausente é valor válido e não desenha chip. Os selos não dependem do CEP.',
    onde: '<code>renderFlags</code>. O tier chega resolvido; limiar e cálculo são de Produto e Engenharia (Q-23).' },
  { r: 'O CEP precisa de 8 dígitos. Com menos, o campo mostra o erro e nada é aplicado.',
    onde: '<code>applyFromInput</code> e <code>showCepError</code>.' },
  { r: 'O CEP não é guardado: nada em localStorage, sessionStorage nem na URL. Recarregar volta ao estado sem CEP.',
    onde: 'Comentário no fim do <code>&lt;script&gt;</code> (LGPD). O rodapé da tela promete isso ao usuário.' },
  { r: 'Comprar: o botão vira "Abrindo…", a cortina entra em 550 ms e a navegação sai em 1400 ms.',
    onde: '<code>wireCtas</code>. Em produção o link leva o vínculo da influenciadora (RF-002, RF-007).' },
];

/* --------------------------------------------------------- o que é simulado */

/* A única seção que o protótipo não sabe gerar, porque ele não sabe o que nele
   é mentira. Cada item aponta para onde a mentira mora. */
const SIMULADO = [
  { o: 'Preços, fretes e prazos', nota: 'Quatro conjuntos fixos em <code>STATE</code> (sem CEP, São Paulo, Rio Branco e genérico). Nada vem de API.' },
  { o: 'A consulta de CEP', nota: '<code>CEP_MAP</code> conhece dois CEPs. Qualquer outro com 8 dígitos cai no conjunto genérico, na hora, sem consulta nem espera. A tela só conta dígitos: não confere se o CEP existe.' },
  { o: '"Preços atualizados há 6 min"', nota: 'Texto fixo no HTML. Em produção é a idade real do dado.' },
  { o: 'Avaliação, selos e timer dos canais', nota: 'Fixos em <code>CH</code>: nota, estoque, volume e dias de oferta.' },
  { o: 'Os links de compra', nota: 'Shopee e TikTok apontam para a home do canal. O da Ybera tem um <code>?parceiro=</code> de exemplo. Em produção, cada link carrega o vínculo da influenciadora.' },
  { o: '"Indicação de Camila"', nota: 'Nome e link do Instagram de exemplo, fixos no cabeçalho.' },
  { o: 'O selo do Reclame Aqui', nota: 'Reprodução do widget com os SVGs oficiais. Em produção é o embed servido pelo Reclame Aqui (pendência #5 no código).' },
  { o: 'Os links do rodapé', nota: 'Todos com <code>href="#"</code>.' },
  { o: 'A foto do produto', nota: 'Amostra em <code>pecas/comparador-publico/assets/</code>.' },
  { o: 'A ordem da pilha e a animação de troca', nota: 'Essas são de verdade: a reordenação por FLIP respeita <code>prefers-reduced-motion</code> e cancela a animação anterior num clique duplo. Podem servir de referência.', boa: true },
];

/* -------------------------------------------------- estados para conferir */

/* Os mesmos que o Painel dirige. Os três últimos existem no código e nenhuma
   interação chega neles. */
const ESTADOS = [
  { nome: 'Sem CEP', q: '', como: 'Como a tela abre.' },
  { nome: 'CEP de São Paulo', q: 'cep=sp', como: '01310-100. A Ybera vence com frete grátis.' },
  { nome: 'CEP do Acre', q: 'cep=ac', como: '69900-970. A Shopee vence; a Ybera cobra R$ 34,90 de frete.' },
  { nome: 'CEP fora da tabela', q: 'cep=outro', como: 'Qualquer outro CEP de 8 dígitos. Frete genérico.' },
  { nome: 'CEP incompleto', q: 'cep=incompleto', como: 'Menos de 8 dígitos. Erro abaixo do campo.' },
  { nome: 'Saída para a Shopee', q: 'cep=sp&saida=shopee', como: 'Botão em "Abrindo…" e cortina de saída.' },
  { nome: 'Saída para o TikTok Shop', q: 'cep=sp&saida=tiktok', como: 'Idem, com o artigo "o".' },
  { nome: 'Saída para a Ybera.com', q: 'cep=sp&saida=ybera', como: 'Idem, a partir do card da melhor oferta.' },
  { nome: 'Canal indisponível', sem: true, como: 'Selo "Indisponível" (<code>stock: \'out\'</code>). Nenhum canal usa.' },
  { nome: 'Canal sem frete informado', sem: true, como: 'Frete "Não informado" e aviso de fora do ranking (<code>noFrete</code>).' },
  { nome: 'Loja não entrega no CEP', sem: true, como: 'Card reduzido com "A loja não entrega neste CEP" (<code>noship</code>).' },
];

/* ------------------------------------------------------------------ seções */

function blocoComoLer() {
  return `
    <h2 class="bloco__titulo">Como ler</h2>
    <p class="bloco__sub">Cada passo depende do anterior.</p>
    <div class="cartao"><ul class="lista-check">
      <li><span class="caixa"></span><span><strong>Regras de negócio</strong>: o que a tela obedece, e o dado dos canais.</span></li>
      <li><span class="caixa"></span><span><strong>O que é demonstração</strong>: para não implementar a mentira junto.</span></li>
      <li><span class="caixa"></span><span><strong>Estados</strong>: cada caso, com link para ver no painel.</span></li>
      <li><span class="caixa"></span><span><strong>Componentes</strong>: o que dá para saber sem anotação.</span></li>
      <li><span class="caixa"></span><span><strong>Textos</strong>: quais são fixos e quais são montados em código.</span></li>
      <li><span class="caixa"></span><span><strong>Tokens</strong>: o que a tela consome do KZ, e o que escreveu literal.</span></li>
      <li><span class="caixa"></span><span><strong>Checklist</strong>: a lista do que conferir, para fechar.</span></li>
    </ul></div>

    <div class="nota nota--cuidado" style="margin-top:14px">
      <strong>A lógica está no mesmo arquivo que o desenho.</strong> Ordenação,
      escolha da melhor oferta, regra do frete e o que cada card mostra estão no
      <code>&lt;script&gt;</code> do <code>index.html</code>, junto com o código que
      escreve o HTML dos cards (<code>fillCard</code>, <code>applyState</code>).
      Não há uma camada de regra separada do DOM, então ler esse arquivo é o
      caminho previsto deste manual, e separar regra de render fica com quem
      implementa.
    </div>`;
}

function blocoRegras(CH, TIER) {
  const regras = REGRAS.map((x) => `<tr>
    <td>${esc(x.r)}</td>
    <td class="apoio">${x.onde}</td>
  </tr>`).join('');

  /* O dado dos canais vem da tela, não daqui. */
  const sim = (v) => (v ? 'sim' : '');
  const canais = Object.entries(CH || {}).map(([id, c]) => `<tr>
    <td><strong>${esc(c.name)}</strong><br><code>${esc(id)}</code></td>
    <td class="num">${esc(String(c.rating).replace('.', ','))}</td>
    <td>${esc((TIER && TIER.stock[c.stock] || {}).label || c.stock)}</td>
    <td>${esc(c.volume ? (TIER.volume[c.volume] || {}).label : 'sem selo')}</td>
    <td class="num">${c.timer ? esc(c.timer + (c.timer === 1 ? ' dia' : ' dias')) : ''}</td>
    <td>${sim(c.aprox)}</td>
    <td>${c.noPrazo ? 'não informa' : ''}</td>
  </tr>`).join('');

  return `
    <h2 class="bloco__titulo">Regras de negócio</h2>
    <p class="bloco__sub">
      Escritas à mão a partir dos comentários do protótipo, com o lugar do código
      onde cada uma é cumprida.
    </p>
    <table><tr><th>Regra</th><th>Onde</th></tr>${regras}</table>

    <h3 class="bloco__titulo" style="font-size:1rem;margin-top:24px">Os canais, como a tela os declara</h3>
    <p class="bloco__sub">Lido de <code>CH</code> e <code>TIER</code> agora. Em produção tudo isto vem da API de cada canal ou do painel administrativo.</p>
    <table><tr><th>Canal</th><th>Nota</th><th>Estoque</th><th>Volume</th><th>Timer</th><th>Frete aproximado</th><th>Prazo</th></tr>${canais}</table>`;
}

function blocoSimulado() {
  const itens = SIMULADO.map((s) => `
    <div class="nota nota--${s.boa ? 'ok' : 'cuidado'}">
      <strong>${esc(s.o)}</strong>: ${s.nota}
    </div>`).join('');
  return `
    <h2 class="bloco__titulo">O que é demonstração e o que é de verdade</h2>
    <p class="bloco__sub">
      Escrito à mão: o protótipo não sabe o que nele é mentira. Nada na tela
      chama endpoint, e esta lista existe para a tabela de CEP não virar tabela
      de verdade no código.
    </p>
    ${itens}`;
}

function blocoEstados() {
  const linhas = ESTADOS.map((e) => `<tr>
    <td><strong>${esc(e.nome)}</strong></td>
    <td class="apoio">${e.como}</td>
    <td>${e.sem
      ? '<span class="pilula">Sem rota</span>'
      : `<a class="pilula pilula--link" href="${PAINEL}${e.q ? '?' + e.q : ''}" target="_blank" rel="noopener">Abrir &rarr;</a>`}</td>
  </tr>`).join('');
  return `
    <h2 class="bloco__titulo">Estados</h2>
    <p class="bloco__sub">
      A tela não tem cenários de conteúdo: os dados estão fixos no código e ela
      não lê nada da URL. Estes são os estados que se alcançam usando a tela,
      cada um com link para o painel já nele. Os marcados "Sem rota" existem no
      código e nenhuma interação chega neles: para ver, a tela precisa aceitar
      cenário.
    </p>
    <table><tr><th>Estado</th><th>Como se chega</th><th></th></tr>${linhas}</table>`;
}

/* Sem anotação não há ficha. O que dá para medir sem inventar é a folha: cada
   bloco de classe (o nome antes de `__` ou `--`) que ela declara, quantas
   regras ele tem, e se aparece na tela agora. Isso NÃO é a lista de
   componentes: é a lista de onde procurar. */
function colherBlocos(d) {
  const blocos = new Map();
  const varrer = (regras) => {
    for (const r of regras) {
      if (r.cssRules && r.cssRules.length && !r.selectorText) { varrer(r.cssRules); continue; }
      if (r.conditionText != null && r.cssRules) { varrer(r.cssRules); continue; }
      for (const m of (r.selectorText || '').matchAll(/\.([a-z][a-z0-9-]*?)(?:__|--|[\s.:,>+~[)]|$)/g)) {
        const b = m[1];
        blocos.set(b, (blocos.get(b) || 0) + 1);
      }
    }
  };
  for (const f of d.styleSheets) {
    if (f.href) continue;
    try { varrer(f.cssRules); } catch { /* outra origem */ }
  }
  return [...blocos.entries()]
    .map(([nome, regras]) => ({
      nome, regras,
      naTela: d.querySelectorAll('.' + CSS.escape(nome) + ', [class*="' + nome + '__"], [class*="' + nome + '--"]').length,
    }))
    .sort((a, b) => b.regras - a.regras);
}

function blocoComponentes(d) {
  const anotados = d.querySelectorAll('[data-component]').length;
  const blocos = colherBlocos(d);
  const linhas = blocos.map((b) => `<tr>
    <td><code>.${esc(b.nome)}</code></td>
    <td class="num">${b.regras}</td>
    <td class="num">${b.naTela || '<span class="apoio">fora da tela agora</span>'}</td>
  </tr>`).join('');
  return `
    <h2 class="bloco__titulo">Componentes</h2>
    <div class="nota nota--cuidado">
      <strong>${anotados ? anotados + ' elementos anotados.' : 'O markup não tem anotação.'}</strong>
      Sem <code>data-component</code>, este manual não sabe quais peças são
      componentes, nem as props e os estados de cada uma, e não vai adivinhar.
      Não existe biblioteca de componentes do KZ carregada na tela: toda peça é
      CSS desta tela.
    </div>
    <p class="bloco__sub" style="margin-top:14px">
      O que dá para medir sem inventar: os blocos de classe que a folha da tela
      declara, quantas regras cada um tem, e quantos elementos na tela agora usam
      o bloco. É onde procurar, não a lista de componentes. Um bloco "fora da
      tela agora" aparece em outro estado (o erro do CEP, a cortina) ou não é
      usado.
    </p>
    <table><tr><th>Bloco</th><th>Regras</th><th>Na tela</th></tr>${linhas}</table>`;
}

async function blocoTextos(d) {
  /* Texto fixo é o que está escrito no HTML. O que aparece na tela e NÃO está
     no HTML foi posto lá pelo código: é dado ou frase montada. A separação é
     verificação contra a origem, não palpite. */
  let origem = '';
  try {
    const bruto = await (await fetch(TELA, { cache: 'no-cache' })).text();
    origem = bruto
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&copy;/g, '©')
      .replace(/\s+/g, ' ');
  } catch { /* sem a origem, a seção avisa e não chuta */ }

  if (!origem) {
    return `
      <h2 class="bloco__titulo">Textos</h2>
      <div class="nota nota--cuidado">Não consegui ler o HTML de origem para separar
      texto fixo de dado. Esta seção fica em branco em vez de listar os dois juntos.</div>`;
  }

  const fixos = new Set();
  for (const el of d.body.querySelectorAll('*')) {
    if (/^(SCRIPT|STYLE|svg|path|SVG)$/.test(el.tagName)) continue;
    for (const n of el.childNodes) {
      if (n.nodeType !== 3) continue;
      const t = n.textContent.trim().replace(/\s+/g, ' ');
      if (!t || t.length <= 2) continue;
      if (!origem.includes(t)) continue;   /* não está no HTML: é dado */
      fixos.add(t);
    }
  }

  /* Escrito à mão: o que o código monta. Listar a frase renderizada fixaria o
     número de um estado qualquer no código de quem copiar. */
  const montados = [
    'Os cards inteiros: nome, subtítulo, nota, selos, preço, prazo, frete e total de cada canal',
    'O rótulo do total: "Total da compra" no card da melhor oferta, "Total" nos outros, "A partir de" sem CEP',
    'O subtítulo do canal, que vira "Canal verificado" quando ele é a melhor oferta',
    'O frete: valor, "Grátis", "Aproximado", "Não informado" ou "Informe o CEP"',
    'A frase do timer, com o número de dias',
    'O aviso de canal fora do ranking, com o nome do canal',
    'O campo de CEP e o cartão "Frete para", com o CEP e a cidade',
    'A mensagem de erro do CEP',
    'O botão de comprar ("Comprar na Shopee") e o estado "Abrindo a Shopee…"',
    'O título da cortina de saída ("Levando você para a Shopee")',
  ];

  return `
    <h2 class="bloco__titulo">Textos</h2>
    <p class="bloco__sub">
      ${fixos.size} textos escritos no markup, conferidos contra o HTML de origem.
      Podem ser implementados como estão.
    </p>
    <div class="cartao"><ul class="lista-check">
      ${[...fixos].sort((a, b) => a.localeCompare(b, 'pt-BR')).map((t) =>
        `<li><span class="caixa"></span><span>${esc(t)}</span></li>`).join('')}
    </ul></div>
    <p class="bloco__sub" style="margin-top:12px">
      Exceção que a conferência não pega: "Levando você para a Shopee" está no HTML
      só como valor inicial da cortina de saída, e o código troca pelo canal
      escolhido. "Boa", no selo do Reclame Aqui, é dado de demonstração.
    </p>

    <div class="nota nota--cuidado" style="margin-top:14px">
      <strong>Estes outros são montados em código.</strong> Não copie a frase que
      aparece na tela: ela traz o dado de um estado qualquer. A montagem está no
      <code>&lt;script&gt;</code> do <code>index.html</code>, em <code>fillCard</code>,
      <code>renderCep</code> e <code>wireCtas</code>.
      <ul style="margin:8px 0 0; padding-left:18px">
        ${montados.map((m) => '<li>' + esc(m) + '</li>').join('')}
      </ul>
    </div>`;
}

function blocoTokens(d) {
  /* Lido do `<style>` da tela. Separo o que é declaração de token (o `:root`)
     do que é uso, e conto as cores escritas literais fora do `:root`: são os
     lugares onde a tela não consome o KZ. */
  const css = [...d.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  const semRoot = css.replace(/:root\s*\{[^}]*\}/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ');

  const declarados = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  const usados = new Map();
  for (const m of semRoot.matchAll(/var\((--[\w-]+)/g)) usados.set(m[1], (usados.get(m[1]) || 0) + 1);

  const grupos = {};
  for (const t of [...usados.keys()].sort()) {
    const g = t.replace(/^--/, '').split('-')[0];
    (grupos[g] = grupos[g] || []).push(t);
  }
  const linhas = Object.entries(grupos).map(([g, ts]) => `<tr>
    <td><strong>--${esc(g)}</strong></td>
    <td class="apoio">${ts.map((t) => '<code>' + esc(t) + '</code>').join(' ')}</td>
  </tr>`).join('');

  const literais = new Map();
  for (const m of semRoot.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const v = m[0].toLowerCase();
    literais.set(v, (literais.get(v) || 0) + 1);
  }
  const totalLiterais = [...literais.values()].reduce((a, b) => a + b, 0);
  const listaLiterais = [...literais.entries()].sort((a, b) => b[1] - a[1])
    .map(([v, n]) => `<code>${esc(v)}</code> ×${n}`).join(' · ');

  const naoDeclarados = [...usados.keys()].filter((t) => !declarados.has(t));

  return `
    <h2 class="bloco__titulo">Tokens</h2>
    <p class="bloco__sub">
      A tela declara ${declarados.size} variáveis no <code>:root</code> do próprio
      <code>&lt;style&gt;</code> e usa ${usados.size} nomes de variável. Cores e raios
      têm o nome do KZ (<code>design-system/tokens.json</code>); espaçamento
      (<code>--sp-*</code>), fontes e curva não aparecem com esse nome lá, e o manual
      não confere a correspondência. Consuma o token, não o número.
    </p>
    <table><tr><th>Grupo</th><th>Tokens usados</th></tr>${linhas}</table>
    ${naoDeclarados.length ? `<div class="nota nota--cuidado" style="margin-top:14px">
      <strong>Usados sem declaração na folha:</strong> ${naoDeclarados.map((t) => '<code>' + esc(t) + '</code>').join(' ')}.
      Ou vêm de <code>style</code> inline posto pelo código, ou estão faltando.</div>` : ''}
    <div class="nota nota--cuidado" style="margin-top:14px">
      <strong>${totalLiterais} cores escritas literais fora do <code>:root</code></strong>,
      em ${literais.size} valores diferentes: ${listaLiterais}.
      Em cada uma, confira se existe token do KZ com aquele papel antes de copiar o hex.
    </div>`;
}

function blocoChecklist() {
  /* Por estado, não por componente: sem anotação não há componente declarado
     para cruzar. Cada estado alcançável, nas três larguras do painel. */
  const larguras = ['390', '720', '1224'];
  const itens = ESTADOS.filter((e) => !e.sem).flatMap((e) => larguras.map((l) =>
    `<li><span class="caixa"></span><span>${esc(e.nome)} · ${l} px</span></li>`)).join('');
  const sem = ESTADOS.filter((e) => e.sem).map((e) => esc(e.nome)).join(', ');
  return `
    <h2 class="bloco__titulo">Checklist de estados</h2>
    <p class="bloco__sub">
      Cada estado alcançável, nas três larguras do painel. Estado faltando é bug
      de implementação, e é o que mais passa batido.
    </p>
    <div class="cartao"><ul class="lista-check">${itens}</ul></div>
    <p class="bloco__sub" style="margin-top:12px">
      Implementados no código e sem como conferir no protótipo: ${sem}. Peça os
      critérios a Produto antes de fechar.
    </p>`;
}

/* ------------------------------------------------------------- markdown */

function paraMarkdown(CH) {
  const sem = (t) => t.replace(/<\/?code>/g, '`').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '');
  const l = [];
  l.push('# Manual de implementação: Comparador público', '');
  l.push('Gerado do protótipo. O dado dos canais sai da tela; regras e demonstração são escritas à mão.', '');
  l.push('## Regras de negócio', '');
  for (const x of REGRAS) l.push(`- ${x.r} (${sem(x.onde)})`);
  l.push('', '## Os canais, como a tela os declara', '');
  for (const [id, c] of Object.entries(CH || {})) {
    l.push(`- **${c.name}** (\`${id}\`): nota ${c.rating}, estoque ${c.stock}, volume ${c.volume || 'sem selo'}`
      + (c.timer ? `, timer ${c.timer} dias` : '') + (c.aprox ? ', frete aproximado' : '') + (c.noPrazo ? ', prazo não informado' : ''));
  }
  l.push('', '## O que é demonstração', '');
  for (const s of SIMULADO) l.push(`- **${s.o}**: ${sem(s.nota)}`);
  l.push('', '## Estados', '');
  for (const e of ESTADOS) l.push(`- **${e.nome}**${e.sem ? ' (sem rota no protótipo)' : ''}: ${sem(e.como)}`);
  l.push('', '## Componentes', '', 'O markup não tem anotação. Toda peça é CSS desta tela; não há biblioteca de componentes do KZ carregada.');
  l.push('', '## Onde está a lógica', '',
    'No `<script>` do `index.html`, junto com o render (`fillCard`, `applyState`, `renderCep`, `wireCtas`).',
    'Não há camada de regra separada do DOM.');
  return l.join('\n');
}

/* --------------------------------------------------------------- montar */

async function montar() {
  await prontaAFonte();
  const d = fonte.contentDocument;

  const CH = daTela('CH');
  const TIER = daTela('TIER');

  if (!CH) {
    document.getElementById('estado-leitura').textContent =
      'Não consegui ler o protótipo. Esta página precisa de servidor: por file:// o iframe conta como outra origem.';
    return;
  }

  const blocos = [
    ['como-ler', 'Como ler', blocoComoLer()],
    ['regras', 'Regras de negócio', blocoRegras(CH, TIER)],
    ['demo', 'Demonstração', blocoSimulado()],
    ['estados', 'Estados', blocoEstados()],
    ['componentes', 'Componentes', blocoComponentes(d)],
    ['textos', 'Textos', await blocoTextos(d)],
    ['tokens', 'Tokens', blocoTokens(d)],
    ['checklist', 'Checklist', blocoChecklist()],
  ];

  alvo.innerHTML = blocos.map(([id, , html]) =>
    `<section class="bloco" id="${id}">${html}</section>`).join('');

  indice.innerHTML = '<div class="indice__lista">' + blocos.map(([id, rotulo]) =>
    `<a href="#${id}">${esc(rotulo)}</a>`).join('') + '</div>';

  const anotados = d.querySelectorAll('[data-component]').length;
  document.getElementById('estado-leitura').textContent =
    `${Object.keys(CH).length} canais lidos da tela, ${anotados} componentes anotados, `
    + `0 cenários de conteúdo, ${ESTADOS.filter((e) => !e.sem).length} estados alcançáveis.`;
  document.getElementById('quando').textContent =
    new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  const botao = document.getElementById('copiar-tudo');
  botao.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(paraMarkdown(CH));
      botao.dataset.feito = 'true';
      botao.textContent = 'Copiado';
    } catch {
      botao.textContent = 'Não consegui copiar';
    }
    setTimeout(() => { delete botao.dataset.feito; botao.textContent = 'Copiar o manual em markdown'; }, 1800);
  });
}

montar();
