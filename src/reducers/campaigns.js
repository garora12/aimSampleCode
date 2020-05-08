import { TYPES } from "./../actions";
import { toKeyedEntry, objectWithoutKey } from "../helpers/reducer-util";
import { errorMessage } from "../helpers/error-util";
import moment from "moment";

const initialState = {
	page: {
		docs: []
	},
	byId: {},
	flash: null,
	groupArray: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case TYPES.LOGOUT_SUCCESS:
			return {
				...initialState
			};
		case TYPES.CAMPAIGNS:
			return {
				...state,
				loading: true
			};
		case TYPES.CAMPAIGNS_SUCCESS:
			return {
				...state,
				page: {
					...action.result,
					params: action.params
				},
				loading: false,
				timestamp: moment().valueOf()
			};
		case TYPES.GROUPS:
			return {
				...state,
				groupArray: [],
				loading: true
			};
		case TYPES.GROUPS_SUCCESS:
			return {
				...state,
				groupArray: action.result,
				groupArrayCampaigns: [
					{ _id: "Select", name: "Select Group" },
					...action.result,
					{ _id: "Other", name: "Add New Group" }
				],
				loading: false,
				page: {
					params: action.params
				}
			};
		case TYPES.CAMPAIGN_SUCCESS:
			return {
				...state,
				byId: {
					...state.byId,
					...toKeyedEntry("_id", action.result)
				}
			};
		case TYPES.CAMPAIGNCREATE_SUCCESS:
			return {
				...state,
				byId: {
					...state.byId,
					...toKeyedEntry("_id", action.result)
				},
				flash: {
					message: "create successful",
					type: action.type
				}
			};
		case TYPES.CAMPAIGNUPDATE_SUCCESS:
			return {
				...state,
				byId: {
					...state.byId,
					...toKeyedEntry("_id", action.result)
				},
				flash: {
					message: "update successful",
					type: action.type
				}
			};
		case TYPES.CAMPAIGNDELETE_SUCCESS:
		case TYPES.CAMPAIGNSDELETE_SUCCESS:
			return {
				...state,
				byId: objectWithoutKey(state.byId, action.params.campaign),
				flash: {
					...action.result.result,
					type: action.type
				}
			};
		case TYPES.CAMPAIGNCLEARPROPS:
			return {
				...state,
				page: {
					docs: []
				}
			};
		case TYPES.CAMPAIGNCLEARFLASH:
			return {
				...state,
				flash: null
			};
		case TYPES.CAMPAIGN_ERROR:
		case TYPES.CAMPAIGNS_ERROR:
		case TYPES.GROUPS_ERROR:
		case TYPES.CAMPAIGNCREATE_ERROR:
		case TYPES.CAMPAIGNUPDATE_ERROR:
		case TYPES.CAMPAIGNDELETE_ERROR:
		case TYPES.CAMPAIGNSDELETE_ERROR:
			return {
				...state,
				flash: {
					error: true,
					...errorMessage(action.result),
					type: action.type
				}
			};
		case TYPES.MESSAGE:
			return {
				...state,
				flash: {
					message: action.message,
					type: action.type
				}
			};
		default:
			return state;
	}
}
