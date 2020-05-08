import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Close from '@material-ui/icons/Close'
import Grid from '@material-ui/core/Grid'
import DialogTitle from '@material-ui/core/DialogTitle';

const titleStyle = {
	marginBottom: 20,
	padding: '20px 10px 18px 20px',
	borderBottom: '2px solid #0D3B6C'
}

const closeStyle = {
	cursor: 'pointer',
	position: 'absolute',
	right: 20,
	top: 25
}

class DeleteConfirmation extends React.Component {

	render() {
		let itemString = <div>{this.props.popupTitle ? this.props.popupTitle : "You're About to Delete a Row"}</div>;

		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={this.props.handleClose}
				maxWidth='sm'
			>
				<DialogTitle
					id="alert-dialog-title"
					style={titleStyle}
					className="custom-dialog-title"
				>
					{itemString}
					<Close
						onClick={this.props.handleClose}
						style={closeStyle}
					/>
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure that you want to delete {this.props.item ? this.props.item : 'the selected items'} from the current {this.props.title} list?
					</DialogContentText>
				</DialogContent>
				<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
					<Button
						onClick={this.props.delete}
						className="submit-btn"
						type="submit"
						style={{marginBottom: 10}}
					>
						Delete
					</Button>
					<Button
						onClick={this.props.handleClose}
						color="primary"
						className="cancel-btn"
						style={{marginBottom: 10, float: 'right'}}
					>
						Cancel
					</Button>
				</div>
			</Dialog>
		);
	}
}

export default DeleteConfirmation;
