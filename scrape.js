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
  return new Promise((resolve, reject) => {
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
        waitUntil: ["domcontentloaded", "networkidle2"],
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
    for (let pageNumber = 0; pageNumber < 2; pageNumber++) {
      //Fetch all profile links from the page
      profileLinks = await page.evaluate(() => {
        if (
          document.querySelectorAll(
            ".search-result__info .search-result__result-link"
          )
        ) {
          //Store and return profile links
          let profiles = [];
          document
            .querySelectorAll(
              ".search-result__info .search-result__result-link"
            )
            .forEach((profile) => {
              if (profile.href) {
                profiles.push(profile.href);
              }
            });
          return profiles;
        }
      });

      //Visit activity page and filter the list of active employees
      let activeEmployees = [];
      for (
        let employeeUrl = 0;
        employeeUrl < profileLinks.length;
        employeeUrl++
      ) {
        let profileLink = profileLinks[employeeUrl];

        //Visit activity page
        await page.goto(profileLink + "detail/recent-activity");

        //Find time of last activities of a user(likes, comments, posts)
        const individualActivities = await page.evaluate(() => {
          let timeOfActivity = [];
          if (
            document.querySelectorAll(
              "div.feed-shared-actor__meta.relative > span.feed-shared-actor__sub-description.t-12.t-black--light.t-normal > div > span.visually-hidden"
            )
          ) {
            document
              .querySelectorAll(
                "div.feed-shared-actor__meta.relative > span.feed-shared-actor__sub-description.t-12.t-black--light.t-normal > div > span.visually-hidden"
              )
              .forEach((item) => {
                if (item.innerHTML) {
                  //Log all user activity within a week
                  if (
                    item.innerHTML.match(
                      /[0-9] (minutes?|hours?|days?|week) ago/
                    )
                  )
                    timeOfActivity.push(item.innerHTML);
                }
              });
          }
          return timeOfActivity;
        });

        //Return links to active employees
        if (individualActivities.length)
          await activeEmployees.push(profileLink);

        //Return to the search page
        await page.goBack();
      }

      console.log(`Active users on page ${pageNumber}: `, activeEmployees);

      if (!fs.existsSync("./output")) {
        // check for existing output directory, create it if necessary
        fs.mkdirSync("./output");
      }

      const pageName = `page${pageNumber}`;
      let currPage = [];
      activeEmployees.forEach((employee) => {
        currPage.push(employee);
      });
      pages.push({ [pageName]: currPage });

      //Navigate to the next page
      profileLinks = [];
      await page.click(
        ".artdeco-pagination__button.artdeco-pagination__button--next"
      );
      await page.waitForNavigation();
    }

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

scrapeLinkedIn({
  username: process.env.EMAIL,
  password: process.env.PASSWORD,
  company: process.env.COMPANY,
});
