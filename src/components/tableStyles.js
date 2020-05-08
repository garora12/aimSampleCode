const tableStyles = {
	root: {
		width: '100%',
		height: 'auto',
	},
	table: {
		minWidth: 1020,
		tableLayout: 'auto',
		'& tr.highLightedRow': {
			background: '#d8f4ff'
		},
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
		color: '#161717',
		'&:hover': {
			backgroundColor: '#eff2ff',
		},
		'& td': {
			fontSize: 15
		}
	},
	tableLink: {
		color: '#375CF6',
		fontWeight: 500,
		cursor: 'pointer',
		textDecoration: 'none'
	}
};

export default tableStyles;
