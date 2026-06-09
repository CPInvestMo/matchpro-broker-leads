const axios = require('axios');
const cheerio = require('cheerio');

// Dubizzle Scraper
const scrapeDubizzleListings = async () => {
  console.log("🔍 Scraping Dubizzle Listings...");
  const baseURL = "https://www.dubizzle.com.eg/properties/apartments-for-sale";

  try {
    const response = await axios.get(baseURL);
    const $ = cheerio.load(response.data);

    const listings = [];

    $('.result-card').each((index, element) => {
      const title = $(element).find('.result-title').text();
      const price = $(element).find('.result-price').text();
      const location = $(element).find('.result-meta-location').text();
      const link = $(element).find('a').attr('href');

      listings.push({
        title,
        price,
        location,
        link: `https://www.dubizzle.com.eg${link}`
      });
    });

    console.log("✅ Dubizzle Listings:", listings);
    return listings;
  } catch (error) {
    console.error("❌ Failed to scrape Dubizzle listings:", error.message);
    return [];
  }
};

scrapeDubizzleListings();
module.exports = scrapeDubizzleListings;