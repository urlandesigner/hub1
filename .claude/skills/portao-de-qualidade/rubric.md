# Rubric — Portão de Qualidade

> Versionado junto com o processo. Cada ciclo pode adicionar itens via fase 04
> (Δrubric) — de preferência nascidos de falhas reais, não de listas imaginadas.
> Severidades: **bloqueio** (impede aprovação) · **ajuste** (corrige no editar) ·
> **nota** (registra, não trava).

## 1. Fidelidade à spec
- 1.1 [bloqueio] A peça resolve a tarefa única da spec — não uma tarefa parecida
- 1.2 [bloqueio] Nada essencial do escopo "dentro" está faltando
- 1.3 [ajuste] Nada do escopo "fora" entrou sem registro no Rastro

## 2. Design system e consistência
- 2.1 [bloqueio] Todo valor visual vem de tokens.json — zero valores inventados
- 2.2 [ajuste] Componentes existentes foram reusados antes de criar novos
- 2.3 [ajuste] Espaçamentos e hierarquia tipográfica seguem a escala do sistema
- 2.4 [ajuste] Ícones e assets de marca vêm de fonte definida no DS (biblioteca de ícones / token de asset), não de emoji ou placeholder. Placeholder sem destino de token vira pendência carimbada

## 3. Percurso e usabilidade
- 3.1 [bloqueio] O percurso completo funciona: entrada → tarefa → confirmação
- 3.2 [bloqueio] Estados cobertos: vazio, carregando, erro, sucesso
- 3.3 [ajuste] Hierarquia visual guia para a ação principal
- 3.4 [ajuste] Textos de interface são claros e no idioma correto

## 4. Acessibilidade (mínimo WCAG AA)
- 4.1 [bloqueio] Contraste de texto ≥ 4.5:1 (3:1 para texto grande)
- 4.2 [bloqueio] Alvos de toque ≥ 44×44 no mobile
- 4.3 [ajuste] Foco visível e ordem de navegação lógica

## 5. Critério de sucesso
- 5.1 [bloqueio] O critério de sucesso da spec é verificável na peça montada no
      percurso — se não dá pra checar olhando, o problema escala pra spec

## 6. Craft e direção estética
- 6.1 [ajuste] A peça cumpre a Direção Estética registrada na spec — não é só correta,
      é a aposta visual que foi decidida (personalidade, composição, uso da marca)
- 6.2 [ajuste] Acabamento à altura de produção: hierarquia editorial, respiro, e motion/
      estados de interação quando fazem sentido — não um wireframe funcional
- 6.3 [nota] Sem "genérico de IA": a peça tem intenção visível, não é o default seguro

## 7. Performance percebida (quando a spec fixa alvo de performance)
- 7.1 [ajuste] Recursos externos no caminho crítico de render (fontes, imagens hero,
      scripts) têm estratégia declarada na peça ou pendência carimbada com dono — nunca
      dependência silenciosa que estoure o alvo (ex.: LCP) só na implementação
- 7.2 [nota] Estados de carregamento espelham a anatomia do conteúdo real (evita layout
      shift no swap)

---
Changelog do rubric:
- v1 (inicial) — base do kit
- v2 (2026-07-14, ciclo comparador-publico) — +2.4 (ícones/assets de fonte definida no DS). Nasceu de falha real: emojis usados como placeholder de ícone, item não coberto pelo rubric v1.
- v3 (2026-07-14, ciclo comparador-publico) — +seção 6 (Craft e direção estética). Nasceu de falha real: comparador aprovado como correto mas genérico, sem a ambição visual de um processo com direção estética. O rubric v2 não tinha como reprovar "correto porém sem craft".
- v4 (2026-07-15, ciclo comparador-publico) — +seção 7 (Performance percebida). Nasceu de nota [fora do rubric] real: a spec fixava LCP < 2,5s mas o rubric não tinha como apontar fontes externas (Google Fonts) no caminho crítico de render; a dependência passaria silenciosa até a implementação. +7.2 [nota] consolida prática que funcionou (skeleton espelhando anatomia do card).
