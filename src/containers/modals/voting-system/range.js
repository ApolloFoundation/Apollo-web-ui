import React from 'react';

class CustomRange extends React.Component {
    state = {value: 0};

    setInputValue = (event) => {
        const {el, setValue, getFormState} = this.props;
        const {values: {voteOptions}} = getFormState();
        const {target : {value}} = event;

        this.setState({
            value: value
        }, setValue('voteOptions', {
            ...voteOptions,
            [el]: value,
        }))
    }
    
    render () {
        const {label, min, max} = this.props;
        const {value} = this.state;

        return (
            <div className={"mb-15"}>
                <p className={'word-brake'}>
                    {label}
                    <span className="badge badge-pill badge-primary float-right">
                        {value}
                    </span>
                </p>
                <input type="range" className="custom-range"
                    max={max}
                    min={min}
                    value={value}
                    onChange={(event) => this.setInputValue(event)}
                />
            </div>
        )
    }
} 

export default CustomRange;