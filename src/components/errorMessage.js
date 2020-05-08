import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Warning from '@material-ui/icons/Warning';


const snackBarStyle = {
	cursor: 'pointer',
	color: '#1D7EE5',
	position: 'absolute',
	right: 10,
	fontSize: 16,
}

const msgStyle = {
	maxWidth: '500px',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	textTransform: 'capitalize',
	marginRight: 50
}

class ErrorMessage extends React.Component {
	render() {
		let errorMessage
		if (this.props.message.code === 11000) {
			errorMessage = (
				<p style={msgStyle}>
					Error: {this.props.message.errmsg}.
					<span
						onClick={this.props.onClose}
						style={snackBarStyle}
					>
						Close
					</span>
				</p>
			)
		} else {
			errorMessage = (
				<p style={msgStyle}>
					Error: You found a problem!
					<span
						onClick={this.props.onClose}
						style={snackBarStyle}
					>
						Close
					</span>
				</p>
			)
		}

		return (
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={true}
				onClose={this.props.onClose}
				ContentProps={{
					'aria-describedby': 'error-id',
				}}
				action={this.props.onClose}
				style={{marginBottom: 25}}
				message={errorMessage}
			/>
		);
	}
}

export default ErrorMessage;
