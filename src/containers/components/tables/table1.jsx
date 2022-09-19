import React from 'react';
import classNames from 'classnames';
import ContentHendler from '../content-hendler';
import Button from '../button';

export default function CustomTable(props) {
  const {
    AboveTabeComponent, actionButton, passProps, hintClassName, className,
    tableName, emptyMessage, header, TableRowComponent, isPaginate,
    previousHendler, nextHendler, page, itemsPerPage = 15, tableData,
  } = props;

  const normalizeTableData = () => {
    let newTableData = [];
    if (itemsPerPage && tableData && tableData.length > itemsPerPage) {
      newTableData = tableData.slice(0, itemsPerPage);
      return newTableData;
    }
    return tableData;
  };

  const isNextDisabled = () => tableData.length <= itemsPerPage;

  const newTableData = normalizeTableData();

  return (
    <ContentHendler
      items={newTableData}
      emptyMessage={emptyMessage}
      className={hintClassName}
    >
      {newTableData
        && (!!newTableData.length || newTableData.length === 0)
        && (
          <>
            <div className={`transaction-table ${className}`}>
              {tableName && (
                <div className="form-title padding-left padding-top">
                  <p>{tableName}</p>
                </div>
              )}
              {AboveTabeComponent && <AboveTabeComponent />}
              <div className="transaction-table-body pb-0">
                <table>
                  <thead>
                    <tr>
                      {header && header.map(el => (
                        <React.Fragment>
                          {!el.isRender && (
                            <td className={classNames({ 'align-right': el.alignRight })}>
                              {el.name}
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newTableData.map((el, index) => (
                      <TableRowComponent
                        key={index}
                        {...el}
                        {...passProps}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {/** Table paginator */}
              {page && newTableData && !!newTableData.length && isPaginate && (
                <div className="btn-box pagination">
                  <Button
                    disabled={page <= 1}
                    onClick={previousHendler}
                    name="Previous"
                  />
                  <div className="pagination-nav">
                    <span>{page * itemsPerPage - itemsPerPage + 1}</span>
                    <span> - </span>
                    <span>{(page * itemsPerPage - itemsPerPage) + newTableData.length}</span>
                  </div>
                  <Button
                    name="Next"
                    onClick={nextHendler}
                    disabled={isNextDisabled(newTableData)}
                  />
                </div>
              )}
              {actionButton && (
                <div className="btn-box pagination">
                  <Button
                    onClick={actionButton.handler}
                    name={actionButton.name}
                  />
                </div>
              )}
            </div>
          </>
        )}
    </ContentHendler>
  );
}
