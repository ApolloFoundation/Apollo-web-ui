import React, { useCallback } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { setModalType } from '../../../../modules/modals';
import styles from './index.module.scss';

export const PureModal = ({ children, withCloseButton, setModalType }) => {

  const handleClose = useCallback(() => {
    setModalType();
  }, [setModalType]);

  return (
    <div className={classNames(styles.pureModal, 'modal-box dark-card')}>
      {withCloseButton && (
        <span onClick={handleClose} className={styles.pureModalClose}>&times;</span>
      )}
      {children}
    </div>
  );
}

const mapDispatchToProps = {
  setModalType,
}

export default connect(null, mapDispatchToProps)(PureModal);