import React from 'react';
import classNames from 'classnames';
import ContentHendler from '../content-hendler';
import uuid from 'uuid';

const CustomTable = (props) => {
    const {keyField, AboveTabeComponent, actionButton, passProps, hintClassName, className, tableName, emptyMessage, header, TableRowComponent, tableData, isPaginate, previousHendler, nextHendler, page, itemsPerPage = 15} = props;
    return (
            <ContentHendler
                items={tableData}
                emptyMessage={emptyMessage}
                className={hintClassName}
            >
                {
                    tableData &&
                    !!tableData.length &&
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
                            <div className="transaction-table-body pb-0 mb-4">
                                <table>
                                    <thead>
                                        <tr>
                                            {
                                                header && 
                                                header.map((el) => 
                                                    <React.Fragment key={uuid()}>
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
                                        tableData.map((el, index) => {
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
                                tableData &&
                                !!tableData.length &&
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
                                        <span>&hellip;</span>
                                        <span>{(page * itemsPerPage - itemsPerPage) + tableData.length}</span>
                                    </div>
                                    <button
                                        type={'button'}
                                        onClick={nextHendler}
                                        className={classNames({
                                            'btn btn-default' : true,
                                            'disabled' : tableData.length < itemsPerPage,
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