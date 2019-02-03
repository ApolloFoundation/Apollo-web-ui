import React from 'react';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {connect} from 'react-redux';

const Goods = ({name, goods, quantity, priceATM, setBodyModalParamsAction}) => (
    <tr className={"marketplace-tab-item"}>
        <td
            className={'blue-link-text'}
        >
            <a onClick={() => setBodyModalParamsAction('MARKETPLACE_PURCHASE', goods)}>
                {name}
            </a>
        </td>
        <td className={"text-align-right"}>{priceATM / 100000000}</td>
        <td className="align-right text-align-right">{quantity}</td>
    </tr>
)

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(setBodyModalParamsAction))
})

export default connect(null, mapDispatchToProps)(Goods);