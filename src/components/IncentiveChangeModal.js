import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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

class IncentiveChangeModal extends Component {
	constructor(props){
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit(e, changeActionActual){
		e.preventDefault()
		this.props.handleRequestUpdate(changeActionActual)
	}

	render() {
		const { currentStatus, changeActionView, changeActionActual } = this.props

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
					Change Deal Status
					<Close
						onClick={this.props.handleClose}
						style={closeStyle}
					/>
				</DialogTitle>
				<DialogContent>
					<div>
						Change this request from <span style={{textTransform: 'capitalize'}}>{currentStatus}</span> to <span style={{textTransform: 'capitalize'}}>{changeActionView}</span>?
					</div>
				</DialogContent>
				<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
					<Button
						className="submit-btn"
						type="submit"
						onClick={(e) => this.handleSubmit(e, changeActionActual)}
						style={{marginBottom: 10}}
					>
						Confirm
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

export default IncentiveChangeModal;
