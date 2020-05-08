import React, { Component } from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux'
import {compose} from 'redux'
import { withRouter } from 'react-router-dom'
import actions from '../actions';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import BPTextField from './controls/BPTextField'
import Close from '@material-ui/icons/Close'

const titleStyle = {
	marginBottom: 20,
	padding: '20px 10px 18px 20px',
	borderBottom: '2px solid #0D3B6C',
	textTransform: 'capitalize'
}

const closeStyle = {
	cursor: 'pointer',
	position: 'absolute',
	right: 20,
	top: 25
}

const required = value => (value  ? undefined : 'Required')

class IncentiveActionModal extends Component {
	constructor(props){
		super(props)
		this.onSubmit = this.onSubmit.bind(this)
		this.purchaseRequest = this.purchaseRequest.bind(this)
	}
	purchaseRequest(request, dealNumber){
		request.dealNumber = dealNumber
	}


	onSubmit(){
		if (this.props.actionType === 'deliver') {
			let dealership = this.props.dealership
			let request = this.props.request
			let dealNumber = this.props.dealNumberForm && this.props.dealNumberForm.values && this.props.dealNumberForm.values.dealNumber ? this.props.dealNumberForm.values.dealNumber : ""
			return new Promise((resolve, reject) => {
				this.props.dispatch(actions.purchaseIncentiveRequest(dealership, request, dealNumber)).then((res)=>{
					if (!(res && res.result && res.result.errors)) {
						resolve()
						this.props.handleClose()
					} else {
						let propErrors = res.result.submissionErrors
						reject(propErrors)
						this.props.dispatch(actions.clearIncentiveRequestFlash())
					}
				})
			})
		} else {
			return this.props.performAction()
		}
	}

	render() {
		const { dealNumberForm, handleSubmit, disableBackdropClick, disableEscapeKeyDown } = this.props
		let action = this.props.actionType
		let dealNumber = dealNumberForm && dealNumberForm.values && dealNumberForm.values.dealNumber

		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={() => {
					if (!disableBackdropClick) {
						this.props.handleClose()
					}
				}}
				maxWidth = 'sm'
				disableBackdropClick
				disableEscapeKeyDown
			>
				<form onSubmit={handleSubmit(this.onSubmit)}>
					<DialogTitle
						id="alert-dialog-title"
						style={titleStyle}
						className="custom-dialog-title"
					>
						Confirm {action}
						<Close
							onClick={this.props.handleClose}
							style={closeStyle}
						/>
					</DialogTitle>
					<DialogContent>
						{(action === 'reject' || action === 'approve') &&
							<span>Are you sure you want to {action} this request?</span>
						}
						{action === 'deliver' &&
							<Grid container spacing={3}>
								<Grid item sm={12}>
									<span>To mark this product as delivered, please enter a stock number and click {action}.</span>
								</Grid>
								<Grid item sm={6}>
										<BPTextField
											name="dealNumber"
											className='text-field user-form'
											placeholder='Stock Number'
										/>
								</Grid>
							</Grid>
						}
					</DialogContent>
					<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
						<Button
							className="submit-btn"
							type="submit"
							style={{marginBottom: 10}}
						>
							{action ? action : ''}
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
				</form>
			</Dialog>
		);
	}
}

export default compose(
	connect(
		({form}) => {

			return {
				dealNumberForm: form['dealNumberForm']
			}
		}
	),
	reduxForm({
		form: 'dealNumberForm',
		destroyOnUnmount: true,
		enableReinitialize: true
	}),
)(IncentiveActionModal);
