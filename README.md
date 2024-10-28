# MAISE - Projeto de Dissertação

## Visão Geral

Este repositório contém o código da plataforma MAISE, um projeto de Dissertação do Mestrado em Comunicação e Tecnologias Web (MCTW) da Universidade de Aveiro.
Siga os passos abaixo para testar a plataforma no seu computador.

## Passos para Testar o Projeto

1. **Acesse o Repositório**  
   Visite o repositório do projeto no GitHub através do seguinte link:  
   [MAISE Repository](https://github.com/micatalyst/Maise)

2. **Clone o Repositório**  
   Faça um fork do repositório para a sua própria conta do GitHub ou transfira manualmente todo o código para o seu computador.

3. **Instalação do Node.js**  
   Se o Node.js não estiver instalado no seu computador, será necessário instalá-lo para que possa testar a plataforma.

4. **Instale as Dependências do Projeto**

   - Abra um terminal de comandos e vá até o diretório da raiz da pasta do projeto.
   - Caso não tenha o Yarn instalado, instale-o executando o comando:
     ```bash
     npm install --global yarn
     ```
   - Em seguida, instale as dependências do front-end com o comando:
     ```bash
     yarn install
     ```
   - Para o back-end, repita o processo de instalação das dependências no diretório da pasta “backend”, que está localizada na raiz do projeto.

5. **Execute o Projeto**
   - **No Windows**: Após instalar as dependências, abra o executável “Open_MAISE.bat”. Este script é exclusivo para o Windows e irá:
     - Executar o front-end.
     - Abrir o servidor de back-end.
     - Abrir o VS Code na pasta do código.
     - Abrir o navegador padrão com o link para visualizar a plataforma.
   - **Em outros sistemas operacionais (como macOS)**: Execute os comandos a seguir nos diretórios correspondentes ao front-end e back-end:
     ```bash
     yarn run dev
     node upload-server.js
     ```

Após abrir o executável ou executar os comandos manualmente, o projeto estará pronto para ser testado. Para acessar a plataforma, basta abrir o link: [http://localhost:3000](http://localhost:3000).

## No Final

Antes de fechar os terminais após os testes, é recomendável que selecione cada um deles e pressione as teclas **Ctrl + C** para terminar os processos com segurança.
