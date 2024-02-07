Este código é um serviço em TypeScript usando o framework NestJS para fazer scraping (raspagem) de dados do site do Superior Tribunal de Justiça (STJ). Vou descrever cada parte do código:

1. **Imports**: O código importa os módulos necessários do NestJS, além do `puppeteer` e `puppeteer-extra` para manipulação e automação de páginas da web.

2. **Interface JstjData**: Define a estrutura dos dados que serão extraídos do site do STJ.

3. **Classe JstjScrapper**: Esta classe é decorada com `@Injectable()` indicando que é injetável no sistema de injeção de dependência do NestJS. Ela é responsável por realizar a raspagem dos dados do site do STJ.

    - **Método Construtor**: Recebe uma instância do `ConfigService` do NestJS, que provavelmente contém a configuração para o modo de execução do Puppeteer (local ou remoto).

    - **Método `genBrowser`**: Gera uma instância do navegador Puppeteer, configurando-o para operar de forma furtiva (para evitar detecção por mecanismos de defesa). O navegador pode ser lançado localmente ou conectado a uma instância remota, dependendo da configuração.

    - **Método `genSearch`**: Realiza uma pesquisa no site do STJ com o código fornecido como parâmetro. Ele navega para a página de pesquisa, preenche o campo de pesquisa com o código e obtém os resultados da pesquisa. Se houver mais resultados do que o número de documentos por página, a paginação é utilizada para obter todos os resultados.

    - **Métodos Privados**:
        - **`getFromPage`**: Extrai os dados de uma página de documento do STJ, como texto pré-formatado, texto parágrafo e número do processo.
        - **`getPaginated`**: Extrai os dados de todas as páginas paginadas de resultados de pesquisa.
        - **`docExtractor`**: Extrai os dados de cada documento em uma página de resultados.
        - **`checkCaptcha`**: Verifica se a página acessada exibe um captcha.
        - **`interceptRequest`**: Interrompe requisições de imagens, folhas de estilo e fontes durante a navegação.

Este serviço encapsula a lógica de raspagem de dados do site do STJ de forma modular e reutilizável, seguindo boas práticas de programação assíncrona com o NestJS e Puppeteer.

## Fluxo de execução
- **GET /live/:code** - Retorna os dados do processo com o código fornecido, não salvando no banco de dados.
- CRON Every 10 minutes - Raspagem de dados de processos com códigos fornecidos, salvando no banco de dados.
