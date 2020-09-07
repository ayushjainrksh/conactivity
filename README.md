# LinkedIn Scraper

Do you find it difficult to network with people on LinkedIn?
If most of your connection requests to recruiters or employees are not being accepted then there's a possibiliy that:
- You didn't attach an invite note with the connection request (but you can eliminate this next time when you send the requests).
- A particular employee might not be interested in accepting the connections or is not interested in your profile (this rarely happens).

The most frequent reason for a request not being accepted is that the employee may not be active on LinkedIn or does not have time to check their account.

To avoid waste of time and effort required to connect with inactive LinkedIn members, I have written a tool which you can use to get the links of active employees working in a particular company. Using this tool you can target the employees or recruiters who are active on LinkedIn.

## How it works?
- User enter the company's LinkedIn handle.
- The script launches an automated browser tab.
- The user is logged in with their account credentials.
- The script redirects to company's profile page and visits `all employees` page from there.
- Now the script scrapes all the links to user profiles and visits their activity page one by one.
- It parses the last 5 activities(likes, comments, post, etc.) of employees.
- The script return urls of the employees active on linkedIn within a week.

## Prerequisites
- Node.js
- Git

## Usage
- Clone the repo.
  #### `git clone https://github.com/ayushjainrksh/linkedin-scraper.git`
- Install dependencies.
  #### `npm install`
- Add credentials
  - Create a `.env` file in the root directory.
    #### `touch .env`
  - Add your LinkedIn account credentials and name of the company to be scraped. Your `.env` file should look like:
    ```
    EMAIL:<Email id associated with LinkedIn>
    PASSWORD:<You LinkedIn password>
    COMPANY:google
    ```
- Now you're all set. Run the script.
  #### `npm start`
- Wait for the script complete parsing. The links would appear on the terminal.
