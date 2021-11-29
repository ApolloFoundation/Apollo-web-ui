import React from "react";

import { convertToToken } from "../../../../helpers/converters";

const PanelOverview = ({ overview, token }) => {
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent">
        <div className="heading mb-3">Overview</div>
        <table className="w-100">
          <tbody>
            {overview.map((item) => {
              return token ? (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>
                    {item.type === "uint" && !(item.name === "releaseTime" || item.name === "decimals" || item.name === "rate") ? (
                      <span>
                        <span className="text-info">
                          {convertToToken(item.value, 8, true)}&nbsp;
                        </span>
                        {token.value && (
                          <span>
                            {token.value}&nbsp;
                            <span className="text-info">
                              {Number(item.value).toLocaleString("en", {
                                useGrouping: true,
                              })}
                            </span>
                          </span>
                        )}
                      </span>
                    ) : (
                      <>
                        {item.name === "rate" ? convertToToken(item.value, 8, true) : item.value}&nbsp;
                        <span className="text-info">{item.type}</span>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>
                    {item.value} <span className="text-info"> {item.type}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelOverview;
