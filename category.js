import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: './user_data',
    });

    const page = await browser.newPage();
    await page.goto('https://compragamer.com/?seccion=3', { waitUntil: 'networkidle2' });

    const accordionCategoriesTest = await page.$$('.noMobile > cgw-category-list > mat-accordion > mat-expansion-panel > div > div > mat-accordion > mat-expansion-panel');

    const size = accordionCategoriesTest.length;

    console.log(size);

    for (let i = 0; i < size; i++) {
        const accordionCategories = await page.$$('.noMobile > cgw-category-list > mat-accordion > mat-expansion-panel > div > div > mat-accordion > mat-expansion-panel');

        const spanSize = await page.evaluate(el => {
            const spans = Array.from(el.querySelectorAll("div > div > p > span"));
            return spans.length;
        }, accordionCategories[i]);

        for (let j = 0; j < spanSize; j++) {
            await page.evaluate((el, index) => {
                el.querySelectorAll("div > div > p > span")[index].click();
            }, accordionCategories[i], j);

            await page.waitForSelector('.addRow', { visible: true });
            console.log(page.url());
            await page.goBack();
            await page.waitForSelector('.addRow', { visible: true });
        }
    }
    // await browser.close();
})();
