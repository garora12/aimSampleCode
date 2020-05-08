import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import OemInvitationForm from './Oems/OemInvitationForm';
import DealershipInvitationForm from './Dealerships/DealershipInvitationForm';

import Close from '@material-ui/icons/Close'

const titleStyle = {
	marginBottom: 30,
	padding: '20px 10px 18px 20px',
	borderBottom: '2px solid #0D3B6C'
}

const closeStyle = {
	cursor: 'pointer',
	position: 'absolute',
	right: 20,
	top: 25
}

class MemberInviteModal extends React.Component {
	render() {
		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={this.props.handleClose}
			>
				<DialogTitle
					id="alert-dialog-title"
					style={titleStyle}
					className="custom-dialog-title"
				>
					Invite New Member
					<Close
						onClick={this.props.handleClose}
						style={closeStyle}
					/>
				</DialogTitle>
				<DialogContent className="member-invite-form">
					{this.props.oem &&
						<OemInvitationForm
							newMember={true}
							handleClose={this.props.handleClose}
						/>
					}
					{this.props.dealership &&
						<DealershipInvitationForm
							newMember={true}
							handleClose={this.props.handleClose}
						/>
					}
				</DialogContent>
			</Dialog>
		);
	}
}

export default MemberInviteModal;
