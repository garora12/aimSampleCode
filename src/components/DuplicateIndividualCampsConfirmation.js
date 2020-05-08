import React from 'react';
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Close from '@material-ui/icons/Close'
import DialogTitle from '@material-ui/core/DialogTitle';
import {Field, reduxForm} from 'redux-form';
import Paper from '@material-ui/core/Paper';
import {Grid, Table, TableColumnResizing, TableHeaderRow,} from '@devexpress/dx-react-grid-material-ui';
import {createNumberMask} from 'redux-form-input-masks';
import moment from 'moment';
import {formatCurrency} from "../helpers/format-util";


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

const currencyMask = createNumberMask({
	prefix: '$',
	allowEmpty: true,
	decimalPlaces: 2
})

const renderTextField = ({
													 input,
													 label,
													 disabled,
													 meta: {touched, error},
													 onChangeCallback,
													 ...custom
												 }) => {

	const handleChange = (event) => {
		input.onChange(event.target.value);
		if (onChangeCallback) {
			onChangeCallback(event.target.value);
		}
	}
	return (
		<FormControl fullWidth>
			<TextField
				label={label}
				error={error}
				disabled={disabled}
				width={'100%'}
				{...input}
				{...custom}
				onChange={handleChange}
			/>
			{error && <div style={{color: 'red', fontSize: '12px', marginTop: '2px'}}>Required Field</div>}
		</FormControl>
	)
}

const renderSelectField = ({
														 input,
														 label,
														 labelId,
														 meta: {touched, error},
														 children,
														 ...custom
													 }) => (
	<FormControl>
		<InputLabel id={labelId}>{label}</InputLabel>
		<Select
			labelId={labelId}
			label={label}
			{...input}
			//onChange={(event, index, value) => input.onChange(value)}
			children={children}
			{...custom}
		/>
	</FormControl>
)

const required = (v) => {
	if (v === '') {
		return 'This field is required'
	}
	return undefined
}

let initialValues = {};
let {selectedGroupIds_globally} = [];

class DuplicateIndividualCampsConfirmation extends React.Component {

	constructor(props, context) {
		super(props);
		this.state = {
			columns: [
				{name: 'name', title: 'Name'},
				{name: 'calendarMonth', title: 'Calendar Month'},
				{name: 'budget', title: 'Budget'},
				{name: 'cap', title: 'Cap Amount'},
				{name: 'pvr', title: 'PVR'},
				{name: 'volumeGoal', title: 'Volume Goal'},
			],
			rows: [],
			defaultColumnWidths: [
				{columnName: 'name', width: 350},
				{columnName: 'calendarMonth', width: 220},
				{columnName: 'budget', width: 150},
				{columnName: 'cap', width: 150},
				{columnName: 'pvr', width: 150},
				{columnName: 'volumeGoal', width: 150},
			],
			currencyValue: {},
		}
	}

	componentDidMount() {
		let rows = [];
		let initialProps = {};
		let ts = moment().unix();
		const {selectedGroupIds, campaignGroups, calendar} = this.props;
		console.log("campaignGroups >>>>>>>>>>>>>>", campaignGroups, calendar);
		selectedGroupIds_globally = selectedGroupIds
		const selectedGroupIdsArr = selectedGroupIds.map((item) => {
			return item.id;
		})
		campaignGroups.page.docs.forEach((campaignGroup, index) => {
			if (selectedGroupIdsArr.includes(campaignGroup._id)) {
				rows.push({
					name: <Field name={'name_' + campaignGroup._id} label="Name" component={renderTextField}
											 validate={required}/>,
					calendarMonth: <Field
						name={'calendarMonth_' + campaignGroup._id}
						labelId={'calendarMonth_' + campaignGroup._id}
						component={renderSelectField}
						label="Calendar Month"
						onChange={(event) => {
							this.handleCalendarMonthChange(event, campaignGroup._id)
						}}
					>
						{calendar.map((calendarMonth) => {
							//const doesBrandsExist = calendarMonth.brands && Object.keys(calendarMonth.brands).length
							return (<MenuItem key={calendarMonth._id}
																value={calendarMonth.startDate + '-' + calendarMonth.endDate + '-' + calendarMonth.brands[campaignGroup.brand.name]}>{calendarMonth.startDate + ' - ' + calendarMonth.endDate}</MenuItem>)
						})}
					</Field>,
					budget: <Field name={'budget_' + campaignGroup._id} label="Budget" component={renderTextField}
												 validate={required} {...currencyMask} onKeyUp={(event) => {
						this.handleBudgetChange(event, campaignGroup._id)
					}}/>,
					cap: <Field name={'cap_' + campaignGroup._id} label="Cap" component={renderTextField}
											validate={required} {...currencyMask}/>,
					pvr: <Field name={'pvr_' + campaignGroup._id} label="PVR" component={renderTextField}
											validate={required} {...currencyMask} onKeyUp={(event) => {
						this.handlePvrChange(event, campaignGroup._id)
					}}/>,
					volumeGoal: <Field name={'volumeGoal_' + campaignGroup._id} label="Volume Goal" component={renderTextField}
														 validate={required} disabled={true}/>,
				})
				initialProps['name_' + campaignGroup._id] = campaignGroup.name + '_' + ts;
				initialProps['campaignType_' + campaignGroup._id] = campaignGroup.campaignType;
				let pvr=campaignGroup.totalBudgetAmount / calendar[0].brands[campaignGroup.brand.name]
				if (campaignGroup.campaignType === "budgeted") {
					initialProps['budget_' + campaignGroup._id] = campaignGroup.totalBudgetAmount;
				} else {
					pvr= campaignGroup.perunitvalue;
					initialProps['budget_' + campaignGroup._id] = campaignGroup.perunitvalue * calendar[0].brands[campaignGroup.brand.name];

				}
				initialProps['pvr_' + campaignGroup._id]=	pvr
				initialProps['cap_' + campaignGroup._id] = pvr;
				initialProps['calendarMonth_' + campaignGroup._id] = calendar[0].startDate + '-' + calendar[0].endDate + '-' + calendar[0].brands[campaignGroup.brand.name];
				initialProps['volumeGoal_' + campaignGroup._id] = calendar[0].brands[campaignGroup.brand.name];
			}
		})
		initialValues = initialProps;
		this.setState({rows, initialProps: initialProps});
	}

	submit = (values) => {
		let {selectedGroupIds} = this.props;
		let groupsDataTobeDuplicated = selectedGroupIds.map((camp) => {
			return {
				campaignId: camp.id,
				name: values['name_' + camp.id],
				totalBudgetAmount: values['budget_' + camp.id],
				capValue: values['cap_' + camp.id],
				startDate: values['calendarMonth_' + camp.id] && moment(values['calendarMonth_' + camp.id].split('-')[0], 'MM-DD-YYYY'),
				endDate: values['calendarMonth_' + camp.id] && moment(values['calendarMonth_' + camp.id].split('-')[1], 'MM-DD-YYYY'),
				pvr: values['pvr_' + camp.id],
				volumeGoal: values['volumeGoal_' + camp.id],
			}
		});

		this.props.duplicateIndividualCamps({duplicationArray: groupsDataTobeDuplicated});
	}

	handleCalendarMonthChange = (event, groupId) => {
		let volumeGoal = event.target.value.split('-')[2]
		this.props.change('volumeGoal_' + groupId, volumeGoal);
		let currentCampType = this.props.campForm['campaigns-individuals-to-duplicate']['values']['campaignType_' + groupId]
		if (currentCampType === "budgeted") {
			let budget = this.props.campForm['campaigns-individuals-to-duplicate']['values']['budget_' + groupId]
			this.props.change('pvr_' + groupId, budget / volumeGoal);
			this.props.change('cap_' + groupId, budget / volumeGoal);
		} else {
			let pvr = this.props.campForm['campaigns-individuals-to-duplicate']['values']['pvr_' + groupId]
			this.props.change('budget_' + groupId, pvr * volumeGoal);
		}

	}

	handleBudgetChange = (event, groupId) => {
		const budget = this.props.campForm['campaigns-individuals-to-duplicate']['values']['budget_' + groupId]
		const volumeGoal = this.props.campForm['campaigns-individuals-to-duplicate']['values']['volumeGoal_' + groupId]
		this.props.change('pvr_' + groupId, budget / volumeGoal);
		this.props.change('cap_' + groupId, budget / volumeGoal);
	}

	handlePvrChange = (event, groupId) => {
		const pvr = this.props.campForm['campaigns-individuals-to-duplicate']['values']['pvr_' + groupId]
		const volumeGoal = this.props.campForm['campaigns-individuals-to-duplicate']['values']['volumeGoal_' + groupId]
		this.props.change('budget_' + groupId, pvr * volumeGoal);
		this.props.change('cap_' + groupId, pvr);
	}

	render() {
		const {handleSubmit, valid} = this.props;
		let itemString = <div>You're About to Duplicate the selected campaigns.</div>;

		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={this.props.handleClose}
				maxWidth='lg'
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
					<DialogContent>
						<Paper>
							<Grid
								rows={this.state.rows}
								columns={this.state.columns}
							>
								<Table/>
								<TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths}/>
								<TableHeaderRow/>
							</Grid>
						</Paper>
					</DialogContent>
					<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
						<Button
							//onClick={this.props.duplicate}
							className="submit-btn"
							type="submit"
							disabled={!valid}
							style={{marginBottom: 10}}
						>
							Duplicate
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

const mapStateToProps = ({form}) => {
	return {
		initialValues: initialValues,
		campForm: form,
		enableReinitialize: true,
	}
}

DuplicateIndividualCampsConfirmation = reduxForm({
	form: 'campaigns-individuals-to-duplicate',
	enableReinitialize: true,
})(DuplicateIndividualCampsConfirmation);

export default connect(mapStateToProps)(DuplicateIndividualCampsConfirmation);
