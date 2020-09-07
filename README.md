# ConActivity
Connect with activity

**Do you find it difficult to network with people on LinkedIn?**
If most of your connection requests to recruiters or employees are not being accepted then there's a possibiliy that:
- You didn't attach an invite note with the connection request (but you can eliminate this next time when you send the requests).
- A particular employee might not be interested in accepting the connections or is not interested in your profile (this rarely happens).

The most frequent reason for a connection request not being accepted is that the employee may not be active on LinkedIn or does not have time to check their account.

To avoid waste of time and effort required in sending connection request to inactive LinkedIn members, use **ConActivity**, a tool that scrapes LinkedIn data and returns the profile links of a company's employees active on LinkedIn. Using **ConActivity** you can target active LinkedIn users and send connection request.

## How it works?
1. User enters the company's LinkedIn handle and runs ConActivity.
2. The script launches an automated browser tab.
3. The user is logged in with their account credentials automatically.
4. The script redirects to company's profile page and visits `all employees` page from there.
5. Now the script scrapes all the links to user profiles and visits their activity page one by one.
6. It parses the last 5 activities(likes, comments, post, etc.) of employees.
7. The script return urls of the employees active on linkedIn within a week.
8. You can use these URLs to visit the profiles and send connection requests.


## Getting started

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
    EMAIL:<LinkedIn email ID>
    PASSWORD:<LinkedIn password>
    COMPANY:google
    ```
- Now you're all set. Run the script.
  #### `npm start`

> Wait for the script to complete parsing. The links would appear on the terminal. You can visit the active user profiles and connect by attaching a invite note. Update the `.env` file to repeat the process for any other company.
