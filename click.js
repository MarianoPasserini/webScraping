import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: './user_data',
  });

  const page = await browser.newPage();
  await page.goto('https://compragamer.com/?seccion=3');

  const acordionCategories = await page.$$('.noMobile > cgw-category-list > mat-accordion > mat-expansion-panel > div > div > mat-accordion > mat-expansion-panel');

  let categoryData = [];

  for (const accordionCategory of acordionCategories) {
    try {
      let category = await page.evaluate(el => el.querySelector("mat-expansion-panel-header > span > mat-panel-title").textContent, accordionCategory);

      // Remove spaces and hyphens from the category
      category = category.replace(/[\s-]/g, '');

      // Click on the header to expand the category
      await accordionCategory.click(category);

      // Wait for a specific duration (e.g., 1000 milliseconds or 1 second)
      const delayTime = 1000;
      await new Promise(resolve => setTimeout(resolve, delayTime));

      // Use page.evaluate within the context of accordionCategory to get nested span values
      let subItems = await page.evaluate(el => {
        const spans = Array.from(el.querySelectorAll("div > div > p > span"));
        return spans.map(span => span.textContent);
      }, accordionCategory);

      // Remove spaces and hyphens from each sub-item
      subItems = subItems.map(item => item.replace(/[\s-]/g, ''));

      // Create an object with the category as the key and sub-items as the value
      let categoryObject = {
        [category]: subItems
      };

      // Push the categoryObject into the categoryData array
      categoryData.push(categoryObject);
    } catch (e) {
      console.log(e);
    }
  }

  console.log(categoryData);

  // await browser.close();
})();
