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
    const acordionSubCategories = await page.$$('.noMobile > cgw-category-list > mat-accordion > mat-expansion-panel > div > div > mat-accordion > mat-expansion-panel > div > div > p');
    console.log(acordionSubCategories.length)

    let subItemsArray = []

    for (const accordionCategory of acordionCategories) {
        try {
          let item = await page.evaluate(el => el.querySelector("mat-expansion-panel-header > span > mat-panel-title").textContent, accordionCategory);
          
          // Click on the header to expand the category
          await accordionCategory.click(item);
    
          // Wait for a specific duration (e.g., 1000 milliseconds or 1 second)
          const delayTime = 1000;
          await new Promise(resolve => setTimeout(resolve, delayTime));
    
          // Use page.evaluate within the context of accordionCategory to get nested span values
          let subItems = await page.evaluate(el => {
            const spans = Array.from(el.querySelectorAll("div > div > p > span"));
            return spans.map(span => span.textContent);
          }, accordionCategory);
    
          console.log(`Category: ${item} - SubItems: ${subItems}`); 
        } catch (e) {
          console.log(e);
        }
      }

    // for(const accordionSubCategory of acordionSubCategories) {
    //     try {
    //         let subItem = await page.evaluate(el => el.querySelector("span").textContent, accordionSubCategory);
    //         subItemsArray.push(subItem);
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     console.log(subItemsArray);
    // }
    // await browser.close();
})();
