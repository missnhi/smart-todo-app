
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
    errors: [], // to store any API errors
    displayInformation: null // To store the display information for the front-end
  };

  try {
    // const [ ebayResponse] = await Promise.all([
    const [bookResponse, movieResponse, placeResponse] = await Promise.all([
    // const [bookResponse, movieResponse, placeResponse, ebayResponse] = await Promise.all([
      //Google Books API
      axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: { q: itemName, key: process.env.GOOGLE_BOOKS_API_KEY }
      }),

      //TMBD API for movies
      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: { api_key: process.env.TMDB_API_KEY, query: itemName }
      }),

      //Google Places API
      axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
        params: {
          input: itemName,
          inputtype: 'textquery',
          locationbias: `circle:2000@${userLocation}`,
          fields: 'formatted_address,name,rating,opening_hours,geometry',
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }),
      // //Ebay API
      // axios.get('https://api.ebay.com/buy/browse/v1/item_summary/search', {
      //   params: {
      //     q: itemName // The product name provided by the user
      //   },
      //   headers: {
      //     'Authorization': `Bearer ${process.env.ebayOAuthToken}`,
      //     'Content-Type': 'application/json',
      //     'X-EBAY-C-MARKETPLACE-ID': 'EBAY_CA' // Target the Canadian marketplace
      //   }
      // })
    ]);

    // Movie
    const exactMovieMatchResults = movieResponse.data.results.filter(movie =>
      exactMatch(movie.original_title, itemName)
    );
    if (exactMovieMatchResults.length > 0) {
      results.category = 'ToWatch';
      results.displayInformation = {
        title: exactMovieMatchResults[0].original_title,
        overview: exactMovieMatchResults[0].overview,
        releaseDate: exactMovieMatchResults[0].release_date
      };
      return results;
    }

    // Book
    const exactBookMatchResults = bookResponse.data.items.filter(item =>
      exactMatch(item.volumeInfo.title, itemName)
    );
    if (exactBookMatchResults.length > 0) {
      results.category = 'ToRead';
      results.displayInformation = {
        title: exactBookMatchResults[0].volumeInfo.title,
        thumbnail: exactBookMatchResults[0].volumeInfo.imageLinks.thumbnail,
        previewLink: exactBookMatchResults[0].volumeInfo.previewLink
      };
      return results;
    }

    // Restaurant
    const exactPlaceMatchResults = placeResponse.data.candidates.filter(candidate =>
      exactMatch(candidate.name, itemName)
    );
    if (exactPlaceMatchResults.length > 0) {
      results.category = 'ToEat';
      results.displayInformation = {
        name: exactPlaceMatchResults[0].name,
        address: exactPlaceMatchResults[0].formatted_address,
        rating: exactPlaceMatchResults[0].rating
      };
      return results;
    }

    // // EBay
    // if (ebayResponse.data.itemSummaries && ebayResponse.data.itemSummaries.length > 0) {
    //     results.category = 'ToBuy';
    //     results.displayInformation = {
    //       title: ebayResponse.data.itemSummaries[0].title,
    //       price: ebayResponse.data.itemSummaries[0].price.value,
    //       image: ebayResponse.data.itemSummaries[0].image.imageUrl,
    //       itemUrl: ebayResponse.data.itemSummaries[0].itemWebUrl
    //     };
    //   return results;
    // }

  } catch (error) {
    results.errors.push(error.message); // Capture any errors
  }

  // Uncategorized
  return results;
};

module.exports = { categorizeItem };

