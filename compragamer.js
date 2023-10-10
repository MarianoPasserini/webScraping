import puppeteer from 'puppeteer';
import fs from 'fs/promises';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: './user_data',
  });

  const page = await browser.newPage();
  await page.goto('https://compragamer.com/?seccion=3', { waitUntil: 'networkidle2' });

  const urlArray = [
    "https://compragamer.com/?seccion=3&cate=58",
    "https://compragamer.com/?seccion=3&cate=27",
    "https://compragamer.com/?seccion=3&cate=48",
    "https://compragamer.com/?seccion=3&cate=26",
    "https://compragamer.com/?seccion=3&cate=49",
    "https://compragamer.com/?seccion=3&cate=6",
    "https://compragamer.com/?seccion=3&cate=62",
    "https://compragamer.com/?seccion=3&cate=15",
    "https://compragamer.com/?seccion=3&cate=47",
    "https://compragamer.com/?seccion=3&cate=16",
    "https://compragamer.com/?seccion=3&cate=19",
    "https://compragamer.com/?seccion=3&cate=81",
    "https://compragamer.com/?seccion=3&cate=34",
    "https://compragamer.com/?seccion=3&cate=5",
    "https://compragamer.com/?seccion=3&cate=8",
    "https://compragamer.com/?seccion=3&cate=39",
    "https://compragamer.com/?seccion=3&cate=2",
    "https://compragamer.com/?seccion=3&cate=13",
    "https://compragamer.com/?seccion=3&cate=18",
    "https://compragamer.com/?seccion=3&cate=38",
    "https://compragamer.com/?seccion=3&cate=65",
    "https://compragamer.com/?seccion=3&cate=72",
    "https://compragamer.com/?seccion=3&cate=74",
    "https://compragamer.com/?seccion=3&cate=78",
    "https://compragamer.com/?seccion=3&cate=84",
    "https://compragamer.com/?seccion=3&cate=85",
    "https://compragamer.com/?seccion=3&cate=66",
    "https://compragamer.com/?seccion=3&cate=83",
    "https://compragamer.com/?seccion=3&cate=31",
    "https://compragamer.com/?seccion=3&cate=111"
  ];

  const categoryData = {}; // Object to store category information

  for (const url of urlArray) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    page.waitForSelector('.mat-chip-list', { visible: true });
    const itemHandlesTest = await page.$$('.addRow .ng-star-inserted > div');
    const size = itemHandlesTest.length;
    console.log(size);
    const cat = await page.$$('.mat-chip-list');
    let catName = await page.evaluate(el => el.querySelector("mat-chip").textContent, cat[0]);
    catName = catName.replace('cancel', '').trim();
    console.log(catName);
    let items = [];

    for (let i = 0; i < size; i++) {
      try {
        const itemHandles = await page.$$('.addRow .ng-star-inserted > div');
        const title = await page.evaluate(el => el.querySelector("div > div > div > a").textContent, itemHandles[i]);
        let priceString = await itemHandles[i].$eval(".contenedor-price > h1 > span", el => el.textContent);
        let price = parseInt(priceString.replace(/\D/g, ''), 10);
        await page.evaluate(el => el.querySelector("div > div > div > a").click(), itemHandles[i]);
        await page.waitForSelector('h1', { visible: true });
        const compatibilityProducts = await page.$$('.mat-tab-body-wrapper > mat-tab-body > div > cgw-product-specifications > div > div > div');

        const specsInfo = {};

        for (const compatible of compatibilityProducts) {
          const spanElements = await compatible.$$('span');
          const spanTexts = await Promise.all(spanElements.map(async spanElement => {
            return await page.evaluate(el => el.textContent.trim(), spanElement);
          }));

          for (let i = 0; i < spanTexts.length; i += 2) {
            specsInfo[spanTexts[i]] = spanTexts[i + 1];
          }
        }

        // Add title, specs, and URL for each product
        items.push({ product: title, price: price, specs: specsInfo, url: page.url() });

        await page.goBack();
        await page.waitForSelector('.addRow', { visible: true });
      } catch (e) {
        console.log(`Error processing product ${i + 1}: ${e.message}`);
        // Continue to the next iteration
        continue;
      }
    }
    
    // Store category information in the object
    categoryData[catName] = items;
    console.log(JSON.stringify(categoryData, null, 2));
  }

  const jsonData = JSON.stringify(categoryData, null, 2); // Convert to JSON for better formatting
  await fs.writeFile('catalogoCompraGamer.json', jsonData, 'utf-8');

  // Close the browser
  await browser.close();
})();
