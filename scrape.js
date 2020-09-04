const puppeteer = require('puppeteer');
require('dotenv').config();

const scrapeLinkedIn = async (data) => {
    console.log(process.env.EMAIL);
    console.log(`Logging in...`);
    const browser = await puppeteer.launch( { headless: false, dumpio: true, args: ['--no-sandbox'], });
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 1200})
    await page.goto(`https://www.linkedin.com/`);



    await page.type('#session_key', data.username);
    await page.type('#session_password', data.password);
    await page.click('.sign-in-form__submit-button');
    // Wait for page load
    await page.waitFor(3000);

    await page.goto(`https://www.linkedin.com/company/${data.company}`);
    await page.waitFor(3000);
    await page.click('.mt2');

    // /detail/recent-activity

    // await page.click('.recent_activity_details_all');

  }

  scrapeLinkedIn({username:process.env.EMAIL, password:process.env.PASSWORD, company: "google"});
