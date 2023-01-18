import React, { useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual} from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardInfoSelector } from '../../../../selectors';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import Button from '../../../components/button';
import ContentLoader from '../../../components/content-loader';

export default function ActivePolls() {
  const dispatch = useDispatch();

  const { dashboardActivePolls } = useSelector(getDashboardInfoSelector, shallowEqual);

  const activePollsContent = useMemo(() => {
    if (!dashboardActivePolls) {
      return (
        <ContentLoader />
      );
    }

    if (dashboardActivePolls.length) {
      return (
        dashboardActivePolls.map(el => (
          <Link
            className="poll-item mb-3"
            to={`/followed-polls/${el.poll}`}
          >
            <div className="poll-item-icon">?</div>
            {el.name}
          </Link>
        ))
      );
    }

    return (
      <p>No active polls.</p>
    );
  }, [dashboardActivePolls]);

  return (
    <div className="card card-light card-h-255 dashboard-tooltip-card">
      <div className="card-title">
        <div className="title">Active Poll</div>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column justify-content-between h-100">
          {activePollsContent}
          <Button
            size="lg"
            color="grey"
            onClick={() => dispatch(setBodyModalParamsAction('ISSUE_POLL'))}
            name="Create poll"
            isArrow
          />
        </div>
      </div>
    </div>
  );
}
