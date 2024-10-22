const axios = require('axios');

/*
Each API call is wrapped in a try/catch block to handle any errors that might occur
during the requests (failed API call, invalid API key).
If any API fails or returns no results, the next category attempt is made.

DOCS: https://developer.themoviedb.org/docs/search-and-query-for-details

 */
const categorizeItem = async (itemName) => {
  // Attempt to categorize as a movie/series
  try {
    const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY, // TMDb API Key from .env file
        query: itemName
      }
    });
    //look in the resutl field, length is how many movies match the query
    if (movieResponse.data.results.length > 0) {
      console.log(`Categorized as movie: ${itemName}`);
      console.log(movieResponse.data.results[0].overview);

      return 'Film/Series';
    }
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }

  // Fallback if no category is detected
  console.log(`Item could not be categorized: ${itemName}`);
  return 'Uncategorized';
};

module.exports = { categorizeItem };
