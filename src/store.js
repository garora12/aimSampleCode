import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import logger from "redux-logger";
import { reducer as formReducer } from "redux-form";
import { save, load } from "redux-localstorage-simple";

import oems from "./reducers/oems";
import users from "./reducers/users";
import userLogs from "./reducers/user-logs";
import auth from "./reducers/auth";
import roles from "./reducers/roles";
import tenantRoles from "./reducers/tenant-roles";
import nav from "./reducers/nav";
import dealerships from "./reducers/dealerships";
import dealershipReports from "./reducers/dealership-reports";
import campaigns from "./reducers/campaigns";
import campaignGroups from "./reducers/campaign-groups";
import campaignIndividuals from "./reducers/campaign-individuals";
import campaignReports from "./reducers/campaign-reports";
import invitations from "./reducers/invitations";
import products from "./reducers/products";
import makes from "./reducers/makes";
import models from "./reducers/models";
import regions from "./reducers/regions";
import states from "./reducers/states";
import environment from "./reducers/environment";
import incentiveRequests from "./reducers/incentive-requests";
import incentiveRequestStates from "./reducers/incentive-request-states";
import incentives from "./reducers/incentives";
import dimensions from "./reducers/dimensions";
import bodyStyles from "./reducers/body-styles";
import trims from "./reducers/trims";
import analytics from "./reducers/analytics";
import forecast from "./reducers/forecast";
import guard from "./reducers/guard";
import { setStore } from "./helpers/fetch-util";
import calendar from "./reducers/calendar";
import productSummary from "./reducers/product-summary";
import campaignSummary from "./reducers/campaign-summary";
import oemSalesReport from "./reducers/oem-report";

export function configureStore(history, _initialState) {
	const reducer = combineReducers({
		auth,
		oems,
		users,
		userLogs,
		roles,
		tenantRoles,
		nav,
		dealerships,
		dealershipReports,
		campaigns,
		campaignGroups,
		campaignIndividuals,
		campaignReports,
		invitations,
		products,
		makes,
		models,
		regions,
		states,
		environment,
		incentiveRequests,
		incentiveRequestStates,
		incentives,
		dimensions,
		bodyStyles,
		trims,
		analytics,
		forecast,
		guard,
		calendar,
		productSummary,
		campaignSummary,
		oemSalesReport,
		form: formReducer
	});
	const initialState = _initialState
		? _initialState
		: load({
				states: ["auth", "nav"]
		  });
	const composeEnhancers =
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const store = createStore(
		reducer,
		initialState,
		composeEnhancers(
			applyMiddleware(
				thunkMiddleware,
				//logger,
				save({
					states: ["auth", "nav"]
				})
			)
		)
	);
	setStore(store);
	return store;
}
