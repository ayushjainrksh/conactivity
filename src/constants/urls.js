// Constants
const LINKEDIN_URL = "https://www.linkedin.com";

// Functions
const companyProfileUrl = (companyName) => {
  return `${LINKEDIN_URL}/company/${companyName}`;
};

const userProfileUrl = (profileLink) => {
  return `${profileLink}/detail/recent-activity`;
};

module.exports = {
  LINKEDIN_URL,
  companyProfileUrl,
  userProfileUrl,
};
