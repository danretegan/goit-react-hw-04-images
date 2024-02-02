import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ image, onItemClick }) => {
  const handleClick = () => {
    onItemClick(image);
  };

  return (
    <div className={styles.ImageGalleryItem} onClick={handleClick}>
      <img
        className={styles.ImageGalleryItemImage}
        src={image.webformatURL}
        alt={image.tags}
      />
    </div>
  );
};

export default ImageGalleryItem;

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onItemClick: PropTypes.func.isRequired,
};
