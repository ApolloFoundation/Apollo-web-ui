export function writeToLocalStorage(field, params){
    localStorage.setItem(field, JSON.stringify(params));
}

export function readFromLocalStorage(field){
    return localStorage.getItem((field))
}

export function deleteFromLocalStorage(field) {
    localStorage.removeItem(field)
}