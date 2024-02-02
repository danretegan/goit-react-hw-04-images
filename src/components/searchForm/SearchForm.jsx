import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchForm.module.css';

class SearchForm extends Component {
  handleClick = () => {
    // La fiecare clic pe input, setează query-ul la un șir gol
    const { onChange } = this.props;
    onChange({ target: { value: '' } });
  };

  render() {
    const { onSubmit, onChange, query } = this.props;

    return (
      <form className={styles.SearchForm} onSubmit={onSubmit}>
        <button type="submit" className={styles.SearchFormButton}>
          <span className={styles.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          className={styles.SearchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={query}
          onChange={onChange}
          onClick={this.handleClick} // Adaugă acest eveniment pentru a goli input-ul
        />
      </form>
    );
  }
}

export default SearchForm;

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};
