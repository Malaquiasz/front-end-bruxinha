# TODO — Cadastro Rápido da home (4ª leva)

## Objetivo
Transformar o "Cadastro Rápido" de um formulário genérico em um objeto
ritual da home, com significado, acolhimento e o mesmo "scroll como
narrativa" do resto do site.

## Passos

- [x] **1. index.html** — reescrever a seção `#cadastro`:
  - Adicionar objeto simbólico (carta) com significado.
  - Refrancar intro para linguagem de ritual/acolhimento.
  - Ajustar labels/placeholders para presença.
  - Adicionar `<p id="reflexo-cadastro">` (reflexo de acolhimento).

- [x] **2. style.css** — adicionar/ajustar:
  - `.cadastro` como cartão ritual + `position: relative`.
  - Estilo do objeto `carta-cadastro` (oculto no mobile).
  - Estilo do `.reflexo-cadastro`.

- [x] **3. script.js** — adicionar o "reflexo" do cadastro:
  - Acolher pelo nome enquanto digita (≥2 letras).
  - Integrar ao handler `submit` existente.

- [x] **4. Verificação** — `node --check script.js` OK; indentação
      limpa; `#cadastro` continua no scrollspy / luz-por-capítulo.
