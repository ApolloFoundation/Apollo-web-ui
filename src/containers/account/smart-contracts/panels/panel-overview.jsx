import React from "react";

import { convertRate, convertToToken } from '../../../../helpers/converters';

const PanelOverview = ({ overview, token }) => {
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent">
        <div className="heading mb-3">Overview</div>
        <table className="w-100">
          <tbody>
            {overview.map((item, index) => {
              return token ? (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    {item.type === "uint" && !(item.name === "releaseTime" || item.name === "releaseDelay" || item.name === "decimals" || item.name === "rate") ? (
                      <span>
                        <span className="text-info">
                          {convertToToken(item.value, 8, true)}&nbsp;
                        </span>
                        {token.value && (
                            <span>
                              ({Number(item.value).toLocaleString("en", {
                                useGrouping: true,
                              })})
                            </span>
                        )}
                      </span>
                    ) : (item.type === "uint" && item.name === "rate") ? (
                      <span className="text-info">{convertRate(item.value)}</span>
                    ) : (
                      <span className="text-info">{ item.value }</span>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
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
