import React, { useState, useEffect } from 'react';
import Searchbar from './searchbar/Searchbar';
import Loader from './loader/Loader';
import ImageGallery from './imageGallery/ImageGallery';
import ScrollButton from './scrollButton/ScrollButton';
import Button from './loadMoreButton/LoadButton';
import Modal from './modal/Modal';
import pixabayService from './services/pixabayService';

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
  try {
    const { images: fetchedImages, totalHits } =
      await pixabayService.searchImages(query, page);

    if (totalHits === 0) {
      setIsLastPage(true);
      return;
    }

    setImages(prevImages => updateImages(prevImages, fetchedImages));
    setPage(page + 1);
  } catch (error) {
    setError(error.message);
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
    const fetchData = async () => {
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
