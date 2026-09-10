# Pessoa 3 — Produto, EJS de Produto e quarto recurso Categoria

## Papel da Pessoa 3

A Pessoa 3 será responsável por:

```text
1. CRUD completo de Produto
2. Visualização de Produto via EJS usando o layout fornecido
3. CRUD completo do quarto recurso: Categoria
4. Testes REST de Produto e Categoria
```

Produto e Categoria podem ser construídos quase totalmente em paralelo com Cliente e Funcionário após a Pessoa 1 publicar a base do projeto.

---

## P3.0 — Participar do contrato inicial

Dependência: nenhuma.

Confirmar com o grupo:

- campos de Produto;
- campos de Categoria;
- rotas REST;
- rotas WEB;
- Categoria será independente na versão obrigatória;
- Produto não dependerá de Categoria para ser salvo.

Essa decisão é importante porque mantém o desenvolvimento realmente paralelo.

---

## P3.1 — Atualizar a base publicada pela Pessoa 1

Dependência: P1.1.

Assim que P1 publicar a base:

```text
1. atualizar branch
2. npm install
3. configurar .env local
4. iniciar aplicação
5. confirmar MongoDB
```

---

# BLOCO PRODUTO

## P3.2 — Implementar ProdutoSchema.js

Dependência: P3.1.

Arquivo:

```text
models/ProdutoSchema.js
```

Campos:

```text
nome: String, required
fabricante: String
descricao: String
valor: Number, required
quantidade: Number, required
foto: String, opcional
```

Usar:

```text
timestamps: true
```

Não implementar upload de arquivo nessa etapa. O input de foto existe no frontend, mas isso exigiria Multer e não é requisito do enunciado.

---

## P3.3 — Implementar Produto.js

Dependência: P3.2.

Arquivo:

```text
models/Produto.js
```

Métodos:

```text
constructor(...)
async save()
static async findAll()
static async findById(id)
static async findByNome(nome)   // útil para evitar duplicidade, se desejado
static async update(id, dados)
static async delete(id)
```

Seguir exatamente a ideia de `Carro.js`: classe simples que encapsula chamadas do Mongoose.

---

## P3.4 — Implementar ProdutoController.js

Dependência: P3.3.

Arquivo:

```text
controllers/ProdutoController.js
```

Métodos REST:

```text
getAllProdutos(req, res)
getProdutoById(req, res)
createProduto(req, res)
updateProduto(req, res)
deleteProduto(req, res)
```

Métodos WEB:

```text
renderCreateProduto(req, res)
renderAllProdutos(req, res)
```

Conversões simples no cadastro, se necessário:

```text
valor -> Number
quantidade -> Number
```

Não criar validação excessivamente complexa; apenas impedir dados claramente inválidos, conforme nível da disciplina.

---

## P3.5 — Corrigir cadastrar-produto.html

Dependência: P3.4.

O formulário original tem:

```html
<form method="POST" action="">
```

Alterar para:

```html
<form method="POST" action="/produtos">
```

O HTML-base usa:

```text
inputNomeProd
inputFabricanteProd
inputDescricaoProd
inputValorProd
inputQtdProd
```

Para simplificar o Controller, é recomendado trocar os `name` para:

```text
nome
fabricante
descricao
valor
quantidade
```

O campo `inputFoto` pode ficar sem processamento real na versão obrigatória.

---

## P3.6 — Criar visualizar-produto.ejs

Dependência: P3.4.

Usar como base visual:

```text
views/ver-produto.html
```

Esse arquivo já contém os cards com:

```text
imagem
nome
fabricante
descrição
valor
quantidade disponível
```

O problema é que todos estão estáticos e repetidos.

Criar:

```text
views/visualizar-produto.ejs
```

Manter uma única estrutura de card dentro do loop:

```ejs
<% produtos.forEach(produto => { %>
    <section class="ver-produto-item-grid">
        ...
        <p id="nome-produto"><%= produto.nome %></p>
        <p id="info-produto"><%= produto.fabricante %></p>
        <p id="info-produto"><%= produto.descricao %></p>
        <p id="valor">R$ <%= produto.valor %></p>
        <p id="disponiveis"><%= produto.quantidade %> disponíveis</p>
    </section>
<% }); %>
```

Para a imagem, enquanto upload não for implementado, usar uma imagem já existente como fallback, por exemplo:

```text
/img/produto1.png
```

Se `foto` for apenas uma string opcional, usar o valor quando estiver preenchido e fallback quando não estiver.

O Controller deve fazer:

```text
const produtos = await Produto.findAll()
res.render('visualizar-produto', { produtos: produtos })
```

### Dependência gerada

Quando Produto + EJS estiverem prontos, avisar P1 para integrar:

```text
Ver Produtos -> /produtos/visualizar
```

---

## P3.7 — Preparar bloco de rotas de Produto

Dependência: P3.4, P3.5 e P3.6.

Entregar para P1:

```text
GET    /produtos
GET    /produtos/:id
POST   /produtos
PUT    /produtos/:id
DELETE /produtos/:id

GET /produto/cadastrar
GET /produtos/visualizar
```

E import:

```text
ProdutoController
```

---

## P3.8 — Testar Produto

Dependência: P3.7 integrado localmente/temporariamente.

Testar:

```text
POST /produtos
GET /produtos
GET /produtos/:id
PUT /produtos/:id
DELETE /produtos/:id
GET /produto/cadastrar
GET /produtos/visualizar
```

Confirmar que a listagem EJS exibe exatamente os registros inseridos no MongoDB.

---

# BLOCO CATEGORIA — quarto recurso obrigatório

## P3.9 — Implementar CategoriaSchema.js

Dependência: P3.1.

Este trabalho pode começar até antes de Produto estar 100% pronto.

Arquivo:

```text
models/CategoriaSchema.js
```

Campos simples:

```text
nome: String, required + unique
descricao: String
```

Usar `timestamps: true`.

Categoria não precisa se relacionar com Produto na versão obrigatória.

---

## P3.10 — Implementar Categoria.js

Dependência: P3.9.

Arquivo:

```text
models/Categoria.js
```

Métodos:

```text
constructor(nome, descricao)
async save()
static async findAll()
static async findById(id)
static async findByNome(nome)
static async update(id, dados)
static async delete(id)
```

Mesmo padrão de `Carro.js`.

---

## P3.11 — Implementar CategoriaController.js

Dependência: P3.10.

Arquivo:

```text
controllers/CategoriaController.js
```

Como EJS não é obrigatório para o quarto recurso, implementar apenas REST:

```text
getAllCategorias(req, res)
getCategoriaById(req, res)
createCategoria(req, res)
updateCategoria(req, res)
deleteCategoria(req, res)
```

`createCategoria` pode verificar `findByNome(nome)` para impedir nomes duplicados.

---

## P3.12 — Preparar bloco de rotas de Categoria

Dependência: P3.11.

Entregar para P1:

```text
GET    /categorias
GET    /categorias/:id
POST   /categorias
PUT    /categorias/:id
DELETE /categorias/:id
```

E import:

```text
CategoriaController
```

---

## P3.13 — Testar Categoria

Dependência: P3.12 integrado localmente/temporariamente.

Testar:

```text
POST /categorias
GET /categorias
GET /categorias/:id
PUT /categorias/:id
DELETE /categorias/:id
```

Também:

```text
nome duplicado
ID inexistente
```

---

# BLOCO OPCIONAL — somente depois do obrigatório

## P3.14 — Relacionar Categoria a Produto

Dependência:

```text
Produto pronto
Categoria pronta
Todos os requisitos obrigatórios funcionando
```

Somente se sobrar tempo.

Possibilidade simples:

```text
Produto.categoria = String
```

ou uma referência Mongoose.

Mas não fazer isso antes da versão obrigatória porque cria dependência entre dois CRUDs que inicialmente podem ser totalmente independentes.

---

## P3.15 — Entregar tudo para integração da Pessoa 1

Dependências: P3.8 e P3.13.

Entregar:

```text
ProdutoSchema.js
Produto.js
ProdutoController.js
cadastrar-produto.html
visualizar-produto.ejs
CategoriaSchema.js
Categoria.js
CategoriaController.js
bloco de rotas/imports
```

Evitar alterar `routes.js`, `server.js` e menus globais na mesma hora em que P1 estiver consolidando. Isso reduz conflitos.

---

## P3.16 — Retestar no código final

Dependência: P1 concluir integração.

No projeto já mergeado:

```text
[ ] cadastrar Produto pelo formulário
[ ] GET /produtos retorna JSON
[ ] visualizar Produtos mostra banco no EJS
[ ] PUT Produto funciona
[ ] DELETE Produto funciona
[ ] CRUD Categoria funciona
[ ] JWT, se aplicado nessas rotas, não bloqueia indevidamente usuário autenticado
```

---

## Checklist da Pessoa 3

```text
[ ] Contrato inicial fechado
[ ] Base de P1 atualizada
[ ] ProdutoSchema.js
[ ] Produto.js
[ ] ProdutoController.js
[ ] cadastrar-produto.html corrigido
[ ] visualizar-produto.ejs criado do layout existente
[ ] CRUD Produto testado
[ ] Bloco de rotas Produto entregue a P1
[ ] CategoriaSchema.js
[ ] Categoria.js
[ ] CategoriaController.js
[ ] CRUD Categoria testado
[ ] Bloco de rotas Categoria entregue a P1
[ ] Reteste Produto/Categoria após merge
[ ] Funcionalidade extra somente se obrigatório já estiver 100%
```
