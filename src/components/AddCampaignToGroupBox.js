import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogContent from '@material-ui/core/DialogContent';
import Close from '@material-ui/icons/Close'
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import {fetchApi} from "../helpers/fetch-util";
import { reduxForm, Field } from 'redux-form';
import {connect} from "react-redux";

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

const renderTextField = (props) => {
	const handleChange = (event) => {
		input.onChange(event.target.value);
		if(onChangeCallback){
			onChangeCallback(event.target.value);
		}
	}

	const {
		input,
		label,
		disabled,
		meta,
		meta: { touched, error },
		onChangeCallback,
		...custom
	}=props;

	return (
		<FormControl fullWidth>
			<TextField
				label={label}
				error={touched && error}
				disabled={disabled}
				width={'100%'}
				{...input}
				{...custom}
				onChange={handleChange}
			/>
			{touched && meta.error && <div style={{color: 'red', fontSize: '12px', marginTop: '2px'}}>{meta.error}</div>}
		</FormControl>
	)}

const renderSelectField = ({
														 input,
														 label,
														 labelId,
														 meta: { touched, error },
														 children,
														 ...custom
													 }) => (
	<FormControl fullWidth>
		<InputLabel id={labelId} error={touched && error}>{label}</InputLabel>
		<Select
			labelId={labelId}
			label={label}
			error={touched && error}
			{...input}
			//onChange={(event, index, value) => input.onChange(value)}
			children={children}
			{...custom}
		/>
		{touched && error && <div style={{color: 'red', fontSize: '12px', marginTop: '2px'}}>{error}</div>}
	</FormControl>
)

const required = value => (value ? undefined : "Required field");

let initialValues={};

class AddCampaignToGroupBox extends React.Component {

	constructor($props) {
		super($props)
		this.state = {
			products:[],
		}
	}

	componentDidMount() {
		const { campaignGroup, oemId } = this.props
		fetchApi({
			method: 'GET',
			url: `/oems/${oemId}/products/brand/${campaignGroup.brand._id}`,
			params:{
				oemId
			},
			dispatch: false
		}).then((result) => {
			if (result.length) {
				this.setState({products: result}, () => {
					this.props.initialize( {
						name: null,
						product: result[0]._id
					})
				});
			}
		})
	}

	submit = (values) => {
		this.props.addCampaignToGroup({
			groupId:this.props.campaignGroup._id,
			productId: values.product,
			campName: values.name,
		});
	}

	render() {
		const { products } = this.state
		const {handleSubmit, valid} = this.props;
		let itemString = <div>Add New Campaign to this Group</div>;

		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={this.props.handleClose}
				maxWidth='md'
				fullWidth={true}
			>
				<form onSubmit={handleSubmit(this.submit)}>
					<DialogTitle
						id="alert-dialog-title"
						style={titleStyle}
						className="custom-dialog-title"
					>
						{itemString}
						<Close
							onClick={this.props.handleClose}
							style={closeStyle}
						/>
					</DialogTitle>
					<DialogContent style={{height:'100px'}}>
							<Grid container spacing={6}>
								<Grid item xs={6} sm={6} md={6} lg={6}>
									<Field name={'name'} label="Name" component={renderTextField} validate={[required]}/>
								</Grid>
								<Grid item xs={6} sm={6} md={6} lg={6}>
									<Field
										name={'product'}
										labelId={'product'}
										component={renderSelectField}
										label="Product"
										validate={[required]}
									>
										{products.length && products.map((product) => {
											return (<MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>)
										})}
									</Field>
								</Grid>
							</Grid>
					</DialogContent>
					<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
						<Button
							onClick={this.props.add}
							className="submit-btn"
							type="submit"
							style={{marginBottom: 10}}
							disabled={!valid}
						>
							Add
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

const mapStateToProps=(state)=> {
	return{
		initialValues: initialValues,
		//enableReinitialize: true,
	}
}

AddCampaignToGroupBox = reduxForm({
	form: 'add-campaign-to-group',
	//enableReinitialize: true,
}) (AddCampaignToGroupBox);

export default connect(mapStateToProps)(AddCampaignToGroupBox);
