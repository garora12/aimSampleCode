import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React from "react";
import { reduxForm } from "redux-form";
import {Link, withRouter} from "react-router-dom";

import Flash from "../Flash";
import tableStyles from "../tableStyles";
import actions from "../../actions";
import EntityTable from "../EntityTableComponents/EntityTable";
import TableToolbar from "../EntityTableComponents/TableToolbar";

import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import {makeStyles, useTheme, withStyles} from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";

import DeleteConfirmation from "../DeleteConfirmation";
import EmptyTableMessage from "../EmptyTableMessage";
import { operatorUtil } from "../../helpers/operator-util";
import { formatDate, getTimeZone } from "../../helpers/date-util";

import Grid1 from "@material-ui/core/Grid";
import moment from 'moment'
import {formatCurrency} from '../../helpers/format-util';
import {hasTenantPermission} from '../../helpers/route-util'
import MultiChipSelect from "../controls/MultiChipSelect";
import {CSVLink} from "react-csv";
import {fetchApi} from "../../helpers/fetch-util";
import $ from "jquery";
import { SortingState } from '@devexpress/dx-react-grid';
import {
	ColumnChooser,
	DragDropProvider,
	Grid,
	Table,
	TableColumnReordering,
	TableColumnResizing,
	TableColumnVisibility,
	TableHeaderRow,
	Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import IconButton from "@material-ui/core/IconButton";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import RowHighlighting from "../rowHighlighting";

const filtersNamespace = 'listing-filters-campaigns';

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

class CampaignTable extends EntityTable {

	constructor(props, context) {
		super(props, context);

		this.defaultSort = "name";
		this.getPage = this.getPage.bind(this);
		this.fetch = this.fetch.bind(this);
		this.delete = this.delete.bind(this);
		this.getRoute = this.getRoute.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDeleteConfirmation = this.handleDeleteConfirmation.bind(this);
		this.handleMultiDeleteConfirmation = this.handleMultiDeleteConfirmation.bind(
			this
		);
		this.csvLink = React.createRef()
		const loclStrge = this.getLocalStorage();

		this.state = {
			...this.state,
			isProductDisabled: !(loclStrge.brand && loclStrge.brand.length),
			selectedBrands: loclStrge.brand ? loclStrge.brand : [],
			selectedProducts: loclStrge.product ? loclStrge.product : [],
			selectedStatus: loclStrge.status ? loclStrge.status : [{"value":"active","label":"Active"}],
			columns: [
				{ name: 'checkbox', title: 'Checkbox'},
				{ name: "name", title: "Campaign Name" },
				{ name: "status", title: "Status" },
				{ name: "abbr", title: "Label" },
				{ name: "campaignType", title: "Type" },
				{ name: "product", title: "Product" },
				{ name: "totalBudgetAmount", title: "Budget" },
				{ name: "perunitvalue", title: "PVR" },
				{ name: "capAmount", title: "Cap Amount" },
				{ name: "startDate", title: "Start Date" },
				{ name: "endDate", title: "End Date" },
				{ name: "createdAt", title: "Created Date & Time" },
				{ name: "createdBy", title: "Created By" },
				{ name: "updatedAt", title: "Modified Date & Time" },
				{ name: "updatedBy", title: "Modified By" },
				{ name: 'actions', title: 'Actions'}
			],
			rows: [],
			defaultColumnWidths: [
				{columnName: 'checkbox', width: 65},
				{columnName: 'name', width: 150},
				{columnName: 'status', width: 100},
				{columnName: 'abbr', width: 150},
				{columnName: 'campaignType', width: 150},
				{columnName: 'product', width: 150},
				{columnName: 'totalBudgetAmount', width: 150},
				{columnName: 'perunitvalue', width: 150},
				{columnName: 'capAmount', width: 150},
				{columnName: 'startDate', width: 150},
				{columnName: 'endDate', width: 150},
				{columnName: 'createdAt', width: 150},
				{columnName: 'createdBy', width: 150},
				{columnName: 'updatedAt', width: 150},
				{columnName: 'updatedBy', width: 150},
				{columnName: 'actions', width: 150},
			],
			tableColumnExtensions: [
				{columnName: 'checkbox', width: 65},
				{columnName: 'name', width: 150},
				{columnName: 'status', width: 100},
				{columnName: 'abbr', width: 150},
				{columnName: 'campaignType', width: 150},
				{columnName: 'product', width: 150},
				{columnName: 'totalBudgetAmount', width: 150, align: 'right'},
				{columnName: 'perunitvalue', width: 150, align: 'right'},
				{columnName: 'capAmount', width: 150, align: 'right'},
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
			sortingStateColumnExtensions: [],
			defaultHiddenColumnNames: [],
			rootNodeIndexes: [],
			tableColumnVisibilityColumnExtensions: [{columnName: 'checkbox', togglingEnabled: false}],
			campaigns: {},
			csvData: []
		};
	}

	getRoute() {
		return `/${operatorUtil(false, true)}/${this.props.params.oemId}/campaigns`;
	}

	getPage() {
		return this.props.campaigns.page;
	}

	componentWillUnmount() {
		 this.props.dispatch(actions.clearCampaignProps())
	}

	fetch(params) {
		this.props.setLoaderState(true)
		this.props.dispatch(
			actions.getCampaigns(
				this.props.params.oemId,
				this.state.selectedBrands.map((brand) => brand.value),
				this.state.selectedProducts.map((product) => product.value),
				this.state.selectedStatus.map((status) => status.value),
				params
			)
		);
	}

	delete(ids) {
		this.setState({ showDeleteConfirmation: false });
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
			this.setState({ selectedCampaign: campaign });
		}

		if (
			this.state.showDeleteConfirmation === false ||
			!this.state.showDeleteConfirmation
		) {
			this.setState({ showDeleteConfirmation: true });
		} else {
			this.setState({ showDeleteConfirmation: false });
		}
	}

	handleMultiDeleteConfirmation() {
		if (
			this.state.showMultiDeleteConfirmation === false ||
			!this.state.showMultiDeleteConfirmation
		) {
			this.setState({ showMultiDeleteConfirmation: true });
		} else {
			this.setState({ showMultiDeleteConfirmation: false });
		}
	}

	checkItems() {
		this.props.setLoaderState(true)
		const loclStrge = this.getLocalStorage();

		if (this.props.auth.loggedin) {
			const sortColumnName = loclStrge.sorting ? loclStrge.sorting[0].columnName : 'startDate'
			const sortDirection = loclStrge.sorting ? loclStrge.sorting[0].direction : 'desc'
			this.props.dispatch(
				actions.getCampaigns(
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
		this.props.dispatch(actions.clearCampaignFlash());
	}

	componentDidMount() {
		this.props.change('status', this.state.selectedStatus)
		this.props.change('makes', this.state.selectedBrands)
		this.props.change('products', this.state.selectedProducts)
		this.checkItems();
		this.props.dispatch(actions.getMakes(this.props.params.oemId, { page: 1 }));

		
		//---------------------------
		let brandIdsArr = this.state.selectedBrands.map((brand) => brand.value)
	
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
			await this.props.dispatch(
				actions.getCampaigns(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{page: 1}
				)
			);
			let brandIdsArr = [];
			if(this.state.selectedBrands.length === 0) {
				brandIdsArr = ['000000000000000000000000']
			} else {
				brandIdsArr = this.state.selectedBrands.map((brand) => brand.value)
			}
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

			await this.props.dispatch(
				actions.getCampaigns(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{page: 1}
				)
			);

		})
	};

	handleChangeMultipleStatuses = (event) => {
		this.props.setLoaderState(true)
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

			this.props.dispatch(
				actions.getCampaigns(
					this.props.params.oemId,
					this.state.selectedBrands.map((brand) => brand.value),
					this.state.selectedProducts.map((product) => product.value),
					this.state.selectedStatus.map((status) => status.value),
					{page: 1}
				)
			);
		})
	}


	handleSelectAllCampaignsClick = (event) => {
		event.stopPropagation();
		const docs = this.getPage().docs.map(doc => {return {id: doc._id, status:true}})

		if (this.state.selected.length !== docs.length) {
			this.setState({ selected: docs}, () => {
				$('tbody tr.MuiTableRow-root').addClass('highLightedRow')
			})
		} else {
			this.setState({ selected: []}, () => {
				$('tbody tr.MuiTableRow-root').removeClass('highLightedRow')
			})
		}
	}

	getLocalStorage = () => {
		return JSON.parse(localStorage.getItem(filtersNamespace))
			? JSON.parse(localStorage.getItem(filtersNamespace)) : {};
	}

	downloadCsv = () => {
		this.props.setLoaderState(true)
		const loclStrge = this.getLocalStorage();

		let reqBody = {
			brandId: this.state.selectedBrands.map((brand) => brand.value),
			productId: this.state.selectedProducts.map((product) => product.value),
			status: this.state.selectedStatus.map((status) => status.value),
			page: 1,
			sort: loclStrge.sort ? loclStrge.sort : '-startDate'
		}
		return fetchApi({
			method: 'POST',
			url: `/oems/${this.props.params.oemId}/campaigns/new`,
			params: {
				oem: this.props.params.oemId,
			},
			body: reqBody,
			dispatch: false
		}).then((data) => {
			let csvData = []
			const headers = [
				"Campaign Name",
				"Status",
				"Label",
				"Type",
				"Product",
				"Budget",
				"PVR",
				"Cap Amount",
				"Start Date",
				"End Date",
				"Created Date & Time",
				"Created By",
				"Modified Date & Time",
				"Modified By",
			]
			csvData.push(headers)
			data && data.docs && data.docs.length && data.docs.forEach((campaign) => {
				const gmtStartDateTime = moment.utc(campaign.startDate, "YYYY-MM-DD HH")
				const startDatelocal = gmtStartDateTime.local().format('M/D/YY');

				const gmtEndDateTime = moment.utc(campaign.endDate, "YYYY-MM-DD HH")
				const endDatelocal = gmtEndDateTime.local().format('M/D/YY');
				csvData.push(
					[
						campaign.name,
						campaign.status === 'complete' ? 'scheduled' : campaign.status,
						campaign &&
						campaign.campaigngroup &&
						campaign.campaigngroup[0] &&
						campaign.campaigngroup[0]["abbreviation"]
							? campaign.campaigngroup[0]["abbreviation"]
							: "",
						campaign.campaignType === "per_unit"
							? "PRU"
							: campaign.campaignType.charAt(0).toUpperCase() + campaign.campaignType.slice(1),
						campaign.products && campaign.products[0] &&  campaign.products[0]['name'] ?  campaign.products[0]['name'] :"",
						campaign.totalBudgetAmount ? formatCurrency(campaign.totalBudgetAmount) : '',
						campaign.perunitvalue ? formatCurrency(campaign.perunitvalue) : '',
						campaign.incentives && campaign.incentives[0] &&  campaign.incentives[0]['maxValue'] ?  formatCurrency(campaign.incentives[0]['maxValue']) :"",
						startDatelocal,
						endDatelocal,
						formatDate(campaign.createdAt, getTimeZone(), "M/D/YY HH:mm"),
						campaign.users[0] && campaign.users[0].name && campaign.users[0].name.first.charAt(0).toUpperCase() +	campaign.users[0].name.first.slice(1) + ' ' + campaign.users[0].name.last.charAt(0).toUpperCase() +	campaign.users[0].name.last.slice(1),
						formatDate(campaign.updatedAt, getTimeZone(), "M/D/YY HH:mm"),
						campaign.updatedBy && campaign.updatedBy.name && campaign.updatedBy.name.first.charAt(0).toUpperCase() + campaign.updatedBy.name.first.slice(1) + ' ' + campaign.updatedBy.name.last.charAt(0).toUpperCase() +	campaign.updatedBy.name.last.slice(1)
					]
				)
			})
			this.setState({csvData}, () => {
				this.props.setLoaderState(false)
				this.csvLink.current.link.click()
			})
		})
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.campaigns && nextProps.campaigns.timestamp !== prevState.campaigns.timestamp) {
			nextProps.setLoaderState(false)
		}

		if (nextProps.campaigns && nextProps.campaigns.page !== prevState.campaigns.page) {
			return {campaigns: nextProps.campaigns};
		} else return null;
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevState.campaigns.page !== this.state.campaigns.page
			|| prevState.selected !== this.state.selected) {
			let rows = [];
			if (this.state.campaigns
				&& this.state.campaigns.page
				&& this.state.campaigns.page.docs
				&& this.state.campaigns.page.docs.length
			) {

				let columns = this.state.columns.map((item) => {
					if (item.name !== 'checkbox') {
						return item;
					} else {
						return {
							name: 'checkbox', title:
								<Checkbox
									color="primary"
									onClick={this.handleSelectAllCampaignsClick}
									checked={this.state.selected.length === this.state.campaigns.page.docs.length && this.state.campaigns.page.docs.length !== 0}
									disabled={false}
								/>
						}
					}
				})

				this.state.campaigns.page.docs.map((doc) => {
					const isSelected = this.isSelected(doc._id);
					let gmtStartDateTime = moment.utc(doc.startDate, "YYYY-MM-DD HH")
					let startDatelocal = gmtStartDateTime.local().format('M/D/YY');

					let gmtEndDateTime = moment.utc(doc.endDate, "YYYY-MM-DD HH")
					let endDatelocal = gmtEndDateTime.local().format('M/D/YY');

					let statusChip;
					let statusChipBg;
					if (doc.status === "incomplete") {statusChipBg = "#8123A6"} else if (doc.status === "complete") {statusChipBg = "#8FA5C9"}
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
					} else if (doc.status === "complete"){
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
							{ doc.status }
						</div>
					}


					rows.push({
						checkbox: (<Checkbox
							color="primary"
							onClick={event =>
								this.handleSelect(event, doc._id, true)
							}
							checked={isSelected}
							id={doc._id}
						/>),
						name: <Link
							to={`${this.getRoute()}/${doc._id}`}
							className={prevProps.classes.tableLink}
						>
							{doc.name}
						</Link>,
						status: statusChip,
						abbr: doc &&
						doc.campaigngroup &&
						doc.campaigngroup[0] &&
						doc.campaigngroup[0]["abbreviation"]
							? doc.campaigngroup[0]["abbreviation"]
							: "",
						campaignType: doc.campaignType === "per_unit"
							? "PRU"
							: doc.campaignType.charAt(0).toUpperCase() + doc.campaignType.slice(1),
						product: doc.products && doc.products[0] &&  doc.products[0]['name'] ?  doc.products[0]['name'] :"",
						totalBudgetAmount: doc.totalBudgetAmount ? formatCurrency(doc.totalBudgetAmount) : '',
						perunitvalue: doc.perunitvalue ? formatCurrency(doc.perunitvalue) : '',
						capAmount: doc.incentives && doc.incentives[0] &&  doc.incentives[0]['maxValue'] ?  formatCurrency(doc.incentives[0]['maxValue']) :"",
						startDate: startDatelocal,
						endDate: endDatelocal,
						createdAt: formatDate(doc.createdAt, getTimeZone(), "M/D/YY HH:mm"),
						createdBy: doc.users[0] && doc.users[0].name && doc.users[0].name.first.charAt(0).toUpperCase() +	doc.users[0].name.first.slice(1) + ' ' + doc.users[0].name.last.charAt(0).toUpperCase() +	doc.users[0].name.last.slice(1),
						updatedAt: formatDate(doc.updatedAt, getTimeZone(), "M/D/YY HH:mm"),
						updatedBy: doc.updatedBy && doc.updatedBy.name && doc.updatedBy.name.first.charAt(0).toUpperCase() +	doc.updatedBy.name.first.slice(1) + ' ' + doc.updatedBy.name.last.charAt(0).toUpperCase() +	doc.updatedBy.name.last.slice(1),
						actions : doc.status === "incomplete" || doc.status === "complete" ? (<span>
												<span title={'Delete Campaign Group'}
															className="show-on-hover"
															onClick={
																() => {this.handleDeleteConfirmation(doc)}
															} style={{cursor:'pointer'}}>
													<DeleteIcon/>
												</span>
											</span>) : '',
					})
				})
				this.setState({rows, columns});
			}
		}
		if (this.state.rows.length > 0 && prevState.rows !== this.state.rows) {
			RowHighlighting()
		}
	}


	render() {
		const loclStrge = this.getLocalStorage();

		const { classes, makes, products, campaigns, handleSubmit } = this.props;
		const { selected } = this.state;
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
			onChangePage={(event, page)=>this.handleChangePage(event, page, filtersNamespace)}
			onChangeRowsPerPage={(event) => this.handleChangeRowsPerPage(event, filtersNamespace)}
			ActionsComponent={TablePaginationActions}
		/>;

		return (
			<div>
				{this.state.showDeleteConfirmation && (
					<DeleteConfirmation
						open={this.state.showDeleteConfirmation}
						item={this.state.selectedCampaign.name}
						title="campaign"
						handleClose={event => this.handleDeleteConfirmation()}
						delete={event => {
								this.props.setLoaderState(true)
								this.handleDelete(event, this.state.selectedCampaign._id)
							}
						}
					/>
				)}
				{this.state.showMultiDeleteConfirmation && (
					<DeleteConfirmation
						open={this.state.showMultiDeleteConfirmation}
						title="campaigns"
						handleClose={event => this.handleMultiDeleteConfirmation()}
						delete={event => {
								this.props.setLoaderState(true)
								this.handleDeleteSelected(event)
							}
						}
					/>
				)}
				{this.props.campaigns.flash && (
					<Flash
						onClose={this.handleFlashClose}
						flash={this.props.campaigns.flash}
						type="Campaign"
					/>
				)}
				<form onSubmit={handleSubmit}>
					<Grid1
						justify={"flex-end"}
						container
						spacing={3}
						style={{ marginLeft: 0, marginRight: 0, width: "100%" }}
					>
						<Grid1 item xs={8} style={{padding: '12px 0'}}>
								<TableToolbar
								numSelected={selected.length}
								title="Campaign"
								handleAdd={this.handleAdd}
								handleDelete={this.handleMultiDeleteConfirmation}
								entity="campaigns"
								hideFilter={true}
								disableAdd={oem && !hasTenantPermission(oem, 'createCampaigns')}
							/>
						</Grid1>

						<Grid1 item xs={4} style={{padding: '12px 0'}}>
							<span onClick={() => {this.downloadCsv()}}
											style={{
												float: 'right',
												textAlign: 'center',
												textDecoration: 'none',
												lineHeight: '38px',
												width: '152px',
												marginTop: '20px',
												height: '40px',
												color: 'white',
												backgroundColor: '#375CF6',
												borderRadius: '2px',
												textTransform: 'capitalize',
												fontSize: '15px',
												fontWeight: '500',
												cursor: 'pointer'
											}}
										color="primary"
										className="submit-btn"
							>Download CSV FILE</span>
							<CSVLink data={this.state.csvData}
											 asyncOnClick={true}
											 ref={this.csvLink}
											 style={{display: 'none'}}
											 filename={"Campaigns.csv"}>
								Download CSV FILE
							</CSVLink>
						</Grid1>
					</Grid1>
						<Grid1
							justify={"flex-end"}
							container
							spacing={3}
							style={{ marginLeft: 0, marginRight: 0, width: "100%", marginTop: "-50px" }}
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

							<Grid1 item xs={3} style={{padding: "25px 2px"}}>
								<MultiChipSelect
									list={[
										{_id:"active", name:"Active"},
										{_id:"paused", name:"Paused"},
										{_id:"expired", name:"Expired"},
										{_id:"depleted", name:"Depleted"},
										{_id:"complete", name:"Scheduled"},
										{_id:"incomplete", name:"Incomplete"},
									]}
									name="status"
									placeholder="Select Status"
									onChangeHandler={this.handleChangeMultipleStatuses}
								/>
							</Grid1>
					</Grid1>
				</form>

				{page.docs && page.docs.length > 0 ? (
					<div className={(classes.tableWrapper + " table-outer hideFirstThSortIcon")}>
						{page.page > 0 && tablePagination}
						<Grid
							rows={this.state.rows}
							columns={this.state.columns}
						>
							<DragDropProvider/>
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
							<Table columnExtensions={this.state.tableColumnExtensions}/>
							<TableColumnReordering
								defaultOrder={[
									'name',
									'status',
									'abbr',
									'campaignType',
									'product',
									'totalBudgetAmount',
									'perunitvalue',
									'capAmount',
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
							<TableColumnVisibility
								defaultHiddenColumnNames={this.state.defaultHiddenColumnNames}
								columnExtensions={this.state.tableColumnVisibilityColumnExtensions}
							/>
							<Toolbar/>
							<ColumnChooser/>
						</Grid>
						{page.page > 0 && tablePagination}
					</div>
				) : (
					oem && hasTenantPermission(oem, 'createCampaigns') &&
					<EmptyTableMessage item="campaign" route={`${this.getRoute()}/new`} />
				)}
			</div>
		);
	}
}

CampaignTable.propTypes = {
	classes: PropTypes.object.isRequired
};

CampaignTable = reduxForm({
	form: 'campaigns-table',
})(CampaignTable);

export default compose(
	withRouter,
	connect(
		(
			{ auth, campaigns, oems, incentives, makes, products },
			{ location, history, match }
		) => ({
			auth,
			campaigns,
			history,
			oems,
			incentives,
			makes,
			products,
			params: match.params
		}),
		dispatch => ({
			dispatch: dispatch
		})
	),
	withStyles(tableStyles)
)(CampaignTable);
