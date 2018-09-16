import React from 'react';
import SiteHeader from '../../components/site-header'
import InfoBox from '../../components/info-box';

class UnknownPage extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'404'}
                />
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        <InfoBox default>
                            The page you are searching for was not found.
                        </InfoBox>
                    </div>
                </div>
            </div>
        );
    }
}

export default UnknownPage;