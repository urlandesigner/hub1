/* Dev mode — inspeciona um elemento da tela e mostra o que o dev precisa.

   ADAPTADO para o Comparador público do HUB Inteligente. Veio da Loja do
   Influencer, que é o caso mais parecido: um arquivo só, CSS num `<style>`
   dentro do HTML, sem biblioteca de componentes.

   O que muda em relação à Loja:
   — "de qual token veio" TEM resposta aqui. O `<style>` declara variáveis no
     `:root` (`--sp-*`, `--neutral-*`, `--r-*`, `--font-*`); cores e raios têm o
     nome do KZ em `design-system/tokens.json`. A ficha lê o nome da declaração;
     onde o CSS escreveu o valor literal (8 cores hex fora do `:root`), cai no
     mapa por valor e, sem par, sai o literal.
   — "do sistema ou local?" tem uma resposta só: local. Não há folha de
     componentes do KZ carregada, só os tokens. Toda peça é CSS desta tela.
   — props e estados dependem de anotação, que esta tela não tem. Saem dizendo
     que falta.

   POR QUE ISTO EXISTE, se o devtools do navegador já mostra CSS calculado:
   porque o devtools mostra `#CA235F` e não diz que aquilo é
   `--yb-accent-signal`; mostra a regra e não diz se ela veio do design system
   ou de uma folha local. Essas duas respostas mudam o trabalho de quem
   implementa — usar o componente do sistema ou escrever um — e são o que este
   painel resolve. O resto é conveniência.

   A REGRA DAQUI: o destaque é desenhado na página do laboratório, por cima do
   iframe, e não dentro dele. O protótipo que o dev inspeciona não ganha um nó
   sequer — a mesma regra do painel de estados, pelo mesmo motivo. */

const inspetor = {
  aberto: false,       /* a coluna da direita está aberta */
  /* A peça mais funda que você clicou NA TELA. O caminho é sempre desenhado a
     partir dela, e não do que está selecionado agora: senão, subir um nível
     apagava os degraus abaixo e não havia como voltar para onde se estava. */
  ancora: null,
  ligado: false,       /* e o clique na tela seleciona em vez de interagir */
  usandoATela: false,  /* a não ser que você tenha pedido para usar a tela */
  selecionado: null,
  tokens: null,      /* mapa valor → nome, montado por tela carregada */
  raizPx: 16,
};

/* ------------------------------------------------- mapa de tokens da tela */

/* Lê todo `--token: valor` das folhas da tela, resolve as cadeias de `var()` e
   indexa por valor normalizado. É o que permite responder "esse #CA235F é o
   --yb-accent-signal" a partir do estilo calculado. */
/* Variáveis internas do framework não são token de design: `--tw-shadow` e
   companhia são encanamento que o Tailwind usa para compor utilitários. Dizer
   que a sombra "veio de --tw-shadow" é verdade literal e mentira útil. */
const TOKEN_DE_ENCANAMENTO = /^--tw-/;

function montarTokens(d) {
  const brutos = new Map();

  /* `if (r.cssRules)` não serve de teste: desde o CSS Nesting, toda CSSStyleRule
     tem um `cssRules` — vazio, mas vazio é truthy. A versão anterior recursava
     numa lista vazia e nunca chegava a ler uma propriedade, e o mapa de tokens
     nascia com zero entradas sem erro nenhum no console. */
  const varrer = (regras) => {
    for (const r of regras) {
      if (r.style) {
        for (const prop of r.style) {
          if (prop.startsWith('--')) brutos.set(prop, r.style.getPropertyValue(prop).trim());
        }
      }
      if (r.cssRules && r.cssRules.length) varrer(r.cssRules);
    }
  };
  for (const folha of d.styleSheets) {
    try { varrer(folha.cssRules); } catch { /* folha de outra origem */ }
  }

  const resolvidos = new Map();
  const resolver = (nome, visto) => {
    if (resolvidos.has(nome)) return resolvidos.get(nome);
    if (visto.has(nome)) return '';
    visto.add(nome);
    let v = brutos.get(nome);
    if (v == null) return '';
    const m = v.match(/^var\(\s*(--[\w-]+)\s*(?:,[\s\S]*)?\)$/);
    if (m) v = resolver(m[1], visto);
    resolvidos.set(nome, v);
    return v;
  };
  for (const nome of brutos.keys()) resolver(nome, new Set());

  /* Normalizar é obrigatório: o token diz `#CA235F` e `1.25rem`, o estilo
     calculado diz `rgb(202, 35, 95)` e `20px`. Sem converter, nada casa. */
  const provete = d.createElement('span');
  provete.style.cssText = 'position:absolute;left:-9999px;top:0';
  d.body.appendChild(provete);

  inspetor.raizPx = parseFloat(getComputedStyle(d.documentElement).fontSize) || 16;

  const corNormal = (valor) => {
    provete.style.color = '';
    provete.style.color = valor;
    if (!provete.style.color) return null;
    return getComputedStyle(provete).color;
  };
  const tamanhoNormal = (valor) => {
    const m = String(valor).match(/^(-?[\d.]+)(rem|px|em)$/);
    if (!m) return null;
    const n = parseFloat(m[1]);
    if (m[2] === 'px') return n + 'px';
    return Math.round(n * inspetor.raizPx * 100) / 100 + 'px';
  };

  const porValor = new Map();
  const guardar = (chave, nome) => {
    if (!chave) return;
    if (!porValor.has(chave)) porValor.set(chave, []);
    if (!porValor.get(chave).includes(nome)) porValor.get(chave).push(nome);
  };

  for (const [nome, valor] of resolvidos) {
    if (!valor) continue;
    /* ESTA LINHA FALTAVA. A constante existia, o comentário explicava por que
       ela existe, e nada a chamava — então o índice por valor guardava o
       encanamento do Tailwind junto com o resto, e como ele é o primeiro a
       casar com `rgb(255,255,255)` e com `0px`, a ficha anunciava que a cor do
       texto "veio de --tw-ring-offset-color" e o padding de
       `--tw-ring-offset-width`. Verdade literal, mentira útil: ninguém
       escreveu essas variáveis, o Tailwind as declara para compor utilitários.

       Um palpite com cara de certeza é pior que "não sei" — é a terceira regra
       do pacote, e era exatamente ela que estava sendo quebrada aqui. */
    if (TOKEN_DE_ENCANAMENTO.test(nome)) continue;
    if (/^#|^rgb|^hsl/.test(valor)) guardar('cor:' + corNormal(valor), nome);
    const t = tamanhoNormal(valor);
    if (t) guardar('tam:' + t, nome);
    guardar('cru:' + valor, nome);
  }

  provete.remove();
  return { porValor, resolvidos, brutos, corNormal };
}

function tokenDe(tipo, valor) {
  if (!inspetor.tokens || valor == null || valor === '') return null;
  const nomes = inspetor.tokens.porValor.get(tipo + ':' + valor)
             || inspetor.tokens.porValor.get('cru:' + valor);
  if (!nomes || !nomes.length) return null;

  /* Vários nomes podem ter o mesmo valor, e um deles é o certo de citar: o
     semântico. `--yb-white` e `--yb-text-on-action` valem os dois `#fff`, mas
     quem implementa deve consumir o segundo.

     A distinção não é chute: no design system o token semântico APONTA para
     outro — `--yb-text-primary: var(--yb-gray-950)`. Então basta olhar o valor
     cru: quem começa com `var(` é derivado, logo semântico. */
  const brutos = inspetor.tokens.brutos;
  const derivado = nomes.find((n) => /^var\(/.test((brutos.get(n) || '').trim()));
  return derivado || nomes[0];
}

/* --------------------------------------------- de onde a regra do CSS vem */

const PSEUDO = /::?(before|after|placeholder|first-line|first-letter|selection|marker|details-content|backdrop)\b/g;
const ESTADO = /:(hover|focus-visible|focus-within|focus|active|disabled|checked|indeterminate|placeholder-shown|valid|invalid|target|visited|link|empty)/g;

function regrasDoElemento(d, el) {
  const achadas = [];

  const percorrer = (regras, folha, condicao) => {
    for (const r of regras) {
      if (r.conditionText != null && r.cssRules) {
        percorrer(r.cssRules, folha, r.conditionText);
        continue;
      }
      if (r.cssRules && !r.selectorText) { percorrer(r.cssRules, folha, condicao); continue; }
      if (!r.selectorText) continue;

      for (const parte of r.selectorText.split(',')) {
        /* Tiro pseudo-elemento e pseudo-classe de estado antes de testar: a
           regra do `:hover` vale para este elemento, e eu quero saber disso. */
        const limpo = parte.replace(PSEUDO, '').replace(ESTADO, '').trim();
        if (!limpo || limpo === '*') continue;
        let casa = false;
        try { casa = el.matches(limpo); } catch { casa = false; }
        if (casa) {
          achadas.push({
            seletor: parte.trim(),
            temEstado: (ESTADO.lastIndex = 0, PSEUDO.lastIndex = 0,
                        ESTADO.test(parte) || PSEUDO.test(parte)),
            css: r.style.cssText,
            arquivo: typeof nomeDaFolha === 'function' ? nomeDaFolha(d, folha)
                     : (folha.href ? folha.href.split('/').pop() : '<style> na página'),
            condicao: condicao || '',
          });
          break;
        }
      }
    }
  };

  for (const folha of d.styleSheets) {
    try { percorrer(folha.cssRules, folha, ''); } catch { /* outra origem */ }
  }
  return achadas;
}

function origemDa(el, regras) {
  /* Nesta tela só existe uma folha, o `<style>` da página, e nenhuma biblioteca
     de componentes. Então não há "do sistema" para responder: o que decide o
     trabalho é se a peça tem regra própria (CSS a traduzir) ou só herda.
     Os tokens do KZ aparecem nas linhas da ficha, não aqui. */
  const proprias = regras.filter((r) => !/^(\*|html|body|:root)$/.test(r.seletor.trim()));
  if (proprias.length) return { de: 'local', rotulo: 'CSS próprio desta tela',
    nota: 'Não existe componente do KZ pronto para esta peça: o CSS abaixo é a fonte. Os valores que citam token (--sp-, --neutral-) devem consumir o token, não o número.' };
  return { de: 'nenhuma', rotulo: 'Sem regra própria',
    nota: 'Nenhuma regra desta tela mira este elemento. Ele herda do pai ou das regras globais.' };
}

/* O NOME CERTO VEM DA DECLARAÇÃO, não do valor.

   Procurar o token pelo valor calculado é adivinhação: `#fff` é `--yb-white`,
   `--yb-bg-page`, `--yb-surface` e `--yb-text-on-action` ao mesmo tempo, e
   escolher entre eles por heurística acerta às vezes. Mas a regra que pintou o
   elemento escreveu o nome: `color: var(--yb-action-primary-text)`. Então eu
   leio dela.

   Entre duas regras que declaram a mesma propriedade, fico com a última na
   ordem do documento — que é quem vence no empate de especificidade, o caso
   comum entre `.yb-btn` e `.yb-btn--primary`. O mapa por valor continua como
   plano B, para quando o CSS escreveu o valor literal. */
function declaracoesDe(regras, prop) {
  if (!regras) return [];
  const alvo = new RegExp('(?:^|;)\\s*' + prop + '\\s*:\\s*([^;]+)', 'i');
  return regras
    /* Regra de `:hover`, `:active` ou `::before` não descreve o que está na
       tela agora. Ela entra na lista de CSS que alcança o elemento, mas não
       pode ser a fonte do token do estado em repouso — foi assim que o fundo
       do botão apareceu como `--yb-action-primary-bg-active`. */
    .filter((r) => !r.temEstado)
    .map((r) => ((r.css || '').match(alvo) || [])[1])
    .filter(Boolean);
}

/* `espera` filtra por tipo quando a declaração é um atalho com mais de um
   token: `border: var(--yb-border-hairline) solid var(--yb-border)` tem a
   espessura primeiro e a cor depois. Sem o filtro, a borda aparecia com o
   nome do token de espessura. */
function tokenDeclarado(regras, prop, espera) {
  const valores = declaracoesDe(regras, prop);
  let achado = null;

  const serve = (nome) => {
    if (!espera || !inspetor.tokens) return true;
    const v = inspetor.tokens.resolvidos.get(nome) || '';
    const ehCor = /^#|^rgb|^hsl/.test(v);
    return espera === 'cor' ? ehCor : !ehCor;
  };

  /* Só a ÚLTIMA declaração conta. Antes eu guardava o último `var()` que
     aparecesse em qualquer regra, e por isso o padding do input dentro da
     caixa do campo aparecia como `--yb-space-4` quando o valor real era 0 —
     a regra que vence declara `padding: 0`, sem token nenhum. */
  const ultima = valores[valores.length - 1];
  if (!ultima) return null;
  const nomes = [...ultima.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);
  achado = nomes.filter(serve).pop() || null;
  return achado;
}

/* Propriedade que nenhuma regra desta peça declara é HERDADA. Dizer isso vale
   mais que mostrar um token adivinhado pelo valor: `rgb(30,30,31)` casa com
   `--yb-text-primary` e com `--yb-bg-inverse`, e nenhum dos dois foi escolhido
   por quem escreveu o CSS deste elemento. */
function herdado(regras, props) {
  return props.every((prop) => declaracoesDe(regras, prop).length === 0);
}

/* --------------------------------------------------------------- contraste */

function paraRgb(cor) {
  const m = String(cor).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const n = m[1].split(',').map((x) => parseFloat(x));
  return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
}

function luminancia({ r, g, b }) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contraste(frente, fundo) {
  const a = paraRgb(frente), b = paraRgb(fundo);
  if (!a || !b) return null;
  const l1 = luminancia(a), l2 = luminancia(b);
  const razao = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(razao * 100) / 100;
}

/* O fundo que vale é o primeiro ancestral que não é transparente. */
function fundoEfetivo(el) {
  let atual = el;
  while (atual) {
    const c = getComputedStyle(atual).backgroundColor;
    const rgb = paraRgb(c);
    if (rgb && rgb.a > 0) return c;
    atual = atual.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

function seloContraste(razao, tamanhoPx, peso) {
  if (razao == null) return '';
  const grande = tamanhoPx >= 24 || (tamanhoPx >= 18.66 && Number(peso) >= 700);
  const aa = grande ? 3 : 4.5;
  const aaa = grande ? 4.5 : 7;
  const passa = razao >= aaa ? 'AAA' : razao >= aa ? 'AA' : razao >= 3 ? 'UI' : 'nao';
  const rotulo = passa === 'nao' ? 'reprova' : passa === 'UI' ? 'só UI' : passa;
  return `<span class="contraste" data-passa="${passa}">${razao}:1 · ${rotulo}</span>`;
}

/* ----------------------------------------------------------------- desenho */

const esc = (t) => String(t == null ? '' : t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function linha(chave, valorHtml) {
  return `<div class="linha"><span class="linha__chave">${esc(chave)}</span><span class="linha__valor">${valorHtml}</span></div>`;
}

/* Dois traçados, um `<svg>` só: o de copiar e o de confirmado. Qual aparece é
   o CSS que decide, pelo `data-copiado` do botão. */
const ICONE_COPIAR = '<svg class="copiavel__icone" viewBox="0 0 16 16" aria-hidden="true">'
  + '<g class="copiavel__papel"><rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/>'
  + '<path d="M10.5 2.5h-8v8"/></g>'
  + '<path class="copiavel__certo" d="M3 8.5 6.4 12 13 4.8"/></svg>';

/* Um valor clicável que copia a declaração CSS correspondente. */
function valor(texto, paraCopiar, extras = {}) {
  const amostra = extras.cor ? `<span class="amostra" style="background:${esc(extras.cor)}"></span>` : '';
  const token = extras.token
    ? `<span class="token">${esc(extras.token)}</span><span class="bruto">${esc(texto)}</span>`
    : extras.nota
      ? `${esc(texto)}<span class="bruto">${esc(extras.nota)}</span>`
      : esc(texto);
  /* O ícone fica no botão, não numa frase no rodapé: a frase explicava que dava
     para copiar e sumia da vista; o ícone diz a mesma coisa no lugar onde o
     clique acontece. */
  return `<button class="copiavel" type="button" data-copiar="${esc(paraCopiar)}" title="Copiar o CSS">`
       + `${amostra}<span>${token}</span>${ICONE_COPIAR}</button>`
       + (extras.depois || '');
}

/* O NOME VEM DO QUE ALGUÉM ESCREVEU, não do que o framework gerou.

   A versão de referência pega a primeira classe sem `__` nem `--`, e acerta
   numa tela com nomes de componente. Com utilitárias ela devolvia
   `text-[2.5rem]`, que não nomeia nada e ainda parece defeito. */
let classesDaCasa = null;

function lerClassesDaCasa(d) {
  const nomes = new Set();
  for (const folha of d.styleSheets) {
    try {
      /* Na Loja aqui se pulava a folha com mais de 50 regras, que era a do
         Tailwind. Nesta tela a única folha é a escrita à mão, e ela tem
         centenas de regras: o filtro por contagem a jogaria fora inteira. */
      if (folha.href) continue;
      for (const r of folha.cssRules) {
        for (const m of (r.selectorText || '').matchAll(/\.([A-Za-z_][\w-]*)/g)) nomes.add(m[1]);
      }
    } catch { /* outra origem */ }
  }
  return nomes;
}

function nomeDaPeca(el) {
  if (el.dataset && el.dataset.component) return el.dataset.component;
  if (classesDaCasa === null) classesDaCasa = lerClassesDaCasa(el.ownerDocument);
  const daCasa = [...el.classList].find((c) => classesDaCasa.has(c));
  if (daCasa) return daCasa;
  if (el.id) return '#' + el.id;
  return el.tagName.toLowerCase();
}

function caminhoAte(el, raiz) {
  const passos = [];
  let atual = el;
  while (atual && atual !== raiz && passos.length < 8) {
    passos.unshift(atual);
    atual = atual.parentElement;
  }
  return passos;
}

function desenhar(el) {
  const corpo = document.getElementById('inspetor-corpo');
  const topo = document.getElementById('inspetor-peca');

  if (!el) {
    topo.innerHTML = '<p class="inspetor__nome">Nada selecionado</p>';
    corpo.innerHTML = '<p class="inspetor__vazio">Clique num elemento da tela para inspecionar. Dá para clicar de qualquer aba.</p>';
    return;
  }

  const d = el.ownerDocument;
  const cs = getComputedStyle(el);
  const caixa = el.getBoundingClientRect();
  const regras = regrasDoElemento(d, el);
  const origem = origemDa(el, regras);

  /* ---- topo: nome e de onde vem ---- */
  topo.innerHTML = `
    <div class="inspetor__peca">
      <p class="inspetor__nome">${esc(nomeDaPeca(el))}</p>
      <span class="inspetor__fonte" data-de="${origem.de}">${esc(origem.rotulo)}</span>
      <button class="inspetor__limpar" type="button" id="limpar-selecao" title="Limpar seleção (Esc)" aria-label="Limpar seleção">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>
      </button>
    </div>
    <p class="inspetor__nota">${esc(origem.nota)}</p>
    <div class="trilha" id="trilha"></div>`;

  const trilha = document.getElementById('trilha');
  const base = (inspetor.ancora && inspetor.ancora.ownerDocument === d) ? inspetor.ancora : el;
  const passos = caminhoAte(base, d.body);
  passos.forEach((p, i) => {
    if (i) trilha.insertAdjacentHTML('beforeend', '<span class="trilha__sep">›</span>');
    const b = document.createElement('button');
    b.className = 'trilha__passo';
    b.type = 'button';
    b.textContent = nomeDaPeca(p);
    if (p === el) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', () => selecionar(p, true));
    trilha.appendChild(b);
  });

  const secoes = [];

  /* ---- qual componente do design system usar ---- */
  /* Vem do `data-ds` no markup. É a informação mais acionável do painel: diz
     o nome da peça a consumir, em vez de deixar o dev deduzir pela classe. */
  const ds = el.dataset && el.dataset.ds;
  if (ds) {
    secoes.push(`<div class="secao"><h3 class="secao__titulo">Use este componente</h3>
      ${linha('do sistema', '<span class="token">' + esc(ds) + '</span>')}
      <p class="inspetor__dica">O CSS abaixo serve para conferir paridade, não para copiar.</p></div>`);
  }

  /* ---- anotação: propriedades e estados ---- */
  const props = el.dataset && el.dataset.props;
  const estados = el.dataset && el.dataset.states;
  if (props) {
    const itens = props.split(',').map((p) => {
      const [nome, tipo] = p.split(':').map((x) => (x || '').trim());
      return linha(nome, esc(tipo || 'handler'));
    });
    secoes.push(`<div class="secao"><h3 class="secao__titulo">Propriedades</h3>${itens.join('')}</div>`);
  } else {
    secoes.push(`<div class="secao"><h3 class="secao__titulo">Propriedades</h3>
      <p class="inspetor__dica">Sem anotação. As props só aparecem quando o markup declara <span class="token">data-props</span> neste elemento.</p></div>`);
  }

  if (estados) {
    const atual = (el.dataset.state || '').trim();
    const itens = estados.split(',').map((s) => s.trim()).filter(Boolean).map((s) =>
      `<span class="estados__item" data-atual="${s === atual}">${esc(s)}</span>`).join('');
    secoes.push(`<div class="secao"><h3 class="secao__titulo">Estados declarados</h3><div class="estados">${itens}</div></div>`);
  }

  /* ---- cores ---- */
  const corTexto = cs.color;
  const corFundo = cs.backgroundColor;
  const fundoReal = fundoEfetivo(el);
  const razao = contraste(corTexto, fundoReal);
  const linhasCor = [
    linha('texto', valor(corTexto, `color: ${corTexto};`, {
      cor: corTexto,
      token: tokenDeclarado(regras, 'color', 'cor')
             || (herdado(regras, ['color']) ? null : tokenDe('cor', corTexto)),
      nota: herdado(regras, ['color']) ? 'herdado' : '',
      depois: seloContraste(razao, parseFloat(cs.fontSize), cs.fontWeight),
    })),
  ];
  if (paraRgb(corFundo) && paraRgb(corFundo).a > 0) {
    linhasCor.push(linha('fundo', valor(corFundo, `background: ${corFundo};`, { cor: corFundo, token: tokenDeclarado(regras, 'background-color', 'cor') || tokenDeclarado(regras, 'background', 'cor') || tokenDe('cor', corFundo) })));
  }
  if (parseFloat(cs.borderTopWidth) > 0) {
    linhasCor.push(linha('borda', valor(cs.borderTopColor, `border-color: ${cs.borderTopColor};`, { cor: cs.borderTopColor, token: tokenDeclarado(regras, 'border-color', 'cor') || tokenDeclarado(regras, 'border', 'cor') || tokenDe('cor', cs.borderTopColor) })));
  }
  secoes.push(`<div class="secao"><h3 class="secao__titulo">Cores</h3>${linhasCor.join('')}</div>`);

  /* ---- tipografia ---- */
  const familia = cs.fontFamily.split(',')[0].replace(/["']/g, '');
  const texto = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  secoes.push(`<div class="secao"><h3 class="secao__titulo">Tipografia</h3>
    ${texto ? linha('texto', '“' + esc(texto) + '”') : ''}
    ${linha('fonte', valor(familia, `font-family: ${cs.fontFamily};`, { nota: herdado(regras, ['font-family', 'font']) ? 'herdado' : '' }))}
    ${linha('tamanho', valor(cs.fontSize, `font-size: ${cs.fontSize};`, { token: tokenDeclarado(regras, 'font-size') || (herdado(regras, ['font-size', 'font']) ? null : tokenDe('tam', cs.fontSize)), nota: herdado(regras, ['font-size', 'font']) ? 'herdado' : '' }))}
    ${linha('altura', valor(cs.lineHeight, `line-height: ${cs.lineHeight};`, { token: tokenDeclarado(regras, 'line-height') || (herdado(regras, ['line-height', 'font']) ? null : tokenDe('tam', cs.lineHeight)), nota: herdado(regras, ['line-height', 'font']) ? 'herdado' : '' }))}
    ${linha('peso', valor(cs.fontWeight, `font-weight: ${cs.fontWeight};`, { token: tokenDeclarado(regras, 'font-weight') || (herdado(regras, ['font-weight', 'font']) ? null : tokenDe('cru', cs.fontWeight)), nota: herdado(regras, ['font-weight', 'font']) ? 'herdado' : '' }))}
    ${cs.letterSpacing !== 'normal' ? linha('tracking', valor(cs.letterSpacing, `letter-spacing: ${cs.letterSpacing};`, { token: tokenDeclarado(regras, 'letter-spacing') || tokenDe('tam', cs.letterSpacing) })) : ''}
  </div>`);

  /* ---- layout ---- */
  const lado = (p) => cs.getPropertyValue(p);
  const quatro = (a, b, c, e) => [lado(a), lado(b), lado(c), lado(e)].join(' ');
  secoes.push(`<div class="secao"><h3 class="secao__titulo">Layout</h3>
    ${linha('tamanho', valor(Math.round(caixa.width) + ' × ' + Math.round(caixa.height), `width: ${Math.round(caixa.width)}px;`))}
    ${linha('display', valor(cs.display, `display: ${cs.display};`))}
    ${linha('padding', valor(quatro('padding-top', 'padding-right', 'padding-bottom', 'padding-left'), `padding: ${quatro('padding-top', 'padding-right', 'padding-bottom', 'padding-left')};`, { token: tokenDeclarado(regras, 'padding') || tokenDe('tam', cs.paddingTop) }))}
    ${cs.margin !== '0px' ? linha('margin', valor(quatro('margin-top', 'margin-right', 'margin-bottom', 'margin-left'), `margin: ${quatro('margin-top', 'margin-right', 'margin-bottom', 'margin-left')};`, { token: tokenDeclarado(regras, 'margin') || tokenDe('tam', cs.marginTop) })) : ''}
    ${cs.rowGap !== 'normal' && cs.rowGap !== '0px' ? linha('gap', valor(cs.rowGap === cs.columnGap ? cs.rowGap : cs.rowGap + ' ' + cs.columnGap, `gap: ${cs.rowGap} ${cs.columnGap};`, { token: tokenDeclarado(regras, 'gap') || tokenDe('tam', cs.rowGap) })) : ''}
  </div>`);

  /* ---- forma ---- */
  const temSombra = cs.boxShadow && cs.boxShadow !== 'none';
  secoes.push(`<div class="secao"><h3 class="secao__titulo">Forma</h3>
    ${linha('raio', valor(cs.borderRadius, `border-radius: ${cs.borderRadius};`, { token: tokenDeclarado(regras, 'border-radius') || tokenDe('tam', cs.borderTopLeftRadius) }))}
    ${parseFloat(cs.borderTopWidth) > 0 ? linha('borda', valor(cs.borderTopWidth + ' ' + cs.borderTopStyle, `border: ${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor};`, { token: tokenDeclarado(regras, 'border-width', 'tam') || tokenDeclarado(regras, 'border', 'tam') || tokenDe('tam', cs.borderTopWidth) })) : ''}
    ${temSombra ? linha('sombra', valor(cs.boxShadow.slice(0, 44) + (cs.boxShadow.length > 44 ? '…' : ''), `box-shadow: ${cs.boxShadow};`, { token: tokenDeclarado(regras, 'box-shadow') || tokenDe('cru', cs.boxShadow) })) : ''}
  </div>`);

  /* ---- acessibilidade ---- */
  const a11y = [];
  const papel = el.getAttribute('role') || papelImplicito(el);
  if (papel) a11y.push(linha('papel', esc(papel)));
  for (const at of el.getAttributeNames()) {
    if (at.startsWith('aria-')) a11y.push(linha(at, esc(el.getAttribute(at))));
  }
  if (el.tagName === 'IMG') a11y.push(linha('alt', el.alt ? '“' + esc(el.alt) + '”' : '<em>vazio</em>'));
  if (el.hasAttribute('tabindex')) a11y.push(linha('tabindex', esc(el.getAttribute('tabindex'))));
  if (el.disabled) a11y.push(linha('estado', 'desabilitado'));
  secoes.push(`<div class="secao"><h3 class="secao__titulo">Acessibilidade</h3>
    ${a11y.length ? a11y.join('') : '<p class="inspetor__dica">Nenhum papel, aria ou alt neste elemento.</p>'}</div>`);

  /* ---- o CSS de verdade ----

     AGRUPADO POR ORIGEM, não um cartão por regra. Antes cada regra virava um
     cartão com o seu próprio cabeçalho, e seis regras da mesma folha repetiam o
     mesmo cabeçalho seis vezes — mais pixel de moldura que de CSS, e a
     informação que importa (de onde isto vem) dita em duplicata.

     O que o cartão SEPARA é o que muda: a folha e o `@media`. O que ele JUNTA é
     o que é igual. Dentro do cartão a ordem continua sendo a do documento, que é
     quem decide o empate — por isso agrupo vizinhos, e não por chave: reordenar
     para juntar folhas distantes mentiria sobre quem vence. */
  const MOSTRADAS = 12;
  const visiveis = regras.slice(0, MOSTRADAS);

  const textoDaRegra = (r) => r.seletor + ' {\n  ' + r.css.replace(/; /g, ';\n  ') + '\n}';

  const grupos = [];
  for (const r of visiveis) {
    const chave = r.arquivo + '|' + (r.condicao || '');
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.chave === chave) ultimo.regras.push(r);
    else grupos.push({ chave, arquivo: r.arquivo, condicao: r.condicao, regras: [r] });
  }

  const blocos = grupos.map((g) => {
    const corpo = g.regras.map(textoDaRegra).join('\n\n');
    const quantas = g.regras.length > 1 ? ` · ${g.regras.length} regras` : '';
    return `
    <div class="regra">
      <div class="regra__fonte">
        <span class="regra__arquivo">${esc(g.arquivo)}${g.condicao ? ' · @media ' + esc(g.condicao) : ''}${quantas}</span>
        <button class="copiavel copiavel--so-icone" type="button"
                data-copiar="${esc(corpo)}" title="Copiar este CSS"
                aria-label="Copiar o CSS de ${esc(g.arquivo)}">${ICONE_COPIAR}</button>
      </div>
      <pre class="regra__css">${esc(corpo)}</pre>
    </div>`;
  }).join('');

  /* O botão do título copia tudo que está à vista — inclusive o que o leitor
     teria que juntar de vários cartões à mão. */
  const tudo = visiveis.map(textoDaRegra).join('\n\n');
  const copiarTudo = visiveis.length > 1
    ? `<button class="copiavel copiavel--so-icone" type="button" data-copiar="${esc(tudo)}"
               title="Copiar todo o CSS desta lista"
               aria-label="Copiar todo o CSS que alcança este elemento">${ICONE_COPIAR}</button>`
    : '';

  secoes.push(`<div class="secao">
    <h3 class="secao__titulo secao__titulo--com-acao">CSS que alcança este elemento${copiarTudo}</h3>
    ${blocos || '<p class="inspetor__dica">Nenhuma regra própria.</p>'}
    ${regras.length > MOSTRADAS ? `<p class="inspetor__dica">E outras ${regras.length - MOSTRADAS} regras.</p>` : ''}</div>`);

  corpo.innerHTML = secoes.join('');
}

function papelImplicito(el) {
  const t = el.tagName;
  if (t === 'BUTTON') return 'button';
  if (t === 'A' && el.href) return 'link';
  if (t === 'INPUT') return 'input · type=' + (el.type || 'text');
  if (t === 'SELECT') return 'combobox';
  if (/^H[1-6]$/.test(t)) return 'heading · nível ' + t[1];
  if (t === 'IMG') return 'img';
  return '';
}

/* ------------------------------------------------ destaque sobre o iframe */

/* A caixa do elemento vem em pixels da tela; a moldura pode estar reduzida.
   `tela.getBoundingClientRect()` já devolve a caixa reduzida, então só o que
   vem de dentro precisa ser multiplicado pela escala. */
function caixaNoPai(el) {
  const r = el.getBoundingClientRect();
  const f = tela.getBoundingClientRect();
  const k = typeof escalaDaTela === 'function' ? escalaDaTela() : 1;
  return { left: f.left + r.left * k, top: f.top + r.top * k, width: r.width * k, height: r.height * k };
}

function pintarDestaque(id, el) {
  const marca = document.getElementById(id);
  if (!el) { marca.hidden = true; return; }
  const c = caixaNoPai(el);
  Object.assign(marca.style, {
    left: c.left + 'px', top: c.top + 'px',
    width: c.width + 'px', height: c.height + 'px',
  });
  marca.hidden = false;
}

/* --------------------------------------------------------------- seleção */

function selecionar(el, daTrilha = false) {
  /* Clicar na tela troca a âncora; andar pela trilha, não. */
  if (!daTrilha) inspetor.ancora = el;
  inspetor.selecionado = el;
  desenhar(el);
  pintarDestaque('marca-sel', el);
  /* As abas de código também olham para a seleção, quando estão no modo peça. */
  if (typeof aoSelecionar === 'function') aoSelecionar(el);
}

/* O protótipo não ganha listener nem nó: os eventos são ouvidos no documento
   dele, mas o que eu desenho fica na página de fora. */
function ligarNaTela() {
  const d = tela.contentDocument;
  if (!d || !d.body) return;

  d.addEventListener('mousemove', (e) => {
    if (!inspetor.ligado) return;
    const el = e.target;
    if (!(el instanceof d.defaultView.Element)) return;
    pintarDestaque('marca-hover', el);
  }, true);

  d.addEventListener('mouseleave', () => {
    pintarDestaque('marca-hover', null);
  }, true);

  /* QUEM SELECIONA É O `pointerdown`, e isso não é detalhe.

     Medido: sobre um botão desativado o navegador dispara `pointerdown` — com
     o alvo sendo o próprio botão — e NÃO dispara `mousedown`, `mouseup` nem
     `click`. Enquanto a seleção vinha do clique, metade dos estados do
     protótipo era impossível de inspecionar: botão de cupom sem cupom, stepper
     no mínimo, qualquer campo desabilitado. Justamente os estados sobre os
     quais o dev mais tem dúvida.

     Cancelar o `pointerdown` também suprime o `mousedown` que viria depois, e
     com ele o foco — era por isso que clicar num campo punha o cursor dentro
     dele. */
  d.addEventListener('pointerdown', (e) => {
    if (!inspetor.ligado || !e.isTrusted) return;
    e.preventDefault();
    e.stopPropagation();
    selecionar(e.target);
  }, true);

  /* O `click` continua barrado à parte: cancelar o `pointerdown` não impede o
     clique de nascer, e sem isto a ação da peça rodaria depois da seleção. */
  d.addEventListener('mousedown', (e) => {
    if (!inspetor.ligado || !e.isTrusted) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  /* Só evento de gente é interceptado. O painel de estados dirige a tela com
     `.click()` sintético, e aqueles têm de continuar passando. */
  d.addEventListener('click', (e) => {
    if (!inspetor.ligado || !e.isTrusted) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  d.addEventListener('scroll', () => {
    if (!inspetor.ligado) return;
    if (inspetor.selecionado) pintarDestaque('marca-sel', inspetor.selecionado);
    pintarDestaque('marca-hover', null);
  }, true);

  classesDaCasa = null;
  inspetor.tokens = montarTokens(d);
}

/* ------------------------------------------------------------- copiar */

function ligarCopia() {
  /* O botão de limpar nasce de novo a cada ficha, então quem ouve é a coluna. */
  document.getElementById('inspetor').addEventListener('click', (e) => {
    if (!e.target.closest('#limpar-selecao')) return;
    inspetor.selecionado = null;
    inspetor.ancora = null;
    desenhar(null);
    pintarDestaque('marca-sel', null);
      if (typeof aoSelecionar === 'function') aoSelecionar(null);
  });

  document.getElementById('inspetor').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copiar]');
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copiar);
      b.dataset.copiado = 'true';
    } catch {
      /* Engolir o erro deixa o botão com cara de quebrado — foi assim que o
         clique sem listener nenhum passou despercebido. Se a área de
         transferência for negada, diga, e selecione o texto para o Ctrl+C
         funcionar à mão. */
      b.dataset.copiado = 'erro';
      const faixa = document.createRange();
      faixa.selectNodeContents(b);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(faixa);
    }
    setTimeout(() => delete b.dataset.copiado, 1400);
  });
}

/* ------------------------------------------------------------- ligar e desligar */

/* Abrir a coluna e interceptar o clique são coisas diferentes, desde que ela
   ganhou as abas de código: nessas, a coluna fica aberta e a tela continua
   clicável — quem está lendo o fonte não quer que o clique selecione peça. */
/* Aqui HÁ chave de dev mode (na Loja não havia). Ligada, ela abre a coluna e
   faz o clique na tela selecionar, em qualquer aba: é o que alimenta a ficha e
   o modo "só o selecionado". Quem solta a tela sem fechar a coluna é o seletor
   "Navegar", na barra do palco. Desligada, a coluna fecha e a tela é só tela. */
function ligarDevMode(valor) {
  inspetor.aberto = valor;
  document.querySelector('.lab').dataset.codigo = String(valor);
  if (!valor) {
    pintarDestaque('marca-sel', null);
    pintarDestaque('marca-hover', null);
  }
  atualizarInspecao();
}

function atualizarInspecao() {
  const valor = inspetor.aberto && !inspetor.usandoATela;
  inspetor.ligado = valor;
  document.body.dataset.inspecionando = String(valor);
  if (!valor) {
    pintarDestaque('marca-hover', null);
  } else if (inspetor.selecionado && inspetor.selecionado.ownerDocument === tela.contentDocument) {
    pintarDestaque('marca-sel', inspetor.selecionado);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && inspetor.ligado) {
    inspetor.selecionado = null;
    inspetor.ancora = null;
    desenhar(null);
    pintarDestaque('marca-sel', null);
      if (typeof aoSelecionar === 'function') aoSelecionar(null);
  }
});

/* O que faltava: sem esta chamada o botão de limpar e o copiar-ao-clicar
   existiam no markup e no CSS, e não respondiam a nada. */
ligarCopia();
