import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'

import {compose} from 'redux'


let selectedItem = null;

export default class EntityForm extends Component {
	constructor(props, context) {
		super(props, context);
		this.handleChange = this.handleChange.bind(this)
		this.handleChangeEvent = this.handleChangeEvent.bind(this)
		this.onCancel = this.onCancel.bind(this)
	}
	handleChange = (name, multi) => value => {
		if (multi){
			this.props.change(name, value.split(","))
		} else {
			this.props.change(name, value)
		}
	};
	handleChangeEvent = (name, multi=true) => e => {
		console.log(e,"eeee");
		e.preventDefault();
		const {value} = e.target;
		if (multi){
			this.props.change(name, value.split(","))
		} else {
			this.props.change(name, value)
		}
	};
	onCancel(e, url, history){
		this.props.dispatch(actions.gotoNav({
			url: url,
			history: history,
		}))
	}
}
