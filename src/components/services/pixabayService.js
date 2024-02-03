import axios from 'axios';
import notiflix from 'notiflix';

const API_KEY = '34187261-edb3bdfe414ee3b7adebeccc5';
const BASE_URL = 'https://pixabay.com/api/';

// Serviciul Pixabay care furnizează funcția de căutare a imaginilor
const pixabayService = {
  // Funcția asincronă pentru căutarea imaginilor
  searchImages: async (query, page = 1, perPage = 12) => {
    try {
      // Realizăm o cerere GET către API-ul Pixabay utilizând Axios
      const response = await axios.get(
        `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`
      );

      // Extragem informațiile necesare din răspunsul API-ului
      const { hits, totalHits } = response.data;

      // Validăm formatul răspunsului pentru a evita erori de manipulare
      if (!Array.isArray(hits)) {
        notiflix.Notify.failure(
          'Invalid response format. Hits should be an array.'
        );
        return {
          images: [],
          totalHits: 0,
        };
      }

      // Informăm utilizatorul dacă nu există imagini pentru căutarea specificată
      if (hits.length === 0) {
        notiflix.Notify.info(
          'Sorry, there are no images matching your request...'
        );
        return {
          images: [],
          totalHits: 0,
        };
      }

      // Afișează notificarea doar pentru prima pagină
      if (page === 1) {
        notiflix.Notify.info(`Found ${totalHits} images for your search.`);
      }

      // Modificăm formatul obiectelor imagine pentru a corespunde structurii așteptate
      const modifiedHits = hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );

      // Returnăm un obiect ce conține imagini modificate și totalul de imagini disponibile
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
