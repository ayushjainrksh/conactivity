<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[logo]: https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square 'All Contributors'
<!-- ALL-CONTRIBUTORS-BADGE:END -->

*Hi :wave:, this project is being actively developed and maintained. If you would like to receive updates about the progress, you can follow [@ayushjn_](https://twitter.com/ayushjn_) on Twitter :bust_in_silhouette:.*

<h1 align="center">
    ConActivity
</h1>

<p align="center">
    <em>"Connect with active LinkedIn users"</em>
</p>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ayushjainrksh/conactivity/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ayushjainrksh/conactivity.svg)](https://GitHub.com/ayushjainrksh/conactivity/issues/)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ayushjainrksh/conactivity/blob/master/CONTRIBUTING.md)
[![All Contributors][logo]](#contributors-)
[![GitHub stars](https://img.shields.io/github/stars/ayushjainrksh/conactivity.svg?style=social&label=Star&maxAge=2592000)](https://github.com/ayushjainrksh/conactivity/stargazers/)
[![Follow @ayushjn_](https://img.shields.io/twitter/follow/ayushjn_.svg?label=Follow%20@ayushjn_)](https://twitter.com/intent/follow?screen_name=ayushjn_)

**Do you find it difficult to network with people on LinkedIn?**

If most of your connection requests to recruiters or employees are not being accepted then there's a possibility that:

- You didn't attach an invite note with the connection request (but you can eliminate this next time when you send the requests).
- A particular employee might not be interested in accepting the connections or is not interested in your profile (this rarely happens).
- The **most frequent reason** for a connection request not being accepted is that the employee **may not be active** on LinkedIn or does not have time to check their account.

To avoid waste of time and effort sending connection requests to inactive LinkedIn members, use **ConActivity**.

**ConActivity** is a tool that scrapes LinkedIn data and returns the profile links of a company's employees active on LinkedIn. Using ConActivity, you can target active LinkedIn users and send connection requests.

## Getting started

Try it out!

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Usage

- Clone the repo.
  #### `git clone https://github.com/ayushjainrksh/conactivity.git`
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

> Wait for the script to complete parsing. The links would appear in the terminal. You can visit the active user profiles and connect by attaching an invite note. Update the `.env` file to repeat the process for any other company.

## How does it work?

1. The user enters the company's LinkedIn handle and runs ConActivity.
2. The script launches an automated browser tab.
3. The user is logged in with their account credentials automatically.
4. The script redirects to the company's profile page and visits the `all employees` page from there.
5. Now the script scrapes all the links to user profiles and visits their activity pages one by one.
6. It parses the last 5 activities(likes, comments, posts, etc.) of employees.
7. The script return urls of the employees active on linkedIn within a week.
8. You can use these URLs to visit the profiles and send connection requests.

## Features

- Get direct LinkedIn handles of active employees of a company in a few minutes.
- LinkedIn users won't be notified when you use the script as it doesn't visit their profiles.

## Caveats

- Problematic with slow internet speed (check your internet connection and try again).
- There's a limit to the number of LinkedIn logins at a given time (if you see a security check on login, please wait for some time before using the script again).

## LICENCE

ConActivity is licenced under the [MIT Licence](https://github.com/ayushjainrksh/conactivity/blob/master/LICENSE).

## Contributing :heart:

Follow [contributing.md](https://github.com/ayushjainrksh/conactivity/blob/master/CONTRIBUTING.md) to start contributions.

## Code of Conduct

Read our [code_of_conduct.md](https://github.com/ayushjainrksh/conactivity/blob/master/CODE_OF_CONDUCT.md)

> If you get stuck somewhere, feel free to open an issue for discussion or shoot a DM on my socials.

## Terms of service

Please read LinkedIn's [User agreement](https://www.linkedin.com/legal/user-agreement) before using this script.

This script is being used for educational purposes only and discourages users to scrape large amount of data at a time as this can lead to the termination of their LinkedIn account. The author or any of the contributor doesn't hold any responsibility in such a case whatsoever. It is recommended to use a secondary LinkedIn account to use the script for a longer period of time to avoid the risk of losing your LinkedIn account.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/ayushjainrksh"><img src="https://avatars3.githubusercontent.com/u/33171576?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ayush Jain</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=ayushjainrksh" title="Code">💻</a> <a href="https://github.com/ayushjainrksh/conactivity/commits?author=ayushjainrksh" title="Documentation">📖</a></td>
    <td align="center"><a href="http://nancychauhan.in/"><img src="https://avatars2.githubusercontent.com/u/37153406?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nancy Chauhan </b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=Nancy-Chauhan" title="Code">💻</a> <a href="https://github.com/ayushjainrksh/conactivity/issues?q=author%3ANancy-Chauhan" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://godslayer201.github.io/"><img src="https://avatars3.githubusercontent.com/u/57140143?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rachitt Shah</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=godslayer201" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Swapnil-2001"><img src="https://avatars0.githubusercontent.com/u/53232360?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Swapnil Sengupta</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=Swapnil-2001" title="Documentation">📖</a></td>
    <td align="center"><a href="https://rajkumaar.co.in"><img src="https://avatars1.githubusercontent.com/u/37476886?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rajkumar S</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=rajkumaar23" title="Code">💻</a> <a href="https://github.com/ayushjainrksh/conactivity/issues?q=author%3Arajkumaar23" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://cwille97.github.io"><img src="https://avatars2.githubusercontent.com/u/24487628?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cedric Wille</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=cwille97" title="Code">💻</a></td>
    <td align="center"><a href="http://amandesai01.github.io"><img src="https://avatars3.githubusercontent.com/u/39585600?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aman Desai</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=amandesai01" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/StaniPetrosyan"><img src="https://avatars2.githubusercontent.com/u/40838627?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stanislav Petrosyan</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=StaniPetrosyan" title="Documentation">📖</a></td>
    <td align="center"><a href="http://tushars.xyz"><img src="https://avatars.githubusercontent.com/u/21238991?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tushar Singh</b></sub></a><br /><a href="https://github.com/ayushjainrksh/conactivity/commits?author=tushar1210" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
