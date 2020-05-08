import React, { Component, useState }from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import labelStyle from './labelStyle'
import emailIcon from '../images/email-icon.png'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import moment from 'moment'
import TextField from '@material-ui/core/TextField'
import Person from '@material-ui/icons/Person'
import Email from '@material-ui/icons/Email'
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Grid from "./Oems/OemCampaignProjectionsForm";



const disabledStyles = {
	control: (provided, state) => ({
		...provided,
		background: 'inherit',
		minHeight: 56,
		fontFamily: 'Roboto',
		border: '1px solid #B7B7B7',
		borderRadius: 5,
		fontSize: 18
	}),
	multiValue: (styles) => {
		return {
			backgroundColor: 'inherit',
			borderRadius: 2,
			border: '1px solid #B7B7B7',
			color: '#B7B7B7',
			display: 'inline-block',
			marginLeft: 5,
			marginTop: 5,
			fontSize: 18,
			padding: 5,
			paddingBottom: 1,
			'div': {
				display: 'inline-block',
			},
			'svg': {
				position: 'relative',
				bottom: 4,
				height: 15,
				width: 15
			}
		}
	},
}


const customStyles = {
	control: (provided, state) => ({
		...provided,
		background: 'inherit',
		minHeight: 56,
		fontFamily: 'Roboto',
		border: '1px solid #B7B7B7',
		borderRadius: 5
	}),
	option: (provided, state) => ({
		...provided,
		color: '#585A5E',
		fontSize: 18,
		backgroundColor: state.isFocused ? '#EBEBEB' : '#FFFFFF',
		cursor: 'pointer !important'
	}),
	multiValue: (styles) => {
		return {
			backgroundColor: 'rgba(0,126,255,.08)',
			borderRadius: 2,
			border: '1px solid rgba(0,126,255,.24)',
			color: '#007eff',
			display: 'inline-block',
			marginLeft: 5,
			marginTop: 5,
			fontSize: 18,
			padding: 5,
			paddingBottom: 1,
			'div': {
				display: 'inline-block',
			},
			'svg': {
				position: 'relative',
				bottom: 4,
				height: 15,
				width: 15
			}
		}
	},
	multiValueRemove: (styles) => ({
		...styles,
		fontSize: 18,
		display: 'inline-block',
		':hover': {
			color: 'black',
			cursor: 'pointer !important',
			backgroundColor: '#E6EEF8 !important'
		},
	}),
	placeholder: (provided, state) => ({
		...provided,
		color: '#585A5E',
		fontSize: 18
	}),
	indicatorSeparator: (provided, state) => ({
		...provided,
		color: '#585A5E',
	}),
	dropdownIndicator: (provided, state) => ({
		...provided,
		color: '#585A5E',
	}),
	menuPortal: base => ({
		...base,
		zIndex: 9999,
	}),
	clearIndicator: base => ({
		...base,
		cursor: 'pointer !important',
	}),
}

const Option = props => (
	<div>
			<components.Option {...props} key={props.value}>
				<Checkbox
					style={{
						display: 'inline-block',
						width: 25,
						position: 'relative',
						bottom: 1,
						padding: 5
					}}
					type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
				<label style={{display: 'inline-block'}}>{props.label}</label>
			</components.Option>
	</div>
);

export const multiAdapter = (list, placeholder, name, disabled) => props => {
	let showError = false
	if (props.meta.touched && props.meta.error) {showError = true}
	let listOptions = []

	listOptions = list && list.map((item)=>{
		return {
			value: item._id,
			label: item.name,
		}
	})

	return (
		<Select
			onSelectResetsInput={false}
			closeOnSelect={false}
			isMulti={true}
			closeMenuOnSelect={false}
			menuPlacement="bottom"
			hideSelectedOptions={true}
			styles={!disabled ? customStyles : disabledStyles}
			options={listOptions}
			value={props.input.value}
			components={makeAnimated()}
			placeholder={placeholder}
			// components={{Option}}
			menuPortalTarget={document.body}
			isDisabled={disabled}
			onChange={props.input.onChange}
		/>
	);
}




export const radioAdapter = (placeholder, className, value, inputClassName = "custom-input-styles", onChangeHandler) => props => {
	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}

	let radioComponent = (
		<Radio
			color='primary'
			disabled={props.disabled}
		/>
	)

	return (
		<RadioGroup
			aria-label="Radio"
			className='custom-radio-styles'
			name={props.name}
			error={showError}
			helperText={showError && message}
		>
			<FormControlLabel value="true" control={radioComponent} label="Yes" />
			<FormControlLabel value="false" style={{marginLeft: 30}} control={radioComponent} label="No" />
		</RadioGroup>
	)
}


export const radioAdapter2 = (placeholder, className, value, inputClassName = "custom-input-styles", onChangeHandler) => props => {
	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}

	let radioComponentTrue = (
		<Radio
			color='primary'
			disabled={props.disabled}
			value={true}
			onClick={(e) => {
				onChangeHandler(e);
			}}
			checked={(value === 'true')}
		/>
	)

	let radioComponentFalse = (
		<Radio
			color='primary'
			disabled={props.disabled}
			value={false}
			onClick={(e) => {
				onChangeHandler(e);
			}}
			checked={(value === 'false')}
		/>
	)

	return (
		<RadioGroup
			aria-label="Radio"
			className='custom-radio-styles'
			name={props.name}
			error={showError}
			helperText={showError && message}
		>
			<FormControlLabel value={true} control={radioComponentTrue} label="Yes" />
			<FormControlLabel value={false} style={{marginLeft: 30}} control={radioComponentFalse} label="No" />
		</RadioGroup>
	)
}


export const switchAdapter = (placeholder, className, value, inputClassName = "custom-input-styles") => props => {

	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}
	return (
		<FormControl
			component="fieldset"
		>
			<FormControlLabel
				style={{marginLeft: 3}}
				label={placeholder}
				labelPlacement="start"
				control={
					<Switch
						value={value}
						checked={value}
						onChange={props.input.onChange}
						disabled={props.disabled}
						error={showError}
						helperText={showError && message}
					/>
				}
			/>
		</FormControl>
	)
}

export const dropDownAdapter = (placeholder, className, list, inputClassName = "custom-input-styles") => props => {
	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}

	let value = props.input.value
	if (typeof value === 'object') {
		value = value._id
	}

	return (
		<FormControl className={!className ? 'text-field user-form custom-input-styles' : className + ' custom-input-styles'}>
			<TextField
				style={{borderRadius: 4}}
				id={`outlined-select-${placeholder}`}
				select
				label={placeholder}
				value={value ? value : ''}
				onChange={props.input.onChange}
				variant="outlined"
				error={showError}
				disabled={props.disabled}
				helperText={showError && message}
			>
				{list && list.map((entity, index) => {
					if (entity._id) {
						return (
							<MenuItem style={{borderRadius: 4}} value={entity._id} key={index}>{entity.name}</MenuItem>
						)
					} else if (entity.value) {
						return (
							<MenuItem style={{borderRadius: 4}} value={entity.value} key={index}>{entity.label || entity.name}</MenuItem>
						)
					} else {
						return (
							<MenuItem value={entity} key={index}>{entity}</MenuItem>
						)
					}
				})}
			</TextField>
		</FormControl>
	)
}

export const dropDownAdapterForProducts = (placeholder, className, list, inputClassName = "custom-input-styles", valuee) => props => {
	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}

	let value = props.input.value ? props.input.value : valuee;
	if (typeof value === 'object') {
		value = value._id
	}

	return (
		<FormControl className={!className ? 'text-field user-form custom-input-styles' : className + ' custom-input-styles'}>
			<TextField
				style={{borderRadius: 4}}
				id={`outlined-select-${placeholder}`}
				select
				label={placeholder}
				value={value ? value : ''}
				onChange={props.input.onChange}
				variant="outlined"
				error={showError}
				disabled={props.disabled}
				helperText={showError && message}
			>
				{list && list.map((entity, index) => {
					if (entity._id) {
						return (
							<MenuItem style={{borderRadius: 4}} value={entity._id} key={index}>{entity.name}</MenuItem>
						)
					} else if (entity.value) {
						return (
							<MenuItem style={{borderRadius: 4}} value={entity.value} key={index}>{entity.label || entity.name}</MenuItem>
						)
					} else {
						return (
							<MenuItem value={entity} key={index}>{entity}</MenuItem>
						)
					}
				})}
			</TextField>
		</FormControl>
	)
}

export const inputAdapter = (placeholder, className, inputClassName = "custom-input-styles") => props => {
	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}

	return (
		<FormControl className={className} style={{width: '100%'}}>
			<TextField
				variant="outlined"
				value={props.input.value}
				onChange={props.input.onChange}
				className={inputClassName}
				label={placeholder}
				disabled={props.disabled}
				placeholder={props.input.value ? '' : placeholder}
				error={showError}
				helperText={showError && message}

			/>
		</FormControl>
	)
}

export const inputAdapterForProducts = (placeholder, className, inputClassName = "custom-input-styles", value) => props => {
	let showError, message
	if (props.meta.touched && props.meta.error) {
		showError = true
		message = props.meta.error
	}

	return (
		<FormControl className={className} style={{width: '100%'}}>
			<TextField
				variant="outlined"
				value={props.input.value ? props.input.value : value}
				onChange={props.input.onChange}
				className={inputClassName}
				label={placeholder}
				disabled={props.disabled}
				placeholder={props.input.value ? '' : placeholder}
				error={showError}
				helperText={showError && message}

			/>
		</FormControl>
	)
}

export const emailAdapter = (placeholder="Email", className, inputClassName = "custom-input-styles", id="outlined-adornment-email") => props => {
	let showError = false
	if (props.meta.touched && props.meta.error) {showError = true}
	return (
		<FormControl className={className} style={{width: '100%'}}>
			<TextField
				id={id}
				className='email-field'
				variant="outlined"
				label={placeholder}
				value={props.input.value}
				onChange={props.input.onChange}
				disabled={props.disabled}
				placeholder={props.input.value ? '' : placeholder}
				error={showError}
				helperText={showError && props.meta.error}
				InputProps={{
					endAdornment: (
						<InputAdornment>
							<Email style={{color: '#585A5E'}}/>
						</InputAdornment>
					)
				}}
			/>
		</FormControl>
	)
}

export const userAdapter = (placeholder="Username", className, inputClassName = "custom-input-styles") => props => {
	let showError = false
	if (props.meta.touched && props.meta.error) {showError = true}
	return (
		<FormControl className={className} style={{width: '100%'}}>
			<TextField
				style={{borderRadius: 4}}
				id="outlined-adornment-user"
				className='user-field'
				variant="outlined"
				label={placeholder}
				value={props.input.value}
				onChange={props.input.onChange}
				placeholder={props.input.value ? '' : placeholder}
				error={showError}
				disabled={props.disabled}
				helperText={showError && props.meta.error}
				InputProps={{
					endAdornment: (
						<InputAdornment style={{color: '#585A5E'}}>
							<Person />
						</InputAdornment>
					)
				}}
			/>
		</FormControl>
	)
}

export const numberAdapter = (placeholder, className, inputClassName = "custom-input-styles", headerVal) => props => {
	let showError = false
	if (props.meta.touched && props.meta.error) {showError = true}
	let headerStyle = {}
	if (headerVal){
		headerStyle = {
			width: headerVal,
			display: 'inline-block'
		}
	}
	let step = false

	if (props && props.inputProps && props.inputProps.step) {
		step = true
	}

	return (
		<FormControl className={className} style={headerStyle}>
			<TextField
				width={props.input.width ? props.input.width : 'auto'}
				variant="outlined"
				value={props.input.value}
				onChange={props.input.onChange}
				className={inputClassName}
				label={placeholder}
				type={step ? 'number' : 'text'}
				disabled={props.disabled}
				placeholder={props.input.value ? '' : placeholder}
				error={showError}
				helperText={showError && props.meta.error}
				inputProps={{step: step ? props.inputProps.step : null, min: step ? props.inputProps.min : null}}
			>
			</TextField>
		</FormControl>
	)
}

export const numberAdapterWithSpinner = (placeholder, className, inputClassName = "custom-input-styles", headerVal) => props => {

	let [count, setCount] = useState(props.input.value ? props.input.value: "0.00");
	console.log(count,"props.input.value")
	let showError = false
	if (props.meta.touched && props.meta.error) {showError = true}
	let headerStyle = {}

	if (headerVal){
		headerStyle = {
			width: headerVal,
			display: 'inline-block'
		}
	}
	let step = false

	if (props && props.inputProps && props.inputProps.step) {
		step = true
	}

	React.useEffect(()=>{
			if(props.input.value!==count){
				//props.input.onChange(props.input.value);
				setCount(props.input.value);
			}
	},[props]);


	const handleChange=(event, value)=>{

		if (event === null) {
			props.input.onChange(value);
			setCount(value);
		} else {
			props.input.onChange(event);
			setCount(event.target.value);
		}
	}

	return (
		<FormControl className={className} style={headerStyle}>
			<div className="input-number-outer">
				<TextField
					width={props.input.width ? props.input.width : 'auto'}
					variant="outlined"
					value={count}
					//value={props.input.value}
					onChange={handleChange}
					className={inputClassName}
					label={placeholder}
					type={step ? 'number' : 'text'}
					disabled={props.disabled}
					placeholder={count ? '' : placeholder}
					error={showError}
					helperText={showError && props.meta.error}
					inputProps={{step: step ? props.inputProps.step : null, min: step ? props.inputProps.min : null}}
				>
				</TextField>
				{!props.disabled &&
					<div className="input-number-btn">
						<span
							className="input-arrow-up"
							onClick={() => {
								if (count) {
									handleChange(null, parseInt(count) + 50)
								} else {
									handleChange(null, parseInt(props.input.value) + 50)
								}

						}}>
							 &#11205;
						</span>
					<span
						className="input-arrow-down"
						onClick={() => {
							if (count) {
								handleChange(null, parseInt(count) - 50)
							} else {
								handleChange(null, parseInt(props.input.value) - 50)
							}
						}}>
						 &#11206;
					</span>
				</div>}
			</div>
		</FormControl>
	)
}

export const datepickerAdapter = (placeholder="Date", className, inputClassName = "custom-input-styles") => props => {
	let value = props.input.value;
	let disableUnderline = props.disableUnderline
	if (!(value)) {
		value = '';
	}
	const asDate = moment(value).format("YYYY-MM-DD")
	let showError = false
	if (props.meta.touched && props.meta.error) {showError = true}
	return (
		<FormControl className={className}>
			<TextField
				variant="outlined"
				value={asDate}
				onChange={props.input.onChange}
				className={inputClassName}
				label={placeholder}
				type="date"
				disabled={props.disabled}
				placeholder={props.input.value ? '' : placeholder}
				error={showError}
				helperText={showError && props.meta.error}
			/>
		</FormControl>
	)
}
