const needle = require("needle");
const cheerio = require("cheerio");
const fs = require('fs');

const Produto = require("./produto");
const { MaxPaginas, URL, MaxTentativas } = require("./config");
const {
  salvarDadosColetadosCsv,
  salvarDadosColetadosJson,
  deletarDadosColetadosJson,
} = require("./utils");

const PRODUTOS = [];
const URLS_COM_ERRO = [];

async function main() {
  try {
    const maxPaginas = MaxPaginas || await numeroPaginas();
    console.log(maxPaginas);
    let tentativas = 0;
    let numeroPaginaComErro = 1;
    let paginaAtual = 1;
    while (paginaAtual <= (maxPaginas + URLS_COM_ERRO.length)) {
      const isPaginaComErroDetectado = paginaAtual > maxPaginas;
      const options = {
        timeout: 60000, // tempo limite de 60 segundos
      };
      await new Promise((resolve) => setTimeout(resolve, (1000 * tentativas)));
      let url;
      if (isPaginaComErroDetectado) 
        url = URLS_COM_ERRO[paginaAtual - (maxPaginas + 1)];
      else
        url = `${URL}?page=${paginaAtual}`;
      const response = await needle("get", url, options);
      const isResponseSuccessful = response.statusCode === 200;
      console.log(url);
      const $ = cheerio.load(response.body);
      
      await extrairDadosProduto($, maxPaginas, paginaAtual, numeroPaginaComErro)

      if (!isResponseSuccessful && tentativas < MaxTentativas) {
        tentativas++;
      } else {
        if (!isResponseSuccessful && isPaginaComErroDetectado) {
          console.error(
            "\x1b[31m",
            `Erro ao extrair informações na página ${paginaAtual}`,
            "\n",
            "\x1b[0m"
          );
          URLS_COM_ERRO.push(url); 
        } else if (isResponseSuccessful && isPaginaComErroDetectado) {
          URLS_COM_ERRO.splice(paginaAtual - (maxPaginas + 1), 1);
          paginaAtual--;
        }
        if (isPaginaComErroDetectado) 
          numeroPaginaComErro++;
        paginaAtual++;
        tentativas = 0;
      }
    }

    finalizarExtracaoProdutos();
  } catch (error) {
    console.error(
      "\x1b[31m",
      `Erro ao extrair informações do produto: ${error}`,
      "\n",
      "\x1b[0m"
    );
  }
}

async function numeroPaginas () {
  const response = await needle("get", URL);
  const $ = cheerio.load(response.body);
  const lastPageNumber = $(".last").text();
  
  return parseInt(lastPageNumber);
}

async function extrairDadosProduto($, maxPaginas, paginaAtual, numeroPaginaComErro) {
  let produtosDaPagina = 0;
  for (const element of $("#item-list > div.wrapper > a").get()) {
    const url = $(element).attr("href").replace("//", "");
    console.log(url);
    const produto = new Produto(url);
    await produto.extrairInformacoes();
    PRODUTOS.push(produto);
    produtosDaPagina++;

    progressoExtracaoProduto(maxPaginas, paginaAtual, produtosDaPagina, numeroPaginaComErro);
  }
}

async function progressoExtracaoProduto(maxPaginas, paginaAtual, produtosDaPagina, numeroPaginaComErro) {
  const isPaginaSemErroDetectado = paginaAtual <= maxPaginas;
  if (isPaginaSemErroDetectado)
    console.log(
      "\x1b[33m",
      `Quantidade de produtos coletados: ${
        PRODUTOS.length
      } até a página ${paginaAtual} (${produtosDaPagina} produtos nesta página)`,
      "\n",
      "\x1b[0m"
    );
  else
    console.log(
      "\x1b[33m",
      `Quantidade de produtos coletados: ${
        PRODUTOS.length
      } até a página ${maxPaginas} + página com erro ${numeroPaginaComErro} (${produtosDaPagina} produtos nesta página)`,
      "\n",
      "\x1b[0m"
    );
}

async function finalizarExtracaoProdutos() {
  if (URLS_COM_ERRO.length > 0) 
    await salvarDadosColetadosJson(URLS_COM_ERRO, "urls_com_erro");
  else 
    if (fs.existsSync("urls_com_erro.json"))
      await deletarDadosColetadosJson("urls_com_erro");

  await salvarDadosColetadosCsv(PRODUTOS);
  await salvarDadosColetadosJson(PRODUTOS);

  console.log(
    "\x1b[33m",
    `Quantidade de produtos coletados: ${PRODUTOS.length}`,
    "\n",
    "\x1b[0m"
  );

  console.log("\x1b[33m", `Exemplo: `, "\n", "\x1b[0m");
  console.log(PRODUTOS[0]);

  console.log(
    "\x1b[34m",
    "Extração de dados finalizada com sucesso!",
    "\n",
    "\x1b[0m"
  );
}

main();
