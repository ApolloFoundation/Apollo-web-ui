import React from "react";
import { convertToToken } from "../../../../../helpers/converters";

const Overview = ({ overview, token }) => {
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent">
        <div className="heading mb-3">Overview Token</div>
        <table className="w-100">
          <tbody>
            {overview.map((item, index) => (
              <tr key={item.name + index}>
                <td>{item.name}</td>
                <td>
                  <span>
                    {item.type === "uint" && !(item.name === "releaseTime" || item.name === "decimals") ? (
                      <>
                        <span className="text-info">
                          {convertToToken(item.value, 8, true)}
                        </span>
                        &nbsp;{token.value} (
                        <span className="text-info">
                          {Number(item.value).toLocaleString("en", {
                            useGrouping: true,
                          })}
                        </span>
                        )
                      </>
                    ) : (
                      <>
                        {item.value}
                        <span className="text-info"> {item.type}</span>
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;
