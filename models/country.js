// Import necessary modules
const mongoose = require('mongoose');

/**
 * Mongoose sub-Schema that represent the flag of the country
 */
const flagSchema = new mongoose.Schema({
    svg: String,
    png: String
});

/**
 * Mongoose sub-Schema that represent the currency of the country
 */
const currencySchema = new mongoose.Schema({
    code: String,
    name: String,
    symbol: String
});

/**
 * Mongoose sub-Schema that represent the language of the country
 */
const languageSchema = new mongoose.Schema({
    iso639_1: String,
    iso639_2: String,
    name: String,
    nativeName: String
});

/**
 * Mongoose sub-Schema that represent the regional bloc of the country
 */
const regionalBlocSchema = new mongoose.Schema({
    acronym: String,
    name: String
});

/**
 * Mongoose sub-Schema that represent the translation of the name of the country
 */
const translationSchema = new mongoose.Schema({
    br: String,
    pt: String,
    nl: String,
    hr: String,
    fa: String,
    de: String,
    es: String,
    fr: String,
    ja: String,
    it: String,
    hu: String
});

/**
 * Mongoose Schema that represents a country in the collection countries
 */
const countrySchema = new mongoose.Schema({
    name: String,
    topLevelDomain: [String],
    alpha2Code: String,
    alpha3Code: String,
    callingCodes: [String],
    capital: String,
    altSpellings: [String],
    subregion: String,
    region: String,
    population: Number,
    latlng: [Number],
    demonym: String,
    area: Number,
    timezones: [String],
    borders: [String],
    nativeName: String,
    numericCode: String,
    flags: flagSchema,
    currencies: [currencySchema],
    languages: [languageSchema],
    translations: translationSchema,
    flag: String,
    regionalBlocs: [regionalBlocSchema],
    cioc: String,
    independent: Boolean
});

/**
 * Helper function to format the country details
 * @param {*} course The country to be formatted 
 * @returns The desired format of the country
 */
function formatCountryDetails(country) {
    return {
      name: country.name,
      alfa3Code: country.alpha3Code,
      nativeName: country.nativeName,
      population: country.population.toLocaleString(),
      region: country.region,
      subRegion: country.subregion,
      capital: country.capital,
      flag: country.flag,
      topLevelDomain: country.topLevelDomain.join(', '), 
      currencies: country.currencies.map(c => c.name).join(', '), 
      languages: country.languages.map(lang => lang.name), 
      borderCountries: country.borders,
      area: country.area,
      numericCode: country.numericCode,
      independent: country.independent,
    };
}

/**
 * Gets all countries from the collection in a specific format
 * @returns All countries
 */
countrySchema.statics.getAllCountryDetails = async function () {
    try {
      const countries = await this.find({});
     
      // Map over each country and format it
      return countries.map(country => formatCountryDetails(country));
  
    } catch (error) {
      console.error('Error finding all country details:', error);
      throw error;
    }
};

/**
 * Gets one country from the collection based on the country name
 * @param {} countryName The name of the country
 * @returns The specific country
 */
countrySchema.statics.getCountry = async function (countryName) {
    try {
      const country = await this.findOne({ name: countryName });
      if (!country) return null;
      
      return formatCountryDetails(country);
  
    } catch (error) {
      console.error('Error finding country:', error);
      throw error;
    }
  };
// Export the the country
module.exports = mongoose.model('Country', countrySchema);
