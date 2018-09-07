import {getSettings} from "../helpers/util/settings";

export function writeToLocalStorage(field, params){
    localStorage.setItem(field, JSON.stringify(params));
}

export function readFromLocalStorage(field){
    return localStorage.getItem((field))
}

export function deleteFromLocalStorage(field) {
    localStorage.removeItem(field)
}

export function getAccountJSONItem(key) {
    return (dispatch) => {
        return dispatch(getJSONItem(getAccountKey(key)));
    };
}

export function setJSONItem(key, data) {
    var jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
}

export function setAccountJSONItem (key, data) {
    setJSONItem(getAccountKey(key), data)
}

// function isIndexedDBSupported() {
//     return NRS.databaseSupport;
// }

function getAccountKey(key) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (account.account === "") {
            return key;
        }
        return key + "." + account.account;
    }
}

function getJSONItem(key) {
    return JSON.parse(localStorage.getItem(key));
};


export function storageSelect(table, query, callback) {
    return (dispatch, getState) => {
        const {account} = getState();

        // if (account.databaseSupport) {
        //     NRS.database.select(table, query, callback);
        //     return;
        // }
        var items = dispatch(getAccountJSONItem(table));

        if (!items) {
            if (callback) {
                callback("No items to select", []);
            }
            return;
        }
        var response = [];
        for (var i=0; i<items.length; i++) {
            if (!query || query.length === 0) {
                response.push(items[i]);
                continue;
            }
            for (var j=0; j<query.length; j++) {

                Object.keys(query[j]).forEach(function(key) {
                    if (items[i][key] === query[j][key]) {
                        response.push(items[i]);
                    }
                })
            }
        }
        if (callback) {
            callback(null, response);
        }
    }
};

export function storageInsert(table, key, data, callback, isAutoIncrement) {
    return (dispatch, getState) => {
        var items = dispatch(getAccountJSONItem(table));
        if (!items) {
            items = [];
        }
        for (var i=0; i<items.length; i++) {
            for (var j=0; j<data.length; j++) {
                if (items[i][key] === data[j][key]) {
                    if (callback) {
                        callback("Key already exists: " + items[i][key], []);
                    }
                    return;
                }
            }
        }

        if (Array.isArray(data)) {
            for (i = 0; i < data.length; i++) {
                insertItem(data[i]);
            }
        } else {
            insertItem(data);
        }
        setAccountJSONItem(table, items);
        if (callback) {
            callback(null, items);
        }

        function insertItem(item) {
            if (!isAutoIncrement) {
                items.push(item);
                return;
            }
            if (item.id) {
                if (callback) {
                    callback("Cannot use auto increment id since data already contains id value", []);
                }
                return;
            }
            if (items.length == 0) {
                item.id = 1;
            } else {
                item.id = items[items.length - 1].id + 1;
            }
            items.push(item);
        }
    }
};