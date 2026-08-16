# Comparador público — peça do cliente final

**Abra `hub-comparador-publico.html`.** É a peça completa e atual.

Ela é idêntica ao `index.html` da raiz do projeto, que é o arquivo que vai para produção em
`hub1-drab.vercel.app`. Os dois andam juntos: mexeu num, sincronize o outro com

```
sed 's|pecas/comparador-publico/assets/|assets/|g' index.html > pecas/comparador-publico/hub-comparador-publico.html
```

## O resto da pasta

- `componentes/` — as peças de onde esta nasceu, dos ciclos 1 e 2: card de canal, pilha,
  hero, entrada de CEP, reordenação, selo de tier. Servem de referência de como cada parte
  foi decidida. **Não são a peça atual** e algumas mostram estados que a página já superou.
- `entrega/` — carimbo demo do ciclo 1 (15/07/2026). Congelado.
- `entrega-ciclo2/` — carimbo demo do ciclo 2 (15/07/2026). Congelado.
- `assets/` — logos de canal, imagem do produto, selo Reclame Aqui.

Contrato da peça: `specs/comparador-publico.md`.
