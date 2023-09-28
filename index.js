import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: './user_data',
  });
  const page = await browser.newPage();
  await page.goto('https://compragamer.com/?seccion=3');

  const itemHandles = await page.$$('.addRow .ng-star-inserted > div');
  console.log(itemHandles.length)
  let items = [];
  for (const itemHandle of itemHandles) {

    let item = null;
    let price = null;
    try{
        item = await page.evaluate(el => el.querySelector("div > div > div > a").textContent, itemHandle);
    } catch (e) {
        console.log(e);
    }
    try{
        price = await page.evaluate(el => el.querySelector(".contenedor-price > h1 > span").textContent, itemHandle);
    } catch (e) {
        console.log(e);
    }
    items.push({title: item, price: price});
  }
    console.log(items);

    
//   await browser.close();
})();