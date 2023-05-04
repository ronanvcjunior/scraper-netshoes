const needle = require("needle");
const cheerio = require("cheerio");

class Produto {
  constructor(url) {
    this.url = url;
    this.titulo = "";
    this.desconto = 0;
    this.precoOriginal = 0;
    this.precoAVista = 0;
    this.precoAPrazo = 0;
    this.descricao = "";
    this.images = [];
    this.atributos = {};
  }

  async extrairInformacoes() {
    try {
      const options = {
        timeout: 60000, // tempo limite de 60 segundos
        follow_max: 3
      };
      const response = await needle("get", this.url, options);
      const $ = cheerio.load(response.body);

      this.titulo = this.obterTitulo($);
      this.desconto = this.obterDesconto($);
      this.precoOriginal = this.obterPrecoOriginal($) || this.obterPrecoAVista($);
      this.precoAVista = this.obterPrecoAVista($);
      this.precoAPrazo = this.obterPrecoAPrazo($);
      this.descricao = this.obterDescricao($);
      this.images = this.obterdescricao($);
      this.atributos = await this.obterAtributos($);
    } catch (error) {
      console.error(`Erro ao extrair informações do produto: ${error}`);
    }
  }

  obterTitulo($) {
    return $("[data-productname]").text().trim();
  }

  obterDesconto($) {
    return parseFloat(
      $("#content > div:nth-child(3) > section > section.photo > figure > ul > li")
        .text()
        .replace("-", "")
        .replace("OFF", "")
        .replace("%", "")
        .trim()
    );
  }
  
  obterPrecoOriginal($) {
    return parseFloat(
      $("#buy-box > div.if-available > div.price.price-box > del")
        .text()
        .replace("R$", "")
        .replace(",", ".")
        .trim()
    );
  }
  
  obterPrecoAVista($) {
    return parseFloat(
      $("div.price.price-box > .default-price > span > strong")
        .text()
        .replace("R$", "")
        .replace(",", ".")
        .trim()
    );
  }
  
  obterPrecoAPrazo($) {
    return parseFloat(
      $("#buy-box > div.if-available > div.ncard-hint-box > div > div.ncard-hint--info > p.ncard-hint--info__payment")
        .text()
        .replace("R$", "")
        .replace(",", ".")
        .trim()
    );
  }

  obterDescricao($) {
    return $("[itemprop='description']").text().trim();
  }

  obterdescricao($) {
    return $("[data-swiper-wrapper-thumbs] > li img")
      .map((_, element) => $(element).attr("data-src"))
      .get();
  }

  async obterAtributos($) {
    const atributos = $("#features > .attributes > li")
      .map((_, element) => {
        const attributeTag = $(element)
          .children("strong")
          .text()
          .replace(":", "")
          .trim();
        const attributeValue = $(element)
          .text()
          .replace(attributeTag, "")
          .replace(":", "")
          .trim();
        return { [attributeTag]: attributeValue };
      })
      .get()
      .reduce((result, attribute) => ({ ...result, ...attribute }), {});

    return atributos;
  }
}

module.exports = Produto;
