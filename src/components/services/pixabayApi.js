// pixabayApi.js
import pixabayService from './pixabayService';

const fetchImages = async (
  query,
  page,
  updateImages,
  setPage,
  setIsLastPage,
  setIsLoading,
  setError
) => {
  setIsLoading(true);

  try {
    const { images: fetchedImages, totalHits } =
      await pixabayService.searchImages(query, page);

    await new Promise(resolve => setTimeout(resolve, 1000));

    updateImages(fetchedImages);

    setPage(page + 1);

    setIsLastPage(fetchedImages.length >= totalHits);
  } catch (error) {
    setError(error.message);
  } finally {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }
};

export default fetchImages;
