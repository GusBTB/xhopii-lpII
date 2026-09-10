# Pessoa 2 — Funcionário, Login e JWT

## Papel da Pessoa 2

A Pessoa 2 terá dois blocos principais:

```text
1. CRUD completo de Funcionário + EJS
2. Autenticação de Cliente com Login + JWT
```

É uma divisão proposital: o CRUD de Funcionário pode ser desenvolvido em paralelo desde cedo, enquanto o Auth tem uma dependência pequena da Pessoa 1 (`Cliente.findByEmail`).

---

## P2.0 — Participar do contrato inicial

Dependência: nenhuma.

Confirmar com o grupo:

- campos de Funcionário;
- rotas REST;
- rotas WEB;
- login por `Cliente.email` + `Cliente.senha`;
- JWT em cookie para o navegador;
- nomes dos métodos que P1 entregará em Cliente.

Contrato que P2 precisa receber de P1:

```text
Cliente.findByEmail(email)
```

---

## P2.1 — Atualizar a base publicada pela Pessoa 1

Dependência: P1.1.

Assim que P1 avisar que a base executável está pronta:

```text
1. atualizar sua branch
2. npm install
3. configurar .env local
4. confirmar que servidor inicia
5. confirmar que MongoDB conecta
```

Não continuar em uma cópia antiga da pasta, pois isso aumenta conflitos no final.

---

## P2.2 — Implementar FuncionarioSchema.js

Dependência: P2.1.

Arquivo:

```text
models/FuncionarioSchema.js
```

Campos:

```text
nome: String
sobrenome: String
cpf: String, required + unique
dataNascimento: Date
telefone: String
cargo: String
salario: Number
email: String, required + unique
senha: String, required
foto: String, opcional
```

Usar:

```text
timestamps: true
```

Seguir a mesma forma do `CarroSchema.js` do professor.

---

## P2.3 — Implementar Funcionario.js

Dependência: P2.2.

Arquivo:

```text
models/Funcionario.js
```

Métodos:

```text
constructor(...)
async save()
static async findAll()
static async findById(id)
static async findByCpf(cpf)
static async findByEmail(email)
static async update(id, dados)
static async delete(id)
```

Seguir o padrão simples:

```text
FuncionarioModel.find()
FuncionarioModel.findById(id)
FuncionarioModel.findOne(...)
FuncionarioModel.findByIdAndUpdate(...)
FuncionarioModel.findByIdAndDelete(...)
```

---

## P2.4 — Implementar FuncionarioController.js

Dependência: P2.3.

Arquivo:

```text
controllers/FuncionarioController.js
```

Métodos REST:

```text
getAllFuncionarios(req, res)
getFuncionarioById(req, res)
createFuncionario(req, res)
updateFuncionario(req, res)
deleteFuncionario(req, res)
```

Métodos WEB:

```text
renderCreateFuncionario(req, res)
renderAllFuncionarios(req, res)
```

### Atenção aos nomes do formulário-base

O HTML original usa:

```text
inputNomeFunc
inputSobrenomeFunc
inputCPFFunc
inputDataNascFunc
inputTelefoneFunc
inputCargoFunc
inputSalarioFunc
inputEmailFunc
inputSenha
```

Para simplificar o Controller, a opção recomendada é renomear os `name` do HTML para:

```text
nome
sobrenome
cpf
dataNascimento
telefone
cargo
salario
email
senha
```

Assim, `req.body` se aproxima diretamente do objeto persistido.

---

## P2.5 — Transformar visualização de Funcionário em EJS

Dependência: P2.4.

Arquivo original:

```text
views/visualizar-funcionario.html
```

Ele contém um comentário indicando onde inserir o resultado da consulta. Criar:

```text
views/visualizar-funcionario.ejs
```

Usar o `visualizar-cliente.ejs` como modelo:

```ejs
<% funcionarios.forEach(funcionario => { %>
    <section class="conteudo-bloco">
        <h2><%= funcionario.nome %> <%= funcionario.sobrenome %></h2>
        <p>CPF: <%= funcionario.cpf %></p>
        <p>Data Nascimento: <%= funcionario.dataNascimento %></p>
        <p>Telefone: <%= funcionario.telefone %></p>
        <p>Cargo: <%= funcionario.cargo %></p>
        <p>Salário: <%= funcionario.salario %></p>
        <p>E-mail: <%= funcionario.email %></p>
    </section>
<% }); %>
```

O Controller deve fazer:

```text
const funcionarios = await Funcionario.findAll()
res.render('visualizar-funcionario', { funcionarios: funcionarios })
```

Não exibir senha na tela.

---

## P2.6 — Corrigir cadastrar-funcionario.html

Dependência: P2.4.

O formulário original tem `action=""`.

Alterar para:

```html
<form method="POST" action="/funcionarios">
```

Manter o design original.

Não implementar upload real de foto antes de o obrigatório estar pronto.

---

## P2.7 — Preparar bloco de rotas de Funcionário

Dependência: P2.4, P2.5 e P2.6.

P2 não precisa ser o dono do `routes.js` final. Entregar para P1 este bloco lógico:

```text
GET    /funcionarios
GET    /funcionarios/:id
POST   /funcionarios
PUT    /funcionarios/:id
DELETE /funcionarios/:id

GET /funcionario/cadastrar
GET /funcionarios/visualizar
```

Além do import:

```text
FuncionarioController
```

### MARCO

Após isso, o CRUD de Funcionário deve estar independente do Auth e já pode ser testado.

---

## P2.8 — Testar Funcionário antes do Auth

Dependência: P2.7 integrado temporariamente/localmente.

Testar:

```text
POST /funcionarios
GET /funcionarios
GET /funcionarios/:id
PUT /funcionarios/:id
DELETE /funcionarios/:id
GET /funcionario/cadastrar
GET /funcionarios/visualizar
```

Também:

```text
CPF repetido
e-mail repetido
ID inexistente
```

---

# BLOCO AUTH — pode começar em paralelo, mas só termina após P1.3

## P2.9 — Criar esqueleto do AuthController

Dependência para começar: P2.1.

Dependência para concluir: **P1.3 — `Cliente.findByEmail(email)`**.

Arquivo:

```text
controllers/AuthController.js
```

P2 pode criar a estrutura antes de Cliente estar pronto:

```text
class AuthController {
    static async login(req, res) { ... }
    static async logout(req, res) { ... }
}
```

Import esperado depois:

```text
Cliente from '../models/Cliente.js'
jsonwebtoken
```

---

## P2.10 — Corrigir login.html

Dependência: nenhuma além da base.

O frontend original usa:

```html
<form class="form-login" method="POST" action="/clientes">
```

Isso está errado para autenticação.

Alterar para:

```html
<form class="form-login" method="POST" action="/login">
```

Inputs existentes:

```text
inputEmailLog
inputSenhaLog
```

O `AuthController` pode ler diretamente:

```text
req.body.inputEmailLog
req.body.inputSenhaLog
```

Assim não é necessário alterar o CSS nem o design.

---

## P2.11 — Finalizar Login após Cliente.findByEmail

Dependência obrigatória: P1.3.

Fluxo:

```text
1. receber email/senha
2. Cliente.findByEmail(email)
3. se não existir -> login inválido
4. comparar senha
5. jwt.sign(..., process.env.JWT_SECRET, ...)
6. salvar token em cookie
7. redirect('/')
```

Payload JWT simples:

```text
id
email
```

Expiração sugerida:

```text
1h
```

### Senha

A atividade exige Login/JWT, mas o exemplo fornecido pelo professor não mostra hashing. Para não transformar o projeto em algo muito mais complexo que o padrão de aula:

- versão mínima: comparação simples da senha cadastrada;
- se o professor já ensinou hash de senha, usar `bcryptjs` e armazenar senha hasheada.

Não adicionar uma arquitetura inteira de autenticação além do necessário.

---

## P2.12 — Implementar middleware JWT

Dependência: P2.11.

Preferência: manter no arquivo compartilhado já existente:

```text
middlewares/middlewares.js
```

P2 escreve/prototipa a função e envia para P1 integrar.

A função deve:

```text
1. procurar token
2. verificar com JWT_SECRET
3. se válido -> next()
4. se inválido -> 401 ou redirecionamento conforme rota
```

Para navegador, o token pode vir de cookie.

Opcionalmente, o mesmo middleware pode aceitar também:

```text
Authorization: Bearer <token>
```

Isso facilita testes da API via Postman.

Evitar criar refresh token, banco de sessões etc.

---

## P2.13 — Implementar logout

Dependência: P2.11.

Fluxo simples:

```text
GET /logout
  -> limpar cookie do token
  -> redirect('/login')
```

O link "Sair" das páginas será corrigido pela Pessoa 1 na integração final para apontar para `/logout`.

---

## P2.14 — Entregar bloco Auth para Pessoa 1

Dependência: P2.12 e P2.13.

Enviar para P1:

```text
AuthController.js
função middleware JWT
imports npm necessários
imports para routes.js
rotas /login e /logout
quais rotas devem usar middleware
```

Bloco lógico de rotas:

```text
GET  /login  -> render login.html
POST /login  -> AuthController.login
GET  /logout -> AuthController.logout
```

P2 e P1 devem combinar como proteger as páginas/rotas sem complicar a aplicação.

Uma solução simples é proteger pelo menos as operações administrativas de Funcionário e Produto e manter cadastro de Cliente público para que o link "Novo na Xhopii? Cadastrar" continue funcionando.

---

## P2.15 — Testar Auth no código integrado

Dependência:

```text
P1 integrou routes.js
P1 integrou middleware/package/server
P1 Cliente está no código final
```

Casos:

```text
[ ] Cliente existente + senha correta -> gera JWT e vai para /
[ ] E-mail inexistente -> não autentica
[ ] Senha errada -> não autentica
[ ] Token válido -> middleware libera
[ ] Token inválido -> middleware bloqueia
[ ] Token ausente -> middleware bloqueia onde aplicável
[ ] /logout limpa autenticação e retorna /login
```

---

## P2.16 — Consolidar README.md

Dependência: projeto funcional.

A base do frontend tem um `README.md.txt` com espaço para integrantes. Criar/renomear para:

```text
README.md
```

Preencher os três integrantes/RA, caso o trio esteja autorizado.

Adicionar instruções curtas:

```text
npm install
configurar .env
npm run dev
```

Variáveis:

```text
PORT
MONGODB_URI
JWT_SECRET
```

Listar principais rotas e tecnologias exigidas.

---

## Checklist da Pessoa 2

```text
[ ] Contrato inicial fechado
[ ] Base de P1 atualizada
[ ] FuncionarioSchema.js
[ ] Funcionario.js
[ ] FuncionarioController.js
[ ] CRUD Funcionário completo
[ ] cadastrar-funcionario.html corrigido
[ ] visualizar-funcionario.ejs criado
[ ] Bloco de rotas entregue a P1
[ ] CRUD Funcionário testado
[ ] AuthController.js
[ ] login.html com POST /login
[ ] Esperou/consumiu Cliente.findByEmail oficial de P1
[ ] JWT gerado
[ ] Middleware JWT implementado
[ ] Logout implementado
[ ] Auth entregue a P1
[ ] Auth retestado após merge
[ ] README.md consolidado
```
