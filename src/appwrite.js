import {Client, Databases, ID, Query} from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const database = new Databases(client);

export const updateSearchCount = async (id, poster_path, title) => {
  try {
    if (id === undefined || poster_path === undefined) {
      console.error("Movie data is incomplete");
      return;
    }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", id),
    ]);

    if (result.documents.length > 0) {
      const docs = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, docs.$id, {
        count: docs.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        count: 1,
        movie_id: id,
        poster_url: `https://image.tmdb.org/t/p/w500/${poster_path}`,
        movie_name: title,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getMovieSearchCount = async (id) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", id),
    ]);

    if (result.documents.length > 0) {
      return result.documents[0].count;
    } else {
      return 1;
    }
  } catch (error) {
    console.error("Error fetching movie search count:", error);
    return 0;
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    return result.documents.map((doc) => ({
      count: doc.count,
      movie_id: doc.movie_id,
      poster_url: doc.poster_url,
      movie_name: doc.movie_name,
    }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};