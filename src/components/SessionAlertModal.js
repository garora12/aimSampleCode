import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import actions from '../actions';
import { clear } from "redux-localstorage-simple";
import sysend from "sysend";

class SessionAlertModal extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
  	if(nextProps.removeLogoutAlertPopup===true) {
			this.continueSession();
		}
	}

	handleAutoLogout = async () => {

    this.setAutoTimeout = setTimeout(() => {
      if (!this.props.auth.isStayClicked || !this.props.auth.isLogoutClicked) {
        this.sessionLogout();
      }
    }, this.props.auth.expireTime);
  }

  continueSession = async () => {
    clearInterval(this.setAutoTimeout)
    await this.props.dispatch(actions.setSessionActive());
  }

  sessionLogout = async (e) => {
    const { auth: { loggedin, sessionId, user } } = this.props;
    if (loggedin) {
      await this.props.dispatch(actions.logout({ sessionId, userId: user.id }))
      clear();
			sysend.broadcast('triggerLogout');
    }
  }

  handleClearAutoLogout = async () => {
    clearInterval(this.setAutoTimeout)
    await this.props.dispatch(actions.setSessionActive());
  }

  restoreSession = async () => {
    await this.props.dispatch(actions.setRestoreSession());
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.auth.isTimedOut}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onEnter={this.restoreSession}
          onEntered={this.handleAutoLogout}
          onExited={this.handleClearAutoLogout}
        >
          <DialogTitle id="alert-dialog-title">
            Your unsaved changes will be lost. Do you want to logout?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.continueSession} color="primary">
              Stay
				    </Button>
            <Button onClick={this.sessionLogout} color="danger" autoFocus>
              Logout
				    </Button>
          </DialogActions>
        </Dialog>
      </div >
    )
  }
}

export default connect(
  ({ auth }) =>
    ({
      auth,
    }),
  dispatch =>
    ({
      dispatch
    })
)(SessionAlertModal);
