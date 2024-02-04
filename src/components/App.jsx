import React, { useState, useEffect } from 'react';
import Searchbar from './searchbar/Searchbar';
import Loader from './loader/Loader';
import ImageGallery from './imageGallery/ImageGallery';
import ScrollButton from './scrollButton/ScrollButton';
import Button from './loadMoreButton/LoadButton';
import Modal from './modal/Modal';
import pixabayService from './services/pixabayService';
import { IMAGES_PER_PAGE } from './constants';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!query) return;
    async function getImages() {
      try {
        setShowButton(true);
        setIsLoading(true);
        const { hits, totalHits: responseTotalHits } =
          await pixabayService.searchImages(query, page);

        if (!hits.length) {
          return setQuery('');
        }

        const modifiedHits = hits.map(
          ({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          })
        );

        setImages(prevImages => [...prevImages, ...modifiedHits]);
        setTotalHits(responseTotalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getImages();
  }, [page, query]);

  const handleSearchSubmit = newQuery => {
    if (query === newQuery) {
      return;
    }
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setTotalHits(1);
    setIsLoading(false);
    setError(null);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  const loadMoreBtn = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Searchbar onSubmit={handleSearchSubmit} />
      {error && <p>Error: {error}</p>}
      <ImageGallery images={images} onItemClick={handleImageClick} />
      {isLoading && <Loader />}
      {!isLoading && totalHits / IMAGES_PER_PAGE > page && showButton && (
        <Button onClick={loadMoreBtn} />
      )}
      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}
      <ScrollButton />
    </>
  );
};

export default App;
