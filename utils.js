const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const util = require('util');
const { unlink } = require("fs").promises;
const writeFile = util.promisify(fs.writeFile);


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

module.exports = { 
  salvarDadosColetadosCsv, 
  salvarDadosColetadosJson, 
  deletarDadosColetadosJson
 };