import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setBodyModalParamsAction, setModalData, setModalType} from '../../../../modules/modals';
import {setAccountPassphrase} from '../../../../modules/account';
import {exportWallet} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import util from "../../../../helpers/util/utils";
// TODO update
class ConfirmExportWallet extends React.Component {
    downloadSecretFile = React.createRef();
    state = {
        isPending: false,
        wallet: null,
    };

    handleFormSubmit = async ({secretPhrase, passphrase, ...values}) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            let passphrase;
            if (this.props.passPhrase) {
                passphrase = this.props.passPhrase;
            } else {
                passphrase = passphrase || secretPhrase;
                if (!passphrase || passphrase.length === 0) {
                    NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                    this.setState({isPending: false});
                    return;
                }
            }

            const params = {
                ...this.props.modalData.params,
                ...values,
                passphrase,
                account: this.props.account,
            };
            const wallet = await this.props.exportWallet(params);
            if (wallet) {
                this.setState({wallet}, () => {
                    let objJsonStr = JSON.stringify(wallet);
                    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
                    const base64 = `data:application/octet-stream;base64,${objJsonB64}`;
                    this.downloadSecretFile.current.href = encodeURI(base64);
                    if (util.isDesktopApp() && window.java) {
                        window.java.downloadFile(objJsonB64, wallet.address);
                    } else {
                        this.downloadSecretFile.current.click();
                    }
                });

                NotificationManager.success('Selected ETH wallet exported successfully!', null, 5000);
                this.props.setAccountPassphrase(passphrase);
            }
            this.setState({isPending: false});
        }
    };

    checkPermissionCallback = (status) => {
        if (!status.hasPermission) {
            const errorCallback = () => {
                console.warn('Storage permission is not turned on')
            };
            window.cordova.plugins.permissions.requestPermission(
                window.cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE,
                (status) => {
                    if (!status.hasPermission) {
                        errorCallback();
                    } else {
                        this.writeFile();
                    }
                },
                errorCallback
            );
        } else {
            this.writeFile();
        }
    };

    writeFile = () => {
        const filename = this.state.wallet.address;
        let base64 = `data:application/octet-stream;df:${filename};base64,${this.state.wallet}`;
        let subject = null;
        if (window.cordova.platformId === "android") {
            base64 = `data:application/;base64,${this.state.wallet}`;
            subject = filename;
        }
        const uri = encodeURI(base64);

        const options = {
            message: null,
            subject,
            files: [uri],
            url: null,
            chooserTitle: 'Export ETH wallet',
        };

        const onError = (msg) => {
            console.log("Downloading failed with message: " + msg);
            NotificationManager.error('Downloading ETH wallet failed', 'Error', 5000);
        };

        window.plugins.socialsharing.shareWithOptions(options, null, onError);
    };

    downloadFile = () => {
        if (window.cordova && window.plugins) {
            let permissions = window.cordova.plugins.permissions;
            permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, this.checkPermissionCallback, null);
        }
        if (util.isDesktopApp() && window.java) {
            let objJsonStr = JSON.stringify(this.state.wallet);
            let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
            window.java.downloadFile(objJsonB64, this.state.wallet.address);
        }
    };

    customFooter = () => {
        return (
            <div className="btn-box form-footer">
                <a
                    ref={this.downloadSecretFile}
                    href={''}
                    download={this.state.wallet.address}
                    className="btn btn-green"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.downloadFile}
                >
                    Download ETH wallet
                </a>
            </div>
        );
    };

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Export ETH wallet'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Export'}
                isPending={this.state.isPending}
                isDisableSecretPhrase={!!this.state.wallet}
                CustomFooter={this.state.wallet ? this.customFooter : null}
                nameModel={this.props.nameModal}
            />
        );
    }
}

const mapStateToProps = ({account, modals}) => ({
    modalData: modals.modalData,
    account: account.account,
    passPhrase: account.passPhrase,
    is2FA: account.is2FA,
});

const mapDispatchToProps = dispatch => ({
    exportWallet: (params) => dispatch(exportWallet(params)),
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmExportWallet);