# Xhopii — LP2 Atividade Prática 04 (API + MongoDB)

Loja virtual em Node.js + Express seguindo o padrão MVC, com API RESTful,
MongoDB/Mongoose, views em EJS e autenticação por JWT.

## Integrantes

| Nome | RA |
| ---- | -- |
| Daniel Andreassi Lopes | 262319500 |
| Gustavo da Costa e Silva | 282319896 |
| Henrique Santoni Corazza | 262310252 |

## Tecnologias

Node.js, Express, MongoDB, Mongoose, EJS, JSON Web Token, bcryptjs,
cookie-parser, multer, Helmet, compression, dotenv.

## Como executar

```bash
npm install
cp envExample.txt .env      # e preencha os valores
node seed.js                # popula o banco (APAGA as coleções antes)
npm start                   # sobe em http://localhost:8080
```

### Variáveis de ambiente

| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta do servidor Express |
| `MONGODB_URI` | String de conexão do MongoDB |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT |

### Usuários criados pela seed

| Tipo | E-mail | Senha |
| ---- | ------ | ----- |
| Funcionário (admin) | `admin@xhopii.com` | `admin123` |
| Funcionário | `mariana@xhopii.com` | `senha123` |
| Cliente | `joana@email.com` | `cliente123` |

São credenciais de desenvolvimento em banco local. Troque antes de publicar
o repositório.

## Autenticação e autorização

O login aceita **Cliente** e **Funcionário**: o `POST /login` procura o e-mail
primeiro na coleção de clientes e, se não encontrar, na de funcionários. O
token JWT carrega `{ id, email, nome, tipo }`, expira em 1 hora e é gravado
em um cookie `httpOnly`. A API também aceita o header
`Authorization: Bearer <token>`, o que permite testar no Postman/Insomnia.

Três middlewares em `middlewares/authMiddlewares.js`:

- `identificarUsuario` — global, apenas descobre quem está acessando e nunca
  bloqueia. É o que permite o menu mudar conforme o usuário.
- `exigirLogin` — exige qualquer usuário autenticado.
- `exigirFuncionario` — exige usuário do tipo `funcionario`.

Quando o acesso é negado, rotas `/api` respondem `401`/`403` em JSON e as
telas redirecionam para `/login`.

Senhas são gravadas com hash bcrypt (`pre("save")` do schema e também no
`update()` do model, já que `findByIdAndUpdate` não dispara o hook) e nunca
retornam nas consultas (`select: false`).

## Foto de perfil

Cliente e Funcionário aceitam uma imagem no cadastro. O arquivo **é gravado
dentro do MongoDB**, no próprio documento:

```js
foto: { data: Buffer, contentType: String }
```

O upload usa `multer` com `memoryStorage`, então o arquivo vai do formulário
direto para o banco, sem passar por disco. Limite de 2 MB, apenas
`png`, `jpeg`, `webp` e `gif`.

As listagens não carregam o binário — `findAll()` e `findById()` aplicam a
projeção `-foto.data` e trazem só o `contentType`, o que já basta para a view
saber se existe foto. A imagem é servida sob demanda por rotas próprias:

| Rota | Retorno |
| ---- | ------- |
| `GET /clientes/:id/foto` | a imagem, com o `Content-Type` original |
| `GET /funcionarios/:id/foto` | idem |

Ambas exigem funcionário autenticado, como as telas que as consomem. Quem não
tem foto cadastrada cai no placeholder da view.

Os formulários enviam `multipart/form-data`; `ehFormulario()` reconhece esse
tipo além do `x-www-form-urlencoded`.

## Rotas

As rotas REST usam o prefixo `/api` para não colidir com as rotas de tela —
sem ele, `GET /clientes/cadastrar` seria capturado por `GET /clientes/:id`.

### Telas (EJS)

| Método | Rota | Acesso |
| ------ | ---- | ------ |
| GET | `/` | público — redireciona para a vitrine |
| GET | `/ver-produto` | público — vitrine da loja |
| GET | `/login` | público |
| POST | `/login` | público |
| GET | `/logout` | público |
| GET | `/recuperar-senha` | público (tela estática) |
| GET | `/clientes/cadastrar` | público |
| GET | `/clientes/visualizar` | funcionário |
| GET | `/clientes/:id/foto` | funcionário |
| GET | `/funcionario/cadastrar` | funcionário |
| GET | `/funcionarios/visualizar` | funcionário |
| GET | `/funcionarios/:id/foto` | funcionário |
| GET | `/produto/cadastrar` | funcionário |
| GET | `/produtos/visualizar` | autenticado |

### API REST

| Recurso | Leitura | Escrita |
| ------- | ------- | ------- |
| `/api/clientes` | funcionário | `POST` público (cadastro da loja); `PUT`/`DELETE` funcionário |
| `/api/funcionarios` | funcionário | funcionário |
| `/api/produtos` | autenticado | funcionário |
| `/api/categorias` | autenticado | funcionário |

Todos os recursos expõem os cinco verbos:

```text
GET    /api/<recurso>
GET    /api/<recurso>/:id
POST   /api/<recurso>
PUT    /api/<recurso>/:id
DELETE /api/<recurso>/:id
```

Os formulários HTML enviam para as mesmas rotas `/api`. O Controller detecta
o `Content-Type: application/x-www-form-urlencoded` e, nesse caso,
redireciona ou renderiza a tela com a mensagem de erro em vez de responder
JSON.

## Estrutura

```text
config/         conexão com o MongoDB
controllers/    Auth, Cliente, Funcionario, Produto, Categoria
middlewares/    middlewares gerais e os de autenticação
models/         <Recurso>Schema.js (Mongoose) + <Recurso>.js (classe)
routes/
  web/          rotas que renderizam telas
  rest/         rotas da API, prefixadas com /api
  index.js      registro central dos routers
views/
  partials/     menu compartilhado, dinâmico por tipo de usuário
utils/          pathUtils e helpers de request
seed.js         popula o banco com dados de demonstração
```

## Quarto recurso

**Categoria** — CRUD RESTful completo em `/api/categorias`, sem tela própria,
já que a atividade exige visualização em EJS apenas de Cliente, Funcionário
e Produto.
