import { TYPES } from "./../actions";
import { toKeyedEntry, objectWithoutKey } from "../helpers/reducer-util";
import { errorMessage } from "../helpers/error-util";
import moment from 'moment'

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

		case TYPES.CAMPAIGN_GROUPS_SUCCESS:
			return {
				...state,
				page: {
					...action.result,
					params: action.params
				},
				loading: false,
				timestamp: moment().valueOf()
			};
		case TYPES.CAMPAIGN_GROUPS_DUPLICATE_SUCCESS:
		case TYPES.CAMPAIGN_GROUPS_DELETE_SUCCESS:
		case TYPES.ADD_CAMPAIGN_TO_GROUP_SUCCESS:
			return {
				...state,
				loading: false,
				flash: {
					...action.result,
					type: action.type
				}
			};
		case TYPES.CAMPAIGN_INSIDE_GROUP_DELETE_SUCCESS:
			return {
				...state,
				loading: false,
				flash: {
					...action.result.result,
					type: action.type
				}
			};
		case TYPES.CAMPAIGN_GROUPS_CLEAR_PROPS:
			return {
				...state,
				page: {
					docs: []
				}
			};
		case TYPES.CAMPAIGN_GROUPS_DUPLICATE_ERROR:
		case TYPES.CAMPAIGN_GROUPS_DELETE_ERROR:
		case TYPES.CAMPAIGN_INSIDE_GROUP_DELETE_ERROR:
		case TYPES.CAMPAIGN_GROUPS_ERROR:
		case TYPES.ADD_CAMPAIGN_TO_GROUP_ERROR:
			return {
				...state,
				flash: {
					error: true,
					...errorMessage(action.result),
					type: action.type
				}
			};
		case TYPES.CAMPAIGN_GROUP_CLEAR_FLASH:
			return {
				...state,
				flash: null
			};
		default:
			return state;
	}
}
