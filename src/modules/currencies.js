

const initState  = {
    types: {
        1:  'Exchangeable',
        2:  'Controllable',
        4:  'Reservable',
        8:  'Claimable',
        16: 'Mintable',
        32: 'Non-Shuffleable',
    }
}

export default (state = initState, action)  => {
    switch(action.type) {
        default: return state;
    }
}


// TODO refactor currency types
export const getCurrencyTypes = (value) => {
    const {types} = initState;

    const arr = Object.keys(types);

    const result = Object.keys(types).map(el => {
        const searchingValue = arr.find((searchingElement, index) => {
            // console.log(searchingElement)
            console.log(searchingElement)
            
            
            console.log(arr[index + 1])
            console.log(arr[index - 1])
            
            if ( arr[index + 1] && arr[index - 1]) {
                return arr[index + 1] > value && arr[index - 1] < value
            }
            if (!arr[index - 1]) {

                return searchingElement;
            }; 

            if (!!arr[index + 1]) {

                return searchingElement;
            }; 
        })
        console.log(searchingValue)
    })

}