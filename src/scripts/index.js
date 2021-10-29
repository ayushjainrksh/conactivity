const { scrapeLinkedIn } = require("./scrapeLinkedin");

scrapeLinkedIn({
  username: process.env.EMAIL,
  password: process.env.PASSWORD,
  company: process.env.COMPANY,
});
