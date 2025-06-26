import {Client, Databases, ID, Query} from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const database = new Databases(client);

/**
 * Updates the search count for a given search term and movie in the Appwrite database.
 * If the movie already exists, increments the count. Otherwise, creates a new document.
 *
 * @async
 * @param {string} searchTerm - The search term used to find the movie.
 * @param {Object} movie - The movie object containing details like `id` and `poster_path`.
 * @param {number} movie.id - The unique identifier for the movie.
 * @param {string} movie.poster_path - The path to the movie's poster image.
 * @returns {Promise<void>}
 */
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    if (movie.id === undefined || movie.poster_path === undefined) {
      console.error("Movie data is incomplete:", movie);
      return;
    }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const docs = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, docs.$id, {
        count: docs.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

/**
 * Fetches the top 10 trending movies from the Appwrite database based on search count.
 *
 * @async
 * @returns {Promise<Array<Object>>} - A list of trending movies with their search term, count, ID, and poster URL.
 */
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(10),
    ]);

    return result.documents.map((doc) => ({
      searchTerm: doc.searchTerm,
      count: doc.count,
      movie_id: doc.movie_id,
      poster_url: doc.poster_url,
    }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};