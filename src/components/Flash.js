import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Warning from '@material-ui/icons/Warning';
import Info from '@material-ui/icons/Info';

import { config } from './../app-config'

const snackBarStyle = {
	cursor: 'pointer',
	color: '#1D7EE5',
	position: 'absolute',
	right: 10,
	fontSize: 16,
}

const msgStyle = {
	maxWidth: '500px',
	marginRight: 50
}


export default class Flash extends React.Component {
	render() {
		let showSnack = false
		let message;
		let errors = this.props.flash && this.props.flash.errors
		if (errors) {
			showSnack = true
			var size = Object.keys(errors).length;
			if (size > 1) {
				message = (
					<p style={msgStyle}>
						Required fields are missing.
						<span
							onClick={this.props.onClose}
							style={snackBarStyle}
						>
							Close
						</span>
					</p>
				)
			} else if (size === 1) {
				let errArray = Object.values(errors).forEach((err) => {
					if (err.message) {
						message = (
							<p style={msgStyle}>
								{err.message}
								<span
									onClick={this.props.onClose}
									style={snackBarStyle}
								>
									Close
								</span>
							</p>
						)
					} else if (err.nested) {
						let nestedError = Object.values(err.nested).forEach((error) => {
							message = (
								<p style={msgStyle}>
									{error.message}
									<span
										onClick={this.props.onClose}
										style={snackBarStyle}
									>
										Close
									</span>
								</p>
							)
						})

					}
				})
			}
		} else if (this.props.flash && this.props.flash.error) {
			showSnack = true
			// Set defaults to avoid undefined error
			let item = ''
			let errMsg = ''
			if (this.props.type) {
				item = this.props.type
				if (item === 'Campaign') {
					item = 'Campaign name'
				}
				if (item === 'Campaign Group') {
					item = 'Campaign Group name'
				}
			}

			if (this.props.flash.code == 11000) {
				// Rename in case of Deal Number because incentive request is in context.
				if (/dealnumber/gi.test(this.props.flash.message)) {
					item = 'Stock Number'
				}

				errMsg = `${item} already exists`
			} else {
				// Added absolute default so undefined is never shown.
				errMsg = this.props.flash.message || this.props.flash.errmsg || ''
			}
			message = (
				<p style={msgStyle}>
					{errMsg}.
					<span
						onClick={this.props.onClose}
						style={snackBarStyle}
					>
						Close
					</span>
				</p>
			)
		} else if (this.props.flash && this.props.flash.message) {
			showSnack = true
			message = (
				<p style={msgStyle}>
					{this.props.flash.message}.
					<span
						onClick={this.props.onClose}
						style={snackBarStyle}
					>
						Close
					</span>
				</p>
			)
		} else {
			showSnack = false
		}

		if (showSnack) {
			return (
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					open={true}
					className="special-snacks"
					onClose={this.props.onClose}
					style={{ marginBottom: 25 }}
					autoHideDuration={config.snackbarHideTime}
					ContentProps={{
						'aria-describedby': 'error-id',
					}}
					message={message}
				/>
			);
		} else {
			return null
		}
	}
}
