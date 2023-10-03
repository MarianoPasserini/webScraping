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
        item = await itemHandle.$eval("div > div > div > a", el => el.textContent.trim());
    } catch (e) {
        console.log("Error getting item title:", e.message);
    }

    try {
        price = await itemHandle.$eval(".contenedor-price > h1 > span", el => parseFloat(el.textContent.replace(/[^\d.-]/g, '')));
    } catch (e) {
        console.log("Error getting item price:", e.message);
    }

    return { title: item, price: price };
}

// Function to scrape items on the current page
async function scrapePageItems(page) {
    const itemHandles = await page.$$('.addRow .ng-star-inserted > div');
    const items = [];

    for (const itemHandle of itemHandles) {
        const scrapedItem = await scrapeItem(page, itemHandle);
        items.push(scrapedItem);
    }

    return items;
}

// Function to handle the entire scraping process for a given accordionCategory
async function scrapeAccordionCategory(page, accordionCategory) {
    const category = await page.evaluate(el => el.querySelector("mat-expansion-panel-header > span > mat-panel-title").textContent.trim(), accordionCategory);

    const spanElements = await accordionCategory.$$('div > div > p > span');

    const subcategories = [];

    for (let j = 0; j < spanElements.length; j++) {
        await clickSpan(page, accordionCategory, j);

        // Wait for the .addRow selector to be visible
        await page.waitForSelector('.addRow', { visible: true });

        const subcategory = await page.evaluate(el => el.textContent.trim(), spanElements[j]);

        const items = await scrapePageItems(page);

        subcategories.push({ [subcategory]: items });

        await page.goBack();
        await page.waitForSelector('.addRow', { visible: true });
    }

    return { [category]: subcategories };
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

    const data = [];

    for (const accordionCategory of accordionCategories) {
        const categoryData = await scrapeAccordionCategory(page, accordionCategory);
        data.push(categoryData);
    }

    console.log(JSON.stringify(data, null, 2)); // Convert to JSON for better formatting

    await browser.close();
})();
