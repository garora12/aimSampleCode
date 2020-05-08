import 'babel-polyfill'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './store'
import './styles/main.css'

import theme from './components/MuiTheme'
import { MuiThemeProvider } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { setStore } from './helpers/route-util'

import App from './App'

const state = window.__initialState__ || undefined
const store = configureStore(state)
setStore(store)

ReactDOM.render(
	<div>
		<Provider store={store}>
			<MuiThemeProvider theme={theme}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<App store={store} />
				</MuiPickersUtilsProvider>
			</MuiThemeProvider>
		</Provider>
	</div>,
	document.getElementById('root')
)
