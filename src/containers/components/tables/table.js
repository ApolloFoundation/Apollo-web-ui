import React from 'react';
import classNames from 'classnames';
import ContentHendler from '../content-hendler';
import uuid from 'uuid';

const CustomTable = (props) => {
    const {actionButton, hintClassName, className, tableName, emptyMessage, header, TableRowComponent, tableData, isPaginate, previousHendler, nextHendler, page} = props;
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
                            <div className="form-title padding-left padding-top">
                                <p>{tableName}</p>
                            </div>

                        <div className="transaction-table-body">
                            <table>
                                <thead>
                                    <tr>
                                        {
                                            header && 
                                            header.map((el) => 
                                                <td
                                                    key={uuid()}
                                                    className={classNames({
                                                        'align-right': el.alignRight
                                                    })}
                                                >
                                                    {el.name}
                                                </td>
                                            )
                                        }
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.map((el, index) => {
                                        return (
                                            <TableRowComponent
                                                {...el}
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

                                <a
                                    className={classNames({
                                        'btn' : true,
                                        'btn-left' : true,
                                        'disabled' : page <= 1,
                                        'round': true,
                                        'round-top-right': true,
                                        'round-bottom-left': true,
                                    })}
                                    onClick={previousHendler}
                                > Previous</a>
                                <div className='pagination-nav'>
                                    <span>{page * 15  - 15 + 1}</span>
                                    <span>&hellip;</span>
                                    <span>{page * 15}</span> 
                                </div>
                                <a
                                    onClick={nextHendler}
                                    className={classNames({
                                        'btn' : true,
                                        'btn-right' : true,
                                        'disabled' : tableData.length < 15,
                                        'round': true,
                                        'round-top-left': true,
                                        'round-bottom-right': true,
                                    })}
                                >Next</a>
                            </div>
                 
                        }
                        {
                            actionButton && 
                            <div className="btn-box pagination">
                                <a
                                    onClick={actionButton.handler}
                                    className={classNames({
                                        'btn' : true,
                                        'btn-right' : true,
                                        'blue': true,
                                        'round': true,
                                        'round-top-left': true,
                                        'round-bottom-right': true,
                                    })}
                                >
                                    {actionButton.name}
                                </a>
                            </div>
                        }
                        </div>
                        
                    </>
                    

                }
            </ContentHendler>
    )
}

export default CustomTable;