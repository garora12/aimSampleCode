import {
	fetchApi
} from '../helpers/fetch-util';
import { typeUtil } from '../helpers/type-util'

export const TYPES = typeUtil([
	'SESSION',
	'CREATE_SESSION',
	'LOGOUT',
	'ME',
	'MEUPDATE',
	'CONFIRMATION',
	'RESENDCONFIRMATION',
	'REGISTER',
	'USER_REGISTRATION',
	'AUTHCLEARFLASH',
	'FORGOTPASSWORD',
	'CONFIRMFORGOTPASSWORD',
	'SIGNUPPARAMS',
	'USER_REGISTRATION_PARAMS',
	'SESSIONIDLE',
	'SESSIONACTIVE',
	'SETEXPIRETIME',
	'RESTORESESSION'
])

export const clearAuthFlash = () => (dispatch) => {
	dispatch({
		type: `${TYPES.AUTHCLEARFLASH}`
	})

	return Promise.resolve()
};

export const getSession = () => (dispatch) => {
	return fetchApi({
		method: 'GET',
		url: '/auth',
		type: TYPES.SESSION,
		dispatch
	})
};

export const logout = (params) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: '/auth/logout',
		body: params,
		type: TYPES.LOGOUT,
		dispatch
	})
};

export const createSession = (params) => (dispatch) => {
	return fetchApi({
		method: 'post',
		url: '/auth',
		body: params,
		params: params,
		type: TYPES.CREATE_SESSION,
		dispatch
	})
};


export const me = () => (dispatch) => {
	return fetchApi({
		method: 'GET',
		url: `/users/me`,
		type: TYPES.ME,
		dispatch
	});
};

export const updateMe = (params) => (dispatch) => {
	return fetchApi({
		method: 'PUT',
		url: `/users/me`,
		params: params,
		body: params,
		type: TYPES.MEUPDATE,
		dispatch
	});
};

export const confirmRegistration = (params) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: `/users/confirmation`,
		params: params,
		body: params,
		type: TYPES.CONFIRMATION,
		dispatch
	});
};

export const resendConfirmation = (params) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: `/users/resend-confirmation`,
		params: params,
		body: params,
		type: TYPES.RESENDCONFIRMATION,
		dispatch
	});
};

export const register = (params) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: `/users`,
		params: params,
		body: params,
		type: TYPES.REGISTER,
		dispatch
	});
};

export const userRegistration = (params) => (dispatch) => {
	return fetchApi({
		method: 'PUT',
		url: `/users/registration/userId/${params.userId}`,
		params: params,
		body: params,
		type: TYPES.USER_REGISTRATION,
		dispatch
	});
};

export const forgotPassword = (email) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: `/auth/forgot-password`,
		params: { email },
		body: { email },
		type: TYPES.FORGOTPASSWORD,
		dispatch
	});
};

export const confirmForgotPassword = (email, forgotPasswordToken, password) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: `/auth/reset-password`,
		params: {
			email,
			forgotPasswordToken,
			password
		},
		body: {
			email,
			forgotPasswordToken,
			password
		},
		type: TYPES.CONFIRMFORGOTPASSWORD,
		dispatch
	});
};

export const getSignupParams = (invitationToken, tenant) => (dispatch) => {
	return fetchApi({
		method: 'GET',
		url: `/tenant-invitations/tenants/${tenant}/${invitationToken}`,
		params: {
			invitationToken,
			tenant
		},
		type: TYPES.SIGNUPPARAMS,
		dispatch
	});
}

export const getUserRegistrationParams = (userId) => (dispatch) => {
	return fetchApi({
		method: 'GET',
		url: `/users/user-invitations/${userId}`,
		params: {
			userId
		},
		type: TYPES.USER_REGISTRATION_PARAMS,
		dispatch
	});
}

export const setSessionIdleTimedOut = () => (dispatch) => {
	dispatch({
		type: `${TYPES.SESSIONIDLE}`
	})
}

export const setSessionActive = () => (dispatch) => {
	dispatch({
		type: `${TYPES.SESSIONACTIVE}`
	})
}

export const setExpireTime = () => (dispatch) => {
	dispatch({
		type: `${TYPES.SETEXPIRETIME}`
	})
}

export const setRestoreSession = () => (dispatch) => {
	dispatch({
		type: `${TYPES.RESTORESESSION}`
	})
}
