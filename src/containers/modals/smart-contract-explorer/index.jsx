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
    <div className="modal-box x-wide">
      <div className="form-group-app media-tab">
        <div className="modal-form">
          <div className="form-group-app media-tab">
            <button onClick={closeModal} className="exit pointer">
              <i className="zmdi zmdi-close" />
            </button>
            <div className="form-title">Overview</div>
            <TabulationBody>
              <TabContaier sectionName={"Overview"}>
                <div className="transaction-table no-min-height transparent">
                  <div className="transaction-table-body transparent full-info">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="title text-dark mb-3">Overview</div>
                        <table className="w-100">
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
                      <div className="col-12 col-md-6">
                        <div className="title text-dark mb-3">
                          Profile Summary
                        </div>
                        <table className="w-100">
                          <tbody>
                            <tr>
                              <td>Contract:</td>
                              <td>
                                {"0x0f5d2fb29fb7d3cfee444a200298f468908cc942"}
                              </td>
                            </tr>
                            <tr>
                              <td>Decimals:</td>
                              <td>
                                {"0x0f5d2fb29fb7d3cfee444a200298f468908cc942"}
                              </td>
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
                  </div>
                </div>
              </TabContaier>
              <TabContaier sectionName={"Read method"}>
                <Accordion allowZeroExpanded={true}>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Minting Finished
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      False <span className="text-info">bool</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Name
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      Decentraland MANA{" "}
                      <span className="text-info">string</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Total Supply
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      2194341127320146244857883456{" "}
                      <span className="text-info">uint256</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Decimals
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      18 <span className="text-info">uint8</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Paused
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      False <span className="text-info">bool</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Decimals
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      18 <span className="text-info">uint8</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Owner (address)
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      0xa66d83716c7cfe425b44d0f7ef92de263468fb3d
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Symbol
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      MANA <span className="text-info">string</span>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className="mb-3">
                    <AccordionItemHeading>
                      <AccordionItemButton className="accordion__button p-3">
                        Allowance
                      </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>
                      <Formik>
                        {({ values, setFieldValue }) => {
                          return (
                            <Form>
                              <TextualInputComponent
                                label="Owner (address)"
                                name="sender"
                                placeholder="Owner (address)"
                                type="text"
                              />
                              <TextualInputComponent
                                label="Sender (address)"
                                name="Amount"
                                placeholder="Sender (address)"
                                type="text"
                              />
                              <Button
                                name="Query"
                                className="btn w-25"
                                color="green"
                                onClick={() => console.log("send")}
                              />
                            </Form>
                          );
                        }}
                      </Formik>
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>
              </TabContaier>
              <TabContaier sectionName={"Call method"}>
                <Formik>
                  {({ values, setFieldValue }) => {
                    return (
                      <Form>
                        <Accordion allowZeroExpanded={true}>
                          <AccordionItem className="mb-3">
                            <AccordionItemHeading>
                              <AccordionItemButton className="accordion__button p-3">
                                Aprove
                              </AccordionItemButton>
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
                              <AccordionItemButton className="accordion__button p-3">
                                Upause
                              </AccordionItemButton>
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
                              <AccordionItemButton className="accordion__button p-3">
                                Mint
                              </AccordionItemButton>
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default SmartContractsExplorer;
