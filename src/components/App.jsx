import React, { Component } from 'react';
import Searchbar from './searchbar/Searchbar';
import Loader from './loader/Loader';
import ImageGallery from './imageGallery/ImageGallery';
import ScrollButton from './scrollButton/ScrollButton';
import Button from './loadMoreButton/LoadButton';
import Modal from './modal/Modal';
import fetchImages from './services/pixabayApi';

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
        this.fetchImagesApp();
      });
    }
  }

  // Această metodă gestionează obținerea de imagini din pixabyAPI.js folosind funcția fetchImages. Parametrii precum query (cuvântul cheie de căutare) și page (numărul de pagină) sunt obținuți din starea locală a componentei. Callback-urile sunt utilizate pentru a actualiza starea componentei App în funcție de rezultatele obținute din API.
  // - updatedImages: array-ul de imagini actualizate. Imaginile noi sunt adăugate la array-ul existent de imagini.
  // - newPage: noul număr de pagină, eventual actualizat după obținerea imaginilor.
  // - isLastPage: valoarea booleană care indică dacă s-a ajuns la ultima pagină de rezultate.
  // - isLoading: valoarea booleană care indică dacă încărcarea este în desfășurare.
  // - error: mesajul de eroare, în cazul în care există probleme în timpul apelului API.
  fetchImagesApp = () => {
    const { query, page } = this.state;

    fetchImages(
      query,
      page,
      updatedImages =>
        this.setState(prevState => ({
          images: [...prevState.images, ...updatedImages],
        })),
      newPage => this.setState({ page: newPage }),
      isLastPage => this.setState({ isLastPage }),
      isLoading => this.setState({ isLoading }),
      error => this.setState({ error })
    );
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
          <Button onClick={this.fetchImagesApp} />
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
