/** ****************************************************************************
 * Copyright © 2021 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import ModalBody from "../../components/modals/modal-body1";
import TabulationBody from "../../components/tabulator/tabuator-body";
import TabContaier from "../../components/tabulator/tab-container";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import TextualInputComponent from "../../components/form-components/textual-input1";
import Button from "../../components/button";
import { Form, Formik } from "formik";

const SmartContractsExplorer = ({ closeModal }) => {
  return (
    <ModalBody
      isDisableSecretPhrase={true}
      modalTitle="Contract Explorer"
      closeModal={closeModal}
      isWide
    >
      <TabulationBody>
        <TabContaier sectionName={"Overview"}>
          <div className="transaction-table no-min-height transparent">
            <div className="transaction-table-body transparent full-info">
              <table>
                <tbody>
                  <tr>
                    <td>Price:</td>
                    <td>{"$0.8299"}</td>
                  </tr>
                  <tr>
                    <td>Fully Diluted Market Cap :</td>
                    <td>{"$1,821,126,432.31"}</td>
                  </tr>
                  <tr>
                    <td>Max Total Supply:</td>
                    <td>{"2,194,340,927.32014624"}</td>
                  </tr>

                  <tr>
                    <td>Holders :</td>
                    <td>{"101,805"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabContaier>
        <TabContaier sectionName={"Profile Summary"}>
          <div className="transaction-table no-min-height transparent">
            <div className="transaction-table-body transparent full-info">
              <table>
                <tbody>
                  <tr>
                    <td>Contract:</td>
                    <td>{"0x0f5d2fb29fb7d3cfee444a200298f468908cc942"}</td>
                  </tr>
                  <tr>
                    <td>Decimals:</td>
                    <td>{"0x0f5d2fb29fb7d3cfee444a200298f468908cc942"}</td>
                  </tr>
                  <tr>
                    <td>Official Site:</td>
                    <td className="blue-link-text">
                      <a
                        href="https://decentraland.org/"
                        rel="nofollow"
                        target="_blank"
                      >
                        https://decentraland.org/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Social Profiles:</td>
                    <td>{""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabContaier>
        <TabContaier sectionName={"Read method"}>
          <div className="transaction-table no-min-height transparent">
            <div className="transaction-table-body transparent full-info">
              <table>
                <tbody>
                  <tr>
                    <td>Minting Finished:</td>
                    <td>{"False bool"}</td>
                  </tr>
                  <tr>
                    <td>Name:</td>
                    <td>{"Decentraland MANA string"}</td>
                  </tr>
                  <tr>
                    <td>Total Supply :</td>
                    <td>{"2194341127320146244857883456 uint256"}</td>
                  </tr>
                  <tr>
                    <td>Decimals :</td>
                    <td>{"18 uint8"}</td>
                  </tr>
                  <tr>
                    <td>Paused:</td>
                    <td>{"False bool"}</td>
                  </tr>
                  <tr>
                    <td>Owner (address):</td>
                    <td>{"0xa66d83716c7cfe425b44d0f7ef92de263468fb3d"}</td>
                  </tr>
                  <tr>
                    <td>Symbol:</td>
                    <td>{"MANA string"}</td>
                  </tr>
                  <tr>
                    <td>Allowance :</td>
                    <td>{"MANA string"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabContaier>
        <TabContaier sectionName={"Call method"}>
          <Formik>
            {({ values, setFieldValue }) => {
              return (
                <Form>
                  <Accordion>
                    <AccordionItem className="mb-3">
                      <AccordionItemHeading>
                        <AccordionItemButton>Aprove</AccordionItemButton>
                      </AccordionItemHeading>

                      <AccordionItemPanel>
                        <TextualInputComponent
                          label="Sender"
                          name="sender"
                          placeholder="Sender (adress)"
                          type="text"
                        />
                        <TextualInputComponent
                          label="Value (uint256) "
                          name="value"
                          placeholder="Value (uint256)"
                          type="text"
                        />
                        <Button
                          name="Write"
                          className="w-25"
                          color="green"
                          onClick={() => console.log("send")}
                        />
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem className="mb-3">
                      <AccordionItemHeading>
                        <AccordionItemButton>Upause</AccordionItemButton>
                      </AccordionItemHeading>

                      <AccordionItemPanel>
                        <TextualInputComponent
                          label="From (addres)"
                          name="from"
                          placeholder="From (addres)"
                          type="text"
                        />
                        <TextualInputComponent
                          label="To (addres)"
                          name="to"
                          placeholder="To (addres)"
                          type="text"
                        />
                        <Button
                          name="Write"
                          className="w-25"
                          color="green"
                          onClick={() => console.log("send")}
                        />
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>Mint</AccordionItemButton>
                      </AccordionItemHeading>

                      <AccordionItemPanel>
                        <TextualInputComponent
                          label="To (addres)"
                          name="sender"
                          placeholder="To (addres)"
                          type="text"
                        />
                        <TextualInputComponent
                          label="Amount(ubit256)"
                          name="Amount"
                          placeholder="Amount(ubit256)"
                          type="text"
                        />
                        <Button
                          name="Write"
                          className="btn w-25"
                          color="green"
                          onClick={() => console.log("send")}
                        />
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                </Form>
              );
            }}
          </Formik>
        </TabContaier>
      </TabulationBody>
    </ModalBody>
  );
};
export default SmartContractsExplorer;
