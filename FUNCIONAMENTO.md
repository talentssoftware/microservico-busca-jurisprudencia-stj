# Funcionamento

[![wakatime](https://wakatime.com/badge/user/d38eb168-6d29-49d2-bed8-f1f729c66217/project/018d7b19-ecaf-4ab6-927c-f71d947f75d1.svg)](https://wakatime.com/@gabrielmoura/projects/oqioccgctz?start=2024-02-03&end=2024-04-14)


## Padrão
- É incluída na fila uma requisição de busca por meio de uma requisição POST para o endpoint **"/jstj"**.
- O serviço de busca de jurisprudência do STJ é acionado a cada 10 minutos por um CRON.
- O resultado da busca é salvo no banco de dados.

## Ao vivo
- O serviço de busca de jurisprudência do STJ é acionado através de uma requisição diretamente ao endpoint **"/jstj/live/:code"**.
- O resultado da busca é retornado sem ser salvo no banco de dados.

## Diagrama do banco de dados
![](Diagram.png)

## Swagger

Pode ser acessado ao executar a aplicação em desenvolvimento no endereço http://localhost:3000/doc.

## Nomenclaturas
- **JSTJ**: Jurisprudência do Superior Tribunal de Justiça
- **STJ**: Superior Tribunal de Justiça