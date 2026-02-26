import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5176/');
    await page.waitForSelector('#mapmyvisitors-widget');

    const outerHTML = await page.evaluate(() => {
        const el = document.querySelector('#mapmyvisitors-widget');
        return el ? el.outerHTML : null;
    });

    console.log(outerHTML);
    await browser.close();
})();
