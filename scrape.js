//Imports
const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fs = require("fs");
require("dotenv").config();

/**
 * Automated login to LinkedIn
 * @param {string} username User email
 * @param {string} password User password
 */
const linkedinLogin = async (username, password, page) => {
  console.log(`Logging in with email: ${process.env.EMAIL}`);

  await page.type("#session_key", username);
  await page.type("#session_password", password);
  await page.click(".sign-in-form__submit-button");

  // Wait for page load
  return new Promise((resolve) => {
    page.on("framenavigated", async () => {
      if (page.url().startsWith("https://www.linkedin.com/feed")) {
        // Save the session cookies
        const cookiesObject = await page.cookies();
        // Store cookies in cookie.json to persist the session
        await jsonfile.writeFile(
          "./cookie.json",
          cookiesObject,
          { spaces: 2 },
          (err) => {
            if (err) console.log("Error while writing file: ", err);
            else console.log("Session saved successfully!");
          }
        );
        return resolve();
      }
    });
  });
};

/**
 * Scrape LinkedIn to find active users for a given company
 * @param {{email: string, password: string, company: string}} data An object with login credentials and the company's LinkedIn handle
 */
const scrapeLinkedIn = async (data) => {
  //Launch a chromium automated session
  const browser = await puppeteer.launch({
    headless: false,
    dumpio: true,
    args: ["--no-sandbox"],
  });

  const waitUntilOptions = ["domcontentloaded", "networkidle2"];
  const time = Date.now();
  const fileName = `./output/${process.env.COMPANY}${time}.json`; // generate the a unique fileName for each run of the script
  let output = {};
  let pages = [];

  try {
    //Open a new tab
    const page = await browser.newPage();

    //Page configurations
    await page.setViewport({ width: 1200, height: 1200 });
    await page.setDefaultNavigationTimeout(0);

    //Check if cookies are stored in cookie.json and use that data to skip login
    const previousSession = fs.existsSync("./cookie.json");
    if (previousSession) {
      //Load the cookies
      const cookiesArr = require(`.${"/cookie.json"}`);
      if (cookiesArr.length !== 0) {
        //Set each browser cookie
        for (let cookie of cookiesArr) {
          await page.setCookie(cookie);
        }
        console.log("Previous session loaded successfully!");
      }
    } else {
      //Visit LinkedIn
      await page.goto(`https://www.linkedin.com/`);

      //Login to your account
      await linkedinLogin(data.username, data.password, page);
    }

    try {
      //Visit the company's page and find the list of employees
      await page.goto(`https://www.linkedin.com/company/${data.company}`, {
        waitUntil: waitUntilOptions,
      });

      //Visit all employees from the company's page
      await page.click("a.ember-view.link-without-visited-state.inline-block");
    } catch (e) {
      console.error(
        "Oops! An error occured while trying to find the company's page." +
          "\n" +
          "The reason for this error can be either the browser was closed while execution or you entered invalid data in env file." +
          "\n" +
          "Please check the LinkedIn handle of the company you're trying to find and your credentials and try again."
      );
      await browser.close();
    }

    await page.waitForNavigation();

    let profileLinks = [];
    const pagesToVisit = 2;
    for (let pageNumber = 0; pageNumber < pagesToVisit; pageNumber++) {
      await autoScroll(page);
      //Fetch all profile links from the page
      profileLinks.push(
        ...(await page.evaluate(() => {
          const profileListSelectors = [
            ".search-result__info .search-result__result-link",
            ".reusable-search__entity-results-list .entity-result__title-text a",
          ];
          let profileListNodes = undefined;
          for (
            let profileListSelectorIndex = 0;
            profileListSelectorIndex < profileListSelectors.length;
            profileListSelectorIndex++
          ) {
            // Breaking Loop when Profile Selector is Found to have data.
            if (
              document.querySelectorAll(
                profileListSelectors[profileListSelectorIndex]
              ).length > 0
            ) {
              profileListNodes = document.querySelectorAll(
                profileListSelectors[profileListSelectorIndex]
              );
              break;
            }
          }
          if (profileListNodes) {
            //Store and return profile links
            let profiles = [];
            profileListNodes.forEach((profile) => {
              if (profile.href) {
                profiles.push(profile.href);
              }
            });
            return profiles;
          }
          if (profileListNodes) {
            //Store and return profile links
            let profiles = [];
            profileListNodes.forEach((profile) => {
              if (profile.href) {
                profiles.push(profile.href);
              }
            });
            return profiles;
          }
        }))
      );

      if (pageNumber + 1 < pagesToVisit) {
        await page.click(
          ".artdeco-pagination__button.artdeco-pagination__button--next"
        );
        await page.waitForNavigation();
      }
    }

    //Visit activity page and filter the list of active employees
    let activeEmployees = [];
    for (
      let employeeUrl = 0;
      employeeUrl < profileLinks.length;
      employeeUrl++
    ) {
      let profileLink = profileLinks[employeeUrl];

      //Visit activity page
      await page.goto(profileLink + "/detail/recent-activity", {
        waitUntil: waitUntilOptions,
      });
      //Find time of last activities of a user(likes, comments, posts)
      const individualActivities = await page.evaluate(() => {
        let timeOfActivity = [];
        const timeSelector =
          "div.feed-shared-actor__meta.relative >" +
          " span.feed-shared-actor__sub-description.t-12.t-black--light.t-normal" +
          " > span > span.visually-hidden";
        if (document.querySelectorAll(timeSelector)) {
          document.querySelectorAll(timeSelector).forEach((item) => {
            if (item.innerHTML) {
              //Log all user activity within a week
              if (
                item.innerHTML.match(/[0-9] (minutes?|hours?|days?|week) ago/)
              )
                timeOfActivity.push(item.innerHTML);
            }
          });
        }
        return timeOfActivity;
      });

      //Return links to active employees
      if (individualActivities.length) await activeEmployees.push(profileLink);
    }
    console.log(`Active users : `, activeEmployees);
    if (!fs.existsSync("./output")) {
      // check for existing output directory, create it if necessary
      fs.mkdirSync("./output");
    }

    const pageName = `page${0}`;
    let currPage = [];
    activeEmployees.forEach((employee) => {
      currPage.push(employee);
    });
    pages.push({ [pageName]: currPage });

    output = { activeProfiles: pages };
    fs.appendFile(fileName, JSON.stringify(output, null, "\t"), (err) => {
      if (err) throw err;
    });

    await browser.close();
  } catch (err) {
    console.error("Oops! An error occured.");
    console.error(err);
    await browser.close();
  }
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

scrapeLinkedIn({
  username: process.env.EMAIL,
  password: process.env.PASSWORD,
  company: process.env.COMPANY,
});
