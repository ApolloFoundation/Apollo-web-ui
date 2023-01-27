import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction, IS_MODAL_PROCESSING } from '../../../../../modules/modals';

const { BigInteger } = require('jsbn');

// validatePassphrase
const typeValues = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
  6: 32,
};

export function handleFormSubmit(values) {
  const { processForm, store: { dispatch, getState }, closeModal } = this;
  const { account: { publicKey } } = getState();

  if (!values.secretPhrase || values.secretPhrase.length === 0) {
    NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
    return;
  }

  if (values.type3 && +values.reserveSupply > +values.maxSupply) {
    NotificationManager.error(
        'Incorrect "reserve supply" value should be less or equal to "total supply"',
        'Error',
        5000
    );
    return;
  }

  const dataValues = values;

  dataValues.type = 0;

  if (values.type1) dataValues.type += typeValues[1];
  if (values.type2) dataValues.type += typeValues[2];
  if (values.type3) dataValues.type += typeValues[3];
  if (values.type4) dataValues.type += typeValues[4];
  if (values.type5) dataValues.type += typeValues[5];
  if (values.type6) dataValues.type += typeValues[6];

  const data = {
    name: dataValues.name,
    code: dataValues.code,
    type: dataValues.type,
    description: dataValues.description,
    minReservePerUnitATM: !dataValues.type3
      ? null
      : new BigInteger(dataValues.minReservePerUnitATM).multiply(new BigInteger("" + (10 ** dataValues.decimals))),
    reserveSupply: !dataValues.type3
      ? null : dataValues.reserveSupply * (10 ** dataValues.decimals),
    minDifficulty: !dataValues.type5 ? null : dataValues.minDifficulty,
    maxDifficulty: !dataValues.type5 ? null : dataValues.maxDifficulty,
    algorithm: !dataValues.type5 ? null : dataValues.algorithm,
    decimals: dataValues.decimals,
    deadline: 1440,
    phased: false,
    issuanceHeight: dataValues.height,
    publicKey,
    feeATM: dataValues.feeATM,
    maxSupply: dataValues.maxSupply * (10 ** dataValues.decimals),
    initialSupply: dataValues.initialSupply * (10 ** dataValues.decimals),
    secretPhrase: dataValues.secretPhrase,
    code2FA: dataValues.code2FA,
  };

  delete data.type1;
  delete data.type2;
  delete data.type3;
  delete data.type4;
  delete data.type5;
  delete data.type6;

  processForm(data, 'issueCurrency', 'Issue currency request has been submitted!', (res) => {
    dispatch({
      type: IS_MODAL_PROCESSING,
      payload: false,
    });
    closeModal();
    NotificationManager.success('Issue currency request has been submitted!', null, 5000);
  });
}
