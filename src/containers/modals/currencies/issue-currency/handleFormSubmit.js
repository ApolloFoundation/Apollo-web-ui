import {NotificationManager} from "react-notifications";
import BigInteger from "big-integer";
import {
    setBodyModalParamsAction,
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

// validatePassphrase
const typeValues = {
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 16,
    6: 32,
};

export function handleFormSubmit (values) {
    const {processForm, store: {dispatch, getState}} = this;
    const {account: {publicKey}} = getState();

    if (!values.secretPhrase || values.secretPhrase.length === 0) {
        NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
        return;
    }

    if (values.reserveSupply > values.maxSupply) {
        NotificationManager.error(
            'Incorrect "reserve supply" value should be less or equal to "total supply"',
            'Error',
            5000
        );
        return;
    }

    values.type = 0;
    
    if (values.type1) values.type += typeValues[1];
    if (values.type2) values.type += typeValues[2];
    if (values.type3) values.type += typeValues[3];
    if (values.type4) values.type += typeValues[4];
    if (values.type5) values.type += typeValues[5];
    if (values.type6) values.type += typeValues[6];
    
    values = {
        name: values.name,
        code: values.code,
        type: values.type,
        description: values.description,
        minReservePerUnitATM: !values.type3 ? null : new BigInteger(values.minReservePerUnitATM).multiply(new BigInteger("" + Math.pow(10, values.decimals))),
        reserveSupply: !values.type3 ? null : values.reserveSupply * Math.pow(10, values.decimals),
        minDifficulty: !values.type5 ? null : values.minDifficulty,
        maxDifficulty: !values.type5 ? null : values.maxDifficulty,
        algorithm: !values.type5 ? null : values.algorithm,
        decimals: values.decimals,
        deadline: 1440,
        phased: false,
        issuanceHeight: values.height,
        publicKey: publicKey,
        feeATM: values.feeATM,
        maxSupply: values.maxSupply * Math.pow(10, values.decimals),
        initialSupply: values.initialSupply * Math.pow(10, values.decimals),
        secretPhrase: values.secretPhrase,
        code2FA: values.code2FA,
    };

    delete values.type1;
    delete values.type2;
    delete values.type3;
    delete values.type4;
    delete values.type5;
    delete values.type6;

    processForm(values, 'issueCurrency', 'Issue currency request has been submitted!', (res) => {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        });

        dispatch(setBodyModalParamsAction(null, {}));
        NotificationManager.success('Issue currency request has been submitted!', null, 5000);
    });
}