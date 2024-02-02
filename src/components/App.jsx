import React, { Component } from 'react';
import Searchbar from './searchbar/Searchbar';
import Loader from './loader/Loader';
import ImageGallery from './imageGallery/ImageGallery';
import ScrollButton from './scrollButton/ScrollButton';
import Button from './loadMoreButton/LoadButton';
import Modal from './modal/Modal';
import pixabayService from './services/pixabayService';

class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    query: '',
    page: 1,
    showModal: false,
    selectedImage: null,
    isLastPage: false,
  };

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.setState({ images: [], page: 1, isLastPage: false }, () => {
        this.fetchImages();
      });
    }
  }

  fetchImages = async () => {
    const { query, page } = this.state;

    this.setState({ isLoading: true });

    try {
      // Încărcare imaginilor
      const { images, totalHits } = await pixabayService.searchImages(
        query,
        page
      );

      // Așteptare 1 secundă după ce imaginile au fost încărcate
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.setState(prevState => ({
        images: [...prevState.images, ...images],
        page: prevState.page + 1,
        isLastPage: prevState.images.length + images.length >= totalHits,
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      // Oprim Loader-ul după 1 secundă
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = query => {
    if (this.state.query === query) {
      return;
    }
    this.setState({
      query: query,
      page: 1,
      images: [],
      error: null,
      isLastPage: false,
    });
  };

  handleImageClick = image => {
    this.setState({ selectedImage: image, showModal: true });
    document.body.style.overflow = 'hidden';
  };

  handleModalClose = () => {
    this.setState({ selectedImage: null, showModal: false });
    document.body.style.overflow = 'auto';
  };

  render() {
    const { images, isLoading, error, showModal, selectedImage, isLastPage } =
      this.state;

    return (
      <>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {error && <p>Error: {error}</p>}
        <ImageGallery images={images} onItemClick={this.handleImageClick} />
        {isLoading && <Loader />}
        {!isLoading && images.length > 0 && !isLastPage && (
          <Button onClick={this.fetchImages} />
        )}

        {showModal && (
          <Modal image={selectedImage} onClose={this.handleModalClose} />
        )}

        <ScrollButton />
      </>
    );
  }
}

export default App;
