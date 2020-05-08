import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import actions from '../actions';
import {compose} from 'redux'

import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import EntityTable from './EntityTableComponents/EntityTable'
import TableHead from './EntityTableComponents/TableHead'
import DropDown from './controls/DropDown'
import _ from 'lodash'
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

let selectedItem = null;

class DealershipModal extends EntityTable {
	constructor(props, context) {
		super(props, context);
		this.defaultSort = 'name'
		this.getPage = this.getPage.bind(this)
		this.fetch = this.fetch.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		// this.handleFilter = this.handleFilter.bind(this)
	}

	getPage() {
		return _.get(this.props.dealerships, "dealershipsForOem.page") ||{docs:[]}
	}
	fetch(params) {
		this.props.dispatch(actions.getDealershipsForOem(this.props.oem, params))
	}

	handleSubmit = () => {
		this.props.handleSubmit(this.state.selected)
	}
	checkDealershipsForOem() {
		const oem = _.get(this.props.dealerships, "dealershipsForOem.params.oem")
		if (!(oem == this.props.oem)) {
			this.props.dispatch(actions.getDealershipsForOem(this.props.oem, {}))
		} else {
			return _.get(this.props.dealerships, "dealershipsForOem.page")
		}
	}

	handleSelectDealershipsAllClick = () => {
		const docs = this.getPage().docs.map(doc => {return {id: doc._id, status:true}})

		if (this.state.selected.length !== docs.length) {
			this.setState({ selected: docs})
		} else {
			this.setState({ selected: []})
		}
	}

	render() {
		const { classes, dealerships, selectedDealerships, regions, states, dealershipIncentiveForm } = this.props;
		let { selected } = this.state;
		const { dealershipsForOem } = dealerships
		const page = this.checkDealershipsForOem()
		const order = this.sortOrder()
		const orderBy = this.sortProperty()
		const preSelected = selectedDealerships.map((d)=> {return d._id})
		if (preSelected.length > 0 && selected.length === 0){
			this.setState({selected: preSelected})
		}

		return (
			<Dialog
				open={this.props.open}
				className="dealership-dialog"
				onBackdropClick={this.props.cancel}
				maxWidth={false}
			>
				<div style={{width: 850}}>
					<DialogTitle
						id="alert-dialog-title"
						className="custom-dialog-title"
						style={titleStyle}
					>
						Add Dealerships to this Campaign
						<Close
							onClick={this.props.cancel}
							style={closeStyle}
						/>
					</DialogTitle>

					<DialogContent className={classes.tableWrapper2} style={{padding: 0}}>
						<Table className={classes.table + ' custom-table'} aria-labelledby="tableTitle">
							<TableHead
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={event => this.handleSelectDealershipsAllClick(event)}
								onRequestSort={this.handleRequestSort}
								rowCount={page && page.docs && page.docs.length}
								entity="oem"
								columnData={[
									{ id: 'dealership', numeric: false, disablePadding: false, label: 'Dealership' },
									{ id: 'region', numeric: false, disablePadding: false, label: 'Region'},
									{ id: 'location', numeric: false, disablePadding: false, label: 'City/State'},
								]}
							/>
							<TableBody>
								{page && page.docs.map(dealership => {
									let isSelected = this.isSelected(dealership._id);
									return (
										<TableRow
											hover
											onClick={event => this.handleSelect(event, dealership._id)}
											role="checkbox"
											aria-checked={isSelected}
											tabIndex={-1}
											key={dealership._id}
											//selected={isSelected}
											className={classes.row}

										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													onClick={event => this.handleSelect(event, dealership._id)}
													checked={isSelected}
													id={dealership._id}
												/>
											</TableCell>
											<TableCell component="th">
												{dealership.name}
											</TableCell>
											<TableCell component="th">
												Region
											</TableCell>
											<TableCell component="th">
												{dealership.address &&
													<span>{dealership.address.city}, {dealership.address.state && dealership.address.state.abbreviation}</span>
												}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
						{page && page.total > 0 &&
							<TablePagination
								component="span"
								count={page && page.total}
								rowsPerPage={page && page.limit}
								page={page && page.page -1}
								backIconButtonProps={{
									'aria-label': 'Previous Page',
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page',
								}}
								onChangePage={this.handleChangePage}
								onChangeRowsPerPage={this.handleChangeRowsPerPage}
							/>
						}
					</DialogContent>
					<div style={{marginLeft: 24, marginBottom: 22, marginRight: 24}}>
						<Button
							onClick={this.handleSubmit}
							className="submit-btn"
							type="submit"
							style={{marginBottom: 10}}
						>
							{!preSelected.length ?
								<span>Add</span> :
								<span>Update</span>
							}
						</Button>
						<Button
							onClick={this.props.cancel}
							color="primary"
							className="cancel-btn"
							style={{marginBottom: 10, float: 'right'}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Dialog>
		);
	}
}


// export default compose(
// 	reduxForm({
// 		form: 'dealershipIncentiveForm',
// 		destroyOnUnmount: false,
// 		enableReinitialize: true
// 	})
// )(DealershipModal);

export default DealershipModal;
