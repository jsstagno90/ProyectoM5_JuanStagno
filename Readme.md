# 🤖 GitHub MCP Server

MCP Server desarrollado como Proyecto Integrador del Módulo 5 de SoyHenry.

El proyecto implementa un servidor basado en **Model Context Protocol (MCP)** que permite a clientes compatibles con MCP, como Antigravity, interactuar con GitHub mediante diferentes herramientas (tools).

La comunicación con GitHub se realiza utilizando **Octokit**, mientras que la validación de los datos de entrada se realiza mediante **Zod**.

---

## 📋 Descripción

El objetivo del proyecto es construir un MCP Server capaz de exponer operaciones de GitHub como herramientas que pueden ser utilizadas por un agente o cliente de Inteligencia Artificial.

La arquitectura principal es:

```text
🤖 Cliente MCP / Antigravity
            │
            │ MCP
            ▼
      🖥️ MCP Server
            │
            ├── Tools
            │
            ├── Schemas (Zod)
            │
            └── Handlers
                    │
                    ▼
                 Octokit
                    │
                    ▼
              GitHub API
```

El servidor permite realizar operaciones sobre repositorios, issues y commits de GitHub.

---

## 🛠️ Tecnologías utilizadas

- **TypeScript**
- **Node.js**
- **MCP SDK**
- **Octokit**
- **Zod**
- **Vitest**
- **GitHub API**
- **dotenv**

---

## 📁 Estructura del proyecto

```text
ProyectoM5_JuanStagno/
│
├── src/
│   ├── github/
│   │   └── client.ts
│   │
│   ├── schemas/
│   │   └── ...
│   │
│   ├── tools/
│   │   ├── create-repository.ts
│   │   ├── get-repository.ts
│   │   ├── list-repositories.ts
│   │   ├── create-issue.ts
│   │   ├── list-issues.ts
│   │   ├── update-issue.ts
│   │   ├── close-issue.ts
│   │   └── list-commits.ts
│   │
│   ├── tests/
│   │   ├── errors.test.ts
│   │   ├── schemas.test.ts
│   │   ├── tools.test.ts
│   │   └── ...
│   │
│   └── server.ts
│
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```

> `src` contiene el código fuente desarrollado en TypeScript.
>
> `dist` contiene el código JavaScript generado durante la compilación.

---

# 🔌 MCP Server

El servidor se crea utilizando el SDK de MCP:

```ts
const server = new McpServer({
    name: "github-ai-agent",
    version: "1.0.0",
});
```

A partir de esta instancia se registran las diferentes tools mediante `server.tool()`.

Por ejemplo:

```ts
server.tool(
    "list_commits",
    "Lista los commits más recientes de un repositorio de GitHub",
    listCommitsSchema.shape,
    async (args) => {
        // handler
    }
);
```

Cada herramienta está compuesta principalmente por:

1. Nombre.
2. Descripción.
3. Schema de entrada.
4. Handler.

---

# 🔧 Tools disponibles

El servidor implementa las siguientes herramientas:

## Repositorios

### `create_repository`

Crea un nuevo repositorio en GitHub.

### `get_repository`

Obtiene información de un repositorio.

### `list_repositories`

Lista los repositorios disponibles.

---

## Issues

### `create_issue`

Crea un nuevo issue en un repositorio.

### `list_issues`

Lista los issues de un repositorio.

### `update_issue`

Actualiza la información de un issue.

### `close_issue`

Cierra un issue.

---

## Commits

### `list_commits`

Lista los commits más recientes de un repositorio.

---

# 🧩 Schemas y validación

Los datos recibidos por las tools son validados utilizando **Zod**.

Por ejemplo:

```ts
export const createRepositorySchema = z.object({
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres")
        .regex(
            /^[a-zA-Z0-9-]+$/,
            "El nombre solo puede contener letras, números y guiones"
        ),

    description: z
        .string()
        .max(500, "La descripción no puede superar los 500 caracteres")
        .optional(),
});
```

El schema permite establecer:

- Tipos de datos.
- Campos obligatorios.
- Campos opcionales.
- Longitudes mínimas y máximas.
- Restricciones mediante expresiones regulares.

Luego el schema se utiliza al registrar la tool:

```ts
createRepositorySchema.shape
```

`shape` permite obtener la estructura de los campos definidos dentro del objeto Zod para utilizarla como esquema de entrada de la tool.

---

# 🧠 Funcionamiento de una Tool

El funcionamiento general de una herramienta es:

```text
🤖 Cliente MCP
      │
      │ Solicitud
      ▼
🔧 Tool
      │
      ▼
🧩 Schema / Zod
      │
      ├── ❌ Datos inválidos
      │
      └── ✅ Datos válidos
              │
              ▼
          Handler
              │
              ▼
           Octokit
              │
              ▼
        GitHub API
```

Por ejemplo, si el usuario solicita crear un repositorio, el cliente MCP puede seleccionar la herramienta `create_repository`.

La tool recibe los argumentos definidos por su schema.

Una vez que los datos son válidos, se ejecuta el handler.

El handler utiliza Octokit para realizar la operación correspondiente en GitHub.

---

# 🐙 GitHub y Octokit

La comunicación con GitHub se realiza mediante **Octokit**.

El cliente se configura utilizando un token almacenado en una variable de entorno:

```ts
const githubToken = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: githubToken,
});
```

Por ejemplo, para listar commits:

```ts
await octokit.rest.repos.listCommits({
    owner: args.owner,
    repo: args.repo,
    per_page: args.per_page ?? 10,
});
```

De esta manera, el handler de la tool utiliza Octokit para realizar la operación correspondiente en la API de GitHub.

---

# 🔐 Autenticación

El acceso a GitHub se realiza mediante un token almacenado en una variable de entorno.

Ejemplo:

```env
GITHUB_TOKEN=tu_token_de_github
```

El token no debe estar escrito directamente en el código fuente ni subirse al repositorio.

---

# ⚠️ Manejo de errores

Las operaciones con GitHub están protegidas mediante `try/catch`.

Cuando GitHub devuelve un error, se utiliza una función para transformar el error en un mensaje entendible:

```ts
getGithubErrorMessage(error)
```

Las tools devuelven una respuesta indicando que ocurrió un error y estableciendo:

```ts
isError: true
```

Esto permite manejar situaciones como:

- Repositorio inexistente.
- Recursos no encontrados.
- Errores de autenticación.
- Otros errores provenientes de GitHub.

Por ejemplo, un error `404` puede ser transformado en un mensaje específico para que el cliente pueda entender qué ocurrió.

---

# 🧪 Testing

El proyecto utiliza **Vitest** para realizar pruebas unitarias.

Los tests cubren tres áreas principales:

## 1. Validación de schemas

Se comprueba que:

- Los inputs válidos sean aceptados.
- Los inputs inválidos sean rechazados.

---

## 2. Lógica de las operaciones

Se prueban las diferentes tools utilizando mocks para simular las respuestas de GitHub.

Esto permite verificar:

- Que la operación sea ejecutada.
- Que Octokit reciba los argumentos correctos.
- Que la respuesta sea procesada correctamente.

---

## 3. Manejo de errores

Se comprueba que errores provenientes de GitHub sean transformados correctamente.

Por ejemplo:

```text
GitHub
   │
   ▼
404 Not Found
   │
   ▼
getGithubErrorMessage()
   │
   ▼
Mensaje de error
```

---

# 🎭 Mocks

Una característica importante de los tests es que **no realizan llamadas reales a GitHub**.

Para esto se utiliza `vi.mock()` de Vitest.

Por ejemplo:

```ts
vi.mock("../github/client.js", () => ({
    octokit: {
        rest: {
            repos: {
                listCommits: vi.fn(),
            },
        },
    },
}));
```

De esta manera, reemplazamos el cliente real de Octokit por una implementación controlada durante el test.

También podemos utilizar `vi.fn()` para crear funciones mock.

Por ejemplo:

```ts
const mockListCommits = vi.fn();
```

Luego podemos simular una respuesta:

```ts
mockListCommits.mockResolvedValue({
    data: [
        {
            sha: "123456789abcdef",
            commit: {
                author: {
                    name: "Juan",
                    date: "2026-08-13",
                },
                message: "Agrega nueva funcionalidad",
            },
        },
    ],
});
```

Así podemos probar la lógica de nuestras tools sin depender de GitHub.

---

# 🚫 ¿Por qué utilizamos mocks?

Los tests de un MCP Server no deben depender de servicios externos.

Si los tests realizaran llamadas reales a GitHub:

- dependerían de Internet;
- podrían fallar si GitHub no está disponible;
- consumirían recursos de la API;
- necesitarían autenticación real;
- podrían modificar información real;
- los resultados podrían variar.

Por eso reemplazamos Octokit mediante mocks y controlamos las respuestas desde el propio test.

---

# 📊 Ejecución de tests

Para ejecutar todos los tests:

```bash
npm run test
```

También se puede ejecutar Vitest directamente:

```bash
npx vitest run
```

Los tests de operaciones de GitHub utilizan mocks y no realizan llamadas reales a la API.

---

# 📦 Dependencias

Las principales dependencias utilizadas en el proyecto incluyen:

- `@modelcontextprotocol/sdk`
- `@octokit/rest`
- `zod`
- `vitest`
- `typescript`
- `dotenv`

Cada una cumple una función diferente dentro del proyecto.

### MCP SDK

Permite construir el MCP Server y registrar sus tools.

### Octokit

Permite comunicarse con la API de GitHub.

### Zod

Permite definir y validar los schemas de entrada.

### Vitest

Permite realizar los tests unitarios.

### TypeScript

Permite desarrollar el proyecto utilizando tipado estático.

### dotenv

Permite cargar variables de entorno desde un archivo `.env`.

---

# 🏗️ Compilación

El proyecto está desarrollado en TypeScript.

Al compilarlo, el código fuente de `src` se transforma en JavaScript y se genera la carpeta `dist`.

Conceptualmente:

```text
src/
  └── archivos .ts
          │
          │ Compilación
          ▼
dist/
  └── archivos .js
          │
          ▼
       Node.js
```

Para realizar el build:

```bash
npm run build
```

La carpeta `dist` contiene los archivos JavaScript generados a partir del código fuente.

---

# 🟢 Node.js

Node.js es el entorno de ejecución utilizado para ejecutar el código JavaScript del proyecto.

El flujo general es:

```text
TypeScript
     │
     │ Compilación
     ▼
JavaScript
     │
     ▼
Node.js
```

Node.js permite ejecutar nuestro MCP Server y utilizar las dependencias necesarias para comunicarse con GitHub.

---

# 📡 Comunicación con GitHub

La comunicación entre nuestro servidor y GitHub se realiza mediante Octokit.

Ejemplo:

```text
MCP Client
    │
    ▼
MCP Server
    │
    ▼
Tool
    │
    ▼
Handler
    │
    ▼
Octokit
    │
    ▼
GitHub API
```

La respuesta realiza el camino inverso:

```text
GitHub API
    │
    ▼
Octokit
    │
    ▼
Handler
    │
    ▼
MCP Server
    │
    ▼
MCP Client
```

---

# 🤖 Integración con clientes MCP

Un cliente compatible con MCP, como Antigravity, puede conectarse al servidor y utilizar las herramientas disponibles.

Por ejemplo, ante una solicitud como:

> "Listame los commits del repositorio."

El cliente puede seleccionar la herramienta:

```text
list_commits
```

y enviar los argumentos correspondientes.

Nuestro servidor procesa la solicitud, valida los datos, ejecuta el handler y utiliza Octokit para comunicarse con GitHub.

---

# 🔄 Flujo completo de una solicitud

Ejemplo utilizando `create_repository`:

```text
👤 Usuario
│
│ "Creá un repositorio llamado mi-proyecto"
▼
🤖 Antigravity
│
│ Selecciona create_repository
▼
🔧 create_repository
│
│ Recibe los argumentos
▼
🧩 Schema / Zod
│
│ Valida los datos
│
├── ❌ Inválidos → Error
│
└── ✅ Válidos
       │
       ▼
   ⚙️ Handler
       │
       ▼
   🐙 Octokit
       │
       ▼
   GitHub API
       │
       ▼
   📦 Respuesta
       │
       ▼
   🖥️ MCP Server
       │
       ▼
   🤖 Antigravity
```

---

# 📐 Arquitectura general

La arquitectura completa del proyecto puede representarse de la siguiente manera:

```text
                         🤖
                    Antigravity
                         │
                         │ MCP
                         ▼
              ┌─────────────────────┐
              │     MCP SERVER      │
              │                     │
              │      server.ts      │
              │                     │
              │ ┌─────────────────┐ │
              │ │      Tools      │ │
              │ └─────────────────┘ │
              │          │          │
              │          ▼          │
              │ ┌─────────────────┐ │
              │ │ Schemas / Zod   │ │
              │ └─────────────────┘ │
              │          │          │
              │          ▼          │
              │ ┌─────────────────┐ │
              │ │    Handlers     │ │
              │ └─────────────────┘ │
              └──────────┬──────────┘
                         │
                         ▼
                    🐙 Octokit
                         │
                         ▼
                   GitHub API
```

---

# 🧪 Arquitectura de testing

Los tests utilizan una arquitectura diferente para evitar llamadas reales:

```text
              🧪 Vitest
                  │
                  ▼
              MCP Tool
                  │
                  ▼
              vi.mock()
                  │
                  ▼
            Octokit Mock
                  │
                  ▼
         Respuesta controlada
```

En los tests:

```text
❌ No hacemos:

Test → Octokit real → GitHub
```

Sino:

```text
✅ Hacemos:

Test → Octokit Mock → Respuesta simulada
```

Esto permite que los tests sean rápidos, controlables y reproducibles.

---

# 🚀 Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd ProyectoM5_JuanStagno
```

Instalar las dependencias:

```bash
npm install
```

---

# 🔐 Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
GITHUB_TOKEN=tu_token_de_github
```

No subir este archivo al repositorio.

---

# ▶️ Ejecución

Una vez instaladas las dependencias y configurada la variable de entorno, ejecutar el proyecto utilizando el script correspondiente definido en `package.json`.

El MCP Server puede conectarse a un cliente compatible con MCP, como Antigravity.

---

# 📝 Proyecto Integrador

Este proyecto fue desarrollado como parte del **Proyecto Integrador del Módulo 5 de SoyHenry**.

Los principales objetivos fueron:

- Implementar un MCP Server.
- Comprender la arquitectura MCP.
- Crear y registrar tools.
- Utilizar schemas para validar entradas.
- Integrar una API externa mediante Octokit.
- Implementar manejo de errores.
- Crear tests unitarios.
- Utilizar mocks para evitar llamadas reales a GitHub.
- Comprender la comunicación entre un cliente MCP, nuestro servidor y una API externa.

---

# 👨‍💻 Autor

**Juan Stagno**

Proyecto Integrador — SoyHenry  
Módulo 5 — MCP, APIs, Tools y Testing