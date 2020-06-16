import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowRight } from '../../../assets/arrow-right.svg';
import { setBodyModalParamsAction } from '../../../modules/modals';
import ContentLoader from '../../components/content-loader';

export default function ActivePolls() {
  const dispatch = useDispatch();

  const { dashboardActivePolls } = useSelector(state => state.dashboard);

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
    <div className="card card-light card-h-255">
      <div className="card-title">
        <div className="title">Active Poll</div>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column justify-content-between h-100">
          {activePollsContent}
          <button
            type="button"
            className="btn btn-grey btn-lg"
            onClick={() => dispatch(setBodyModalParamsAction('ISSUE_POLL'))}
          >
            <span>Create poll</span>
            <div className="btn-arrow">
              <ArrowRight />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
