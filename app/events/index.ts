const cheerio = require("cheerio");
import fetch from "node-fetch";

const URL =
  "https://starktx.info/goerli/0x917651782f0f5656e3518c522b9d10320e4ac663e87d9118a7a5eed8fbdf46/";

(async function main() {
  const response = await fetch(URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const calls = $("#ev_tree ul li p");
  const callRegex = /.*\.([^\(]*)\(([^\)]*)\)/;
  const events = [];
  const eventText = $(".transaction-info").text().trim();
  const eventMatch = eventText.match(
    /[^\/]*\/([0-9]+)[^0-9]*(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\sUTC).*/
  );
  for (let call of calls) {
    const match = $(call).text().trim().match(callRegex);
    if (match) {
      events.push({
        name: match[1],
        block_number: parseInt(eventMatch[1]),
        timestamp: new Date(Date.parse(eventMatch[2])).toISOString(),
        paramenters: match[2].split(", ").map((param: string) => ({
          name: param.split("=")[0],
          value: param.split("=")[1]
        }))
      });
    }
  }
  console.log(JSON.stringify(events, undefined, 2));
})();
