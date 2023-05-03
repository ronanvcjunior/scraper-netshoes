const needle = require("needle");
const cheerio = require("cheerio");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

const url = "https://www.netshoes.com.br/busca";

const scrapedResults = [];

async function scrapedBusca() {
  try {
    const response = await needle("get", url);

    const $ = cheerio.load(response.body);

    $("#item-list > div.wrapper > a").each((index, elem) => {
      const url = $(elem).attr("href").replace("//", "");
      const scrapedResult = { url };
      scrapedResults.push(scrapedResult);
    });
    
    return scrapedResults;
  } catch (error) {
    console.error(error);
  }
}

async function scrapedProduct(scrapedBuscas) {
  try {
    return await Promise.all(
      scrapedBuscas.map(async product => {
        const response = await needle("get", product.url, { follow_max: 3 });
        const $ = cheerio.load(response.body);
        
        const title = $("[data-productname]").text();
        // console.log(response.body);
        product.title = title;

        const price = $("div.price.price-box > .default-price > span > strong")
            .text()
            .replace("R$", "")
            .trim();
        product.price = price;

        const description = $("[itemprop='description']").text();
        product.description = description;

        const images = [];
        $("[data-swiper-wrapper-thumbs] > li").each((index, element) => {
          const image = $(element)
              .find("img")
              .attr("data-src");

          images.push(image);
        });
        product.images = images;

        const attributes = {};
        $("#features > .attributes > li").each((index, element) => {
          const resultAttributeTag = $(element)
              .children("strong")
              .text();
              
              const attributeTag = resultAttributeTag.replace(":", "");
              
              const attributeValue = $(element)
              .text()
              .replace(resultAttributeTag, "")
              .trim();
              
              attributes[attributeTag] = attributeValue;
        });
        product.attributes = attributes;
      })
    );
  } catch (error) {
    console.error(error);
  }
}

async function createCsvFile() {
  const csv = new ObjectsToCsv(scrapedResults);

  await csv.toDisk('./test.csv');
}

async function createJsonFile() {
  const jsonString = JSON.stringify(scrapedResults, null, 2);

  fs.writeFile('data.json', jsonString, (err) => {
    if (err) {
      console.error('Erro ao escrever arquivo:', err);
    } else {
      console.log('Arquivo gravado com sucesso!');
    }
  });
}

async function main () {
  const scrapedBuscas = await scrapedBusca();
  await scrapedProduct(scrapedBuscas);
  await createCsvFile();
  await createJsonFile();
}

main();

