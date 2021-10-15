import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import util from "../../../../helpers/util/utils";

const Settings = ({
  setBodyModalParamsAction,
  isLocalhost,
  isActive,
  closeMenu,
}) => (
  <div
    className={classNames({
      "account-body-modal": true,
      active: isActive,
      "settings-bar": true,
      "settings-menu": true,
      "settings-body-modal-window": true,
    })}
  >
    <div className="options-col">
      <ul>
        <li>
          <NavLink activeClass={"active"} className="option" to="/blocks">
            Blocks
          </NavLink>
        </li>
        <li>
          <NavLink activeClass={"active"} className="option" to="/peers">
            Peers
          </NavLink>
        </li>
        <li>
          <NavLink activeClass={"active"} className="option" to="/generators">
            Generators
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClass={"active"}
            className="option"
            to="/backend-status"
          >
            Backend Tasks Status
          </NavLink>
        </li>
        {isLocalhost && (
          <>
            <li>
              <NavLink
                activeClass={"active"}
                className="option"
                to="/funding-monitors"
              >
                Monitors
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClass={"active"}
                className="option"
                to="/scheduled-transactions"
              >
                Scheduled transactions
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
    <div className="options-col">
      <ul>
        <li>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              return setBodyModalParamsAction("TOKEN_GENERATION_VALIDATION");
            }}
            className="option"
          >
            Generate token
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              return setBodyModalParamsAction("CALCULATE_CACHE");
            }}
            className="option"
          >
            Calculate hash
          </button>
        </li>
        {
          <li>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                return setBodyModalParamsAction("TRANSACTIONS_OPERATIONS");
              }}
              className="option"
            >
              Transaction operations
            </button>
          </li>
        }
      </ul>
    </div>
    <div className="options-col">
      <ul>
        {util.isDesktopApp() && (
          <li className={"hide-media"}>
            <a href="/test" className="option">
              API Console
            </a>
          </li>
        )}

        <li>
          <NavLink activeClass={"active"} to="/settings" className="option">
            Settings
          </NavLink>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              return setBodyModalParamsAction("EXPORT_KEY_SEED");
            }}
            className="option"
          >
            Export Secret File
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              return setBodyModalParamsAction("SHARDING_INFO");
            }}
            className="option"
          >
            Sharding info
          </button>
        </li>
      </ul>
    </div>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(null, mapDispatchToProps)(Settings);
