import { TYPES } from './../actions';
import { errorMessage } from '../helpers/error-util';
import { config } from '../../src/app-config';


const initialState = {
	loggedin: false,
	flash: null,
	user: null,
	token: null,
	signupParams: null,
	isTimedOut: false,
	isStayClicked: false,
	isLogoutClicked: false,
	expireTime: config.AUTO_LOGOUT_SESSION_TIMEOUT
};

export default function (state = initialState, action) {
	switch (action.type) {
		case TYPES.SIGNUPPARAMS_SUCCESS:
			return {
				...state,
				signupParams: action.result
			}
		case TYPES.USER_REGISTRATION_PARAMS_SUCCESS:
			return {
				...state,
				userRegistrationParams: action.result
			}
		case TYPES.CONFIRMATION_SUCCESS:
		case TYPES.CREATE_SESSION_SUCCESS:
		case TYPES.CONFIRMFORGOTPASSWORD_SUCCESS:
		case TYPES.RESETPASSWORD_SUCCESS:
			return {
				...state,
				...action.result,
				loggedin: true,
				flash: null,
				isStayClicked: false,
				isLogoutClicked: false
			};
		case TYPES.UNAUTHENTICATED:
		case TYPES.LOGOUT_SUCCESS:
			return {
				...state,
				token: null,
				user: null,
				loggedin: false,
				flash: null,
				isTimedOut: false,
				isLogoutClicked: false,
				isStayClicked: false,
			};
		case TYPES.ME_SUCCESS:
		case TYPES.MEUPDATE_SUCCESS:
		case TYPES.SESSION_SUCCESS:
			return {
				...state,
				user: action.result,
				// flash:null
			}
		case TYPES.FORGOTPASSWORD_SUCCESS:
			return {
				...state,
				flash: {
					error: false,
					...action.result,
					type: action.type
				}
			};
		case TYPES.RESENDCONFIRMATION_SUCCESS:
		case TYPES.REGISTER_SUCCESS:
			if (action.result.token && action.result.token != '') {
				return {
					...state,
					...action.result,
					loggedin: true,
					flash: null
				};
			} else {
				return state
			}
		case TYPES.USER_REGISTRATION_SUCCESS:
				return {
					...state,
					...action.result,
					loggedin: true,
					flash: null
				};
		case TYPES.AUTHCLEARFLASH:
			return {
				...state,
				flash: null
			};
		case TYPES.SESSION_ERROR:
		case TYPES.CREATE_SESSION_ERROR:
		case TYPES.ME_ERROR:
		case TYPES.MEUPDATE_ERROR:
		case TYPES.CONFIRMATION_ERROR:
		case TYPES.RESENDCONFIRMATION_ERROR:
		case TYPES.REGISTER_ERROR:
		case TYPES.USER_REGISTRATION_ERROR:
		case TYPES.FORGOTPASSWORD_ERROR:
		case TYPES.CONFIRMFORGOTPASSWORD_ERROR:
		case TYPES.SIGNUPPARAMS_ERROR:
		case TYPES.USER_REGISTRATION_PARAMS_ERROR:
			return {
				...state,
				signupParams: null,
				flash: {
					error: true,
					...errorMessage(action.result),
					type: action.type
				}
			}
		case TYPES.SESSIONIDLE:
			return {
				...state,
				isTimedOut: true
			};
		case TYPES.SESSIONACTIVE:
			return {
				...state,
				isTimedOut: false,
				isStayClicked: true,
				isLogoutClicked: true
			};
		case TYPES.SETEXPIRETIME:
			return {
				...state,
				isTimedOut: false,
				isStayClicked: true,
				isLogoutClicked: true
			};
		case TYPES.RESTORESESSION:
			return {
				...state,
				isStayClicked: false,
				isLogoutClicked: false
			};
		default:
			return state;
	}
}
