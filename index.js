const needle = require("needle");
const cheerio = require("cheerio");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const util = require('util');
const { unlink } = require("fs").promises;
const writeFile = util.promisify(fs.writeFile);

const Produto = require("./produto");

const URL = "https://www.netshoes.com.br/busca";

const PRODUTOS = [];
const URLS_COM_ERRO = [];

async function main() {
  try {
    const response = await needle("get", URL);
    const $ = cheerio.load(response.body);

    let maxPages = parseInt($(".last").text());
    console.log(maxPages);

    let i = 1;
    let tentativas = 0;
    while (i <= (maxPages + URLS_COM_ERRO.length)) {
      const options = {
        timeout: 60000, // tempo limite de 60 segundos
      };
      await new Promise((resolve) => setTimeout(resolve, (1000 * tentativas)));
      let url;
      if (i > maxPages)
        url = URLS_COM_ERRO[i - (maxPages + 1)];
      else
        url = `${URL}?page=${i}`;
      const response = await needle("get", url, options);
      console.log(url);
      const $ = cheerio.load(response.body);
      let produtosDaPagina = 0;
      for (const element of $("#item-list > div.wrapper > a").get()) {
        const url = $(element).attr("href").replace("//", "");
        console.log(url);
        const produto = new Produto(url);
        try {
          await produto.extrairInformacoes();
          PRODUTOS.push(produto);
          produtosDaPagina++;
          console.log(
            "\x1b[33m",
            `Quantidade de produtos coletados: ${
              PRODUTOS.length
            } até a página ${i} (${produtosDaPagina} produtos nesta página)`,
            "\n",
            "\x1b[0m"
          );
        } catch (error) {
          console.error(
            "\x1b[31m",
            `Erro ao extrair informações do produto: ${error}`,
            "\n",
            "\x1b[0m"
          );
          URLS_COM_ERRO.push(url); 
        }
      }
      if (produtosDaPagina === 0 && tentativas < 3) {
        tentativas++;
      } else {
        if (produtosDaPagina === 0 && (i <= maxPages)) {
          console.error(
            "\x1b[31m",
            `Erro ao extrair informações na página ${i}`,
            "\n",
            "\x1b[0m"
          );
          console.log(response.statusCode)
          URLS_COM_ERRO.push(`${URL}?page=${i}`); 
        } else if (produtosDaPagina > 0 && (i > maxPages)) {
          URLS_COM_ERRO.splice(i - (maxPages + 1), 1);
        }
        i++;
        tentativas = 0;
      }
    }

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
  } catch (error) {
    console.error(
      "\x1b[31m",
      `Erro ao extrair informações do produto: ${error}`,
      "\n",
      "\x1b[0m"
    );
    URLS_COM_ERRO.push(`${URL}?page=${i}`); 
  }
}

async function salvarDadosColetadosCsv(dados, nomeArquivo = "dados_coletados") {
  try {
    const csv = new ObjectsToCsv(dados);
    await csv.toDisk(`./${nomeArquivo}.csv`);
    console.log('\x1b[32m', "Dados coletados gravados com sucesso em CSV!",  '\n', '\x1b[0m');
  } catch (error) {
    console.error('\x1b[31m', `Erro ao gravar dados coletados em CSV: ${error}`, '\n', '\x1b[0m');
  }
}

async function salvarDadosColetadosJson(dados, nomeArquivo = "dados_coletados") {
  try {
    const jsonString = JSON.stringify(dados, null, 2);
    await writeFile(`./${nomeArquivo}.json`, jsonString);
    console.log('\x1b[32m', "Dados coletados gravados com sucesso em JSON!", '\n', '\x1b[0m');
  } catch (error) {
    console.error('\x1b[31m', `Erro ao gravar dados coletados em JSON: ${error}`, '\n', '\x1b[0m');
  }
}

async function deletarDadosColetadosJson(nomeArquivo = "dados_coletados") {
  try {
    await unlink(`./${nomeArquivo}.json`);
    console.log('\x1b[32m', "Arquivo JSON deletado com sucesso!", '\n', '\x1b[0m');
  } catch (error) {
    console.error('\x1b[31m', `Erro ao deletar arquivo JSON: ${error}`, '\n', '\x1b[0m');
  }
}


main();
