import React, { Component } from 'react';


import { reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux'
import {compose} from 'redux'
import { withRouter } from 'react-router-dom'


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import BPTextField from './controls/BPTextField'
import Close from '@material-ui/icons/Close'
import Warning from '@material-ui/icons/Warning'
import EntityForm from './EntityForm'
import {formatCurrency} from '../helpers/format-util';


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


class RequestUpdateModal extends EntityForm {
	constructor(props){
		super(props)
	}

	render() {
		const { initialDeposit, newDeposit, initialRequest, newRequest, incentiveState, incentiveSubstate} = this.props
		let depositStatement, requestStatement
		if (initialDeposit > newDeposit) {
			depositStatement = `You are about to decrease your deposit amount from ${formatCurrency(initialDeposit)} to ${formatCurrency(newDeposit)}.`
		} else if (initialDeposit < newDeposit) {
			depositStatement = `You are about to increase your deposit amount from ${formatCurrency(initialDeposit)} to ${formatCurrency(newDeposit)}.`
		} else if (initialDeposit === newDeposit) {
			depositStatement = ''
		} else if (newDeposit && !initialDeposit) {
			depositStatement = `You are about to increase your deposit amount from $0 to ${formatCurrency(newDeposit)}.`
		}
		if (incentiveState === 'requested' || incentiveState === 'preparing') {
				if (initialRequest > newRequest) {
					requestStatement = `You are about to reduce your requested funds from ${formatCurrency(initialRequest)} to ask for ${formatCurrency(newRequest)}.`
				} else if (initialRequest < newRequest) {
					requestStatement = `You are risking your request for ${formatCurrency(initialRequest)} to ask for ${formatCurrency(newRequest)}.`
				} else {
					requestStatement = ''
				}
		} else {
				if (initialRequest > newRequest) {
					requestStatement = `You are about to reduce your approved funds from ${formatCurrency(initialRequest)} to ask for ${formatCurrency(newRequest)}.`
				} else if(initialRequest < newRequest) {
					requestStatement = `You are risking your approved request for ${formatCurrency(initialRequest)} to ask for ${formatCurrency(newRequest)}.`
				} else {
					requestStatement = ''
				}
		}


		return (
			<div>
				<Dialog
					open={this.props.open}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					onBackdropClick={this.props.handleClose}
					maxWidth='xs'
				>
					<DialogTitle
						id="alert-dialog-title"
						style={titleStyle}
						className="custom-dialog-title"
					>
						<Warning style={{color: '#DF4F34', fontSize: 21, position: 'relative', top: 3, marginRight: 5}} />
						Notice
						<Close
							onClick={this.props.handleClose}
							style={closeStyle}
						/>
					</DialogTitle>
					<DialogContent>
						{depositStatement &&
							<div style={{marginBottom: 20}}>{depositStatement}</div>
						}
						{requestStatement &&
							<div>{requestStatement}</div>
						}
					</DialogContent>
					<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
						<Button
							onClick={this.props.continue}
							className="submit-btn"
							type="submit"
							style={{marginBottom: 10}}
						>
							Continue
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
			</div>
		);
	}
}

export default RequestUpdateModal
