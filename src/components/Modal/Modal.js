import React from 'react';

import styles from './Modal.module.css';

const Modal = (props) => (
    <div className={styles.Modal}>
        <div className={styles.Box}>
            <h2>Wrong button!</h2>
            <p>Your level: <strong>{props.level}</strong></p>
            <button onClick={props.click}>try again</button>
        </div>
    </div>
);

export default Modal;