const puppeteer = require('puppeteer');
require('dotenv').config();

const scrapeLinkedIn = async (data) => {
    try {
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
        await page.click('a.ember-view.link-without-visited-state.inline-block');
        await page.waitFor(3000);
        const result = await page.evaluate(() => {
            console.log('Printing...');
            if(document.querySelectorAll('.search-result__info .search-result__result-link')) {

                let profiles = []; 
                document.querySelectorAll('.search-result__info .search-result__result-link').forEach(element => {
                    if(element.href) {
                        console.log(element.href);
                        profiles.push(element.href);
                    }


                });
                return profiles;
            }
        });
        console.log(result);

        let activity = [];
        for(let i = 0; i<result.length; i++){
            let element = result[i];
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
            await activity.push({[element]: individualActivity});
        }
        let links = [];
        activity.filter(item=>{
            if(Object.value(item).length) {
                links.push(Object.keys(item));
            }
        });
        console.log(activity);
    }
    catch(err) {
        console.log(err);
    }
  }

  scrapeLinkedIn({username:process.env.EMAIL, password:process.env.PASSWORD, company: "facebook"});
