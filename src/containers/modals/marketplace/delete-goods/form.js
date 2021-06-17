import React from "react";

import { formatTimestamp } from "../../../../helpers/util/time";
import { connect } from "react-redux";

import TextualInput from "../../../components/form-components/textual-input";

const Form = ({ setValue, goods }) => (
  <>
    {goods && (
      <>
        <TextualInput
          setValue={setValue}
          label="Date:"
          text={formatTimestamp(goods.timestamp)}
        />
        <TextualInput
          setValue={setValue}
          label="Seller:"
          text={goods.sellerRS}
        />
        <TextualInput
          setValue={setValue}
          label="Current quantity:"
          text={goods.quantity}
        />
      </>
    )}
  </>
);

const md2p = {
  formatTimestamp,
};

export default connect(null, md2p)(Form);
