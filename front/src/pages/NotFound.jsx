import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.message}>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className={styles.link}>Return to Homepage</Link>
    </div>
  );
};

export default NotFound;