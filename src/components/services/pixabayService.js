import axios from 'axios';

const API_KEY = '34187261-edb3bdfe414ee3b7adebeccc5';
const BASE_URL = 'https://pixabay.com/api/';

const searchImages = async (query, page) => {
  try {
    const apiUrl = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${page}&per_page=10`;
    const response = await axios.get(apiUrl);

    if (response.data.hits.length === 0) {
      return { images: [], totalHits: 0 };
    }

    return { images: response.data.hits, totalHits: response.data.totalHits };
  } catch (error) {
    throw new Error(error.message);
  }
};

const pixabayService = { searchImages };

export default pixabayService;
