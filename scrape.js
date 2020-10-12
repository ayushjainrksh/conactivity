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
 * Automating scroll inside a page
 * @param {Promise} page Promise of Browser page
 */
const autoScroll = async (page) => {
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
};

/**
 * Fetch all profile links
 * @param {Promise} page Promise of Browser page
 * @param {Number} pagesToVisit Static param, setted to 2
 */
const fetchProfileLinks = async (page, pagesToVisit = 2) => {
  let profileLinks = [];
  for (let pageNumber = 0; pageNumber < pagesToVisit; pageNumber++) {
    await autoScroll(page);

    //Fetch all profile links from the page
    profileLinks.push(
      ...(await page.evaluate(() => {
        //Multiple selectors for different displays of LinkedIn(see issue #20)
        const profileListSelectors = [
          ".search-result__info .search-result__result-link",
          ".reusable-search__entity-results-list .entity-result__title-text a",
        ];
        let profileListNodes = null;
        for (
          let profileListSelectorIndex = 0;
          profileListSelectorIndex < profileListSelectors.length;
          profileListSelectorIndex++
        ) {
          //Break the loop where profile selector matches
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
          //Store and return profile links from nodes
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

    if (pageNumber < pagesToVisit - 1) {
      //Click on next button on the bottom of the profiles page
      await page.click(
        ".artdeco-pagination__button.artdeco-pagination__button--next"
      );
      await page.waitForNavigation();
    }
  }
  return profileLinks;
};

/**
 * Get all activity of the profile
 * @param {Promise} page Promise of Browser page
 * @param {Array} profileLinks 
 * @param {String[]} waitUntilOptions 
 */
const fetchEachProfileActivity = async (
  page,
  profileLinks,
  waitUntilOptions
) => {
  let activeEmployees = [];
  //Visit each employee's profile
  for (let employeeUrl = 0; employeeUrl < profileLinks.length; employeeUrl++) {
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
            if (item.innerHTML.match(/[0-9] (minutes?|hours?|days?|week) ago/))
              timeOfActivity.push(item.innerHTML);
          }
        });
      }
      return timeOfActivity;
    });

    //Return links to active employees
    if (individualActivities.length) await activeEmployees.push(profileLink);
  }
  return activeEmployees;
};

/**
 * Save profiles data in a JSON file
 * @param {Array} activeEmployees List of active employees
 */
const saveProfiles = (activeEmployees) => {
  const time = Date.now();
  const fileName = `./output/${process.env.COMPANY}${time}.json`; // generate the a unique fileName for each run of the script

  //Save all active employee profiles to a file
  if (!fs.existsSync("./output")) {
    // check for existing output directory, create it if necessary
    fs.mkdirSync("./output");
  }

  const output = { activeProfiles: activeEmployees };
  fs.appendFile(fileName, JSON.stringify(output, null, "\t"), (err) => {
    if (err) throw err;
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

    //Fetch all profile links
    let profileLinks = await fetchProfileLinks(page);

    //Visit activity page and filter the list of active employees
    let activeEmployees = await fetchEachProfileActivity(
      page,
      profileLinks,
      waitUntilOptions
    );
    console.log("Active users : ", activeEmployees);

    //Save profiles to a file
    await saveProfiles(activeEmployees);

    await browser.close();
  } catch (err) {
    console.error("Oops! An error occured.");
    console.error(err);
    await browser.close();
  }
};

scrapeLinkedIn({
  username: process.env.EMAIL,
  password: process.env.PASSWORD,
  company: process.env.COMPANY,
});
