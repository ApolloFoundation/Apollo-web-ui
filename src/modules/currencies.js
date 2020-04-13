const initState = {
    types: {
        1: {image: '<i class="zmdi zmdi-swap"></i>', name: 'Exchangeable'}, // Exchangeable
        2: {image: '<i class="zmdi zmdi-lock"></i>', name: 'Controllable'}, // Controllable
        4: {image: '<i class="zmdi zmdi-balance"></i>', name: 'Reservable'}, //Reservable
        8: {image: '<i class="zmdi zmdi-key"></i>', name: 'Claimable'}, // Claimable
        16: {image: '<i class="zmdi zmdi-toll"></i>', name: 'Mintable'}, // Mintable
        32: {image: '<i class="zmdi zmdi-minus-circle-outline"></i>', name: 'Non-Shuffleable'}, //Non-Shuffleable 
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        default:
            return state;
    }
}


export const getCurrencyTypes = (value, isBasic) => {
    let b = 1;
    let res = [];
    while (b <= value) {
        if (b && value) res.push(b);
        b <<= 1;
    }

    if (isBasic)
        return res.map((el) => {
            return initState.types[el].name
        })

    return res
        .map((el, index) => {
            const type = initState.types[el];
            if (index === 0) {
                return `
                        <span className="phasing-box"
                            style={{zIndex: 12}}
                            data-custom
                            data-custom-at="top"
                            data-cat-id=${JSON.stringify({infoContent: type.name})}
                        >
                            ${type.image}
                        </span>`
            } else {
                return `&nbsp;
                        <span className="phasing-box"
                            style={{zIndex: 12}}
                            data-custom
                            data-custom-at="top"
                            data-cat-id=${JSON.stringify({infoContent: type.name})}
                        >
                            ${type.image}
                        </span>`
            }
        })
        .reduce((a, b) => {
            return a + b;
        })
}
