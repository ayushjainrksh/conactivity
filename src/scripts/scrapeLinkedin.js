const puppeteer = require("puppeteer");
const fs = require("fs");
const rxjs = require("rxjs");
const { mergeMap, toArray, filter } = require("rxjs/operators");
const { linkedinLogin } = require("./login");
const { urls, selectors } = require("../constants");
const { fileIO, formatters, scroll } = require("../utils");

/**
 * Fetch all profile links
 * @param {Promise} page Promise of Browser page
 * @param {Number} pagesToVisit Specifies the number of page to scrape (defaults to 2)
 */
const fetchProfileLinks = async (page, pagesToVisit = 2) => {
  let profileLinks = [];
  for (let pageNumber = 0; pageNumber < pagesToVisit; pageNumber++) {
    await scroll.autoScroll(page);

    //Fetch all profile links from the page
    profileLinks.push(
      ...(await page.evaluate(() => {
        //Multiple selectors for different displays of LinkedIn(see issue #20)
        const profileListSelectors = selectors.PROFILE_LINK_SELECTORS;
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
              // Remove query params from URL
              profiles.push(formatters.removeQueryParamsFromUrl(profile.href));
            }
          });
          return profiles;
        }
      }))
    );

    if (pageNumber < pagesToVisit - 1) {
      //Click on next button on the bottom of the profiles page
      await page.click(selectors.BOTTOM_NAV_NEXT_BUTTON);
      await page.waitForNavigation();
    }
  }
  return profileLinks;
};

/**
 * Filter and return active employees (any activity withing 1 week)
 * from all employees by visiting their activity page
 * @param {Promise} page Promise of Browser page
 * @param {Array.<String>} profileLinks A list of scraped profile links
 * @param {Array.<String>} waitUntilOptions Puppeteer options
 * @param {Number} numOfParallelTabs Number of profiles to visit in parallel tabs
 */
const fetchEachProfileActivityInParallel = async (
  page,
  profileLinks,
  waitUntilOptions,
  numOfParallelTabs = 5
) => {
  return rxjs.from(profileLinks).pipe(
    mergeMap(async (profileLink) => {
      //Visit activity page
      await page.goto(urls.userProfileUrl(profileLink), {
        waitUntil: waitUntilOptions,
      });

      //Find time of last activities of a user(likes, comments, posts)
      const individualActivities = await page.evaluate(() => {
        let timeOfActivity = [];
        if (document.querySelectorAll(selectors.TIME_SELECTOR)) {
          document.querySelectorAll(selectors.TIME_SELECTOR).forEach((item) => {
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
      if (individualActivities.length) {
        return profileLink;
      } else {
        return null;
      }
    }, numOfParallelTabs),
    filter((profileLink) => !!profileLink),
    toArray()
  );
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
    page.setDefaultNavigationTimeout(0);

    //Check if cookies are stored in cookie.json and use that data to skip login
    const previousSession = fs.existsSync("./cookie.json");
    if (previousSession) {
      //Load the cookies
      const cookiesArr = require("../../cookie.json");
      if (cookiesArr.length !== 0) {
        //Set each browser cookie
        for (let cookie of cookiesArr) {
          await page.setCookie(cookie);
        }
        console.log("Previous session loaded successfully!");
      }
    } else {
      //Visit LinkedIn
      await page.goto(urls.LINKEDIN_URL);

      //Login to your account
      await linkedinLogin(data.username, data.password, page);
    }

    try {
      //Visit the company's page and find the list of employees
      console.log(urls);
      await page.goto(urls.companyProfileUrl(data.company), {
        waitUntil: waitUntilOptions,
      });

      //Visit all employees from the company's page
      await page.click(selectors.VISIT_ALL_EMPLOYEES);
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
    const profileLinks = await fetchProfileLinks(page);

    //Visit activity page and filter the list of active employees
    const activeEmployeesObservable = await fetchEachProfileActivityInParallel(
      page,
      profileLinks,
      waitUntilOptions
    );
    const activeEmployees = await rxjs.lastValueFrom(activeEmployeesObservable);
    console.log("Active users : ", activeEmployees);

    //Save profiles to a file
    fileIO.saveProfiles(activeEmployees);

    await browser.close();
  } catch (err) {
    console.error("Oops! An error occured.");
    console.error(err);
    await browser.close();
  }
};

module.exports = {
  fetchProfileLinks,
  fetchEachProfileActivityInParallel,
  scrapeLinkedIn,
};
