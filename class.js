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

  const acordionCategories = await page.$$('.noMobile > cgw-category-list > mat-accordion > mat-expansion-panel > div > div > mat-accordion > mat-expansion-panel');
  console.log(acordionCategories.length)

  let items = [];
  for(const acordionCategory of acordionCategories) {
    let item = null;
    try {
       item = await page.evaluate(el => el.querySelector(" mat-expansion-panel-header > span > mat-panel-title").textContent, acordionCategory);
       items.push(item);
    } catch (e) {
      console.log(e);
    }
  }
    console.log(items);
//   await browser.close();
})();