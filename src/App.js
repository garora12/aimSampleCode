import "babel-polyfill";
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./styles/main.css";
import ConfirmRegistrationPage from "./pages/Auth/ConfirmRegistrationPage";
import DealershipIncentivePage from "./pages/Dealerships/DealershipIncentivePage";
import DealershipIncentivesPage from "./pages/Dealerships/DealershipIncentivesPage";
import DealershipIncentiveRequestsPage from "./pages/Dealerships/DealershipIncentiveRequestsPage";
import DealershipReportsPage from "./pages/Dealerships/DealershipReportsPage";
import DealershipMembersPage from "./pages/Dealerships/DealershipMembersPage";
import DealershipPage from "./pages/Dealerships/DealershipPage";
import DealershipsPage from "./pages/Dealerships/DealershipsPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import LoginPage from "./pages/Auth/LoginPage";
import ScilicetRedirectPage from "./pages/Other/scilicetRedirectPage";
import MyInvitationsPage from "./pages/Profile/MyInvitationsPage";
import OemBrandPage from "./pages/Oems/OemBrandPage";
import OemBrandsPage from "./pages/Oems/OemBrandsPage";
import OemCampaignChartsPage from "./pages/Oems/OemCampaignChartsPage";
import OemCampaignMultipleDemandChartsPage from "./pages/Oems/OemCampaignMultipleDemandChartsPage";
import OemCampaignProjectionsPage from "./pages/Oems/OemCampaignProjectionsPage";
import OemCampaignReportsPage from "./pages/Oems/OemCampaignReportsPage";
import OemCampaignPage from "./pages/Oems/OemCampaignPage";
import OemCampaignsPage from "./pages/Oems/OemCampaignsPage";
import OemCampaignGroupsPage from "./pages/Oems/OemCampaignGroupsPage";
import OemIndividualCampaignsPage from "./pages/Oems/OemIndividualCampaignsPage";
import OemIncentivePage from "./pages/Oems/OemIncentivePage";
import OemMemberPage from "./pages/Oems/OemMemberPage";
import OemMembersPage from "./pages/Oems/OemMembersPage";
import OemModelPage from "./pages/Oems/OemModelPage";
import OemModelsPage from "./pages/Oems/OemModelsPage";
import OemTrimsPage from "./pages/Oems/OemTrimsPage";
import OemTrimPage from "./pages/Oems/OemTrimPage";
import OemPage from "./pages/Oems/OemPage";
import OemCalendarPage from "./pages/Oems/OemCalendarPage";
import OemProductSummaryPage from "./pages/Oems/OemProductSummaryPage";
import OemCampaignSummaryPage from "./pages/Oems/OemCampaignSummaryPage";
import OemProductPage from "./pages/Oems/OemProductPage";
import OemProductsPage from "./pages/Oems/OemProductsPage";
import OemMemberReportsPage from "./pages/Oems/OemMemberReportsPage";
import OemsPage from "./pages/Oems/OemsPage";
import PrivacyPolicyPage from "./pages/Other/PrivacyPolicyPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import SearchPage from "./pages/Other/SearchPage";
import SettingsPage from "./pages/Admin/SettingsPage";
import SignUpPage from "./pages/Auth/SignupPage";
import TermsPage from "./pages/Other/TermsPage";
import UserPage from "./pages/Admin/UserPage";
import UsersPage from "./pages/Admin/UsersPage";
import SetPasswordPage from "./pages/Admin/SetPasswordPage";
import DealershipMemberInvitePage from "./pages/Dealerships/DealershipMemberInvitePage";
import OemMemberInvitePage from "./pages/Oems/OemMemberInvitePage";
import DealershipMemberPage from "./pages/Dealerships/DealershipMemberPage";

import { operatorUtil } from "./helpers/operator-util";
import IdleTimer from "react-idle-timer";
import SessionAlertModal from "./components/SessionAlertModal";
import actions from "./actions";
import { config } from "./app-config";
import sysend from "sysend";
import SetUserPasswordPage from "./pages/Auth/SetUserPasswordPage";
import UserLogsPage from "./pages/Admin/UserLogsPage";
import ColumnResizingPage from "./pages/Oems/ColumnResizingPage";

class App extends Component {
	constructor(props) {
		super(props);
		this.idleTimer = null;
		this.state = {
			removeLogoutAlertPopup: false,
			showLogoutAlertPopup: false
		};
	}

	onIdle = async e => {
		await this.props.dispatch(actions.setSessionIdleTimedOut());
	};

	componentDidMount() {
		let self = this;
		const { auth } = this.props;
		sysend.on("triggerActivityForAllTabs", function() {
			if (auth.loggedin) {
				self.setState({ removeLogoutAlertPopup: true }, () => {
					self.setState({ removeLogoutAlertPopup: false });
				});
				self.idleTimer && self.idleTimer.reset();
			}
		});
	}

	onAction = async e => {
		this.setState({ removeLogoutAlertPopup: true }, () => {
			this.setState({ removeLogoutAlertPopup: false });
		});
		this.idleTimer = null;
		sysend.broadcast("triggerActivityForAllTabs");
	};

	// shouldComponentUpdate(nextProps, nextState, nextContext) {
	// 	return nextState.removeLogoutAlertPopup === this.state.removeLogoutAlertPopup;
	// }

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({ showLogoutAlertPopup: nextProps.auth.isTimedOut });
	}

	render() {
		const { auth } = this.props;
		const { showLogoutAlertPopup } = this.state;
		return (
			<div className="app-container">
				{auth.loggedin ? (
					<IdleTimer
						ref={ref => {
							this.idleTimer = ref;
						}}
						element={document}
						onActive={this.onActive}
						onIdle={this.onIdle}
						onAction={this.onAction}
						debounce={250}
						events={["keydown", "mousedown", "MSPointerDown"]}
						timeout={config.LOGOUT_SESSION_TIMEOUT}
					/>
				) : (
					""
				)}
				{showLogoutAlertPopup ? (
					<div>
						<SessionAlertModal
							removeLogoutAlertPopup={this.state.removeLogoutAlertPopup}
						/>
					</div>
				) : (
					" "
				)}

				<BrowserRouter>
					<Switch>
						{config.ALLOW_REDIRECT &&	<Route path="/" component={ScilicetRedirectPage} />
					}
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/brands/:makeId/models/:modelId/trims/:trimId`}
							component={OemTrimPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/brands/:makeId/models/:modelId/trims`}
							component={OemTrimsPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/brands/:makeId/models/:modelId`}
							component={OemModelPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/brands/:makeId/models`}
							component={OemModelsPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/brands/:makeId`}
							component={OemBrandPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/brands`}
							component={OemBrandsPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/campaigns/:campaignId/incentives/:incentiveId`}
							component={OemIncentivePage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/campaigns/:campaignId/charts`}
							component={OemCampaignChartsPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/charts`}
							component={OemCampaignMultipleDemandChartsPage}
						/>
						
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/projections`}
							component={OemCampaignProjectionsPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/campaigns/:campaignId/reports`}
							component={OemCampaignReportsPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/campaigns/:campaignId`}
							component={OemCampaignPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/campaigns`}
							component={OemCampaignsPage}
						/>

						<Route
							path={`/${operatorUtil(false, true)}/:oemId/campaign-groups`}
							component={OemCampaignGroupsPage}
						/>

						<Route
							path={`/${operatorUtil(false, true)}/:oemId/individual-campaigns`}
							component={OemIndividualCampaignsPage}
						/>

						<Route
							path={`/${operatorUtil(false, true)}/:oemId/products/:productId`}
							component={OemProductPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/products`}
							component={OemProductsPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/Calendar`}
							component={OemCalendarPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/product-summary`}
							component={OemProductSummaryPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/Campaign-Summary`}
							component={OemCampaignSummaryPage}
						/>
						<Route
							path={`/${operatorUtil(
								false,
								true
							)}/:oemId/members/invitations/:invitationId`}
							component={OemMemberInvitePage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/members/:memberId`}
							component={OemMemberPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/members`}
							component={OemMembersPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId/Sales-Report`}
							component={OemMemberReportsPage}
						/>
						ute path={`/${operatorUtil(false, true)}/:oemId/multiple-demand-plot`}	component={OemCampaignMultipleDemandChartsPage}/> */}
						<Route
							path={`/${operatorUtil(false, true)}/column-resizing`}
							component={ColumnResizingPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}/:oemId`}
							component={OemPage}
						/>
						<Route
							path={`/${operatorUtil(false, true)}`}
							component={OemsPage}
						/>
						<Route
							path="/dealerships/:dealershipId/incentives/:incentiveRequestId"
							component={DealershipIncentivePage}
						/>
						<Route
							path="/dealerships/:dealershipId/members/invitations/:invitationId"
							component={DealershipMemberInvitePage}
						/>
						<Route
							path="/dealerships/:dealershipId/members/:memberId"
							component={DealershipMemberPage}
						/>
						<Route
							path="/dealerships/:dealershipId/members"
							component={DealershipMembersPage}
						/>
						<Route
							path="/dealerships/:dealershipId/incentives"
							component={DealershipIncentivesPage}
						/>
						<Route
							path="/dealerships/:dealershipId/incentive-requests"
							component={DealershipIncentiveRequestsPage}
						/>
						<Route
							path="/dealerships/:dealershipId/reports"
							component={DealershipReportsPage}
						/>
						<Route
							path="/dealerships/:dealershipId"
							component={DealershipPage}
						/>
						<Route path="/dealerships" component={DealershipsPage} />

						<Route
							path="/admin/users/:userId/password"
							component={SetPasswordPage}
						/>
						<Route path="/admin/users/:userId" component={UserPage} />
						<Route path="/admin/users" component={UsersPage} />
						<Route path="/admin/user-logs" component={UserLogsPage} />
						<Route path="/admin/settings" component={SettingsPage} />
						<Route
							path="/confirm-registration/:confirmationToken"
							component={ConfirmRegistrationPage}
						/>
						<Route path="/signup" component={SignUpPage} />
						<Route path="/set-user-password" component={SetUserPasswordPage} />
						<Route path="/forgot-password" component={ForgotPasswordPage} />
						<Route path="/terms" component={TermsPage} />
						<Route path="/privacy-policy" component={PrivacyPolicyPage} />
						<Route path="/my-invitations" component={MyInvitationsPage} />
						<Route path="/search" component={SearchPage} />
						<Route
							path="/confirm-reset-password/:token"
							component={ResetPasswordPage}
						/>
						{<Route path="/" component={LoginPage} />}
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default connect(
	({ auth }) => ({
		auth
	}),
	dispatch => ({
		dispatch
	})
)(App);
