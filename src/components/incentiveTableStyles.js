const tableStyles = {
	root: {
		width: '100%',
		height: 'auto',
	},
	table: {
		tableLayout: 'auto'
	},
	tableWrapper: {
		boxShadow: '1px 0 10px 0 #d9e4ec !important',
		background: '#ffffff',
		'& button': {
			width: 'auto !important'
		}
	},
	tableWrapper2: {
		background: '#ffffff',
		'& button': {
			width: 'auto !important'
		}
	},
	row: {
		borderBottom: '1px solid #EBEBEB',
		'&:hover': {
			backgroundColor: '#DFE5FE',
		},
		'& td': {
			fontSize: 15
		}
	},
	customButton: {
		backgroundColor: "#375CF6",
		color: "#FFFFFF",
		textTransform: 'capitalize',
		marginBottom: 12,
		marginTop: 20,
		fontWeight: 500,
		'&:hover' : {
			backgroundColor: '#1E43DD'
		}
	},
	tableLink: {
		color: '#375CF6',
		fontWeight: 500,
		cursor: 'pointer',
		textDecoration: 'none'
	},
	pendingButton: {
		borderRadius: 4,
		backgroundColor: '#304ffe',
		color: 'white',
		textAlign: 'center',
		textTransform: 'capitalize',
		paddingTop: 4,
		paddingBottom: 6,
		cursor: 'pointer',
		width: 94,
		paddingLeft: 3
	},
	requestedButton: {
		borderRadius: 4,
		backgroundColor: '#093a6e',
		color: 'white',
		textAlign: 'center',
		textTransform: 'capitalize',
		paddingTop: 4,
		paddingBottom: 6,
		cursor: 'pointer',
		width: 94,
		paddingLeft: 3
	},
	approveButton: {
		color: 'white',
		borderRadius: 4,
		backgroundColor: '#304ffe',
		display: 'inline-block',
		marginRight: 13,
		// marginLeft: -15,
		cursor: 'pointer',
		fontWeight: 500,
		fontSize: 13,
		paddingTop: 4,
		paddingBottom: 6,
		paddingLeft: 8,
		paddingRight: 8,
		border: '1px solid #304ffe',
		'&:hover' : {
			backgroundColor: '#1736E5'
		}
	},
	counteredButton: {
		borderRadius: 4,
		backgroundColor: '#45688E',
		color: 'white',
		textAlign: 'center',
		textTransform: 'capitalize',
		paddingTop: 4,
		paddingBottom: 6,
		cursor: 'pointer',
		width: 94,
		paddingLeft: 3
	},
	moreMargin: {
		marginLeft: -52
	},
	rejectButton: {
		borderRadius: 4,
		backgroundColor: '#f8f8f8',
		border: 'solid 1px #939393',
		display: 'inline-block',
		color: '#161717',
		cursor: 'pointer',
		paddingTop: 4,
		paddingBottom: 6,
		paddingLeft: 8,
		paddingRight: 8,
		fontWeight: 500,
		fontSize: 13,
		'&:hover' : {
			backgroundColor: '#DFDFDF'
		}
	}
};

export default tableStyles;
