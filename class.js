import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: './user_data',
  });

  const page = await browser.newPage();
  await page.goto('https://compragamer.com/?seccion=3', { waitUntil: 'networkidle2' });

  const itemHandlesTest = await page.$$('.addRow .ng-star-inserted > div');
  console.log(itemHandlesTest.length);
  const size = itemHandlesTest.length;

  let items = [];

  for(let i = 0; i < size; i++) {
    try {
      const itemHandles = await page.$$('.addRow .ng-star-inserted > div');
      await page.evaluate(el => el.querySelector("div > div > div > a").click(), itemHandles[i]);
      await page.waitForSelector('h1', { visible: true });
      const title = await page.evaluate(el => el.querySelector("h1").textContent, await page.$('.product-details-container'));
      console.log(page.url());
      items.push({title: title, url: page.url()});
      await page.goBack();
      await page.waitForSelector('.addRow', { visible: true });
    } catch (e) {
      console.log(e);
    }
  }
  console.log(items);
})();
