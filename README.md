<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/144166088?v=4" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">Talents Softwre</h1>
    
<p align="center">

<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
<img src="https://img.shields.io/badge/-Puppeteer-333333?style=for-the-badge&logo=puppeteer" alt="Puppeteer">
<a href="https://medium.com/@mpreziuso/password-hashing-pbkdf2-scrypt-bcrypt-and-argon2-e25aaf41598e">
<img src="https://img.shields.io/badge/-Argon2-333333?style=for-the-badge&logo=argon2" alt="Argon2"/>
</a>

</p>

## Descrição

Visa buscar jurisprudências no https://scon.stj.jus.br/SCON/ e retornar um JSON para aplicação.

## Instalação

```bash
$ pnpm install
```

## Rodando o app

```bash
# development
$ pnpm build

# production mode
$ pnpm run start:prod
```
## Rodando o app com Docker

```bash
## Test

```bash
# Local
docker build -t talentssoftware/microservico-busca-jurisprudencia-stj .
docker run -p 3000:3000 talentssoftware/microservico-busca-jurisprudencia-stj

# Remote
docker build -t talentssoftware/microservico-busca-jurisprudencia-stj .
docker run -p 3000:3000 -e PUPPETEER_MODE=remote -e PUPPETEER_ENDPOINT=http://host.docker.internal:9222 talentssoftware/microservico-busca-jurisprudencia-stj
docker run -d -p 9222:9222 --name puppeteer-chrome --cap-add=SYS_ADMIN ghcr.io/puppeteer/puppeteer:latest
``` 


## Variáveis de ambiente

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/your_db_name
BACKEND_PORT=3000 # default: 3000
JWT_SECRET='your_secret'
PUPPETEER_MODE=local # or remote. default: local
PUPPETEER_ENDPOINT=http://localhost:9222 # if PUPPETEER_MODE is remote
JWT_EXPIRES_IN=1h # or 1m, 1d, 1w, 1y. default: 1h
ARGON_SALT='your_salt'
```
Para gerar um JWT_SECRET, você pode usar o seguinte comando:

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

Para gerar um ARGON_SALT, você pode usar o seguinte comando:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

[company-logo]: https://avatars.githubusercontent.com/u/144166088?v=4
[repository-url]: https://github.com/talentssoftware/microservico-busca-jurisprudencia-stj
[author-email]: mailto:gmoura96@icloud.com
[author-github]: https://github.com/gabrielmoura
