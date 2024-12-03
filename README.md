# Sistema de Gerenciamento de Alunos com Autenticação JWT

Este projeto implementa uma API para o gerenciamento de alunos, permitindo a criação de novos alunos, a visualização de informações sobre os alunos cadastrados, a atualização e remoção de registros, além de fornecer funcionalidades como cálculo de média e verificação de aprovação. A autenticação é feita por meio de JWT (JSON Web Token).

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de APIs.
- **JWT (jsonwebtoken)**: Autenticação por meio de tokens.
- **Bcryptjs**: Criptografia de senhas.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

## Como Executar o Projeto

### Pré-requisitos

Antes de executar o projeto, verifique se você tem o Node.js e o NPM instalados no seu sistema. Caso não tenha, baixe e instale a partir do [site oficial do Node.js](https://nodejs.org/).

### Passos para rodar

1. Clone este repositório:
    ```bash
    git clone https://github.com/usuario/repositorio.git
    cd repositorio
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto e defina a chave secreta para o JWT:
    ```plaintext
    JWT_SECRET=sua-chave-secreta
    ```

4. Execute o servidor:
    ```bash
    npm start
    ```

O servidor estará rodando na porta `3000`.

## Endpoints da API

### 1. **Registro de Usuário** (Cadastro)

- **Método**: `POST`
- **Rota**: `/register`
- **Corpo da requisição**:
    ```json
    {
      "username": "nomeusuario",
      "password": "senha"
    }
    ```
- **Resposta**:
    ```json
    {
      "message": "Usuário registrado com sucesso!"
    }
    ```

### 2. **Login de Usuário**

- **Método**: `POST`
- **Rota**: `/login`
- **Corpo da requisição**:
    ```json
    {
      "username": "nomeusuario",
      "password": "senha"
    }
    ```
- **Resposta**:
    ```json
    {
      "token": "jwt-token-gerado"
    }
    ```

### 3. **Listar Todos os Alunos** (Requer autenticação)

- **Método**: `GET`
- **Rota**: `/alunos`
- **Resposta**:
    ```json
    [
      { "id": 1, "nome": "João", "ra": "12345", "nota1": 7.0, "nota2": 8.0 },
      ...
    ]
    ```

### 4. **Listar Médias dos Alunos** (Requer autenticação)

- **Método**: `GET`
- **Rota**: `/alunos/medias`
- **Resposta**:
    ```json
    [
      { "nome": "João", "media": "7.50" },
      ...
    ]
    ```

### 5. **Listar Alunos Aprovados** (Requer autenticação)

- **Método**: `GET`
- **Rota**: `/alunos/aprovados`
- **Resposta**:
    ```json
    [
      { "nome": "João", "status": "Aprovado" },
      ...
    ]
    ```

### 6. **Detalhar um Aluno** (Requer autenticação)

- **Método**: `GET`
- **Rota**: `/alunos/:id`
- **Resposta**:
    ```json
    { "id": 1, "nome": "João", "ra": "12345", "nota1": 7.0, "nota2": 8.0 }
    ```

### 7. **Cadastrar Novo Aluno** (Requer autenticação)

- **Método**: `POST`
- **Rota**: `/alunos`
- **Corpo da requisição**:
    ```json
    {
      "id": 21,
      "nome": "Carlos",
      "ra": "12346",
      "nota1": 8.0,
      "nota2": 7.5
    }
    ```
- **Resposta**:
    ```json
    {
      "message": "Aluno cadastrado com sucesso!"
    }
    ```

### 8. **Atualizar Dados de um Aluno** (Requer autenticação)

- **Método**: `PUT`
- **Rota**: `/alunos/:id`
- **Corpo da requisição**:
    ```json
    {
      "nome": "Carlos Silva",
      "nota1": 9.0
    }
    ```
- **Resposta**:
    ```json
    {
      "message": "Aluno atualizado com sucesso!"
    }
    ```

### 9. **Excluir Aluno** (Requer autenticação)

- **Método**: `DELETE`
- **Rota**: `/alunos/:id`
- **Resposta**:
    ```json
    {
      "message": "Aluno deletado com sucesso!"
    }
    ```

## Autenticação

Para acessar os endpoints que exigem autenticação, você deve incluir um **token JWT** no cabeçalho `Authorization` das requisições:

- **Formato**: `Authorization: Bearer <token>`
  
Você pode obter um token de acesso realizando o login com o endpoint `/login`.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests.

