import React, { useEffect } from 'react';
import styles from './ScrollButton.module.css';

const ScrollButton = () => {
  useEffect(() => {
    const scrollFunction = () => {
      const mybutton = document.getElementById('btn-back-to-top');
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        mybutton.style.display = 'block';
      } else {
        mybutton.style.display = 'none';
      }
    };

    window.addEventListener('scroll', scrollFunction);

    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, []);

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      id="btn-back-to-top"
      className={styles.ScrollButton}
      onClick={backToTop}
    >
      scroll to top
    </button>
  );
};

export default ScrollButton;
