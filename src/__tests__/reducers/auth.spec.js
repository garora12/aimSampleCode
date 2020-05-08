import expect from 'expect'
import reducer from '../../reducers/auth'
import {TYPES} from '../../actions'

describe('auth reducer:', () => {
	const initialState = {
			loggedin: false,
			flash:null,
			user: null,
			token: null,
			signupParams: null
	};
	let user = {
		name: {
			first: "jimmy",
			last: "johnson"
		},
		username: "auser",
		email:"blah@gmail.com",
		password: "foo"
	};

	const token = "asdasdasd";
	
	const loggedInState = {
			loggedin: true,
			user,
			token,
			flash: null,
			signupParams:null
	};


	it('initial', () => {
		const expectedState = initialState
		expect(reducer(undefined, {})).toEqual(expectedState)
	})

	it('register, resend, confirm, logout', () => {
		expect(
			reducer(initialState, {
				type: TYPES.REGISTER_SUCCESS,
				result: {
					message:"please check your email for confirmation"
				}
			})
		).toEqual({
			...initialState
		})
		expect(
			reducer(initialState, {
				type: TYPES.RESENDCONFIRMATION_SUCCESS,
				result: {
					message:"resent confirmation"
				}
			})
		).toEqual({
			...initialState
		})

		expect(
			reducer(initialState, {
				type: TYPES.CONFIRMATION_SUCCESS,
				result: {
					user,
					token
				}
			})
		).toEqual(loggedInState)

		expect(
			reducer(loggedInState, {
				type: TYPES.LOGOUT_SUCCESS,
			})
		).toEqual({
			...initialState
		})
	})
	it('login, update profile, unauthorized, ', () => {
		expect(
			reducer(initialState, {
				type: TYPES.CREATE_SESSION_SUCCESS,
				result: {
					user,
					token
				}
			})
		).toEqual(loggedInState)

		user.name.first = "leroy"
		expect(
			reducer(loggedInState, {
				type: TYPES.MEUPDATE_SUCCESS,
				result: user
			})
		).toEqual({
			...loggedInState,
			user,
		})

		expect(
			reducer(loggedInState, {
				type: TYPES.UNAUTHENTICATED,
			})
		).toEqual({
			...initialState,
		})
	})
	it('errors ', () => {
		expect(
			reducer(loggedInState, {
				type: TYPES.MEUPDATE_ERROR,
				result: {
					message: "error updating user"
				}
			})
		).toEqual({
			...loggedInState,
			flash: {
				message: "error updating user",
				error: true,
				type: TYPES.MEUPDATE_ERROR
			}
		})
	})
})
