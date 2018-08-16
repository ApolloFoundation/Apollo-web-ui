import qrcode from '../qr-code/qr-code'


function generateQRCode(target, qrCodeData, minType, cellSize) {
    var type = minType ? minType : 2;
    while (type <= 40) {
        try {
            var qr = qrcode(type, 'M');
            qr.addData(qrCodeData);
            qr.make();
            var img = qr.createImgTag(cellSize);
            console.log("Encoded QR code of type " + type);
            if (target) {
                console.log(target);
            }
            return img;
        } catch (e) {
            type++;
        }
    }
    // $(target).empty().html($.t("cannot_encode_message", qrCodeData.length));
};

function  getAccountMask(c) {
    // switch(c) {
    //     case "*":
    //         return NRS.constants.ACCOUNT_MASK_ASTERIX;
    //     case "_":
    //         return NRS.constants.ACCOUNT_MASK_UNDERSCORE;
    //     default:
    //         return NRS.constants.ACCOUNT_MASK_PREFIX ? NRS.constants.ACCOUNT_MASK_PREFIX : "APL-";
    // }

    return;
}

export default {
    generateQRCode,
    getAccountMask
}