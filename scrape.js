//Imports
const puppeteer = require('puppeteer');
require('dotenv').config();

/**
 * Automated login to LinkedIn
 * @param {string} username User email 
 * @param {string} password User password
 */
const linkedinLogin = async (username, password, page) => {
    console.log(`Logging in with email: ${process.env.EMAIL}`);

    await page.type('#session_key', username);
    await page.type('#session_password', password);
    await page.click('.sign-in-form__submit-button');

    // Wait for page load
    await page.waitFor(3000);
}

/**
 * Scrape LinkedIn to find active users for a given company
 * @param {{email: string, password: string, company: string}} data An object with login credentials and the company's LinkedIn handle
 */
const scrapeLinkedIn = async (data) => {
    try {
        //Launch a chromium automated session
        const browser = await puppeteer.launch( { headless: false, dumpio: true, args: ['--no-sandbox'], });

        //Open a new tab
        const page = await browser.newPage();

        //Page configurations
        await page.setViewport({width: 1200, height: 1200});
        await page.setDefaultNavigationTimeout(0);

        //Visit LinkedIn
        await page.goto(`https://www.linkedin.com/`);

        //Login to your account
        await linkedinLogin(data.username, data.password, page);

        //Visit the company's page and find the list of employees
        await page.goto(`https://www.linkedin.com/company/${data.company}`, {
            waitUntil: 'domcontentloaded',
        });

        //Visit all employees from the company's page
        await page.click('a.ember-view.link-without-visited-state.inline-block');
        await page.waitForNavigation();

        let profileLinks = [];
        for(let pageNumber = 0; pageNumber<2; pageNumber++) {

            //Fetch all profile links from the page
            profileLinks = await page.evaluate(() => {
                if(document.querySelectorAll('.search-result__info .search-result__result-link')) {
                    //Store and return profile links
                    let profiles = [];
                    document.querySelectorAll('.search-result__info .search-result__result-link').forEach(element => {
                        if(element.href) {
                            profiles.push(element.href);
                        }
                    });
                    return profiles;
                }
            });

            let activity = [];
            for(let i = 0; i<profileLinks.length; i++){
                let element = profileLinks[i];
                await page.goto(element+'detail/recent-activity');
                const individualActivity = await page.evaluate(() => {
                    console.log('Found...');
                    let eachActivity = [];
                    if(document.querySelectorAll('div.feed-shared-actor__meta.relative > span.feed-shared-actor__sub-description.t-12.t-black--light.t-normal > div > span.visually-hidden')) {
                        document.querySelectorAll('div.feed-shared-actor__meta.relative > span.feed-shared-actor__sub-description.t-12.t-black--light.t-normal > div > span.visually-hidden').forEach(item=>{
                            if(item.innerHTML) {
                                console.log(item.innerHTML);
                                if(item.innerHTML.match(/[0-9] (minutes?|hours?|days?|week) ago/))
                                    eachActivity.push(item.innerHTML);
                            }
                        });
                    }
                    return eachActivity;
                });
                if(individualActivity.length)
                    await activity.push(element);
                await page.goBack();
            }
            console.log(activity);
            profileLinks = [];
            await page.click('.artdeco-pagination__button.artdeco-pagination__button--next');
            await page.waitFor(2000);
        }
    }
    catch(err) {
        console.log(err);
    }
  }

  scrapeLinkedIn({username:process.env.EMAIL, password:process.env.PASSWORD, company: process.env.COMPANY});
