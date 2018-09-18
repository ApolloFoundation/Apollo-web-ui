import axios from 'axios';
import config from '../../config'
import {getLocale} from "../internationalisation";

const EPOCH_BEGINNING = 1385294400000;

export function toEpochTime(currentTime, epochB) {
    if (currentTime === undefined) {
        currentTime = new Date();
    }
    console.warn("epochB", epochB);
    return Math.floor((currentTime - epochB) / 1000);
};

export function formatTimestamp(timestamp, date_only, isAbsoluteTime) {
    return (dispatch, getState) => {
        const {account} = getState();

        var locale = dispatch(getLocale());
        var date;
        console.log(timestamp);

        if (typeof timestamp == "object") {
            date = timestamp;
            console.log('++++++++++++++++++++++');
        } else if (isAbsoluteTime) {
            date = new Date(timestamp);
            console.log('++++++++++++++++++++++');
            console.log(date);
        } else {
            date = new Date(dispatch(fromEpochTime(timestamp)));
            console.log('++++++++++++++++++++++');
            console.log(date);
        }

        console.log('++++++++++++++++++++++');
        console.log(date);

        if (!isNaN(date) && typeof(date.getFullYear) == 'function') {
            var d = date.getDate();
            var dd = d < 10 ? '0' + d : d;
            var M = date.getMonth() + 1;
            var MM = M < 10 ? '0' + M : M;
            var yyyy = date.getFullYear();
            var yy = String(yyyy).substring(2);

            var res = locale.dateFormat
                .replace(/dd/g, dd)
                .replace(/d/g, d)
                .replace(/MM/g, MM)
                .replace(/M/g, M)
                .replace(/yyyy/g, yyyy)
                .replace(/yy/g, yy);

            console.log(res);
            console.log('LLLLLLLLLLLLLLLLLLLLLLLL');
            console.log(date_only);

            if (!date_only) {
                var hours = date.getHours();
                var originalHours = hours;
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();

                if (!account.settings || account.settings["24_hour_format"] == "0") {
                    if (originalHours == 0) {
                        hours += 12;
                    } else if (originalHours >= 13 && originalHours <= 23) {
                        hours -= 12;
                    }
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                res += " " + hours + ":" + minutes + ":" + seconds;

                if (!account.settings || account.settings["24_hour_format"] == "0") {
                    res += " " + (originalHours >= 12 ? "PM" : "AM");
                }
            }

            console.log('::::::::::::::::::::::');
            console.log(res);

            return res;
        } else {

            return date.toLocaleString();
        }
    }
};


export function fromEpochTime  (epochTime) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (!account.constants || account.constants.epochBeginning === 0) {
            throw "undefined epoch beginning";
        }
        return epochTime * 1000 + account.constants.epochBeginning - 500;
    }
};
