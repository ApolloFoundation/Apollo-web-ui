import React from "react";

import { convertToToken } from "../../../../helpers/converters";

const PanelOverview = ({ overview, token }) => {
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent">
        <div className="heading mb-3">Overview</div>
        <table className="w-100">
          <tbody>
            {overview.map((item, index) =>
              token ? (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    {!item.type === "url" ? (
                      <a
                        target="_blank"
                        href={item.value}
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <>
                        <span>
                          {item.type === "uint" &&
                          !(
                            item.name === "releaseTime" ||
                            item.name === "decimals"
                          ) ? (
                            <>
                              <span className="text-info">
                                {convertToToken(item.value, 8, true)}{" "}
                              </span>
                              {token.value && (
                                <>
                                  {token.value}
                                  <span className="text-info">
                                    {Number(item.value).toLocaleString("en", {
                                      useGrouping: true,
                                    })}
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {item.value}
                              <span className="text-info"> {item.type}</span>
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    {item.value } <span className="text-info"> {item.type}</span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelOverview;
