import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadButton.module.css';

const Button = ({ onClick }) => {
  return (
    <div className={styles.ButtonContainer}>
      <button type="button" className={styles.Button} onClick={onClick}>
        Load more...
      </button>
    </div>
  );
};

export default Button;

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
