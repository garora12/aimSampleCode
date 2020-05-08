import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles';

const MuiTheme = createMuiTheme({
	palette: {
		primary: {
			main: '#375CF6',
		},
		secondary: {
			main: '#375CF6',
		}
	},
	typography: {
		useNextVariants: true,
	},
});

export default MuiTheme
