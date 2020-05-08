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

		case TYPES.CAMPAIGN_INDIVIDUALS_SUCCESS:
			return {
				...state,
				page: {
					...action.result,
					params: action.params
				},
				loading: false,
				timestamp: moment().valueOf()
			};
		case TYPES.CAMPAIGN_INDIVIDUALS_DUPLICATE_SUCCESS:
			return {
				...state,
				loading: false,
				flash: {
					...action.result,
					type: action.type
				}
			};
		case TYPES.CAMPAIGN_INDIVIDUALS_DELETE_SUCCESS:
			return {
				...state,
				loading: false,
				flash: {
					...action.result.result,
					type: action.type
				}
			};
		case TYPES.CAMPAIGN_INDIVIDUALS_CLEAR_PROPS:
			return {
				...state,
				page: {
					docs: []
				}
			};
		case TYPES.CAMPAIGN_INDIVIDUALS_DUPLICATE_ERROR:
		case TYPES.CAMPAIGN_INDIVIDUALS_DELETE_ERROR:
		case TYPES.CAMPAIGN_INDIVIDUALS_ERROR:
			return {
				...state,
				flash: {
					error: true,
					...errorMessage(action.result),
					type: action.type
				}
			};
		case TYPES.CAMPAIGN_INDIVIDUAL_CLEAR_FLASH:
			return {
				...state,
				flash: null
			};
		default:
			return state;
	}
}
