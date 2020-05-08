import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Close from '@material-ui/icons/Close'

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

class CapWarning extends React.Component {

	render() {
		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth='sm'
				onBackdropClick={this.props.handleClose}
			>
				<DialogTitle
					id="alert-dialog-title"
					className="custom-dialog-title"
					style={titleStyle}
				>
					Apply Multi Campaign Cap Change?
					<Close
						onClick={this.props.handleClose}
						style={closeStyle}
					/>
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Changing the cap on this campaign effects all active campaigns linked to this product.
					</DialogContentText>
				</DialogContent>
				<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
					<Button
						onClick={this.props.confirm}
						className="submit-btn"
						type="submit"
						style={{marginBottom: 10}}
					>
						Apply
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

export default CapWarning;
