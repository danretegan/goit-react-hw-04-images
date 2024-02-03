import PropTypes from 'prop-types';
import SearchForm from '../searchForm/SearchForm';
import styles from './Searchbar.module.css';
import { useState } from 'react';

const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = event => {
    setQuery(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    onSubmit(query);
  };

  return (
    <header className={styles.Searchbar}>
      <SearchForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        query={query}
      />
    </header>
  );
};

export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
