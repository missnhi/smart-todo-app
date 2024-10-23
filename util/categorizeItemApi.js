
/*
Each API call is wrapped in a try/catch block to handle any errors that might occur
during the requests (failed API call, invalid API key).
If any API fails or returns no results, the next category attempt is made.

DOCS:
for movies: TMDB API
    https://developer.themoviedb.org/docs/search-and-query-for-details
for restaurants: Google Places API
    https://developers.google.com/maps/documentation/places/web-service/search-find-place
for books: Google Books API
    https://developers.google.com/books/docs/v1/using#auth
 */
// const axios = require('axios');

// const categorizeItem = async (itemName) => {
//
//   // 1. Categorize as a movie/series
//   try {
//     const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
//       params: {
//         api_key: process.env.TMDB_API_KEY, // TMDb API Key from .env file
//         query: itemName
//       }
//     });
//     //look in the resutl field, length is how many movies match the query
//     if (movieResponse.data.results.length > 0) {
//       console.log(`Number of result: ${movieResponse.data.results.length}`);
//       console.log(`Categorized as movie: ${itemName}`);
//       console.log(movieResponse.data.results[0].overview);
//
//       return 'ToWatch';
//     }
//   } catch (error) {
//     console.error('Error fetching movie data:', error);
//   }
//
//   // 2. Check if it's a book (Google Books API)
//   try {
//     const bookResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
//       params: {
//         q: itemName,
//         key: process.env.GOOGLE_BOOKS_API_KEY // Use your Google Books API key
//       }
//     });
//
//     // Filter the results to check for an exact match (case-insensitive)
//     const exactMatchResults = bookResponse.data.items.filter(item => {
//       // Google Books API returns the book title in item.volumeInfo.title
//       return item.volumeInfo.title.toLowerCase() === itemName.toLowerCase();
//     });
//
//     if (exactMatchResults.length > 0) {
//       console.log(`Number of result: ${bookResponse.data.items.length}`);
//       console.log(bookResponse.data.items[0].volumeInfo.title);
//
//       console.log(bookResponse.data.items[0].volumeInfo.imageLinks.thumbnail);
//       console.log(bookResponse.data.items[0].volumeInfo.previewLink);
//
//       return 'ToRead';
//     }
//   } catch (error) {
//     console.error('Error fetching book data:', error);
//   }
//
//   // 3. Check if it's a restaurant/cafe (Google Places API)
//   try {
//     const placeResponse = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
//       params: {
//         input: itemName, // Name of the item (restaurant/cafe)
//         inputtype: 'textquery', // input type (e.g., text query)
//         locationbias: 'circle:2000@53.530110,-113.495629', // 2km radius around Edmonton's coordinates
//         fields: 'formatted_address,name,rating,opening_hours,geometry', // Specify what fields you want in the response
//         key: process.env.GOOGLE_PLACES_API_KEY
//       }
//     });
//
//     const exactMatchResults = placeResponse.data.candidates.filter(candidate => {
//       // Perform a case-insensitive exact match of the name
//       return candidate.name.toLowerCase() === itemName.toLowerCase();
//     });
//
//     if (exactMatchResults.length > 0) {
//       console.log("Google Place API: ", placeResponse.data.candidates);
//
//       return 'ToEat'; // Return the exact match(es)
//     }
//   } catch (error) {
//     console.error('Error fetching restaurant data:', error);
//   }
//
//   // // 4. Check if it's a product (Walmart API)
//   // try {
//   //   const productResponse = await axios.get('https://api.walmartlabs.com/v1/search', {
//   //     params: {
//   //       query: itemName,
//   //       apiKey: process.env.WALMART_API_KEY // Use your Walmart API key
//   //     }
//   //   });
//   //   if (productResponse.data.items && productResponse.data.items.length > 0) {
//   //     return 'ToBuy';
//   //   }
//   // } catch (error) {
//   //   console.error('Error fetching product data:', error);
//   // }
//
//   // 5. Uncategorized if no category is detected
//   console.log(`Item could not be categorized: ${itemName}`);
//   return 'Uncategorized';
// };
//
// module.exports = { categorizeItem };


const axios = require('axios');

// Helper function to perform exact match (case-insensitive)
const exactMatch = (candidateName, itemName) => {
  return candidateName.toLowerCase() === itemName.toLowerCase();
};

// Main categorization function with parallel API requests, enhanced error handling, and configurable location bias
const categorizeItem = async (itemName, userLocation = '53.5461,-113.4938') => {
  const results = {
    category: 'Uncategorized', // default category
    errors: [] // to store any API errors
  };

  let displayInformation;

  // Parallel API requests using Promise.all
  try {
    const [movieResponse, bookResponse, placeResponse] = await Promise.all([
      // TMDB API (Movie/Series Search)
      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: process.env.TMDB_API_KEY, // TMDB API Key from .env file
          query: itemName
        }
      }),
      // Google Books API (Book Search)
      axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: itemName,
          key: process.env.GOOGLE_BOOKS_API_KEY // Google Books API Key
        }
      }),
      // Google Places API (Restaurant/Cafe Search) with configurable location bias
      axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
        params: {
          input: itemName, // Name of the item (restaurant/cafe)
          inputtype: 'textquery', // Specifies input type (text query)
          locationbias: `circle:2000@${userLocation}`, // Configurable location bias, default to Edmonton
          fields: 'formatted_address,name,rating,opening_hours,geometry',
          key: process.env.GOOGLE_PLACES_API_KEY // Google Places API Key
        }
      })
    ]);

    // Check if it's a movie/series (TMDB API)
    const movieResult = movieResponse.data.results;
    if (movieResult && movieResult.length > 0) {
      console.log(`Number of movie results: ${movieResult.length}`);
      console.log(`Categorized as movie: ${itemName}`);

      displayInformation = [movieResult[0].original_title, movieResult[0].overview, movieResult[0].release_date];
      console.log(displayInformation);
      results.category = 'ToWatch';
      return results;
    }

    // Check if it's a book (Google Books API) with exact match
    const exactBookMatchResults = bookResponse.data.items.filter(item =>
      exactMatch(item.volumeInfo.title, itemName)
    );
    if (exactBookMatchResults.length > 0) {
      console.log(`Number of book results: ${bookResponse.data.items.length}`);
      console.log(`Book Title: ${exactBookMatchResults[0].volumeInfo.title}`);
      console.log(exactBookMatchResults[0].volumeInfo.imageLinks.thumbnail);
      console.log(exactBookMatchResults[0].volumeInfo.previewLink);

      results.category = 'ToRead';
      return results;
    }

    // Check if it's a restaurant/cafe (Google Places API) with exact match
    const exactPlaceMatchResults = placeResponse.data.candidates.filter(candidate =>
      exactMatch(candidate.name, itemName)
    );
    if (exactPlaceMatchResults.length > 0) {
      console.log("Google Places API results: ", exactPlaceMatchResults);

      results.category = 'ToEat';
      return results;
    }
  } catch (error) {
    // Catch any errors during API requests and log them
    console.error('Error fetching data from APIs:', error.message);
    results.errors.push(error.message); // Add error message to the results
  }

  // If no results match, return the default category as 'Uncategorized'
  console.log(`Item could not be categorized: ${itemName}`);
  return results;
};

module.exports = { categorizeItem };

