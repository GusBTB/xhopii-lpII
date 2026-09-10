# Pessoa 1 — Base do projeto, Cliente e integração

## Papel da Pessoa 1

A Pessoa 1 será responsável por criar a fundação que desbloqueia os outros dois integrantes, implementar o módulo de Cliente e atuar como integrador dos arquivos mais compartilhados.

Responsabilidades principais:

```text
1. Base Node/Express/Mongo/EJS
2. CRUD completo de Cliente
3. EJS de Cliente
4. Método Cliente.findByEmail para desbloquear Auth
5. Consolidação de routes.js
6. Consolidação de server.js/middlewares/package.json
7. Correção final dos menus/links compartilhados
8. Integração final das branches
```

---

## P1.0 — Participar do contrato inicial

Dependência: nenhuma.

Fazer junto com Pessoas 2 e 3:

- confirmar campos de Cliente, Funcionário, Produto e Categoria;
- confirmar rotas REST e WEB;
- confirmar que login será feito usando `Cliente.email` + `Cliente.senha`;
- confirmar que o quarto recurso será Categoria;
- definir nomes de branches/commits se estiverem usando Git.

Resultado necessário para avançar:

```text
Todos programam usando os mesmos nomes.
```

---

## P1.1 — Criar a base executável do projeto

Dependência: P1.0.

Prioridade: **máxima**. Este passo deve ser feito e compartilhado cedo para liberar P2 e P3.

Usar o `exemplo-api-mongodb` como referência direta.

Criar/copiar e adaptar:

```text
config/db.js
middlewares/middlewares.js
routes/routes.js
utils/pathUtils.js
server.js
package.json
```

Copiar a pasta do frontend-base:

```text
assets/
views/
```

Configurar no `server.js`:

```text
dotenv.config()
Database.connect()
app.set("views", ...)
app.set("view engine", "ejs")
app.use(staticMiddleware)
app.use(urlencodedMiddleware)
app.use(jsonMiddleware)
app.use(securityMiddleware)
app.use(compressionMiddlewware)
app.use(router)
app.listen(...)
```

Não criar Service/Repository. Manter o formato de classes e métodos `static` usado pelo professor.

### Variáveis de ambiente

Criar `.env` local:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/xhopii
JWT_SECRET=trocar_por_um_segredo_local
```

Não versionar segredo real.

### Dependências npm

Começar pelas dependências do exemplo e adicionar as necessárias para JWT:

```text
jsonwebtoken
cookie-parser
```

### Teste de aceite de P1.1

```text
[ ] npm install funciona
[ ] npm run dev/start inicia
[ ] MongoDB conecta
[ ] GET /login abre login.html
[ ] CSS e imagens aparecem
```

### ENTREGA/DEPENDÊNCIA GERADA

Quando P1.1 estiver funcionando, publicar imediatamente para P2 e P3.

Isso desbloqueia:

```text
P2.1 — Funcionário
P3.1 — Produto
P3.4 — Categoria
```

---

## P1.2 — Implementar ClienteSchema.js

Dependência: P1.1.

Arquivo:

```text
models/ClienteSchema.js
```

Campos combinados:

```text
nome
sobrenome
cpf
dataNascimento
telefone
email
senha
foto (opcional)
```

Seguir o formato do `CarroSchema.js`:

```text
new mongoose.Schema({...}, { timestamps: true })
mongoose.model('Cliente', ClienteSchema)
export default ClienteModel
```

Marcar no mínimo:

```text
cpf -> required + unique
email -> required + unique
senha -> required
```

Não implementar regra de negócio complexa dentro do Schema.

---

## P1.3 — Implementar Cliente.js

Dependência: P1.2.

Arquivo:

```text
models/Cliente.js
```

Seguir o padrão de `Carro.js`.

Métodos necessários:

```text
constructor(...)
async save()
static async findAll()
static async findById(id)
static async findByCpf(cpf)
static async findByEmail(email)   <-- IMPORTANTE PARA PESSOA 2
static async update(id, dados)
static async delete(id)
```

Para manter simples, `update` pode encapsular:

```text
ClienteModel.findByIdAndUpdate(id, dados, { new: true })
```

### ENTREGA/DEPENDÊNCIA GERADA

Assim que `Cliente.findByEmail(email)` estiver funcionando, avisar P2.

Isso desbloqueia:

```text
P2.5 — Finalização do AuthController/Login/JWT
```

Não é necessário esperar todo o módulo Cliente terminar para liberar esse método.

---

## P1.4 — Implementar ClienteController.js

Dependência: P1.3.

Arquivo:

```text
controllers/ClienteController.js
```

Métodos REST:

```text
getAllClientes(req, res)
getClienteById(req, res)
createCliente(req, res)
updateCliente(req, res)
deleteCliente(req, res)
```

Métodos WEB:

```text
renderCreateCliente(req, res)
renderAllClientes(req, res)
```

Manter o estilo do exemplo:

```text
try/catch
console.error(...)
res.status(...).json(...)
res.sendFile(...)
res.render(...)
```

### Comportamento esperado

`createCliente`:

```text
1. ler req.body
2. verificar CPF/e-mail duplicado
3. new Cliente(...)
4. save()
5. retornar 201
```

`getClienteById`:

```text
1. req.params.id
2. Cliente.findById(id)
3. 404 se não existir
4. JSON se existir
```

`updateCliente`:

```text
1. req.params.id
2. Cliente.update(id, req.body)
3. 404 se não existir
4. retornar objeto atualizado
```

`deleteCliente`:

```text
1. req.params.id
2. Cliente.delete(id)
3. 404 se não existir
4. retornar mensagem simples
```

---

## P1.5 — Adaptar cadastro e visualização de Cliente

Dependência: P1.4.

### Cadastro

Arquivo existente:

```text
views/cadastrar-cliente.html
```

O formulário já está perto do necessário:

```html
<form method="POST" action="/clientes">
```

Conferir os `name`:

```text
nome
sobrenome
cpf
dataNascimento
telefone
email
senha
```

O `inputFoto` pode permanecer visualmente, mas upload real de arquivo não faz parte do escopo obrigatório. Não adicionar Multer antes do restante do projeto funcionar.

### Visualização

Arquivo existente:

```text
views/visualizar-cliente.ejs
```

Ele já usa:

```ejs
<% clientes.forEach(cliente => { %>
```

Conferir se os campos mostrados coincidem com o Schema.

O Controller deve fazer:

```text
const clientes = await Cliente.findAll()
res.render('visualizar-cliente', { clientes: clientes })
```

---

## P1.6 — Preparar suas rotas de Cliente

Dependência: P1.4 e P1.5.

Como `routes/routes.js` é arquivo compartilhado, a Pessoa 1 é o integrador oficial dele.

Adicionar:

```text
GET    /clientes
GET    /clientes/:id
POST   /clientes
PUT    /clientes/:id
DELETE /clientes/:id

GET /clientes/cadastrar
GET /clientes/visualizar
```

Cuidado com a ordem das rotas. Rotas fixas de tela podem ser registradas antes de rotas dinâmicas `/:id` quando houver risco de colisão.

---

## P1.7 — Testar Cliente isoladamente

Dependência: P1.6.

Executar:

```text
POST /clientes
GET /clientes
GET /clientes/:id
PUT /clientes/:id
DELETE /clientes/:id
GET /clientes/cadastrar
GET /clientes/visualizar
```

Também testar:

```text
CPF repetido
e-mail repetido
ID inexistente
```

Resultado de P1.7:

```text
Módulo Cliente está pronto e Auth já possui findByEmail.
```

---

## P1.8 — Receber os blocos de P2 e P3 e integrar routes.js

Dependências:

```text
P2.4 — Funcionário pronto
P2.6 — Auth/JWT pronto
P3.3 — Produto pronto
P3.6 — Categoria pronta
```

P2 e P3 não precisam editar simultaneamente o mesmo `routes.js` final. Eles devem informar à Pessoa 1:

```text
imports necessários
rotas necessárias
middlewares que precisam ser aplicados
```

Pessoa 1 consolida tudo no único `routes/routes.js`, mantendo o estilo do exemplo do professor.

Estrutura lógica final:

```text
// Auth / páginas públicas

// Cliente API
// Funcionário API
// Produto API
// Categoria API

// Rotas de render Cliente
// Rotas de render Funcionário
// Rotas de render Produto
// Home
```

Evitar criar múltiplos routers só para fugir de conflito de merge, pois o exemplo do professor usa um arquivo de rotas simples.

---

## P1.9 — Integrar middlewares/package/server enviados por P2

Dependência: P2.6.

P2 fornecerá a implementação JWT. P1 garante que o projeto final tenha:

```text
import cookieParser from 'cookie-parser'
app.use(cookieParser())
```

ou a organização equivalente definida pelo grupo.

Também conferir:

```text
JWT_SECRET vem do .env
jsonwebtoken está no package.json
middleware JWT é exportado/importado corretamente
```

---

## P1.10 — Corrigir menus e rotas quebradas em todas as páginas

Dependência: P1.8 e P1.9.

Este é um passo final de integração porque várias telas repetem o mesmo menu.

Padronizar:

```text
Home                -> /
Cadastro Cliente    -> /clientes/cadastrar
Cadastro Funcionário-> /funcionario/cadastrar
Cadastro Produto    -> /produto/cadastrar
Ver Clientes        -> /clientes/visualizar
Ver Funcionários    -> /funcionarios/visualizar
Ver Produtos        -> /produtos/visualizar
Sair                -> /logout
```

Também remover/corrigir links relativos problemáticos do frontend-base:

```text
login.html
ver-produto.html
../img/...
```

Quando o Express serve `assets` na raiz, imagens devem preferir:

```text
/img/arquivo.png
```

---

## P1.11 — Merge final e teste conjunto

Dependências: todos os módulos entregues.

Depois de consolidar:

1. instalar dependências do zero;
2. subir MongoDB;
3. subir aplicação;
4. pedir P2 para testar Auth e Funcionário;
5. pedir P3 para testar Produto e Categoria;
6. testar Cliente novamente;
7. executar o fluxo completo pelo navegador.

Não aceitar "na minha branch funcionava" como teste final.

---

## Checklist da Pessoa 1

```text
[ ] Contrato inicial fechado
[ ] Base publicada cedo
[ ] MongoDB conectado
[ ] EJS configurado
[ ] Assets funcionando
[ ] ClienteSchema.js
[ ] Cliente.js
[ ] Cliente.findByEmail(email)
[ ] ClienteController.js
[ ] CRUD Cliente completo
[ ] cadastrar-cliente.html integrado
[ ] visualizar-cliente.ejs integrado
[ ] Rotas Cliente
[ ] Rotas P2 integradas
[ ] Rotas P3 integradas
[ ] JWT/middlewares integrados
[ ] Menus/links corrigidos
[ ] Teste final após merge
```
