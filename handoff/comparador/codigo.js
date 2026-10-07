/* Abas de código — os arquivos do protótipo como texto, com copiar e baixar.

   ADAPTADO para o Comparador público do HUB Inteligente, a partir da versão
   da Loja do Influencer. A tela é um arquivo só: todo o CSS mora num `<style>`
   e todo o JS num `<script>`, os dois dentro do `index.html`. Por isso a
   descoberta também lista o que está escrito DENTRO do HTML — seguindo só os
   `<link>` e `<script src>`, as abas CSS e JS nasceriam vazias.

   A seleção da peça vem do dev mode, que aqui existe.

   POR QUE ISTO EXISTE, se as outras duas ferramentas já leem a tela: porque
   elas entregam a LEITURA do código — de qual token veio o valor, qual peça é
   do design system, quais estados existem. Um dev que vai reescrever na stack
   dele quer a leitura. Um dev que vai aproveitar o markup quer o ARQUIVO. São
   dois momentos do mesmo handoff, e só o primeiro estava coberto.

   A REGRA DAQUI é a das outras: nada é escrito à mão. A lista de arquivos sai
   do <head> do próprio protótipo e das imagens que ele renderizou. Se a tela
   ganhar uma folha nova, a aba mostra ela sozinha — uma lista escrita à mão
   desatualizaria na primeira mudança, que é o erro que este pacote existe para
   não cometer. */

const codigo = {
  aba: 'inspecionar',
  /* A peça é o padrão. A tela inteira serve a quem vai aproveitar o protótipo,
     e isso é raro; quem abre as abas quase sempre está olhando uma peça. */
  escopo: 'peca',          /* 'peca' ou 'tela' — o que as abas mostram */
  arquivos: null,          /* descobertos na tela; null = ainda não leu */
  pasta: '',               /* a pasta do protótipo, p. ex. "v2/" */
  atual: {},               /* grupo → caminho em exibição */
  cache: new Map(),        /* caminho → texto, para não buscar duas vezes */
};

const GRUPOS = { html: 'html', css: 'css', js: 'js' };

/* Conta as leituras de arquivo, para descartar as que chegam fora de hora. */
let leitura = 0;

/* A raiz é a pasta do projeto: duas acima desta página, porque o projeto tem
   mais de um protótipo e cada handoff mora em `handoff/<protótipo>/`. É ela que
   define o caminho de cada arquivo dentro do .zip, e é por isso que o
   `pecas/comparador-publico/assets/` que a tela escreve continua valendo
   depois de descompactar. */
const RAIZ = new URL('../../', location.href);

function relativo(abs) {
  const u = new URL(abs);
  if (u.origin !== RAIZ.origin) return null;
  if (!u.pathname.startsWith(RAIZ.pathname)) return null;
  /* Servidor com URL limpa (o `npx serve` do launch.json deste projeto)
     redireciona `index.html` para `/`, e o caminho relativo virava "" — que o
     teste de "é de fora?" lia como falso, e o HTML da tela sumia da lista. */
  const caminho = u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname;
  return decodeURIComponent(caminho.slice(RAIZ.pathname.length));
}

/* ------------------------------------------------- descobrir os arquivos */

function descobrir(d) {
  const achados = [];
  const vistos = new Set();

  const por = (href, grupo, binario = false) => {
    if (!href) return;
    let abs;
    try { abs = new URL(href, d.baseURI).href.split('#')[0]; } catch { return; }
    const caminho = relativo(abs);
    /* Fora da pasta do projeto é rede — webfont, CDN. Não entra: não é código
       deste repositório e não se baixa junto. Aparece como nota na aba Baixar. */
    if (!caminho) { achados.push({ externo: abs, grupo }); return; }
    if (vistos.has(caminho)) return;
    vistos.add(caminho);
    achados.push({ caminho, url: abs.split('?')[0], grupo, binario });
  };

  por(d.baseURI, 'html');
  d.querySelectorAll('link[rel~="stylesheet"]').forEach((l) => por(l.getAttribute('href'), 'css'));
  d.querySelectorAll('script[src]').forEach((s) => por(s.getAttribute('src'), 'js'));

  /* O que está escrito DENTRO do HTML conta como arquivo.

     Numa tela montada sobre framework utilitário por CDN não há folha local
     para seguir: o CSS da casa está num `<style>` e a configuração num
     `<script>` sem `src`. Seguir só os `<link>` deixaria a aba CSS vazia numa
     tela que tem CSS — e o dev que recebesse o pacote não encontraria a regra
     que procura.

     Eles entram como pseudo-arquivos, com o texto já em mãos: não há o que
     buscar, o conteúdo está no nó. */
  const oHtml = achados.find((a) => a.grupo === 'html' && a.caminho);
  const dono = oHtml ? oHtml.caminho : 'index.html';
  const inline = (nos, grupo, rotulo) => {
    [...nos].forEach((no, i) => {
      const texto = no.textContent.trim();
      if (!texto) return;
      const caminho = dono + ' › ' + rotulo + (nos.length > 1 ? ' ' + (i + 1) : '');
      vistos.add(caminho);
      achados.push({ caminho, grupo, inline: true, texto, sistema: false });
    });
  };
  inline(d.querySelectorAll('style'), 'css', '<style>');
  inline(d.querySelectorAll('script:not([src])'), 'js', '<script>');
  d.querySelectorAll('img[src]').forEach((i) => por(i.getAttribute('src'), 'asset', true));

  /* O sprite de ícones entra por `<use href="sprite.svg#id">`, que não é `src`
     de nada. Sem procurar por ele o .zip saía sem ícone nenhum — e o erro é
     silencioso: a tela abre, só fica sem os desenhos. */
  d.querySelectorAll('use').forEach((u) => {
    const h = u.getAttribute('href') || u.getAttribute('xlink:href');
    if (h && !h.startsWith('#')) por(h, 'asset', true);
  });

  /* A pasta do protótipo sai do HTML dele. Ela é o que separa o que é deste
     protótipo do que vem de fora — o design system, por exemplo. Perguntar
     pela pasta é mais honesto que adivinhar pelo nome do arquivo. */
  const html = achados.find((a) => a.grupo === 'html' && a.caminho);
  codigo.pasta = html ? html.caminho.replace(/[^/]+$/, '') : '';

  for (const a of achados) {
    if (a.caminho && !a.inline) a.sistema = !a.caminho.startsWith(codigo.pasta);
  }
  return achados;
}

function ligarCodigoNaTela() {
  const d = tela.contentDocument;
  if (!d || !d.body) return;
  codigo.arquivos = descobrir(d);
  codigo.cache.clear();
  if (codigo.aba !== 'inspecionar') abrirAba(codigo.aba);
}

/* ------------------------------------------------------------- buscar */

const kb = (n) => (n < 1024 ? n + ' B' : (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' kB');

async function texto(arq) {
  /* Pseudo-arquivo não se busca: o conteúdo veio do nó. */
  if (arq.inline) return arq.texto;
  if (codigo.cache.has(arq.caminho)) return codigo.cache.get(arq.caminho);
  const r = await fetch(arq.url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
  const t = await r.text();
  codigo.cache.set(arq.caminho, t);
  return t;
}

async function bytes(arq) {
  if (arq.inline) return new TextEncoder().encode(arq.texto);
  const r = await fetch(arq.url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
  return new Uint8Array(await r.arrayBuffer());
}

/* ------------------------------------------------------------- as abas */

function abrirAba(nome) {
  codigo.aba = nome;
  document.querySelector('.lab').dataset.aba = nome;

  document.querySelectorAll('.aba').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.aba === nome));
  });
  document.querySelectorAll('.aba-conteudo').forEach((p) => {
    p.hidden = p.dataset.de !== (GRUPOS[nome] ? 'codigo' : nome);
  });


  if (GRUPOS[nome]) mostrarGrupo(nome);
  if (nome === 'baixar') montarBaixar();
}

function mostrarGrupo(grupo) {
  /* Invalida qualquer leitura de arquivo em voo. Sem isso, trocar para o modo
     peça enquanto um `fetch` de arquivo está a caminho deixava o nome certo e o
     conteúdo errado: a peça entrava na hora, e o arquivo chegava depois e
     escrevia por cima. */
  leitura++;

  const lista = document.getElementById('arquivos');
  const pre = document.getElementById('codigo-fonte');

  if (codigo.escopo === 'peca') return mostrarPeca(grupo, lista, pre);
  semConteudo(false);

  if (!codigo.arquivos) {
    lista.hidden = true;
    vazio(pre, 'Ainda lendo a tela. Se não aparecer nada, esta página precisa de um servidor: por file:// o navegador não deixa ler o que está dentro do iframe.');
    return;
  }

  const meus = codigo.arquivos.filter((a) => a.caminho && a.grupo === grupo);
  if (!meus.length) {
    lista.hidden = true;
    vazio(pre, 'A tela não carrega nenhum arquivo ' + grupo.toUpperCase() + ' deste projeto.');
    return;
  }

  const doProjeto = meus.filter((a) => !a.sistema);
  const doSistema = meus.filter((a) => a.sistema);

  /* Um arquivo só: a lista de chips não acrescenta nada, e o nome já está no
     cabeçalho. */
  lista.hidden = meus.length < 2;
  lista.innerHTML = '';
  const bloco = (titulo, itens) => {
    if (!itens.length) return;
    if (doProjeto.length && doSistema.length) {
      const h = document.createElement('p');
      h.className = 'arquivos__grupo';
      h.textContent = titulo;
      lista.append(h);
    }
    for (const a of itens) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'arquivos__item';
      b.dataset.caminho = a.caminho;
      b.textContent = a.caminho.slice(a.sistema ? 0 : codigo.pasta.length);
      lista.append(b);
    }
  };
  bloco('deste protótipo', doProjeto);
  bloco('do design system', doSistema);

  /* O primeiro da lista é o do design system, porque o <head> carrega o
     sistema antes do local. Abrir aquele por padrão daria a impressão errada
     de qual código é desta tela — então a vez é do protótipo. */
  const escolhido = meus.find((a) => a.caminho === codigo.atual[grupo])
    || doProjeto[0] || doSistema[0];
  mostrarArquivo(escolhido);
}

/* Sem nada para mostrar, some o cabeçalho e o seletor junto: nome vazio e dois
   botões desligados não informam nada, e ainda parecem defeito. Fica só a
   mensagem — com a saída para a tela inteira dentro dela, senão sem o seletor
   não haveria caminho de volta. */
function semConteudo(ligado) {
  document.querySelector('.aba-conteudo[data-de="codigo"]').dataset.semPeca = String(ligado);
}

/* No modo peça não há lista de arquivos: há a peça, e dela saem dois textos. */
function mostrarPeca(grupo, lista, pre) {
  lista.hidden = true;
  document.getElementById('codigo-aviso').hidden = true;

  const el = typeof inspetor === 'object' ? inspetor.selecionado : null;
  if (!el) {
    semConteudo(true);
    vazio(pre, 'Nenhuma peça selecionada. Clique num elemento da tela. Dá para clicar sem sair desta aba.', true);
    return;
  }
  if (grupo === 'js') {
    semConteudo(true);
    vazio(pre, 'JavaScript não é por elemento. O que move esta peça está nos arquivos da tela.', true);
    return;
  }
  semConteudo(false);

  const arqs = arquivosDaPeca(el);
  const alvo = grupo === 'html' ? arqs.html : arqs.css;

  delete pre.dataset.vazio;
  pre.textContent = alvo.texto;
  pre.scrollTop = 0;
  document.getElementById('codigo-nome').textContent = alvo.caminho;
  document.getElementById('codigo-peso').textContent =
    kb(new Blob([alvo.texto]).size) + ' · ' + alvo.texto.split('\n').length + ' linhas';
  document.getElementById('copiar-codigo').disabled = false;
  document.getElementById('baixar-codigo').disabled = false;
}

function vazio(pre, msg, comSaida = false) {
  pre.dataset.vazio = 'true';
  pre.textContent = msg;
  if (comSaida) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'botao botao--fantasma codigo__saida';
    b.id = 'ver-tela-inteira';
    b.textContent = 'Ver os arquivos da tela inteira';
    pre.append(b);
  }
  document.getElementById('codigo-nome').textContent = '—';
  document.getElementById('codigo-peso').textContent = '';
  document.getElementById('codigo-aviso').hidden = true;
  document.getElementById('copiar-codigo').disabled = true;
  document.getElementById('baixar-codigo').disabled = true;
}

async function mostrarArquivo(arq) {
  const minha = ++leitura;
  codigo.atual[arq.grupo] = arq.caminho;

  document.querySelectorAll('.arquivos__item').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.caminho === arq.caminho));
  });

  const pre = document.getElementById('codigo-fonte');
  const nome = document.getElementById('codigo-nome');
  const peso = document.getElementById('codigo-peso');
  const aviso = document.getElementById('codigo-aviso');

  nome.textContent = arq.caminho;
  peso.textContent = '';
  aviso.hidden = !arq.sistema;
  aviso.textContent = arq.sistema
    ? 'Este arquivo não é deste protótipo: vem de fora da pasta ' + codigo.pasta
      + '. Está aqui para leitura: consuma como dependência, não copie para dentro do seu código.'
    : '';

  pre.dataset.vazio = 'true';
  pre.textContent = 'lendo…';

  let t;
  try {
    t = await texto(arq);
  } catch (e) {
    if (minha !== leitura) return;
    vazio(pre, 'Não consegui ler ' + arq.caminho + ' (' + e.message + ').');
    nome.textContent = arq.caminho;
    return;
  }
  if (minha !== leitura) return;

  delete pre.dataset.vazio;
  pre.textContent = t;
  pre.scrollTop = 0;
  peso.textContent = kb(new Blob([t]).size) + ' · ' + t.split('\n').length + ' linhas';
  document.getElementById('copiar-codigo').disabled = false;
  document.getElementById('baixar-codigo').disabled = false;
}


/* ------------------------------------------- só a peça selecionada */

/* A outra metade da pergunta que as abas respondem. A tela inteira serve para
   quem vai aproveitar o protótipo; quem vai implementar UM componente quer o
   markup dele e as regras que chegam nele, sem ler 600 linhas de HTML.

   A peça vem do Inspecionar: é a mesma seleção, vista por outro ângulo. */

const VAZIAS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'source', 'track', 'wbr']);
/* Dentro destas o espaço em branco é conteúdo, então o texto sai como está. */
const CRUAS = new Set(['pre', 'textarea', 'script', 'style']);

function nomeDaTag(el) {
  /* Em SVG o `tagName` já vem com a caixa que o autor escreveu, e baixar ela
     quebra `linearGradient` e `clipPath`. Só HTML é minúsculo. */
  return el.namespaceURI === 'http://www.w3.org/2000/svg' ? el.tagName : el.tagName.toLowerCase();
}

function htmlIndentado(el, nivel = 0, saida = []) {
  const tab = '  '.repeat(nivel);
  const tag = nomeDaTag(el);
  /* Atributo de valor vazio sai sem o `=""`: é como `hidden`, `disabled` e
     `data-template` se escrevem, e é como o dev vai escrever de volta. */
  const attrs = [...el.attributes]
    .map((a) => a.value === '' ? ' ' + a.name
      : ' ' + a.name + '="' + a.value.replace(/"/g, '&quot;') + '"').join('');

  if (VAZIAS.has(tag)) { saida.push(tab + '<' + tag + attrs + '>'); return saida; }

  if (CRUAS.has(tag)) {
    saida.push(tab + '<' + tag + attrs + '>' + el.textContent + '</' + tag + '>');
    return saida;
  }

  const filhos = [...el.childNodes].filter((n) =>
    n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

  if (!filhos.length) { saida.push(tab + '<' + tag + attrs + '></' + tag + '>'); return saida; }

  if (filhos.length === 1 && filhos[0].nodeType === 3) {
    saida.push(tab + '<' + tag + attrs + '>'
      + filhos[0].textContent.trim().replace(/\s+/g, ' ') + '</' + tag + '>');
    return saida;
  }

  saida.push(tab + '<' + tag + attrs + '>');
  for (const f of filhos) {
    if (f.nodeType === 3) saida.push('  '.repeat(nivel + 1) + f.textContent.trim().replace(/\s+/g, ' '));
    else htmlIndentado(f, nivel + 1, saida);
  }
  saida.push(tab + '</' + tag + '>');
  return saida;
}

/* As regras que alcançam a peça OU qualquer coisa dentro dela.

   Por subárvore e não só pelo elemento: quem seleciona um painel quer o CSS dos
   filhos junto, senão o arquivo não serve para implementar nada. E a conta é
   uma `querySelector` por regra, não um `matches` por elemento × regra — a
   segunda forma é milhões de chamadas num protótipo normal. */
/* Na Loja havia duas folhas inline, a escrita à mão e a que o Tailwind injeta,
   e elas eram separadas contando regras (a do framework passava de 50). Aqui
   não há framework, e a única folha tem centenas de regras: a mesma conta a
   chamaria de "do Tailwind". Então o nome diz só o que ela é. Se um dia a tela
   ganhar uma segunda folha inline, elas saem numeradas. */
function nomeDaFolha(d, folha) {
  if (folha.href) return decodeURIComponent(folha.href.split('/').pop());
  const estilos = [...d.querySelectorAll('style')];
  const i = estilos.indexOf(folha.ownerNode);
  if (i < 0) return '<style> na página';
  return '<style>' + (estilos.length > 1 ? ' ' + (i + 1) : '') + ' · escrito à mão';
}

function regrasDaPeca(d, raiz) {
  const achadas = [];
  const vistas = new Set();

  const percorrer = (regras, folha, condicao) => {
    for (const r of regras) {
      if (r.conditionText != null && r.cssRules) { percorrer(r.cssRules, folha, r.conditionText); continue; }
      if (r.cssRules && r.cssRules.length && !r.selectorText) { percorrer(r.cssRules, folha, condicao); continue; }
      if (!r.selectorText || !r.style || !r.style.cssText) continue;

      for (const parte of r.selectorText.split(',')) {
        const limpo = parte.replace(PSEUDO, '').replace(ESTADO, '').trim();
        if (!limpo || limpo === '*') continue;
        let alcanca = false;
        try { alcanca = raiz.matches(limpo) || !!raiz.querySelector(limpo); } catch { alcanca = false; }
        if (alcanca) {
          const chave = (condicao || '') + '|' + r.selectorText + '|' + r.style.cssText;
          if (vistas.has(chave)) break;
          vistas.add(chave);
          achadas.push({
            seletor: r.selectorText,
            css: r.style.cssText,
            arquivo: nomeDaFolha(d, folha),
            daFolha: folha.href || '',
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

function cssDaPeca(el) {
  const d = el.ownerDocument;
  const regras = regrasDaPeca(d, el);
  const nome = nomeDaPeca(el);
  const linhas = [
    '/* CSS que alcança ' + nome + ' e o que está dentro dela.',
    '   Lido da tela, na ordem em que o navegador leu as folhas.',
    '   ' + regras.length + ' regras, todas do <style> da página.',
    '   Os var(--sp-*), var(--neutral-*) e companhia são tokens do KZ',
    '   declarados no :root da mesma folha: consuma o token, não o número. */',
    '',
  ];

  let arquivoAtual = null;
  for (const r of regras) {
    if (r.arquivo !== arquivoAtual) {
      arquivoAtual = r.arquivo;
      linhas.push('', '/* ===== ' + arquivoAtual + ' ===== */', '');
    }
    const corpo = r.css.split(';').map((x) => x.trim()).filter(Boolean)
      .map((x) => '  ' + x + ';').join('\n');
    if (r.condicao) {
      linhas.push('@media ' + r.condicao + ' {');
      linhas.push('  ' + r.seletor + ' {');
      linhas.push(corpo.split('\n').map((l) => '  ' + l).join('\n'));
      linhas.push('  }', '}');
    } else {
      linhas.push(r.seletor + ' {', corpo, '}');
    }
  }
  return linhas.join('\n');
}

function arquivosDaPeca(el) {
  const base = (nomeDaPeca(el) || 'peca').replace(/[^\w.-]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return {
    base,
    html: { caminho: base + '.html', texto: htmlIndentado(el).join('\n') },
    css: { caminho: base + '.css', texto: cssDaPeca(el) },
  };
}

/* Chamada pelo Dev mode toda vez que a seleção muda. */
function aoSelecionar(el) {
  const bloco = document.getElementById('baixar-peca');
  bloco.hidden = !el;
  if (el) {
    document.getElementById('baixar-peca-nome').textContent =
      nomeDaPeca(el) + ', ' + (el.querySelectorAll('*').length + 1) + ' elementos';
  }
  if (codigo.escopo === 'peca' && GRUPOS[codigo.aba]) mostrarGrupo(codigo.aba);
}

/* ------------------------------------------------------------- baixar */

function salvar(blob, nome) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* <zip> */
/* Escritor de .zip sem compressão (método "store").

   À mão, e de propósito: o pacote de handoff não tem dependência nenhuma, e um
   .zip sem compressão é cabeçalho mais os bytes do arquivo. Vale o custo
   porque o .zip sai com as pastas no lugar — então o `../design-system/` que o
   protótipo escreve continua valendo depois de descompactar, e quem recebe
   abre o index.html e vê a tela. */
const CRC_TABELA = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABELA[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function montarZip(entradas) {
  const cod = new TextEncoder();
  const locais = [];
  const central = [];
  let desloc = 0;

  for (const { caminho, bytes: dados } of entradas) {
    const nome = cod.encode(caminho);
    const crc = crc32(dados);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);           /* versão mínima para extrair */
    local.setUint16(6, 0x0800, true);       /* bit 11: nome em UTF-8 */
    local.setUint16(8, 0, true);            /* método 0 = store, sem compressão */
    local.setUint16(10, 0, true);           /* hora */
    local.setUint16(12, 33, true);          /* data: 1980-01-01, a mais antiga válida */
    local.setUint32(14, crc, true);
    local.setUint32(18, dados.length, true);
    local.setUint32(22, dados.length, true);
    local.setUint16(26, nome.length, true);
    local.setUint16(28, 0, true);
    locais.push(new Uint8Array(local.buffer), nome, dados);

    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true);
    c.setUint16(10, 0, true);
    c.setUint16(12, 0, true);
    c.setUint16(14, 33, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, dados.length, true);
    c.setUint32(24, dados.length, true);
    c.setUint16(28, nome.length, true);
    c.setUint16(30, 0, true);               /* extra */
    c.setUint16(32, 0, true);               /* comentário */
    c.setUint16(34, 0, true);               /* disco */
    c.setUint16(36, 0, true);               /* atributos internos */
    c.setUint32(38, 0, true);               /* atributos externos */
    c.setUint32(42, desloc, true);          /* onde começa o cabeçalho local */
    central.push(new Uint8Array(c.buffer), nome);

    desloc += 30 + nome.length + dados.length;
  }

  const tamCentral = central.reduce((s, p) => s + p.length, 0);
  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 0x06054b50, true);
  fim.setUint16(8, entradas.length, true);
  fim.setUint16(10, entradas.length, true);
  fim.setUint32(12, tamCentral, true);
  fim.setUint32(16, desloc, true);

  return new Blob([...locais, ...central, new Uint8Array(fim.buffer)], { type: 'application/zip' });
}
/* </zip> */

function montarBaixar() {
  const lista = document.getElementById('baixar-lista');
  const nota = document.getElementById('baixar-nota');
  lista.innerHTML = '';

  const meus = (codigo.arquivos || []).filter((a) => a.caminho);
  for (const a of meus) {
    const li = document.createElement('li');
    li.className = 'baixar__linha';
    li.innerHTML =
      '<span class="baixar__caminho"></span>'
      + '<span class="baixar__selo" data-de="' + (a.sistema ? 'sistema' : 'projeto') + '">'
      + (a.sistema ? 'do sistema' : 'do protótipo') + '</span>'
      + '<span class="baixar__peso"></span>'
      + '<button class="baixar__um" type="button">Baixar</button>';
    li.querySelector('.baixar__caminho').textContent = a.caminho;
    li.querySelector('.baixar__um').dataset.caminho = a.caminho;
    lista.append(li);
  }

  /* O peso vem de um HEAD por arquivo, depois da lista já na tela. Serve para
     decidir o que vale baixar — e um HEAD que falhe deixa a célula em branco,
     que é melhor que um número inventado. */
  for (const a of meus) {
    if (a.inline) {
      const alvo = lista.querySelector('[data-caminho="' + CSS.escape(a.caminho) + '"]');
      if (alvo) alvo.closest('.baixar__linha').querySelector('.baixar__peso').textContent = kb(new Blob([a.texto]).size);
      continue;
    }
    fetch(a.url, { method: 'HEAD' }).then((r) => {
      const n = Number(r.headers.get('content-length'));
      if (!n) return;
      const alvo = lista.querySelector('[data-caminho="' + CSS.escape(a.caminho) + '"]');
      if (alvo) alvo.closest('.baixar__linha').querySelector('.baixar__peso').textContent = kb(n);
    }).catch(() => { /* fica em branco */ });
  }

  const externos = [...new Set((codigo.arquivos || []).filter((a) => a.externo).map((a) => a.externo))];
  nota.textContent = externos.length
    ? 'Fora do .zip: ' + externos.length + ' arquivo(s) de rede: '
      + externos.map((u) => new URL(u).hostname).filter((h, i, l) => l.indexOf(h) === i).join(', ')
      + '. Não são código deste repositório, e a tela descompactada continua buscando eles online.'
    : 'Nenhum arquivo de rede: o .zip tem tudo que a tela carrega.';
}

async function baixarTudo(botao) {
  const meus = (codigo.arquivos || []).filter((a) => a.caminho);
  if (!meus.length) return;
  const antes = botao.textContent;
  botao.disabled = true;
  botao.textContent = 'Montando…';
  try {
    const entradas = [];
    for (const a of meus) {
      /* `index.html › <style>` não é nome de arquivo que sobreviva a um
         descompactar. Dentro do .zip ele vira um arquivo de verdade. */
      const caminho = a.inline
        ? a.caminho.replace(/^(.*?)\.html › <(style|script)>\s*(\d*)$/,
            (m, base, tipo, n) => base + '.inline' + (n ? '-' + n : '') + (tipo === 'style' ? '.css' : '.js'))
        : a.caminho;
      entradas.push({ caminho, bytes: await bytes(a) });
    }
    salvar(montarZip(entradas), (codigo.pasta.replace(/\/$/, '') || 'prototipo') + '-codigo.zip');
    botao.textContent = entradas.length + ' arquivos baixados';
  } catch (e) {
    botao.textContent = 'Falhou: ' + e.message;
  }
  setTimeout(() => { botao.disabled = false; botao.textContent = antes; }, 2200);
}

/* Um arquivo só, com o código em blocos — é o formato que se cola numa IA ou
   numa task sem anexo.

   Só o código DESTE protótipo entra inteiro. O design system fica de fora, por
   nome: colar o fonte dele num prompt é 500 kB pedindo para a IA reescrever o
   que já existe pronto, que é o contrário do que estas ferramentas dizem a
   página toda. Quem quiser o sistema junto baixa o .zip. Binário também fica
   de fora — não se escreve imagem dentro de um markdown. */
async function montarMarkdown() {
  const arquivos = codigo.arquivos || [];
  const meus = arquivos.filter((a) => a.caminho && !a.binario && !a.sistema);
  const doSistema = arquivos.filter((a) => a.caminho && a.sistema);
  const midia = arquivos.filter((a) => a.caminho && a.binario && !a.sistema);
  const linguagem = { html: 'html', css: 'css', js: 'js' };

  const partes = [
    '# Código do protótipo: ' + (codigo.pasta.replace(/\/$/, '') || 'protótipo'),
    '',
    'Lido da tela em ' + new Date().toLocaleString('pt-BR') + '.',
    '',
  ];

  for (const a of meus) {
    partes.push('## ' + a.caminho, '', '```' + (linguagem[a.grupo] || ''), await texto(a), '```', '');
  }

  if (doSistema.length) {
    partes.push('## Do design system: não está aqui, e é de propósito', '',
      'A tela carrega estes arquivos como dependência. Consuma o componente que já',
      'existe; não copie o fonte deles para dentro do seu código.', '');
    for (const a of doSistema) partes.push('- `' + a.caminho + '`');
    partes.push('');
  }

  if (midia.length) {
    partes.push('## Imagens', '', 'Fora deste arquivo. Estão no .zip.', '');
    for (const a of midia) partes.push('- `' + a.caminho + '`');
  }

  return partes.join('\n');
}

async function comBotao(botao, feito, trabalho) {
  const antes = botao.textContent;
  botao.disabled = true;
  botao.textContent = 'Montando…';
  try {
    await trabalho();
    botao.textContent = feito;
  } catch (e) {
    botao.textContent = 'Falhou: ' + e.message;
  }
  setTimeout(() => { botao.disabled = false; botao.textContent = antes; }, 2200);
}

/* ------------------------------------------------------------- ligar */

function ligarCodigo() {
  document.querySelectorAll('.aba').forEach((b) => {
    b.addEventListener('click', () => abrirAba(b.dataset.aba));
  });

  document.getElementById('arquivos').addEventListener('click', (e) => {
    const b = e.target.closest('.arquivos__item');
    if (!b) return;
    const arq = codigo.arquivos.find((a) => a.caminho === b.dataset.caminho);
    if (arq) mostrarArquivo(arq);
  });

  document.getElementById('copiar-codigo').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    const antes = b.textContent;
    try {
      await navigator.clipboard.writeText(document.getElementById('codigo-fonte').textContent);
      b.dataset.feito = 'true';
      b.textContent = 'Copiado';
    } catch {
      b.textContent = 'Selecione e copie';
    }
    setTimeout(() => { delete b.dataset.feito; b.textContent = antes; }, 1600);
  });

  document.getElementById('baixar-codigo').addEventListener('click', () => {
    const caminho = document.getElementById('codigo-nome').textContent;
    const t = document.getElementById('codigo-fonte').textContent;
    salvar(new Blob([t], { type: 'text/plain' }), caminho.split('/').pop());
  });

  for (const r of document.querySelectorAll('input[name="escopo"]')) {
    r.addEventListener('change', () => {
      codigo.escopo = r.value;
      if (GRUPOS[codigo.aba]) mostrarGrupo(codigo.aba);
    });
  }

  /* O botão nasce dentro da mensagem, então quem ouve é o painel. */
  document.querySelector('.aba-conteudo[data-de="codigo"]').addEventListener('click', (e) => {
    if (!e.target.closest('#ver-tela-inteira')) return;
    const r = document.querySelector('input[name="escopo"][value="tela"]');
    r.checked = true;
    r.dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.getElementById('baixar-peca-zip').addEventListener('click', (e) =>
    comBotao(e.currentTarget, 'Peça baixada', async () => {
      const el = inspetor.selecionado;
      if (!el) throw new Error('nada selecionado');
      const a = arquivosDaPeca(el);
      const cod = new TextEncoder();
      salvar(montarZip([
        { caminho: a.html.caminho, bytes: cod.encode(a.html.texto) },
        { caminho: a.css.caminho, bytes: cod.encode(a.css.texto) },
      ]), a.base + '.zip');
    }));

  document.getElementById('copiar-peca').addEventListener('click', (e) =>
    comBotao(e.currentTarget, 'Peça copiada', async () => {
      const el = inspetor.selecionado;
      if (!el) throw new Error('nada selecionado');
      const a = arquivosDaPeca(el);
      await navigator.clipboard.writeText(
        '# ' + nomeDaPeca(el) + '\n\n## ' + a.html.caminho + '\n\n```html\n' + a.html.texto
        + '\n```\n\n## ' + a.css.caminho + '\n\n```css\n' + a.css.texto + '\n```\n');
    }));

  document.getElementById('baixar-zip').addEventListener('click', (e) => baixarTudo(e.currentTarget));

  document.getElementById('baixar-md').addEventListener('click', (e) =>
    comBotao(e.currentTarget, 'Arquivo baixado', async () => {
      salvar(new Blob([await montarMarkdown()], { type: 'text/markdown' }),
        (codigo.pasta.replace(/\/$/, '') || 'prototipo') + '-codigo.md');
    }));

  document.getElementById('copiar-md').addEventListener('click', (e) =>
    comBotao(e.currentTarget, 'Código copiado', async () => {
      await navigator.clipboard.writeText(await montarMarkdown());
    }));

  document.getElementById('baixar-lista').addEventListener('click', async (e) => {
    const b = e.target.closest('.baixar__um');
    if (!b) return;
    const arq = codigo.arquivos.find((a) => a.caminho === b.dataset.caminho);
    if (!arq) return;
    const antes = b.textContent;
    b.textContent = '…';
    try {
      salvar(new Blob([await bytes(arq)]), arq.caminho.split('/').pop());
      b.textContent = 'ok';
    } catch { b.textContent = 'falhou'; }
    setTimeout(() => { b.textContent = antes; }, 1400);
  });
}

ligarCodigo();
