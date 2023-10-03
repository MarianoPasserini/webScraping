import puppeteer from 'puppeteer';

// Function to click on a span inside accordionCategories
async function clickSpan(page, accordionCategory, index) {
    await page.evaluate((el, i) => {
        el.querySelectorAll("div > div > p > span")[i].click();
    }, accordionCategory, index);
}

// Function to scrape item details
async function scrapeItem(page, itemHandle) {
    let item = null;
    let price = null;

    try {
        item = await itemHandle.$eval("div > div > div > a", el => el.textContent);
    } catch (e) {
        console.log("Error getting item title:", e.message);
    }

    try {
        price = await itemHandle.$eval(".contenedor-price > h1 > span", el => el.textContent);
    } catch (e) {
        console.log("Error getting item price:", e.message);
    }

    return { title: item, price: price };
}

// Function to scrape items on the current page
async function scrapePageItems(page, category) {
    const itemHandles = await page.$$('.addRow .ng-star-inserted > div');
    const items = [];

    for (const itemHandle of itemHandles) {
        const scrapedItem = await scrapeItem(page, itemHandle);
        items.push(scrapedItem);
    }

    return { [category]: items }; // Use category as the main key
}

// Function to handle the entire scraping process for a given accordionCategory
async function scrapeAccordionCategory(page, accordionCategory) {
    const category = await page.evaluate(el => el.querySelector("mat-expansion-panel-header > span > mat-panel-title").textContent, accordionCategory);

    const spanSize = await accordionCategory.$$eval("div > div > p > span", spans => spans.length);

    for (let j = 0; j < spanSize; j++) {
        await clickSpan(page, accordionCategory, j);

        // Wait for the .addRow selector to be visible
        await page.waitForSelector('.addRow', { visible: true });

        const items = await scrapePageItems(page, category);

        console.log(items);
        console.log(page.url());

        await page.goBack();
        await page.waitForSelector('.addRow', { visible: true });
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: './user_data',
    });

    const page = await browser.newPage();
    await page.goto('https://compragamer.com/?seccion=3', { waitUntil: 'networkidle2' });

    const accordionCategories = await page.$$('.noMobile > cgw-category-list > mat-accordion > mat-expansion-panel > div > div > mat-accordion > mat-expansion-panel');

    for (const accordionCategory of accordionCategories) {
        await scrapeAccordionCategory(page, accordionCategory);
    }

    // await browser.close();
})();
