import pixabayService from './pixabayService';

// Funcția pentru obținerea imaginilor din API-ul Pixabay:
const fetchImages = async (
  query, // Cuvântul cheie pentru căutare
  page, // Numărul paginii de rezultate căutate (implicit 1)
  updateImages, // Funcția pentru actualizarea imaginilor în starea componentei principale (App)
  setPage, // Funcția pentru actualizarea numărului paginii în starea componentei
  setIsLastPage, // Funcția pentru actualizarea indicatorului ultimei pagini în starea componentei
  setIsLoading, // Funcția pentru actualizarea stării de încărcare în starea componentei
  setError // Funcția pentru gestionarea erorilor în starea componentei
) => {
  setIsLoading(true);

  try {
    // Încărcare imaginilor de la API
    const { images: fetchedImages, totalHits } =
      await pixabayService.searchImages(query, page);

    // Așteptare 1 secundă după ce imaginile au fost încărcate
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Actualizăm imaginile în starea componentei, adăugând imaginile noi la cele existente
    updateImages(fetchedImages);

    // Actualizăm numărul paginii în starea componentei, trecând la pagina următoare
    setPage(page + 1);

    // Actualizăm indicatorul ultimei pagini în funcție de condiția specificată
    setIsLastPage(fetchedImages.length >= totalHits);
  } catch (error) {
    setError(error.message);
  } finally {
    // Oprim Loader-ul după 1 secundă
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }
};

export default fetchImages;
