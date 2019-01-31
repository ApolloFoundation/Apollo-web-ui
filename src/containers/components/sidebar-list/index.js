import React from 'react';
import InfoBox from '../info-box';
import uuid from 'uuid';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import ContentLoader from '../../components/content-loader';


import {formatTimestamp} from "../../../helpers/util/time";

const SidebarContent = ({emptyMessage, baseUrl, data, bottomBarPreText, element, location: {pathname}, Component}) => (
    <>
        <div className="card card-full-screen no-padding scroll">
            {
                data ?
                data.map((el, index) => {
                    return (
                        <Link
                            key={index}
                            style={{display: 'block'}}
                            to={baseUrl + el[element]}
                            className={classNames({
                                "chat-item": true,
                                "active": pathname === baseUrl + el[element]
                            })}
                        >
                            <Component  {...el}/>
                        </Link>
                    );
                }) : <ContentLoader />
            }
            {
                data &&
                data.length === 0 &&
                <p className={"no-followed-polls"}>{emptyMessage}</p>
            }
        </div>
    </>
)

export default withRouter(SidebarContent);