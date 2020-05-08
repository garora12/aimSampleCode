import React, { Component } from "react";
import actions from "./../actions";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { hasTenantPermission } from "../helpers/route-util";
import { operatorUtil } from "../helpers/operator-util";

const NavBarStyles = {
	main: {
		backgroundColor: "#F7F7F7",
		borderBottom: "1px solid #979797",
		marginTop: 29
	},
	tab: {
		display: "inline-block",
		marginRight: 30,
		paddingBottom: 5,
		cursor: "pointer",
		width: "auto",
		textAlign: "left",
		fontSize: 16,
		fontWeight: 500,
		color: "#585a5e"
	},
	selectedTab: {
		color: "#304ffe",
		borderBottom: "2px solid #304ffe",
		display: "inline-block",
		marginRight: 30,
		paddingBottom: 5,
		cursor: "pointer",
		fontSize: 16,
		width: "auto",
		textAlign: "left"
	}
};

class NavBar extends Component {
	render() {
		const goto = ({ state, url }) => e => {
			e.preventDefault();
			this.props.dispatch(
				actions.gotoNav({
					history: this.props.history,
					url,
					state
				})
			);
		};
		const pathName = this.props.location.pathname;

		let navBar = [];
		let oem = {};
		let make = {};
		let campaign = {};
		let dealership = {};
		let user = {};
		let model = {};
		let profile = {};

		//oem nav
		if (this.props.oems.byId[this.props.match.params.oemId]) {
			oem = this.props.oems.byId[this.props.match.params.oemId];

			navBar = [
				{
					url: `/${operatorUtil(false, true)}/${oem._id}/Calendar`,
					name: "calendar",
					selected: pathName.indexOf("/Calendar") >= 0
				},
				{
					url: `/${operatorUtil(false, true)}/${oem._id}`,
					name: "settings",
					selected: pathName === `/${operatorUtil(false, true)}/${oem._id}`
				}
				// {
				// 	url: `/${operatorUtil(false, true)}/${oem._id}/product-summary`,
				// 	name: 'Product Summary',
				// 	selected: pathName.indexOf('/product-summary') >= 0
				// },
			];
			if (hasTenantPermission(oem, "readProducts")) {
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/products`,
					name: "products",
					selected: pathName.indexOf("/products") >= 0
				});
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/brands`,
					name: "brands",
					selected: pathName.indexOf("/brands") >= 0
				});
				// navBar.unshift({
				// 	url: `/${operatorUtil(false)}/${oem._id}/regions`,
				// 	name: 'regions',
				// 	selected: pathName.indexOf('/regions') >= 0
				// })
			}
			if (hasTenantPermission(oem, "readMembers")) {
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/members`,
					name: "members",
					selected: pathName.indexOf("/members") >= 0
				});
			}
			if (hasTenantPermission(oem, "readCampaigns")) {
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/Sales-Report`,
					name: "Operator Sales Report",
					selected: pathName.indexOf("/Sales-Report") >= 0
				});
			}
			if (hasTenantPermission(oem, "createCampaigns")) {
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/Campaign-Summary`,
					name: "Campaigns Summary",
					selected: pathName.indexOf("/Campaign-Summary") >= 0
				});
			}
			if (hasTenantPermission(oem, "readDemandCharts")) {
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${
						oem._id
					}/charts`,
					name: "Charts",
					selected: pathName.indexOf("/charts") >= 0
				});
			}
			if (hasTenantPermission(oem, "readCampaigns")) {
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/projections`,
					name: "Projections",
					selected: pathName.indexOf("/projections") >= 0
				});
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/individual-campaigns`,
					name: "Individual Campaigns",
					selected: pathName.indexOf("/individual-campaigns") >= 0
				});
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/campaign-groups`,
					name: "Campaign Groups",
					selected: pathName.indexOf("/campaign-groups") >= 0
				});
				navBar.unshift({
					url: `/${operatorUtil(false, true)}/${oem._id}/campaigns`,
					name: "campaigns",
					selected: pathName.indexOf("/campaigns") >= 0
				});
			}
		}

		//brand nav
		if (this.props.makes.byId[this.props.match.params.makeId]) {
			make = this.props.makes.byId[this.props.match.params.makeId];

			navBar = [
				{
					url: `/${operatorUtil(false, true)}/${make.oem}/brands/${
						make._id
					}/models`,
					name: "models",
					selected: pathName.indexOf("/models") >= 0
				},
				{
					url: `/${operatorUtil(false, true)}/${make.oem}/brands/${make._id}`,
					name: "settings",
					selected:
						pathName ===
						`/${operatorUtil(false, true)}/${make.oem}/brands/${make._id}`
				}
			];
		}
		//model nav
		if (this.props.models.byId[this.props.match.params.modelId]) {
			model = this.props.models.byId[this.props.match.params.modelId];
			let oemId = this.props.match.params.oemId;

			navBar = [
				{
					url: `/${operatorUtil(false, true)}/${oemId}/brands/${
						make._id
					}/models/${model._id}/trims`,
					name: "trims",
					selected: pathName.indexOf("/trims") >= 0
				},
				{
					url: `/${operatorUtil(false, true)}/${oemId}/brands/${
						model.make
					}/models/${model._id}`,
					name: "settings",
					selected:
						pathName ===
						`/${operatorUtil(false, true)}/${oemId}/brands/${
							model.make
						}/models/${model._id}`
				}
			];
		}
		// campaign nav
		if (this.props.campaigns.byId[this.props.match.params.campaignId]) {
			campaign = this.props.campaigns.byId[this.props.match.params.campaignId];

			navBar = [
				{
					url: `/${operatorUtil(false, true)}/${campaign.oem}/campaigns/${
						campaign._id
					}`,
					name: "Campaign Details",
					selected:
						pathName ===
						`/${operatorUtil(false, true)}/${campaign.oem}/campaigns/${
							campaign._id
						}`
				},
				// {
				// 	url: `/${operatorUtil(false, true)}/${campaign.oem}/campaigns/${
				// 		campaign._id
				// 	}/charts`,
				// 	name: "charts",
				// 	selected: pathName.indexOf("/charts") >= 0
				// },
				{
					url: `/${operatorUtil(false, true)}/${campaign.oem}/campaigns/${
						campaign._id
					}/reports`,
					name: "Reports",
					selected: pathName.indexOf("/reports") >= 0
				}
				// {
				// 	url: `/${operatorUtil(false, true)}/${campaign.oem}/campaigns/${campaign._id}/multiple-demand-plot`,
				// 	name: 'Multiple Demand charts',
				// 	selected: pathName.indexOf('/multiple-demand-plot') >= 0
				// },
			];
		}

		// dealership nav
		if (this.props.dealerships.byId[this.props.match.params.dealershipId]) {
			dealership = this.props.dealerships.byId[
				this.props.match.params.dealershipId
			];

			navBar = [
				{
					url: `/dealerships/${dealership._id}/`,
					name: "settings",
					selected: pathName === `/dealerships/${dealership._id}`
				}
			];

			if (hasTenantPermission(dealership, "readMembers")) {
				navBar.unshift({
					url: `/dealerships/${dealership._id}/members`,
					name: "members",
					selected: pathName.indexOf("/members") >= 0
				});
			}
			if (hasTenantPermission(dealership, "readReports")) {
				navBar.unshift({
					url: `/dealerships/${dealership._id}/reports`,
					name: "reports",
					selected: pathName.indexOf("/reports") >= 0
				});
			}
			// if (hasTenantPermission(dealership, "readIncentives")) {
			// 	navBar.unshift({
			// 		url: `/dealerships/${dealership._id}/incentives`,
			// 		name: "incentives",
			// 		selected: pathName.indexOf("/incentives") >= 0
			// 	});
			// }
			if (hasTenantPermission(dealership, "readIncentives")) {
				navBar.unshift({
					url: `/dealerships/${dealership._id}/incentive-requests`,
					name: "Incentives Requests",
					selected: pathName.indexOf("/incentive-requests") >= 0
				});
			}
		}

		// admin nav
		if (
			pathName.indexOf("/admin") >= 0 &&
			!this.props.users.byId[this.props.match.params.userId]
		) {
			navBar = [
				{
					url: "/admin/users",
					name: "users",
					selected: pathName.indexOf("/users") >= 0
				},
				{
					url: "/admin/user-logs",
					name: "user logs",
					selected: pathName.indexOf("/user-logs") >= 0
				},
			];
		} else if (this.props.users.byId[this.props.match.params.userId]) {
			user = this.props.users.byId[this.props.match.params.userId];
			navBar = [
				{
					url: `/admin/users/${user._id}`,
					name: "edit",
					selected: pathName === `/admin/users/${user._id}`
				},
				{
					url: `/admin/users/${user._id}/password`,
					name: "password",
					selected: pathName.indexOf("/password") >= 0
				}
			];
		}

		// profile nav
		if (pathName.indexOf("/my-invitations") >= 0) {
			navBar = [
				// {
				// 	url: '/profile',
				// 	name: 'profile',
				// 	selected: pathName === '/profile'
				// },
				{
					url: "/my-invitations",
					name: "invitations",
					selected: pathName.indexOf("/my-invitations") >= 0
				}
			];
		}

		if (navBar.length > 0) {
			return (
				<div style={NavBarStyles.main}>
					{navBar &&
						navBar.map(nav => {
							const index = navBar.indexOf(nav);
							return (
								<Link to={nav.url}>
									<div
										key={index}
										//onClick={goto({ url: nav.url })}
										style={
											nav.selected ? NavBarStyles.selectedTab : NavBarStyles.tab
										}
									>
										<span style={{ textTransform: "capitalize" }}>
											{nav.name}
										</span>
									</div>
								</Link>
							);
						})}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default compose(
	withRouter,
	connect(
		(
			{ auth, oems, makes, models, campaigns, dealerships, users },
			{ location, history }
		) => ({
			auth,
			oems,
			makes,
			models,
			campaigns,
			dealerships,
			users,
			location,
			history
		}),
		dispatch => ({
			dispatch: dispatch
		})
	)
)(NavBar);
