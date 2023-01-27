import React from 'react';
import classNames from 'classnames';
import ContentHendler from '../content-hendler';

const CustomTable = (props) => {

    const normalizeTableData = () => {
        const {tableData , itemsPerPage} = props;
        let newTableData = [];
        if(itemsPerPage && tableData && tableData.length > itemsPerPage) {
            newTableData = tableData.slice(0, itemsPerPage);
            return newTableData
        } else {
            return tableData
        }
    };

    const isNextDisabled = () => {
        const {tableData , itemsPerPage = 15} = props;
        return tableData.length <= itemsPerPage
    };

    const {AboveTabeComponent, actionButton, passProps, hintClassName, className, tableName, emptyMessage, header, TableRowComponent, tableData, isPaginate, previousHendler, nextHendler, page, itemsPerPage = 15} = props;
    const newTableData = normalizeTableData();

    return (
            <ContentHendler
                items={newTableData}
                emptyMessage={emptyMessage}
                className={hintClassName}
            >
                {
                    newTableData &&
                    (!!newTableData.length || newTableData.length === 0) &&
                    <>
                        <div className={`transaction-table ${className}`}>
                            {
                                tableName &&
                                <div className="form-title padding-left padding-top">
                                    <p>{tableName}</p>
                                </div>
                            }
                            {
                                AboveTabeComponent &&
                                <AboveTabeComponent />
                            }
                            <div className="transaction-table-body pb-0">
                                <table>
                                    <thead>
                                        <tr>
                                            {
                                                header &&
                                                header.map((el) =>
                                                    <React.Fragment key={el.name}>
                                                        {
                                                            !el.isRender &&
                                                            <td
                                                                className={classNames({
                                                                    'align-right': el.alignRight
                                                                })}
                                                            >
                                                                {el.name}
                                                            </td>
                                                        }
                                                    </React.Fragment>
                                                )
                                            }

                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        newTableData.map((el, index) => {
                                            return (
                                                <TableRowComponent
                                                    key={index}
                                                    {...el}
                                                    {...passProps}
                                                />
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                            {/** Table paginator */}
                            {
                                page &&
                                newTableData &&
                                !!newTableData.length &&
                                isPaginate &&
                                <div className="btn-box pagination">

                                    <button
                                        type={'button'}
                                        className={classNames({
                                            'btn btn-default' : true,
                                            'disabled' : page <= 1,
                                        })}
                                        onClick={previousHendler}
                                    >
                                        Previous
                                    </button>
                                    <div className='pagination-nav'>
                                        <span>{page * itemsPerPage  - itemsPerPage + 1}</span>
                                        <span> - </span>
                                        <span>{(page * itemsPerPage - itemsPerPage) + newTableData.length}</span>
                                    </div>
                                    <button
                                        type={'button'}
                                        onClick={nextHendler}
                                        className={classNames({
                                            'btn btn-default' : true,
                                            'disabled' : isNextDisabled(newTableData),
                                        })}
                                    >
                                        Next
                                    </button>
                                </div>
                            }
                            {
                                actionButton &&
                                <div className="btn-box pagination">
                                    <button
                                        type={'button'}
                                        onClick={actionButton.handler}
                                        className={'btn btn-default'}
                                    >
                                        {actionButton.name}
                                    </button>
                                </div>
                            }
                        </div>
                    </>


                }
            </ContentHendler>
    )
}

export default CustomTable;
