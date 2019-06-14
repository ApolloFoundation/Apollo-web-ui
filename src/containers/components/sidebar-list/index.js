import React from 'react';
import InfoBox from '../info-box';
import uuid from 'uuid';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import ContentLoader from '../../components/content-loader';
import {withRouter} from 'react-router-dom';

const SidebarContent = ({emptyMessage, baseUrl, data, bottomBarPreText, element, location, Component, currentItem}) => (
    <>
        <div className="card">
            {
                !!data &&
                data.length > 0 &&
                data.map((el, index) => {
                    return (
                        <Link
                            key={element}
                            style={{display: 'block'}}
                            to={baseUrl + el[element]}
                            className={classNames({
                                "chat-item": true,
                                "active": (location && location.pathname === baseUrl + el[element]) || currentItem === el[element]
                            })}
                        >
                            <Component  {...el}/>
                        </Link>
                    );
                }) 
            }
            {
                !data &&
                <ContentLoader />
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