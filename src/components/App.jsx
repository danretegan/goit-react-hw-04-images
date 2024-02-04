import React, { useState, useEffect } from 'react';
import Searchbar from './searchbar/Searchbar';
import Loader from './loader/Loader';
import ImageGallery from './imageGallery/ImageGallery';
import ScrollButton from './scrollButton/ScrollButton';
import Button from './loadMoreButton/LoadButton';
import Modal from './modal/Modal';
import pixabayService from './services/pixabayService';
import Notiflix from 'notiflix';

const updateImages = (prevImages, fetchedImages) => [
  ...prevImages,
  ...fetchedImages,
];

const fetchImagesApp = async (
  query,
  page,
  setImages,
  setPage,
  setIsLoading,
  setError,
  setIsLastPage
) => {
  setIsLoading(true);
  console.log('Fetching images...');
  try {
    const { images: fetchedImages, totalHits } =
      await pixabayService.searchImages(query, page);

    console.log('Total hits:', totalHits);

    if (totalHits === 0) {
      setIsLastPage(true);
      Notiflix.Notify.info('No images found. Please try another search term.');
      return;
    }

    setImages(prevImages => updateImages(prevImages, fetchedImages));
    setPage(page + 1);
    const remainingImages = totalHits - page * 12;
    const successMessage = `Found ${totalHits} images for "${query}". <br/>${remainingImages} images remained to be seen.`;
    Notiflix.Notify.success(successMessage);
  } catch (error) {
    setError(error.message);
    Notiflix.Notify.failure(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const handleSearchSubmit = newQuery => {
    if (query === newQuery) {
      return;
    }

    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setError(null);
    setIsLastPage(false);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    console.log('Effect is running...');
    const fetchData = async () => {
      console.log('Fetching data...');
      if (query && (page === 1 || isLastPage)) {
        setImages([]);
        await fetchImagesApp(
          query,
          page,
          setImages,
          setPage,
          setIsLoading,
          setError,
          setIsLastPage
        );
      }
    };

    fetchData();
  }, [query, page, isLastPage, setImages, setPage, setIsLoading, setError]);

  return (
    <>
      <Searchbar onSubmit={handleSearchSubmit} />
      {error && <p>Error: {error}</p>}
      <ImageGallery images={images} onItemClick={handleImageClick} />
      {isLoading && <Loader />}
      {!isLoading && images.length > 0 && !isLastPage && (
        <Button
          onClick={() =>
            fetchImagesApp(
              query,
              page,
              setImages,
              setPage,
              setIsLoading,
              setError,
              setIsLastPage
            )
          }
        />
      )}

      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}

      <ScrollButton />
    </>
  );
};

export default App;
