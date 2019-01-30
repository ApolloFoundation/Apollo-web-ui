

const initState  = {
    types: {
        1:  '<i class="zmdi zmdi-swap" />',                 // Exchangeable
        2:  '<i class="zmdi zmdi-lock" />',                 // Controllable
        4:  '<i class="zmdi zmdi-balance" />',              //Reservable
        8:  '<i class="zmdi zmdi-key" />',                  // Claimable
        16: '<i class="zmdi zmdi-toll" />',                 // Mintable
        32: '<i class="zmdi zmdi-minus-circle-outline" />', //Non-Shuffleable 
    }
}

export default (state = initState, action)  => {
    switch(action.type) {
        default: return state;
    }
}


export const getCurrencyTypes = (value) => {
    var b = 1;
    var res= [];
    while(b<=value){
        if(b & value)res.push(b);
        b <<= 1;
    }

    return res
        .map((el, index) => {
            const type = initState.types[el];
            if (index === 0) {
                return `${type}`
            } else {
                return `&nbsp;${type}`
            }
        })
        .reduce((a, b) => {
            return a + b;
        })
}
