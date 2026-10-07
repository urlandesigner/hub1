/* Painel de estados — navega os estados do Comparador público.

   Montado a partir do `painel.js` publicado do Handoff de Checkout (o motor:
   estado na URL, recarga a cada mudança, largura em número com zoom) e do
   `palco.js` da Loja do Influencer (a chave que abre a coluna e o seletor do
   clique).

   A REGRA DESTE ARQUIVO: o painel dirige a tela pelos controles reais dela —
   digita no campo de CEP, aperta "Ver frete", aperta o botão de comprar do
   canal. Nunca pinta o DOM nem força classe. Todo estado que o painel mostra é
   um estado que uma pessoa alcança.

   UMA EXCEÇÃO, e ela é dita em voz alta no painel: ao apertar "Comprar", a tela
   mostra a cortina de saída e, 1,4 s depois, navega para o site do canal. Dentro
   do iframe isso tiraria a tela do handoff (e o site do canal recusa abrir em
   iframe). O painel segura SÓ essa última navegação; o clique, o "Abrindo…" e a
   cortina são os da tela, sem retoque.

   Cada mudança RECARREGA a tela e reaplica tudo do zero. Trocar o CEP pela
   interface passa pelo "Trocar", e a saída para o canal não tem volta: aplicar
   só a diferença deixaria estado preso. */

const tela = document.getElementById('tela');
const moldura = document.getElementById('moldura');
const aplicando = document.getElementById('aplicando');
const larguraAtual = document.getElementById('largura-atual');
const descricao = document.getElementById('estado-descricao');

/* Larguras de verdade, inclusive a de desktop — nunca `100%`, senão abrir a
   coluna do dev mode estreita o palco e a tela cai num ponto de quebra menor
   sozinha.

   O KZ declara os modos de breakpoint (Small, Medium, Large) sem número em
   `design-system/tokens.json`, então os números saem da própria tela:
   — 390 é o celular para o qual a coluna foi desenhada (ela trava em 430);
   — 720 é o `min-width` em que o "Como funciona" passa a três colunas;
   — 1224 é onde o último container fecha: o `.page` trava em 1160 e o cabeçalho
     em 1160 + 2 × 32 de respiro. Acima disso só cresce calha vazia.
   O layout de duas colunas começa em 1080; o campo de largura cobre o vão. */
const LARGURAS = { mobile: 390, tablet: 720, desktop: 1224 };

const MIN_LARGURA = 240;
const MAX_LARGURA = 3840;
const limitarLargura = (n) => Math.min(MAX_LARGURA, Math.max(MIN_LARGURA, Math.round(n)));

/* A largura digitada VENCE o preset enquanto existir, e as duas ficam
   guardadas em separado: clicar no preset volta sem precisar lembrar o número. */
function larguraEscolhida() {
  return estado.largura || LARGURAS[estado.dispositivo];
}

/* Os CEPs são os que a própria tela conhece: `CEP_MAP` no `<script>` do
   `index.html` tem 01310-100 (São Paulo) e 69900-970 (Rio Branco). Qualquer
   outro CEP de 8 dígitos cai no frete genérico, e menos de 8 é erro. */
const CEPS = {
  sp: '01310100',
  ac: '69900970',
  outro: '80010000',
  incompleto: '0131',
};

const CONTROLES = [
  {
    tipo: 'seg', id: 'dispositivo', titulo: 'Dispositivo', padrao: 'mobile',
    opcoes: [
      { v: 'mobile', r: 'Mobile' },
      { v: 'tablet', r: 'Tablet' },
      { v: 'desktop', r: 'Desktop' },
    ],
    /* largura não exige recarregar: é a moldura que muda, não a tela */
    semRecarga: true,
    livre: true,
  },
  {
    tipo: 'seg', id: 'cep', titulo: 'CEP', padrao: 'sem',
    opcoes: [
      { v: 'sem', r: 'Sem' },
      { v: 'sp', r: 'SP' },
      { v: 'ac', r: 'AC' },
      { v: 'outro', r: 'Outro' },
      { v: 'incompleto', r: 'Erro' },
    ],
    dica: 'SP (01310-100): Ybera vence com frete grátis. AC (69900-970): Shopee vence, Ybera fica com frete de R$ 34,90. Outro: qualquer CEP fora da tabela, com frete genérico. Erro: CEP com menos de 8 dígitos.',
  },
  {
    tipo: 'seg', id: 'saida', titulo: 'Saída para o canal', padrao: 'nenhuma',
    opcoes: [
      { v: 'nenhuma', r: 'Não' },
      { v: 'shopee', r: 'Shopee' },
      { v: 'tiktok', r: 'TikTok' },
      { v: 'ybera', r: 'Ybera' },
    ],
    dica: 'Aperta o "Comprar" do canal e mostra a cortina de saída. A navegação para o site do canal é a única coisa que o painel segura: dentro do handoff ela tiraria a tela daqui.',
  },
];

/* ------------------------------------------------------------------ estado */

function lerUrl() {
  const p = new URLSearchParams(location.search);
  const e = {};
  for (const c of CONTROLES) {
    const v = p.get(c.id);
    e[c.id] = c.opcoes.some((o) => o.v === v) ? v : c.padrao;
  }
  const px = parseInt(p.get('largura'), 10);
  e.largura = Number.isFinite(px) ? limitarLargura(px) : 0;
  return e;
}

let estado = lerUrl();

/* Só o que difere do padrão vai para a URL, senão ela fica ilegível. */
function escreverUrl() {
  const p = new URLSearchParams();
  for (const c of CONTROLES) if (estado[c.id] !== c.padrao) p.set(c.id, estado[c.id]);
  if (estado.largura) p.set('largura', estado.largura);
  const busca = p.toString();
  history.replaceState(null, '', busca ? '?' + busca : location.pathname);
}

/* ------------------------------------------------------------------ markup */

function montarPainel() {
  const alvo = document.getElementById('controles');
  alvo.textContent = '';

  for (const c of CONTROLES) {
    const grupo = document.createElement('div');
    grupo.className = 'grupo';

    const titulo = document.createElement('span');
    titulo.className = 'grupo__titulo';
    titulo.textContent = c.titulo;
    grupo.appendChild(titulo);

    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.setAttribute('role', 'radiogroup');
    seg.setAttribute('aria-label', c.titulo);

    for (const o of c.opcoes) {
      const label = document.createElement('label');
      label.className = 'seg__opcao';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = c.id;
      input.value = o.v;
      input.checked = estado[c.id] === o.v;
      input.addEventListener('change', () => {
        estado[c.id] = o.v;
        /* Clicar num preset é dizer "volta para este número": a largura
           digitada sai de cena, senão o clique não faria nada visível. */
        if (c.livre) {
          estado.largura = 0;
          const campo = document.getElementById('largura-livre');
          campo.value = '';
          campo.placeholder = String(LARGURAS[estado.dispositivo]);
          seg.dataset.apagado = 'false';
        }
        escreverUrl();
        c.semRecarga ? aplicarLargura() : aplicar();
      });

      const span = document.createElement('span');
      span.textContent = o.r;

      label.append(input, span);
      seg.appendChild(label);
    }
    grupo.appendChild(seg);

    if (c.livre) grupo.appendChild(campoDeLargura(seg));

    if (c.dica) {
      const dica = document.createElement('p');
      dica.className = 'grupo__dica';
      dica.textContent = c.dica;
      grupo.appendChild(dica);
    }

    alvo.appendChild(grupo);
  }

  /* Um grupo sem controle, dizendo por quê. Grupo vazio sem explicação lê como
     defeito; com a explicação, vira achado. */
  const cenario = document.createElement('div');
  cenario.className = 'grupo';
  cenario.innerHTML =
    '<span class="grupo__titulo">Cenário do conteúdo</span>'
    + '<p class="painel__aviso">Os preços, canais e selos estão fixos no <code>&lt;script&gt;</code> da tela, '
    + 'e ela não lê cenário pela URL. Por isso não há conteúdo para trocar aqui.</p>'
    + '<p class="painel__aviso">Três caminhos existem no código e nenhuma interação chega neles: '
    + 'canal <b>indisponível</b> (<code>stock: \'out\'</code>), canal que <b>não informa o frete</b> '
    + '(<code>noFrete</code>) e loja que <b>não entrega no CEP</b> (<code>noship</code>). '
    + 'Para vê-los, a tela precisa aceitar cenário.</p>';
  alvo.appendChild(cenario);
}

/* O campo da largura exata.

   `change`, e não `input`: limitar enquanto a pessoa digita transforma o "1"
   de "1366" em 240 e come o resto. Enquanto houver número digitado, o preset
   fica apagado — continua marcado, porque é para onde o clique volta. */
function campoDeLargura(seg) {
  const caixa = document.createElement('div');
  caixa.className = 'livre';

  const campo = document.createElement('input');
  campo.className = 'livre__campo';
  campo.type = 'number';
  campo.id = 'largura-livre';
  campo.min = MIN_LARGURA;
  campo.max = MAX_LARGURA;
  campo.step = 1;
  campo.placeholder = String(LARGURAS[estado.dispositivo]);
  campo.value = estado.largura || '';
  campo.setAttribute('aria-label', 'Largura exata em pixels');

  const unidade = document.createElement('span');
  unidade.className = 'livre__unidade';
  unidade.textContent = 'px';

  const aplicarCampo = () => {
    const n = parseInt(campo.value, 10);
    estado.largura = Number.isFinite(n) ? limitarLargura(n) : 0;
    campo.value = estado.largura || '';
    seg.dataset.apagado = String(Boolean(estado.largura));
    escreverUrl();
    aplicarLargura();
  };
  campo.addEventListener('change', aplicarCampo);

  const limpar = document.createElement('button');
  limpar.className = 'livre__limpar';
  limpar.type = 'button';
  limpar.textContent = 'Usar o preset';
  limpar.addEventListener('click', () => { campo.value = ''; aplicarCampo(); });
  caixa.append(campo, unidade, limpar);

  seg.dataset.apagado = String(Boolean(estado.largura));
  return caixa;
}

/* --------------------------------------------------------------- dispositivo */

/* A moldura mantém a largura escolhida e é REDUZIDA por `transform` quando não
   cabe. A tela sempre renderiza no ponto de quebra escolhido; o que encolhe é
   a imagem. */
let escala = 1;

function escalaDaTela() { return escala; }

/* O rótulo da barra sai da pastilha, não de um capitalize: as duas têm de dizer
   a mesma coisa, e quem renomear uma não pode esquecer a outra. */
function rotuloDoDispositivo() {
  const marcado = document.querySelector('input[name="dispositivo"]:checked');
  const rotulo = marcado && marcado.parentElement.querySelector('span');
  return rotulo ? rotulo.textContent : estado.dispositivo;
}

function aplicarLargura() {
  const area = document.querySelector('.palco__area');
  const caixa = document.getElementById('moldura-caixa');
  const e = getComputedStyle(area);
  const dispX = Math.max(280, area.clientWidth - parseFloat(e.paddingLeft) - parseFloat(e.paddingRight));
  const dispY = Math.max(280, area.clientHeight - parseFloat(e.paddingTop) - parseFloat(e.paddingBottom));

  const largura = larguraEscolhida();
  escala = Math.min(1, dispX / largura);

  moldura.style.width = largura + 'px';
  moldura.style.height = Math.round(dispY / escala) + 'px';
  moldura.style.transform = escala < 1 ? 'scale(' + escala + ')' : '';
  caixa.style.width = Math.round(largura * escala) + 'px';
  caixa.style.height = dispY + 'px';

  larguraAtual.textContent = largura + ' px · '
    + (estado.largura ? 'Largura digitada' : rotuloDoDispositivo())
    + (escala < 1 ? ' · ' + Math.round(escala * 100) + '%' : '');

  if (typeof inspetor === 'object' && inspetor.selecionado) {
    pintarDestaque('marca-sel', inspetor.selecionado);
  }
}

/* Um quadro de folga entre o aviso e a conta: o callback mexe no tamanho de
   elementos dentro do próprio elemento observado, e fazer isso de forma
   síncrona é o caminho para o laço. */
let medindo = false;
new ResizeObserver(() => {
  if (medindo) return;
  medindo = true;
  requestAnimationFrame(() => { medindo = false; aplicarLargura(); });
}).observe(document.querySelector('.palco__area'));

/* ------------------------------------------------- dirigir a tela de verdade */

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/* O iframe tem `src` no markup e às vezes dispara o `load` ANTES deste arquivo
   registrar o ouvinte. `readyState` sozinho não resolve: um iframe recém-criado
   começa em `about:blank`, que já é "complete". Por isso confiro também que a
   pilha de canais existe. */
function telaPronta() {
  return new Promise((resolve) => {
    const d = tela.contentDocument;
    const pronta = d
      && d.readyState === 'complete'
      && !d.location.href.startsWith('about:')
      && d.getElementById('pilha')
      && d.getElementById('pilha').children.length;
    if (pronta) resolve();
    else tela.addEventListener('load', resolve, { once: true });
  });
}

let recarga = 0;

function carregarTela() {
  return new Promise((resolve) => {
    tela.addEventListener('load', resolve, { once: true });
    /* O `_` incrementa a cada aplicação: atribuir o mesmo `src` não garante
       nova navegação. A tela não lê query string nenhuma (é regra dela, o CEP
       não pode ficar guardado), então o parâmetro não interfere. */
    tela.src = '../../index.html?_=' + (++recarga);
  });
}

/* O mesmo caminho de quem usa: digitar e apertar "Ver frete". */
function informarCep(d, cep) {
  const campo = d.getElementById('cepInput');
  const botao = d.getElementById('cepApply');
  if (!campo || !botao) return;
  campo.value = cep;
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  botao.click();
}

/* Segura só a navegação final da saída para o canal. A tela agenda
   `window.location.href = …` num `setTimeout`; este embrulho deixa passar
   qualquer outro timer (o "Abrindo…", a cortina) e descarta só o que troca a
   página. Mexe no `setTimeout` da janela da tela, não em nó nenhum dela. */
function segurarNavegacao(w) {
  const original = w.setTimeout;
  w.setTimeout = function (fn, ms, ...resto) {
    if (typeof fn === 'function' && /location\.href\s*=/.test(String(fn))) return 0;
    return original.call(w, fn, ms, ...resto);
  };
}

let aplicacao = 0;

async function aplicar() {
  const minha = ++aplicacao;
  aplicando.hidden = false;

  await carregarTela();
  if (minha !== aplicacao) return;      /* o painel mudou no meio: desiste */

  const d = tela.contentDocument;
  aplicarLargura();
  mostrarDescricao();

  /* A tela recarregou: o inspetor perde o elemento que tinha e precisa remontar
     o mapa de tokens e os ouvintes contra o documento novo, e as abas de código
     releem a lista de arquivos. */
  if (typeof ligarNaTela === 'function') ligarNaTela();
  if (typeof ligarCodigoNaTela === 'function') ligarCodigoNaTela();
  if (typeof inspetor === 'object' && inspetor.selecionado) {
    inspetor.selecionado = null;
    inspetor.ancora = null;
    desenhar(null);
    pintarDestaque('marca-sel', null);
    if (typeof aoSelecionar === 'function') aoSelecionar(null);
  }

  /* As animações de entrada da tela levam até ~0,6 s. Esperar por elas evita
     que o inspetor meça uma peça no meio do caminho. */
  await esperar(650);
  if (minha !== aplicacao) return;

  if (estado.cep !== 'sem') {
    informarCep(d, CEPS[estado.cep]);
    /* A pilha se reordena com uma animação de 420 ms, disparada depois de dois
       quadros. Com folga, para o "Aplicando…" só sumir com a pilha parada. */
    await esperar(700);
    if (minha !== aplicacao) return;
  }

  if (estado.saida !== 'nenhuma') {
    segurarNavegacao(tela.contentWindow);
    const cta = d.querySelector('.channel__cta[data-ch="' + estado.saida + '"]');
    if (cta) cta.click();
    /* A cortina entra 550 ms depois do clique. */
    await esperar(700);
    if (minha !== aplicacao) return;
  }

  aplicando.hidden = true;
}

/* ------------------------------------------------------------------ rodapé */

function mostrarDescricao() {
  const partes = [];
  const cep = CONTROLES.find((c) => c.id === 'cep').opcoes.find((o) => o.v === estado.cep);
  if (estado.cep === 'sem') partes.push('Sem CEP: a pilha ordena por preço e o frete pede o CEP.');
  else if (estado.cep === 'incompleto') partes.push('CEP com 4 dígitos: a tela mostra o erro abaixo do campo.');
  else partes.push('CEP ' + cep.r + ' informado: a pilha ordena por preço + frete.');
  if (estado.saida !== 'nenhuma') partes.push('Cortina de saída aberta.');
  descricao.textContent = partes.join(' ');
}

function ligarRodape() {
  const copiar = document.getElementById('copiar-link');
  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      copiar.dataset.feito = 'true';
      copiar.textContent = 'Link copiado';
    } catch {
      copiar.textContent = 'Copie da barra de endereço';
    }
    setTimeout(() => {
      delete copiar.dataset.feito;
      copiar.textContent = 'Copiar link deste estado';
    }, 1800);
  });

  const dev = document.getElementById('dev-mode');
  const dobrarDev = document.getElementById('dobrar-codigo');

  /* Um estado, dois controles: a chave do painel e o botão do palco mexem na
     mesma coisa. */
  const sincronizarDev = () => {
    ligarDevMode(dev.checked);
    dobrarDev.setAttribute('aria-expanded', String(dev.checked));
    dobrarDev.title = dev.checked ? 'Esconder o dev mode' : 'Mostrar o dev mode';
  };
  dev.addEventListener('change', sincronizarDev);
  dobrarDev.addEventListener('click', () => { dev.checked = !dev.checked; sincronizarDev(); });

  /* O dev mode nasce LIGADO, e esta chamada é o que faz a ferramenta concordar
     com o `checked` do HTML: sem ela, a chave aparecia ligada com a coluna
     fechada atrás. */
  sincronizarDev();

  for (const r of document.querySelectorAll('input[name="clique"]')) {
    r.addEventListener('change', () => {
      inspetor.usandoATela = r.value === 'usar';
      atualizarInspecao();
    });
  }

  const btTema = document.getElementById('tema');
  const temaAtual = () => document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro';
  const rotularTema = () => { btTema.title = temaAtual() === 'escuro' ? 'Tema claro' : 'Tema escuro'; };
  rotularTema();
  btTema.addEventListener('click', () => {
    const vaiEscurecer = temaAtual() === 'claro';
    if (vaiEscurecer) document.documentElement.dataset.tema = 'escuro';
    else delete document.documentElement.dataset.tema;
    rotularTema();
    try { localStorage.setItem('handoff-tema', vaiEscurecer ? 'escuro' : 'claro'); } catch { /* sem armazenamento */ }
  });

  const dobrarPainel = document.getElementById('dobrar-painel');
  dobrarPainel.addEventListener('click', () => {
    const lab = document.querySelector('.lab');
    const fechado = lab.dataset.painel === 'fechado';
    lab.dataset.painel = fechado ? 'aberto' : 'fechado';
    dobrarPainel.setAttribute('aria-expanded', String(fechado));
    dobrarPainel.title = fechado ? 'Esconder o painel de estados' : 'Mostrar o painel de estados';
  });

  document.getElementById('limpar').addEventListener('click', () => {
    history.replaceState(null, '', location.pathname);
    estado = lerUrl();
    montarPainel();
    aplicarLargura();
    aplicar();
  });
}

/* ------------------------------------------------------------------ início */

async function iniciar() {
  montarPainel();
  ligarRodape();
  aplicarLargura();
  await telaPronta();
  await aplicar();
}

iniciar();
