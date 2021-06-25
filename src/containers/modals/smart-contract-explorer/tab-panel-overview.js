import React from "react";

const TabPanelOverview = ({ overview }) => {
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent">
        <div className="title text-dark mb-3">Overview</div>
        <table className="w-100">
          <tbody>
            {overview.map((item) => (
              <tr>
                <td>{item.name}</td>
                <td>
                  {!item.type === "url" ? (
                    <a target="_blanck" href={item.value}>
                      {item.value}
                    </a>
                  ) : (
                    <>
                      <span>{item.value}</span>
                      <span className="text-info"> {item.type}</span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabPanelOverview;
