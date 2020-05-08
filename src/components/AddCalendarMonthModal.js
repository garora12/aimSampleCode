import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import OemInvitationForm from './Oems/OemInvitationForm';
import OemAddMonthForm from './Oems/OemAddMonthForm'
import DealershipInvitationForm from './Dealerships/DealershipInvitationForm';

import Close from '@material-ui/icons/Close'

const titleStyle = {

	padding: '10px 10px 10px 20px',
}

const closeStyle = {
	cursor: 'pointer',
	position: 'absolute',
	right: 16,
	top: 17
}

class AddCalendarMonthModal extends React.Component {
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
					Add New Months

					<Close
						onClick={this.props.handleClose}
						style={closeStyle}
					/>
				</DialogTitle>
				<DialogContent className="member-invite-form">
					<p  style={{
						margin: '0px 0 20px 0',

					}}>Select the number of months you want to add to your calender</p>
					{this.props.oem &&
                        <OemAddMonthForm
							handleClose={this.props.handleClose}
						/>
					}
				</DialogContent>
			</Dialog>
		);
	}
}

export default AddCalendarMonthModal;
