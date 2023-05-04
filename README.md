# scraper-netshoes

Este projeto contém um script de web scraping que faz a coleta de informações dos produtos da Netshoes e salva os resultados em arquivos CSV e JSON.

## Pré-requisitos
Antes de executar o script, é necessário instalar o Node.js no seu computador. Se você ainda não tem o Node.js instalado, você pode baixá-lo e instalá-lo através do site oficial: https://nodejs.org/en/download/.

## Como executar
Para executar o script, siga os passos abaixo:

1. Baixe o código-fonte do projeto e extraia os arquivos em um diretório de sua escolha.
2. Abra o terminal e navegue até o diretório onde o código-fonte está localizado.
3. Instale as dependências do projeto com o comando: 
    ```bash
    # instalar as dependências
    npm install
    ```
4. Execute o script com o comando: 
    ```bash
    # executar o script
    node index.js
    ```

Ao executar o script, serão criados dois arquivos no diretório atual: um arquivo CSV chamado dados_coletados.csv e um arquivo JSON chamado dados_coletados.json. Esses arquivos conterão as informações coletadas pelo script. Além disso, pode ser criado um terceiro arquivo JSON chamado urls_com_erro.json, contendo as URLs dos produtos da Netshoes que apresentaram erro durante o scraping.

## Como testar

Existe um arquivo chamado config.js, nele é possível alterar o número de paginadas a serem extraridas.

```js
MaxPaginas: 0   // Irá coletar os dados de todas as páginas
MaxPaginas: 10  // Irá coletar os dados de 10 páginas
```

Também é possível alterar o número de tentativas que uma página pode soferr para tentar extrair os seus dados.

```js
MaxTentativas: 3   // Serão feitas 3 tentativas antes de colocar a página como página com erro
```

## Exemplo

### Arquivo JSON: <a href="./dados_coletados.json" target="_blank">dados_coletados.json</a>

```json
[
  {
    "url": "www.netshoes.com.br/tenis-mizuno-wave-titan-2-2FU-6367-006",
    "title": "Tênis Mizuno Wave Titan 2 - Preto",
    "price": "227,99",
    "description": "*Possui forma pequena, para um melhor ajuste nos pés, recomendamos a compra de um tamanho maior do que o seu usual.* Aposte no conforto e qualidade do novo Tênis de Corrida Masculino da Mizuno para te acompanhar nos seus treinos diários. Com design moderno, o running indicado para caminhadas e corridas leves possui cabedal fabricado com material macio e respirável que garante mais frescor durante o uso. O calcanhar é acolchoado e oferece suporte aos pés enquanto o cadarço garante ajuste eficaz. A entressola em EVA conta com tecnologia que proporciona alto nível de maciez entre uma passada e outra; e o solado de borracha proporciona aderência e tração por onde você passar. Indicado para corredores de pisada neutra, o Tênis Masculino Mizuno acompanha os corredores mais ambiciosos na busca pelo melhor pace. Aproveite!",
    "images": [
      "https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom1.jpg?ts=1657368380&",
      "https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom2.jpg?ts=1657368380&",
      "https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom3.jpg?ts=1657368380&",
      "https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom4.jpg?ts=1657368380&",
      "https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom5.jpg?ts=1657368380&"
    ],
    "attributes": {
      "Nome": "Tênis Mizuno Wave Titan 2", "Gênero": "Unissex",
      "Indicado para": "Dia a Dia",
      "Material": "Têxtil e Sintético",
      "Categoria": "Caminhada",
      "Composição": "Cabedal: Têxtil com tiras sintéticas, calcanhar acolchoado e fecho em cadarço; Entressola: EVA; Solado: Borracha",
      "Tecnologia": "Wave",
      "Pisada": "Neutra",
      "Definição da Tecnologia": "Tecnologia que garante 100% da performance do sistema, proporcionando maior absorção de impacto, máximo amortecimento e estabilidade",
      "Importante": "Possui forma pequena, para um melhor ajuste nos pés, recomendamos a compra de um tamanho maior do que o seu usual.",
      "Garantia do Fabricante": "Contra defeito de fabricação",
      "Origem": "Nacional",
      "Marca ": "Mizuno"
    }
  }
]
```

### Arquivo CSV: <a href="./dados_coletados.csv" target="_blank">dados_coletados.csv</a>


<table>
<thead>
<tr>
<th>url</th>
<th>titulo</th>
<th>desconto</th>
<th>precoOriginal</th>
<th>precoAVista</th>
<th>precoAPrazo</th>
<th>descricao</th>
<th style="width: 500px">images</th>
<th>atributos</th>
</tr>
</thead>
<tbody>
<tr>
<td>www.netshoes.com.br/tenis-mizuno-wave-titan-2-2FU-6367-006</td>
<td>Tênis Mizuno Wave Titan 2 - Preto</td>
<td>31</td>
<td>349.99</td>
<td>227.99</td>
<td>239.99</td>
<td><em>Possui forma pequena, para um melhor ajuste nos pés, recomendamos a compra de um tamanho maior do que o seu usual.</em> Aposte no conforto e qualidade do novo Tênis de Corrida Masculino da Mizuno para te acompanhar nos seus treinos diários. Com design moderno, o running indicado para caminhadas e corridas leves possui cabedal fabricado com material macio e respirável que garante mais frescor durante o uso. O calcanhar é acolchoado e oferece suporte aos pés enquanto o cadarço garante ajuste eficaz. A entressola em EVA conta com tecnologia que proporciona alto nível de maciez entre uma passada e outra; e o solado de borracha proporciona aderência e tração por onde você passar. Indicado para corredores de pisada neutra, o Tênis Masculino Mizuno acompanha os corredores mais ambiciosos na busca pelo melhor pace. Aproveite!</td>
<td style="width: 500px"><img src="https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom1.jpg?ts=1657368380&"/><br><img src="https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom2.jpg?ts=1657368380&"/><br><img src="https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom3.jpg?ts=1657368380&"/><br><img src="https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom4.jpg?ts=1657368380&"/><br><img src="https://static.netshoes.com.br/produtos/tenis-mizuno-wave-titan-2/06/2FU-6367-006/2FU-6367-006_zoom5.jpg?ts=1657368380&"/></td>
<td>Nome: &quot;Tênis Mizuno Wave Titan 2&quot;, Gênero: &quot;Unissex&quot;, Indicado para: &quot;Dia a Dia&quot;, Material: &quot;Têxtil e Sintético&quot;, Categoria: &quot;Caminhada&quot;, Composição: &quot;Cabedal: Têxtil com tiras sintéticas, calcanhar acolchoado e fecho em cadarço; Entressola: EVA; Solado: Borracha&quot;, Tecnologia: &quot;Wave&quot;, Pisada: &quot;Neutra&quot;, Definição da Tecnologia: &quot;Tecnologia que garante 100% da performance do sistema, proporcionando maior absorção de impacto, máximo amortecimento e estabilidade&quot;, Importante: &quot;Possui forma pequena, para um melhor ajuste nos pés, recomendamos a compra de um tamanho maior do que o seu usual.&quot;, Garantia do Fabricante: &quot;Contra defeito de fabricação&quot;, Origem: &quot;Nacional&quot;, Marca: &quot;Mizuno&quot;</td>
</tr>
</tbody>
</table>


