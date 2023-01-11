import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import { walletWithdraw} from '../../../../actions/wallet';
import {currencyTypes} from '../../../../helpers/format';
import { getAccountSelector, getConstantsSelector, getModalDataSelector } from '../../../../selectors';
import ModalBody from '../../../components/modals/modal-body';
import { WithdrawForm } from './form';
import { WithdrawCurrencyFee } from './WithdrawCurrencyFee';

const WithdrawCurrency = ({ closeModal,  }) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector);
    const constants = useSelector(getConstantsSelector);
    const account = useSelector(getAccountSelector);

    const handleFormSubmit = useCallback(async ({ secretPhrase, asset, ...values }) => {
        if (!values.toAddress) {
            NotificationManager.error('To wallet is required.', 'Error', 5000);
            return;
        }
        if (!values.amount) {
            NotificationManager.error('Amount is required.', 'Error', 5000);
            return;
        }
        if (!secretPhrase || secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const { gasLimitEth, gasLimitERC20 } = constants;
        const { balances } = modalData;

        const gasLimit = asset.currency === 'eth' ? gasLimitEth : gasLimitERC20;
        const maxFee = values.transferFee * gasLimit * 0.000000001;
        const balance = parseFloat(asset.balance);
        const amount = parseFloat(values.amount);

        if (asset.currency === 'eth') {
            if (balance === 0 || balance < (amount + maxFee)) {
                NotificationManager.error(`Not enough founds on your ${asset.currency.toUpperCase()} balance.`, 'Error', 5000);
                return;
            }
        } else {
            if (balance === 0 || balance < amount) {
                NotificationManager.error(`Not enough founds on your ${asset.currency.toUpperCase()} balance.`, 'Error', 5000);
                return;
            } else if (balances.eth === 0 || balances.eth < maxFee) {
                NotificationManager.error(`Not enough founds on your ETH balance.`, 'Error', 5000);
                return;
            }
        }

        setIsPending(true);

        const params = {
            ...values,
            transferFee: parseFloat(values.transferFee),
            cryptocurrency: currencyTypes[asset.currency],
            passphrase: secretPhrase,
            sender: account,
        };

        const result = await dispatch(walletWithdraw(params));
        if (result) {
            NotificationManager.success('Successfully sent.', null, 5000);
            closeModal();
        }
        setIsPending(false);
    }, [dispatch, constants, modalData, account, closeModal]);

    const getAssetTypes = useCallback(() => {
        const balances = modalData ? modalData.balances : {};
        return Object.keys(balances).map((currency) => (
            {
                value: {
                    currency,
                    balance: balances[currency]
                },
                label: `${currency.toUpperCase()} - Balance: ${balances[currency]} ${currency.toUpperCase()}`
            }
        ));
    }, [modalData]);

    const typeData = useMemo(() => getAssetTypes(), [getAssetTypes]); 
    
    return (
        <ModalBody
            modalTitle="Withdraw"
            handleFormSubmit={handleFormSubmit}
            closeModal={closeModal}
            submitButtonName="Withdraw"
            initialValues={{
                fromAddress: modalData?.address ?? '',
                toAddress: '',
                amount: 0,
                asset: typeData.find(type => type.value.currency === 'eth')?.value,
                transferFee: 0,
            }}
            isPending={isPending}
        >
            <WithdrawForm typeData={typeData} />
            <WithdrawCurrencyFee />
        </ModalBody>
    );
}

export default WithdrawCurrency;