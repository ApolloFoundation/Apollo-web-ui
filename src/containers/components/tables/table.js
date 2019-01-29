import React from 'react';
import classNames from 'classnames';
import ContentHendler from '../content-hendler';

const CustomTable = (props) => {
    const {header, TableRowComponent, tableData, isPaginate, previousHendler, nextHendler, page} = props;
    return (
        <div className="transaction-table">
            <ContentHendler
                items={tableData}
                emptyMessage={'No transactions found.'}
            >
                <div className="transaction-table-body">
                    <table>
                        <thead>
                            <tr>
                                {
                                    header && 
                                    header.map((el) => 
                                        <td
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
                            tableData &&
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
            </ContentHendler>
            {/** Table paginator */}
            {
                page &&
                tableData &&
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
        </div>
    )
}

export default CustomTable;