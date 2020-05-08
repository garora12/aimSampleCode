import fetch from "isomorphic-fetch";
import { config } from "./../app-config";
import { decode as jwtDecode } from "jsonwebtoken";
import {getTimeZone} from "../helpers/date-util";

let store = null;
export const UNAUTHENTICATED = "UNAUTHENTICATED";

export const refreshSession = async refreshToken => {
	try {
		const refreshSession = await fetch(`${config.API_URL}/auth/refresh-token`, {
			method: "post",
			body: JSON.stringify({ refreshToken }),
			headers: {
				accept: "application/json",
				"content-type": "application/json"
			}
		}).then(refreshSession => refreshSession.json());
		return refreshSession.access_token;
	} catch (err) {
		console.error("error while refreshing session", err);
		return null;
	}
};

export const fetchApi = async params => {
	const { url, method, dispatch, type } = params;
	if (guardAction(type, params.params, method)) {
		return;
	}

	if (dispatch) {
		dispatch({
			type
		});
	}


	let headers = {
		Accept: "application/json",
		"Content-Type": "application/json"
	};

	if (params.body) {
		params.body.timeZone = getTimeZone()
	}
	let body = params.body ? JSON.stringify(params.body) : null;
	const authState = store ? store.getState().auth : null;
	let token = authState ? authState.token : null;
	const decodedToken = token ? jwtDecode(token) : null;
	const tokenExpiresAt = decodedToken ? decodedToken.exp * 1000 : null;
	const shouldRefreshToken =
		tokenExpiresAt && tokenExpiresAt < new Date().getTime();
	if (shouldRefreshToken) {
		token = await refreshSession(authState && authState.refreshToken);
	}
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}
	return fetch(`${config.API_URL}${url}`, {
		method,
		body,
		headers
	})
		.then(response => {
			if (response.status === 401) {
				if (dispatch) {
					dispatch({
						type: UNAUTHENTICATED
					});
				}
			} else if (response.status >= 400) {
				return response.json().then(result => {
					var error = {
						result,
						params: params.params,
						status: response.status
					};
					if (dispatch) {
						dispatch({
							type: `${type}_ERROR`,
							...error
						});
					}
					return Promise.resolve(error);
				});
			} else {
				return response.json().then(result => {
					if (dispatch) {
						dispatch({
							type: `${type}_SUCCESS`,
							result,
							url,
							method,
							params: params.params
						});
					}
					return Promise.resolve(result);
				});
			}
		})
		.catch(err => {
			const result = {
				...err,
				message: err.message ? err.message : "" + err
			};
			var error = {
				result,
				params: params.params,
				status: 503
			};
			if (dispatch) {
				dispatch({
					type: `${type}_ERROR`,
					...error
				});
			}
			return Promise.resolve(error);
		});
};

export const setStore = s => {
	store = s;
};

export const refresh = type => {
	const { guard } = store.getState();
	const state = guard[type];
	if (state) {
		const { url, method, params } = state;
		fetchApi({
			url,
			method,
			params,
			type,
			dispatch: store.dispatch
		});
		return Promise.resolve(); // this is required to keep the function signature the same
	} else {
		//this will not fail, its just to resume since could not refresh an action that was not populated
		return Promise.resolve("Could not find state");
	}
};

export const guardAction = (type, params, method) => {
	const { guard } = store.getState();

	const state = guard[type];
	if (!state || method != "GET") {
		return false;
	} else if (state.state == "request") {
		return true;
	} else if (state.state == "fail") {
		const threshold = Date.now() - state.completedAt;
		if (threshold > 60000) {
			return false;
		} else if (params == null && state.params == null) {
			return true;
		} else if (params == null) {
			return false;
		} else if (state.params == null) {
			return false;
		} else {
			const keys1 = Object.keys(params),
				keys2 = Object.keys(state.params);
			if (keys1.length != keys2.length) {
				return false;
			} else {
				const diff = keys1.find(key => {
					return params[key] != state.params[key];
				});
				if (diff) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
};
