import axios from 'axios';
import { BASE_URL, API_KEY, IMAGES_PER_PAGE } from '../constants';
import notiflix from 'notiflix';

const pixabayService = {
  searchImages: async (query, page = 1, perPage = IMAGES_PER_PAGE) => {
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
          hits: [],
          totalHits: 0,
        };
      }

      if (hits.length === 0) {
        notiflix.Notify.info(
          'Sorry, there are no images matching your request...'
        );
        return {
          hits: [],
          totalHits: 0,
        };
      }

      return {
        hits,
        totalHits,
      };
    } catch (error) {
      notiflix.Notify.failure(`Error: ${error.message}`);
      throw new Error(error.message);
    }
  },
};

export default pixabayService;
