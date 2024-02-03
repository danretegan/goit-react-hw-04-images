import axios from 'axios';
import notiflix from 'notiflix';

const API_KEY = '34187261-edb3bdfe414ee3b7adebeccc5';
const BASE_URL = 'https://pixabay.com/api/';

let hasShownNotification = false; // Variabilă pentru a verifica dacă notificarea a fost afișată

// Serviciul Pixabay care furnizează funcția de căutare a imaginilor în API-ul Pixabay:
const pixabayService = {
  // Funcția asincronă pentru căutarea imaginilor în API-ul Pixabay în funcție de un cuvânt cheie, pagină și număr de rezultate pe pagină (implicit 12):
  searchImages: async (query, page = 1, perPage = 12) => {
    try {
      // Realizăm o cerere GET către API-ul Pixabay utilizând Axios și obținem răspunsul API-ului într-o variabilă de răspuns (response):
      const response = await axios.get(
        `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`
      );

      // Extragem informațiile necesare din răspunsul API-ului Pixabay și le stocăm în variabile locale (hits și totalHits):
      const { hits, totalHits } = response.data;

      // Validăm formatul răspunsului pentru a evita erori de manipulare a datelor și pentru a afișa notificări corespunzătoare:
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

      // Modificăm formatul obiectelor imagine pentru a corespunde structurii așteptate de componenta ImageGallery:
      const modifiedHits = hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );

      // Afișează notificarea doar dacă nu a fost deja afișată pentru căutarea curentă:
      if (!hasShownNotification) {
        notiflix.Notify.info(`Found ${totalHits} images for your search.`);
        hasShownNotification = true; // Setează variabila pentru a indica că notificarea a fost afișată pentru căutarea curentă și nu trebuie afișată din nou pentru aceeași căutare în API Pixabay
      }

      // Returnăm un obiect ce conține imagini modificate și totalul de imagini disponibile pentru căutare în API Pixabay:
      return {
        images: modifiedHits,
        totalHits,
      };
    } catch (error) {
      notiflix.Notify.failure(`Error: ${error.message}`);
      throw new Error(error.message);
    } finally {
      // Resetăm variabila pentru a permite afișarea notificării pentru următoarea căutare în API Pixabay:
      hasShownNotification = false;
    }
  },
};

export default pixabayService;
