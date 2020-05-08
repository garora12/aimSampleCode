import {compose} from "redux";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import React from "react";
import { reduxForm } from "redux-form";
import {Link, withRouter} from "react-router-dom";

import Flash from "../Flash";
import tableStyles from "../tableStyles";
import actions from "../../actions";
import EntityTable from "../EntityTableComponents/EntityTable";
import TableToolbar from "../EntityTableComponents/TableToolbar";

import Checkbox from "@material-ui/core/Checkbox";
import {makeStyles, useTheme, withStyles} from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";

import DeleteConfirmation from "../DeleteConfirmation";
import AddCampaignToGroupBox from "../AddCampaignToGroupBox";
import DuplicateConfirmation from "../DuplicateConfirmation";
import {operatorUtil} from "../../helpers/operator-util";
import {formatDate} from "../../helpers/date-util";
import moment from 'moment'
import {formatCurrency, formatUserName} from '../../helpers/format-util';
import {hasTenantPermission} from '../../helpers/route-util'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Grid1 from "@material-ui/core/Grid";

import {CustomTreeData, SortingState, TreeDataState} from '@devexpress/dx-react-grid';
import MultiChipSelect from "../controls/MultiChipSelect";
import $ from "jquery";

import {
	ColumnChooser,
	DragDropProvider,
	Grid,
	Table,
	TableColumnReordering,
	TableColumnResizing,
	TableColumnVisibility,
	TableHeaderRow,
	TableTreeColumn,
	Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import RowHighlighting from "../rowHighlighting";

let selectedItem = null;
const filtersNamespace = 'listing-filters-campaign-groups';

const useStyles1 = makeStyles(theme => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5),
	},
}));


function TablePaginationActions(props) {
	const classes = useStyles1();
	const theme = useTheme();
	const {count, page, rowsPerPage, onChangePage} = props;

	const handleFirstPageButtonClick = event => {
		onChangePage(event, 0);
	};

	const handleBackButtonClick = event => {
		onChangePage(event, page - 1);
	};

	const handleNextButtonClick = event => {
		onChangePage(event, page + 1);
	};

	const handleLastPageButtonClick = event => {
		onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<div className={classes.root}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
			</IconButton>
			<IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
				{theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
			</IconButton>
		</div>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};

class CampaignGroupsTable extends EntityTable {

	rootNodeIndexes = [];

	constructor(props, context) {
		super(props, context);

		this.defaultSort = "name";
		this.getPage = this.getPage.bind(this);
		this.fetch = this.fetch.bind(this);
		this.delete = this.delete.bind(this);
		this.getRoute = this.getRoute.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDeleteConfirmation = this.handleDeleteConfirmation.bind(this);
		this.handleDeleteConfirmationForCampaign = this.handleDeleteConfirmationForCampaign.bind(this);
		this.handleMultiDeleteConfirmation = this.handleMultiDeleteConfirmation.bind(
			this
		);
		this.handleMultiDuplicateConfirmation = this.handleMultiDuplicateConfirmation.bind(
			this
		);

		const loclStrge = this.getLocalStorage();

		this.state = {
			...this.state,
			brand: loclStrge.brand ? loclStrge.brand : "All",
			product: loclStrge.product ? loclStrge.product : "All",
			status: loclStrge.status ? loclStrge.status : "active",
			isProductDisabled: loclStrge.brand && loclStrge.brand.length ? false: true,

			columns: [
				{name: 'checkbox', title: 'Checkbox'},
				{name: 'name', title: 'Name'},
				{name: 'status', title: 'Status'},
				{name: 'abbreviation', title: 'Label'},
				{name: 'campaignType', title: 'Type'},
				{name: 'product', title: 'Product'},
				{name: 'totalBudgetAmount', title: 'Budget'},
				{name: 'perunitvalue', title: 'PVR'},
				{name: 'volumeGoal', title: 'Volume Goal'},
				{name: 'capValue', title: 'Cap Amount'},
				{name: 'startDate', title: 'Start Date'},
				{name: 'endDate', title: 'End Date'},
				{name: 'createdAt', title: 'Created Date & Time'},
				{name: 'createdBy', title: 'Created By'},
				{name: 'updatedAt', title: 'Modified Date & Time'},
				{name: 'updatedBy', title: 'Modified By'},
				{name: 'actions', title: 'Actions'},
			],
			rows: [],
			defaultColumnWidths: [
				{columnName: 'checkbox', width: 115},
				{columnName: 'name', width: 150},
				{columnName: 'status', width: 100},
				{columnName: 'abbreviation', width: 150},
				{columnName: 'campaignType', width: 150},
				{columnName: 'product', width: 150},
				{columnName: 'totalBudgetAmount', width: 150},
				{columnName: 'perunitvalue', width: 150},
				{columnName: 'volumeGoal', width: 150},
				{columnName: 'capValue', width: 150},
				{columnName: 'startDate', width: 150},
				{columnName: 'endDate', width: 150},
				{columnName: 'createdAt', width: 150},
				{columnName: 'createdBy', width: 150},
				{columnName: 'updatedAt', width: 150},
				{columnName: 'updatedBy', width: 150},
				{columnName: 'actions', width: 150},
			],
			tableColumnExtensions: [
				{columnName: 'name', width: 115},
				{columnName: 'status', width: 100},
				{columnName: 'abbreviation', width: 150},
				{columnName: 'campaignType', width: 150},
				{columnName: 'product', width: 150},
				{columnName: 'totalBudgetAmount', width: 150, align: 'right'},
				{columnName: 'perunitvalue', width: 150, align: 'right'},
				{columnName: 'volumeGoal', width: 150},
				{columnName: 'capValue', width: 150, align: 'right'},
				{columnName: 'startDate', width: 150},
				{columnName: 'endDate', width: 150},
				{columnName: 'createdAt', width: 150},
				{columnName: 'createdBy', width: 150},
				{columnName: 'updatedAt', width: 150},
				{columnName: 'updatedBy', width: 150},
				{columnName: 'actions', width: 150},
			],
			sorting: loclStrge.sorting ? loclStrge.sorting : [{columnName: 'startDate', direction: 'desc'}],
			defaultSorting: loclStrge.sorting ? loclStrge.sorting : [{columnName: 'startDate', direction: 'desc'}],
			sortingStateColumnExtensions: [
				{columnName: 'type', sortingEnabled: false},
				{columnName: 'product', sortingEnabled: false},
				{columnName: 'volumeGoal', sortingEnabled: false},
			],
			defaultHiddenColumnNames: [],
			expandedRowIds: [],
			rootNodeIndexes: [],
			tableColumnVisibilityColumnExtensions: [{columnName: 'checkbox', togglingEnabled: false}],
			selection: [],
			showAddCampaignToGroupBox: false,
			selectedCampaignGroupToAddCampaign:null,
			selectedBrands: loclStrge.brand ? loclStrge.brand : [],
			selectedProducts: loclStrge.product ? loclStrge.product : [],
			selectedStatus: loclStrge.status ? loclStrge.status : [{"value":"active","label":"Active"}],
			campaignGroups: {}
		}
	}

	getRoute() {
		return `/${operatorUtil(false, true)}/${this.props.params.oemId}/campaigns`;
	}

	getPage() {
		return this.props.campaignGroups.page;
	}

	componentWillUnmount() {
		this.props.dispatch(actions.clearCampaignGroupsProps())
		this.props.dispatch(actions.clearCampaignFlash())
	}

	fetch(params) {
		this.props.setLoaderState(true)
		this.props.dispatch(
			actions.getCampaignGroups(
				this.props.params.oemId,
				this.state.selectedBrands.map((brand) => brand.value),
				this.state.selectedProducts.map((product) => product.value),
				this.state.selectedStatus.map((status) => status.value),
				params
			)
		);
	}

	handleAdd = (event) => {
		event.preventDefault()
		this.props.history.push({pathname: `/operators/${this.props.params.oemId}/campaigns/new`, state:{orignationPage: 'campaign-groups'}})
	}

	delete(ids) {
		this.setState({showDeleteConfirmation: false});
		return this.props.dispatch(
			actions.deleteCampaigns(this.props.params.oemId, ids)
		);
	}

	showMessage(msg) {
		return this.props.dispatch(
			actions.showMessage(msg)
		);
	}

	handleDeleteConfirmation(campaign) {
		if (campaign) {
			this.setState({selectedCampaign: campaign}, () => {
				if (
					this.state.showDeleteConfirmation === false ||
					!this.state.showDeleteConfirmation
				) {
					this.setState({showDeleteConfirmation: true});
				} else {
					this.setState({showDeleteConfirmation: false});
				}
			});
		}
	}

	handleDeleteConfirmationForCampaign(campaign) {
		if (campaign) {
			this.setState({selectedCampaign2: campaign}, () => {
				if (
					this.state.showDeleteConfirmationForCampaign === false ||
					!this.state.showDeleteConfirmationForCampaign
				) {
					this.setState({showDeleteConfirmationForCampaign: true});
				} else {
					this.setState({showDeleteConfirmationForCampaign: false});
				}
			});
		}
	}

	handleAddCampaignToGroup(campaignGroup) {
		if (campaignGroup) {
			console.log(campaignGroup);
			this.setState({ selectedCampaignGroupToAddCampaign: campaignGroup }, () => {
				if (
					this.state.showAddCampaignToGroupBox === false ||
					!this.state.showAddCampaignToGroupBox
				) {
					this.setState({ showAddCampaignToGroupBox: true });
				} else {
					this.setState({ showAddCampaignToGroupBox: false });
				}
			});
		}
	}

	handleMultiDeleteConfirmation() {
		if (
			this.state.showMultiDeleteConfirmation === false ||
			!this.state.showMultiDeleteConfirmation
		) {
			this.setState({showMultiDeleteConfirmation: true});
		} else {
			this.setState({showMultiDeleteConfirmation: false});
		}
	}

	handleMultiDuplicateConfirmation() {
		if (
			this.state.showMultiDuplicateConfirmation === false ||
			!this.state.showMultiDuplicateConfirmation
		) {
			this.setState({showMultiDuplicateConfirmation: true});
		} else {
			this.setState({showMultiDuplicateConfirmation: false});
		}
	}

	checkItems() {
		this.props.setLoaderState(true)
		const loclStrge = this.getLocalStorage();

		if (this.props.auth.loggedin) {
			const sortColumnName = loclStrge.sorting ? loclStrge.sorting[0].columnName : 'startDate'
			const sortDirection = loclStrge.sorting ? loclStrge.sorting[0].direction : 'desc'
			this.props.dispatch(
				actions.getCampaignGroups(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{
						page: loclStrge.page ? loclStrge.page : 1,
						limit: loclStrge.limit ? loclStrge.limit : -1,
						sort: sortDirection === "asc" ? sortColumnName : "-" + sortColumnName
					})
			);
		}
	}

	handleFlashClose = () => {
		this.props.dispatch(actions.clearCampaignGroupFlash());
	}

	handleFlashCloseForCampaigns = () => {
		this.props.dispatch(actions.clearCampaignFlash());
	}

	componentDidMount() {
		this.props.setLoaderState(true)
		this.props.change('status', this.state.selectedStatus)
		this.props.change('makes', this.state.selectedBrands)
		this.props.change('products', this.state.selectedProducts)
		this.checkItems();
		this.props.dispatch(actions.getMakes(this.props.params.oemId, {page: 1}));
		this.props.dispatch(actions.getCalendarMonths(this.props.params.oemId, '', {page: 1, limit: -1}))

		//---------------------------
		let brandIdsArr = [];
		if(this.state.selectedBrands.length === 0) {
			brandIdsArr = ['000000000000000000000000']
		} else {
			brandIdsArr = this.state.selectedBrands.map((brand) => brand.value)
		}
		this.props.dispatch(
			actions.getProductsByBrandIds(
				this.props.params.oemId,
				brandIdsArr
			)
		);
		//----------------------------

		// Clear local storage for Campaign internal pages filter.
		// We don't need to do this as we are saving only sorting and page length.
		// localStorage.removeItem('listing-filters-campaign-sales-report');
	}


	handleChangeMultipleBrands = (event) => {
		this.props.setLoaderState(true)
		const loclStrge = this.getLocalStorage();
		let selectedBrands = []
		for (let i in event) {
			if (event[i].value !== undefined) {
				selectedBrands.push(event[i])

			}
		}
		const isProductDisabled = !selectedBrands.length
		this.setState({selectedBrands, selectedProducts: [], isProductDisabled}, async () => {
			localStorage.setItem(
				filtersNamespace, JSON.stringify(
					{
						...JSON.parse(localStorage.getItem(filtersNamespace)),
						brand: this.state.selectedBrands,
						product: []
					}
				)
			);

			this.props.change('products', [])
			const sortColumnName = loclStrge.sorting ? loclStrge.sorting[0].columnName : 'startDate'
			const sortDirection = loclStrge.sorting ? loclStrge.sorting[0].direction : 'desc'
			await this.props.dispatch(
				actions.getCampaignGroups(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{
						page: loclStrge.page ? loclStrge.page : 1,
						limit: loclStrge.limit ? loclStrge.limit : -1,
						sort: sortDirection === "asc" ? sortColumnName : "-" + sortColumnName
					}
				)
			);
			let brandIdsArr = this.state.selectedBrands.map((brand) => brand.value);
			await this.props.dispatch(
				actions.getProductsByBrandIds(
					this.props.params.oemId,
					brandIdsArr
				)
			);
		});
	};

	handleChangeMultipleProducts = async event => {
		this.props.setLoaderState(true)
		const loclStrge = this.getLocalStorage();
		let selectedProducts = []
		for (let i in event) {
			if (event[i].value !== undefined) {
				selectedProducts.push(event[i])

			}
		}

		this.setState({selectedProducts}, async () => {

			localStorage.setItem(
				filtersNamespace, JSON.stringify(
					{
						...JSON.parse(localStorage.getItem(filtersNamespace)),
						product: this.state.selectedProducts
					}
				)
			);
			const sortColumnName = loclStrge.sorting ? loclStrge.sorting[0].columnName : 'startDate'
			const sortDirection = loclStrge.sorting ? loclStrge.sorting[0].direction : 'desc'
			await this.props.dispatch(
				actions.getCampaignGroups(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{
						page: loclStrge.page ? loclStrge.page : 1,
						limit: loclStrge.limit ? loclStrge.limit : -1,
						sort: sortDirection === "asc" ? sortColumnName : "-" + sortColumnName
					}
				)
			);

		})
	};

	handleChangeMultipleStatuses = (event) => {
		this.props.setLoaderState(true)
		const loclStrge = this.getLocalStorage();
		let selectedStatus = []
		for (let i in event) {
			if (event[i].value !== undefined) {
				selectedStatus.push(event[i])

			}
		}

		this.setState({selectedStatus}, async () => {
			localStorage.setItem(
				filtersNamespace, JSON.stringify(
					{
						...JSON.parse(localStorage.getItem(filtersNamespace)),
						status: this.state.selectedStatus
					}
				)
			);
			const sortColumnName = loclStrge.sorting ? loclStrge.sorting[0].columnName : 'startDate'
			const sortDirection = loclStrge.sorting ? loclStrge.sorting[0].direction : 'desc'
			this.props.dispatch(
				actions.getCampaignGroups(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{
						page: loclStrge.page ? loclStrge.page : 1,
						limit: loclStrge.limit ? loclStrge.limit : -1,
						sort: sortDirection === "asc" ? sortColumnName : "-" + sortColumnName
					}
				)
			);

		})
	}

	handleSelectAllCampaignGroupsClick = (event) => {
		event.stopPropagation();
		const docs = this.getPage().docs.map(doc => {
			return {id: doc._id, status: true}
		})
		if (this.state.selected.length !== docs.length) {
			this.setState({selected: docs}, () => {
				$('tbody tr.MuiTableRow-root').addClass('highLightedRow')
			})
		} else {
			this.setState({selected: []}, () => {
				$('tbody tr.MuiTableRow-root').removeClass('highLightedRow')
			})
		}
	}

	getLocalStorage = () => {
		return JSON.parse(localStorage.getItem(filtersNamespace))
			? JSON.parse(localStorage.getItem(filtersNamespace)) : {};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		//let timestamp = ((nextProps || {})['campaignGroups'] || {})['timestamp']
		if (nextProps.campaignGroups && nextProps.campaignGroups.timestamp !== prevState.campaignGroups.timestamp) {
			nextProps.setLoaderState(false)
		}

		if (nextProps.campaignGroups && nextProps.campaignGroups.page !== prevState.campaignGroups.page) {
			return {campaignGroups: nextProps.campaignGroups};
		} else return null;
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevState.campaignGroups.page !== this.state.campaignGroups.page
			|| prevState.selected !== this.state.selected) {
			let rows = [];
			if (this.state.campaignGroups
				&& this.state.campaignGroups.page
				&& this.state.campaignGroups.page.docs
				&& this.state.campaignGroups.page.docs.length
			) {

				let columns = this.state.columns.map((item) => {
					if (item.name !== 'checkbox') {
						return item;
					} else {
						return {
							name: 'checkbox', title:
								<Checkbox
									color="primary"
									onClick={this.handleSelectAllCampaignGroupsClick}
									checked={this.state.selected.length === this.state.campaignGroups.page.docs.length && this.state.campaignGroups.page.docs.length !== 0}
									disabled={false}
								/>
						}
					}
				})
				var counter = 0;
				this.state.campaignGroups.page.docs.map((doc) => {
					this.rootNodeIndexes.push(counter);
					const isSelected = this.isSelected(doc._id);
					let gmtStartDateTime = moment.utc(doc.startDate, "YYYY-MM-DD HH")
					let startDatelocal = gmtStartDateTime.local().format('M/D/YY');

					let gmtEndDateTime = moment.utc(doc.endDate, "YYYY-MM-DD HH")
					let endDatelocal = gmtEndDateTime.local().format('M/D/YY');

					let statusChip;
					let statusChipBg;
					if (doc.status === "incomplete") {statusChipBg = "#8123A6"} else if (doc.status === "scheduled") {statusChipBg = "#8FA5C9"}
					if(doc.status === "incomplete") {
						statusChip = <div
							style={{
								backgroundColor: statusChipBg,
								color: "white",
								borderRadius: 5,
								padding: 5,
								textTransform: "capitalize"
							}}
						>
							{doc.status}
						</div>
					} else if (doc.status === "scheduled"){
						statusChip = <div
							style={{
								backgroundColor: statusChipBg,
								color: "white",
								borderRadius: 5,
								padding: 5,
								textTransform: "capitalize"
							}}
						>
							Scheduled
						</div>
					} else {
						statusChip = <div style={{ textTransform: "capitalize" }}>
							{doc.status }
						</div>
					}


					rows.push({
						checkbox: (<Checkbox
							color="primary"
							onClick={event =>
								this.handleSelect(event, doc._id, true)
							}
							id={doc._id}
							checked={isSelected}
						/>),
						name: doc.name,
						status: statusChip,
						abbreviation: doc && doc.abbreviation ? doc.abbreviation : "",
						campaignType: "",
						product: "",
						totalBudgetAmount: doc.totalBudgetAmount ? formatCurrency(doc.totalBudgetAmount) : '',
						perunitvalue: doc.pvr ? formatCurrency(doc.pvr) : '',
						volumeGoal: '',
						capValue: doc.capValue ? formatCurrency(doc.capValue) : '',
						startDate: startDatelocal,
						endDate: endDatelocal,
						createdAt: doc.createdAt ? formatDate(doc.createdAt, "", "M/D/YY HH:mm") : '',
						createdBy: formatUserName(doc, "createdBy.name"),
						updatedAt: doc.updatedAt ? formatDate(doc.updatedAt, "", "M/D/YY HH:mm") : '',
						updatedBy: formatUserName(doc, "updatedBy.name"),
						actions : <span>
												<span title={'Delete Campaign Group'}
														className="show-on-hover"
														onClick={
															() => {this.handleDeleteConfirmation(doc._id)}
														} style={{cursor:'pointer'}}>
													<DeleteIcon/>
												</span>
													<span title={'Add Campaign to this Group'}
																className="show-on-hover"
																onClick={
																	() => {this.handleAddCampaignToGroup(doc)}
																} style={{cursor:'pointer'}}>
													<AddCircleIcon/>
												</span>
											</span>,
						items: []
					})

					doc.campaignArray.forEach((campaign) => {
						let gmtStartDateTime2 = moment.utc(campaign.startDate, "YYYY-MM-DD HH")
						let startDatelocal2 = gmtStartDateTime2.local().format('M/D/YY');
						let gmtEndDateTime2 = moment.utc(campaign.endDate, "YYYY-MM-DD HH")
						let endDatelocal2 = gmtEndDateTime2.local().format('M/D/YY');
						let statusChip;
						let statusChipBg;
						if (campaign.status === "incomplete") {statusChipBg = "#8123A6"} else if (campaign.status === "complete") {statusChipBg = "#8FA5C9"}
						if(campaign.status === "incomplete") {
							statusChip = <div
								style={{
									backgroundColor: statusChipBg,
									color: "white",
									borderRadius: 5,
									padding: 5,
									textTransform: "capitalize"
								}}
							>
								{campaign.status}
							</div>
						} else if (campaign.status === "complete"){
							statusChip = <div
								style={{
									backgroundColor: statusChipBg,
									color: "white",
									borderRadius: 5,
									padding: 5,
									textTransform: "capitalize"
								}}
							>
								Scheduled
							</div>
						} else {
							statusChip = <div style={{ textTransform: "capitalize" }}>
								{campaign.status }
							</div>
						}

						rows[rows.length - 1].items.push({
							checkbox: '',
							name: (<Link to={{pathname: this.getRoute()+'/'+campaign._id, state: {orignationPage: 'campaign-groups'}}} className={prevProps.classes.tableLink}>
								{campaign.name}
							</Link>),
							status: statusChip,
							abbreviation: doc && doc.abbreviation ? doc.abbreviation : "",
							campaignType: campaign.campaignType === "per_unit"
								? "PRU"
								: campaign.campaignType.charAt(0).toUpperCase() + campaign.campaignType.slice(1),
							product: campaign.incentive && campaign.incentive.product && campaign.incentive.product['name'] ? campaign.incentive.product['name'] : "",
							totalBudgetAmount: campaign.totalBudgetAmount ? formatCurrency(campaign.totalBudgetAmount) : '',
							perunitvalue: campaign.perunitvalue ? formatCurrency(campaign.perunitvalue) : '',
							volumeGoal: campaign.volumeGoal,
							capValue: formatCurrency(doc.capValue), //campaign.incentives && campaign.incentives[0] &&  campaign.incentives[0]['maxValue'] ?  formatCurrency(campaign.incentives[0]['maxValue']) : "",
							startDate: startDatelocal2,
							endDate: endDatelocal2,
							createdAt: formatDate(campaign.createdAt, "", "M/D/YY HH:mm"),
							createdBy: formatUserName(campaign, "createdBy.name"),
							updatedAt: formatDate(campaign.updatedAt, "", "M/D/YY HH:mm"),
							updatedBy: formatUserName(campaign, "updatedBy.name"),
							actions: <span>
												<span title={'Delete Campaign Group'}
															className="show-on-hover"
															onClick={
																() => {this.handleDeleteConfirmationForCampaign(campaign._id)}
															} style={{cursor:'pointer'}}>
													<DeleteIcon/>
												</span>
											</span>,
						});
						counter++
					})
					counter++
				});
			
				this.setState({rows, rootNodeIndexes: this.rootNodeIndexes, columns})
			}
		}

		if (this.state.rows.length > 0 && prevState.rows !== this.state.rows) {
			RowHighlighting()
		}



	}

	duplicateGroups = async (groupsDataTobeDuplicated) => {
		this.props.setLoaderState(true)
		await this.props.dispatch(actions.duplicateGroups(this.props.params.oemId, groupsDataTobeDuplicated));
		await this.checkItems();
		this.setState({showMultiDuplicateConfirmation: false, selected: []});
	}

	addCampaignToGroup = async (campaignData) => {
		this.props.setLoaderState(true)
		await this.props.dispatch(actions.addCampaignToGroup(this.props.params.oemId, campaignData));
		await this.checkItems();
		this.setState({ showAddCampaignToGroupBox: false });
	}

	deleteSelectedGroups = async () => {
		this.props.setLoaderState(true)
		let ids = this.state.selected.map((item) => {
			return item.id;
		})
		await this.props.dispatch(actions.deleteGroups(this.props.params.oemId, ids));
		await this.checkItems();
		this.setState({showMultiDeleteConfirmation: false, selected: []});
	}

	deleteSelectedGroup = async (event, id) => {
		this.props.setLoaderState(true)
		await this.props.dispatch(actions.deleteGroups(this.props.params.oemId, [id]));
		await this.checkItems();
		this.setState({showDeleteConfirmation: false, selected: []});
	}

	deleteSelectedCampaign = async (event, id) => {
		this.props.setLoaderState(true)
		await this.props.dispatch(actions.deleteCampaignInsideGroup(this.props.params.oemId, [id]));
		await this.checkItems();
		this.setState({showDeleteConfirmationForCampaign: false, selected: []});
	}

	handleExpandAll = () => {
		if (this.state.expandedRowIds.length) {
			this.setState({expandedRowIds: []})
		} else {
			this.setState({expandedRowIds: this.state.rootNodeIndexes})
		}
	}

	handleAddCampaign = () => {
		const { campaignGroups } = this.props
		const campGrpId = this.state.selected && this.state.selected.length && this.state.selected[0].id
		const campaignGroup = campaignGroups.page.docs.find((item) => {
			return item._id === campGrpId
		})
		if (campaignGroup) {
			this.setState({ selectedCampaignGroupToAddCampaign: campaignGroup }, () => {
				if (
					this.state.showAddCampaignToGroupBox === false ||
					!this.state.showAddCampaignToGroupBox
				) {
					this.setState({ showAddCampaignToGroupBox: true });
				} else {
					this.setState({ showAddCampaignToGroupBox: false });
				}
			});
		}
	}

	render() {
		const loclStrge = this.getLocalStorage();

		const {classes, makes, products, campaignGroups, handleSubmit} = this.props;
		const {selected} = this.state;
		const page = this.getPage();
		if (page.docs && page.docs.length) {
			page.page = loclStrge.page ? loclStrge.page : page.page;
			page.limit = loclStrge.limit ? loclStrge.limit : page.limit;
		}

		const order = this.sortOrder();
		const orderBy = this.sortProperty();

		let oem = null
		if (this.props.oems.byId[this.props.params.oemId]) {
			oem = this.props.oems.byId[this.props.params.oemId]
		}

		const tablePagination = <TablePagination
			//rowsPerPageOptions={[1, 10, 25, { label: 'All', value: -1 }]}
			component="div"
			count={page.total}
			rowsPerPage={page.limit}
			page={page.page - 1}
			backIconButtonProps={{
				"aria-label": "Previous Page"
			}}
			nextIconButtonProps={{
				"aria-label": "Next Page"
			}}
			onChangePage={(event, page) => this.handleChangePage(event, page, filtersNamespace)}
			onChangeRowsPerPage={(event) => this.handleChangeRowsPerPage(event, filtersNamespace)}
			ActionsComponent={TablePaginationActions}
		/>;

		const getChildRows = (row, rootRows) => (row ? row.items : rootRows);
		let calendarMonths = this.props.calendar.calendarMonths.filter(calendarObj => {
			return calendarObj.isFutured
		})
		return (
			<div>
				{this.state.showDeleteConfirmation && (
					<DeleteConfirmation
						open={this.state.showDeleteConfirmation}
						item={this.state.selectedCampaign.name}
						popupTitle={"You're About to Delete a Row"}
						title="Campaign Groups"
						handleClose={() => {this.setState({ showDeleteConfirmation: false })}}
						delete={event =>
							this.deleteSelectedGroup(event, this.state.selectedCampaign)
						}
					/>
				)}
				{this.state.showDeleteConfirmationForCampaign && (
					<DeleteConfirmation
						open={this.state.showDeleteConfirmationForCampaign}
						item={this.state.selectedCampaign2.name}
						popupTitle={"You're About to Delete a Row"}
						title="Campaign"
						handleClose={() => {this.setState({ showDeleteConfirmationForCampaign: false })}}
						delete={event =>
							this.deleteSelectedCampaign(event, this.state.selectedCampaign2)
						}
					/>
				)}
				{this.state.showAddCampaignToGroupBox && (
					<AddCampaignToGroupBox
						open={this.state.showAddCampaignToGroupBox}
						title="Campaign"
						handleClose={() => {this.setState({ showAddCampaignToGroupBox: false })}}
						campaignGroup={this.state.selectedCampaignGroupToAddCampaign}
						oemId={this.props.params.oemId}
						addCampaignToGroup={this.addCampaignToGroup}
					/>
				)}
				{this.state.showMultiDeleteConfirmation && (
					<DeleteConfirmation
						open={this.state.showMultiDeleteConfirmation}
						popupTitle={"You're About to Delete the selected Rows"}
						title="Campaign Groups"
						handleClose={event => this.handleMultiDeleteConfirmation()}
						delete={this.deleteSelectedGroups}
					/>
				)}

				{this.state.showMultiDuplicateConfirmation && (
					<DuplicateConfirmation
						open={this.state.showMultiDuplicateConfirmation}
						selectedGroupIds={this.state.selected}
						campaignGroups={this.state.campaignGroups}
						calendar={calendarMonths}
						title="Campaign Groups"
						handleClose={event => this.handleMultiDuplicateConfirmation()}
						// duplicate={this.handleDuplicateSelected}
						duplicateGroups={this.duplicateGroups}
					/>
				)}

				{this.props.campaignGroups.flash && (
					<Flash
						onClose={this.handleFlashClose}
						flash={this.props.campaignGroups.flash}
						type="Campaign Group"
					/>
				)}
				{this.props.campaigns.flash && (
					<Flash
						onClose={this.handleFlashCloseForCampaigns}
						flash={this.props.campaigns.flash}
						type="Campaign"
					/>
				)}
				<form onSubmit={handleSubmit}>
				<Grid1
					justify={"flex-end"}
					container
					spacing={3}
					style={{marginLeft: 0, marginRight: 0, width: "100%"}}
				>
					<Grid1 item xs={12}>
						<TableToolbar
							numSelected={selected.length}
							title="Campaign"
							handleAdd={this.handleAdd}
							handleDuplicate={this.handleMultiDuplicateConfirmation}
							handleDelete={this.handleMultiDeleteConfirmation}
							handleExpandAll={this.handleExpandAll}
							handleAddCampaign={this.handleAddCampaign}
							entity="campaigns"
							hideFilter={true}
							disableAdd={oem && !hasTenantPermission(oem, 'createCampaigns')}
							showButtonToDuplicateOption={true}
							showExpandAllButton={page.docs && page.docs.length > 0}
							expandAllButtonTextState={!this.state.expandedRowIds.length}
							showButtonToAddCampaignOption={this.state.selected.length === 1}
						/>

					</Grid1>
				</Grid1>
				<Grid1
					justify={"flex-end"}
					container
					spacing={3}
					style={{marginLeft: 0, marginRight: 0, width: "100%", marginTop: "-60px"}}
				>
					<Grid1 item xs={3} style={{padding: "25px 2px"}}>

						<MultiChipSelect
							list={makes && makes.page && makes.page.docs}
							name="makes"
							placeholder="Select Brands"
							onChangeHandler={this.handleChangeMultipleBrands}
						/>

					</Grid1>

					<Grid1 item xs={3} style={{padding: "25px 2px"}}>
						<MultiChipSelect
							list={products && products.productsByBrandIds}
							name="products"
							placeholder="Select Products"
							onChangeHandler={this.handleChangeMultipleProducts}
							disabled = {this.state.isProductDisabled}
						/>
					</Grid1>

					<Grid1 item xs={3} style={{padding: "25px 2px"}} >

						<MultiChipSelect
							list={[
								{_id:"active", name:"Active"},
								{_id:"paused", name:"Paused"},
								{_id:"expired", name:"Expired"},
								{_id:"depleted", name:"Depleted"},
								{_id:"scheduled", name:"Scheduled"},
							]}
							name="status"
							placeholder="Select Status"
							onChangeHandler={this.handleChangeMultipleStatuses}
						/>
					</Grid1>
				</Grid1>
				</form>


				{campaignGroups.loading === false ?
					page.docs && page.docs.length > 0 ? (
							<div className={(classes.tableWrapper + " table-outer hideFirstThSortIcon")}>
								{page.page > 0 && tablePagination}

								<Grid
									rows={this.state.rows}
									columns={this.state.columns}
								>
									{/*<SelectionState*/}
									{/*selection={this.state.selection}*/}
									{/*onSelectionChange={ (selection) => {*/}
									{/*this.setState({selection})*/}
									{/*}}*/}
									{/*/>*/}
									{/*<IntegratedSelection />*/}
									<DragDropProvider/>
									<TreeDataState
										expandedRowIds={this.state.expandedRowIds}
										onExpandedRowIdsChange={(value) => {
											this.setState({expandedRowIds: value})
										}}
									/>
									<CustomTreeData
										getChildRows={getChildRows}
									/>
									<SortingState
										sorting={this.state.sorting}
										defaultSorting={this.state.defaultSorting}
										columnExtensions={this.state.sortingStateColumnExtensions}
										onSortingChange={(sorting) => {
											this.setState({sorting}, () => {

												localStorage.setItem(
													filtersNamespace, JSON.stringify(
														{
															...JSON.parse(localStorage.getItem(filtersNamespace)),
															sorting
														}
													)
												);

												this.checkItems();
											})
										}}
									/>

									{/*<VirtualTable columnExtensions={this.state.tableColumnExtensions}/>*/}
									<Table columnExtensions={this.state.tableColumnExtensions}/>
									<TableColumnReordering
										defaultOrder={[
											'name',
											'status',
											'abbreviation',
											'campaignType',
											'product',
											'volumeGoal',
											'totalBudgetAmount',
											'perunitvalue',
											'capValue',
											'startDate',
											'endDate',
											'createdAt',
											'createdBy',
											'updatedAt',
											'updatedBy',
											'actions',
										]}
									/>
									<TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths}/>
									<TableHeaderRow showSortingControls/>
									{/*<TableSelection showSelectAll />*/}
									<TableTreeColumn
										for="checkbox"
									/>
									<TableColumnVisibility
										defaultHiddenColumnNames={this.state.defaultHiddenColumnNames}
										columnExtensions={this.state.tableColumnVisibilityColumnExtensions}
									/>
									<Toolbar/>
									<ColumnChooser/>
								</Grid>
								{page.page > 0 && tablePagination}
							</div>
						) :
						(oem && hasTenantPermission(oem, 'createCampaigns') && <div style={{
							color: '#284D76',
							fontSize: 18,
							textAlign: 'center',
							borderRadius: 5,
							width: 300,
							margin: '0px auto',
							padding: 10,
							marginTop: 50,
							boxShadow: '0px 0px 5px -1px rgba(0,0,0,0.75)'
						}}
						>
							No Groups available
						</div>)
					:
					''}
			</div>
		);
	}
}


CampaignGroupsTable.propTypes = {
	classes: PropTypes.object.isRequired
};

CampaignGroupsTable = reduxForm({
	form: 'campaign-groups-table',
})(CampaignGroupsTable);

export default compose(
	withRouter,
	connect(
		(
			{auth, campaigns, campaignGroups, oems, incentives, makes, products, calendar},
			{location, history, match}
		) => ({
			auth,
			campaigns,
			campaignGroups,
			history,
			oems,
			incentives,
			makes,
			products,
			calendar,
			params: match.params
		}),
		dispatch => ({
			dispatch: dispatch
		})
	),
	withStyles(tableStyles)
)(CampaignGroupsTable);
