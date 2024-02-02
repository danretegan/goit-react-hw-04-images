import axios from 'axios';
import notiflix from 'notiflix';

const API_KEY = '34187261-edb3bdfe414ee3b7adebeccc5';
const BASE_URL = 'https://pixabay.com/api/';

const pixabayService = {
  searchImages: async (query, page = 1, perPage = 12) => {
    try {
      const response = await axios.get(
        `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`
      );

      const { hits, totalHits } = response.data;

      if (!Array.isArray(hits)) {
        notiflix.Notify.failure(
          'Invalid response format. Hits should be an array.'
        );
        return {
          images: [],
          totalHits: 0,
        };
      }

      if (hits.length === 0) {
        notiflix.Notify.info(
          'Sorry, there are no images matching your request...'
        );
        return {
          images: [],
          totalHits: 0,
        };
      }

      const modifiedHits = hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );

      return {
        images: modifiedHits,
        totalHits,
      };
    } catch (error) {
      notiflix.Notify.failure(`Error: ${error.message}`);
      throw new Error(error.message);
    }
  },
};

export default pixabayService;
