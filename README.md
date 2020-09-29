*Hi :wave:, this project is being actively developed and maintained. If you would like to receive updates about the progress you can follow [@ayushjn_](https://twitter.com/ayushjn_) on Twitter :bust_in_silhouette:.*

<h1 align="center">
    ConActivity
</h1>

<p align="center">
    <em>"Connect with active LinkedIn users"</em>
</p>

<p align="center">
  <a href="https://github.com/ayushjainrksh/conactivity/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="ConActivity is released under the MIT license." />
  </a>
  <a href="https://github.com/ayushjainrksh/conactivity/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=ayushjn_">
    <img src="https://img.shields.io/twitter/follow/ayushjn_.svg?label=Follow%20@ayushjn_" alt="Follow @ayushjn_" />
  </a>
</p>

**Do you find it difficult to network with people on LinkedIn?**

If most of your connection requests to recruiters or employees are not being accepted then there's a possibiliy that:
- You didn't attach an invite note with the connection request (but you can eliminate this next time when you send the requests).
- A particular employee might not be interested in accepting the connections or is not interested in your profile (this rarely happens).
- The **most frequent reason** for a connection request not being accepted is that the employee **may not be active** on LinkedIn or does not have time to check their account.

To avoid waste of time and effort required in sending connection request to inactive LinkedIn members, use **ConActivity**.

**ConActivity** is a tool that scrapes LinkedIn data and returns the profile links of a company's employees active on LinkedIn. Using ConActivity you can target active LinkedIn users and send connection requests.

## Getting started
Try it out!

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Usage
- Clone the repo.
  #### `git clone https://github.com/ayushjainrksh/linkedin-scraper.git`
- Navigate to the cloned repo.
  #### `cd conactivity`
- In the root directory, install dependencies.
  #### `npm install`
- Add your credentials
  - Create a `.env` file in the root directory.
    #### `touch .env`
  - Add your LinkedIn account credentials and the company's LinkedIn handle. Your `.env` file should look like:
    ```
    EMAIL=<LinkedIn email ID>
    PASSWORD=<LinkedIn password>
    COMPANY=google
    ```
- Now you're all set. Run the script.
  #### `npm start`

> Wait for the script to complete parsing. The links would appear on the terminal. You can visit the active user profiles and connect by attaching a invite note. Update the `.env` file to repeat the process for any other company.

## How it works?
1. User enters the company's LinkedIn handle and runs ConActivity.
2. The script launches an automated browser tab.
3. The user is logged in with their account credentials automatically.
4. The script redirects to company's profile page and visits `all employees` page from there.
5. Now the script scrapes all the links to user profiles and visits their activity page one by one.
6. It parses the last 5 activities(likes, comments, post, etc.) of employees.
7. The script return urls of the employees active on linkedIn within a week.
8. You can use these URLs to visit the profiles and send connection requests.

## Features
- Get direct LinkedIn handles of active employees of a company in a few minutes.
- LinkedIn users won't be notified when you use the script as it doesn't visit their profiles.

## Caveats
- Problematic with slow internet speed (check your internet connection and try again).
- There's a limit to number of LinkedIn logins at a given time (if you see a security check on login, please wait for some time before using the script again).

## LICENCE
ConActivity is licenced under the [MIT Licence](https://github.com/ayushjainrksh/conactivity/blob/master/LICENSE).

## Contributing :heart:
Follow [contributing.md](https://github.com/ayushjainrksh/conactivity/blob/master/CONTRIBUTING.md) to start contributions.

## Code of Conduct
Read our [code_of_conduct.md](https://github.com/ayushjainrksh/conactivity/blob/master/CODE_OF_CONDUCT.md)

> If you get stuck somewhere, feel free to open an issue for discussion or shoot a DM on my socials.

## Terms of service
Please read LinkedIn's [User agreement](https://www.linkedin.com/legal/user-agreement) before using this script. 

This script is being used for educational purposes only and discourages users to scrape large amount of data at a time as this can lead to their LinkedIn account termination. The author or any of the contributor doesn't hold any responsibility in such a case whatsoever. It is recommended to use a secondary LinkedIn account to use the script for a longer period of time to avoid risk of losing your LinkedIn account.
