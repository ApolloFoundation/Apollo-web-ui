import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { setModalType } from '../../../../modules/modals';
import styles from './index.module.scss';

export const PureModal = ({ children, withCloseButton }) => {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setModalType())
  }, [dispatch, setModalType]);

  return (
    <div className={classNames(styles.pureModal, 'modal-box dark-card')}>
      {withCloseButton && (
        <span onClick={handleClose} className={styles.pureModalClose}>&times;</span>
      )}
      {children}
    </div>
  );
}