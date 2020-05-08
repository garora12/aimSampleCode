import actions, {TYPES} from '../../actions'
import expect from 'expect'
import {createStore, getActions, getStore} from './test-util'
import fs from 'fs'
import {setStore} from '../../helpers/fetch-util'
import FormData from 'isomorphic-form-data'

describe('auth actions', () => {
	it('get me', () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

		let initialState = {
			auth: {}
		}
		const getState = () => initialState
		const store = createStore(getState)
		setStore(store)
		let singleOem = null
		return store.dispatch(actions.createSession({
			username: "az22",
			password: "12312312312331123"
		}))
		.then(() => {
			const action = getActions(store, true, 1)[0]
			initialState.auth.token = action.result.token
			return store.dispatch(actions.me())
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.ME_SUCCESS)
			expect(action.result.username).toEqual("az22")
		})
	})
	it('login and get session', () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

		let initialState = {
			auth: {}
		}
		const getState = () => initialState
		const store = createStore(getState)
		setStore(store)

		return store.dispatch(actions.createSession({
			username: "az22",
			password: "12312312312331123"
		}))
		.then(() => {
			const action = getActions(store, true, 1)[0]
			initialState.auth.token = action.result.token
			expect(action.type).toEqual(TYPES.CREATE_SESSION_SUCCESS)
			expect(action.result).not.toBeNull()
			expect(action.result.token).not.toBeNull()
			expect(action.result.user).not.toBeNull()
			expect(action.result.user.username).toEqual("az22")
			return store.dispatch(actions.getSession())
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.SESSION_SUCCESS)
			expect(action.result).not.toBeNull()
			expect(action.result.token).not.toBeDefined()
			expect(action.result).not.toBeNull()
			expect(action.result.username).toEqual("az22")
		})
	})
	it('login error', () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

		const store = createStore()

		return store.dispatch(actions.createSession({
			username: "az22",
			password: "badpassword"
		}))
		.then(() => {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.CREATE_SESSION_ERROR)
			expect(action.result).not.toBeNull()
			expect(action.result.message).toEqual("invalid username or password")
			expect(action.status).toEqual(400)
			expect(action.params).toEqual({
				username: "az22",
				password: "badpassword"
			})
		})
	})
	it('register and confirmation and update me', () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

		const email = `test${new Date().getTime()}@barrelproofapps.com`
		let initialState = {
			auth: {}
		}
		const getState = () => initialState
		const store = createStore(getState)
		setStore(store)
		let createdUser = null, confirmationToken = null
		return store.dispatch(actions.register({
			name: {
				first: "jimmy",
				last: "johnson"
			},
			username: email,
			email,
			password: "foo"
		}))
		.then(() => {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.REGISTER_SUCCESS)
			expect(action.result.username).toEqual(email)
			createdUser = action.result
			//logout
			delete initialState.auth.token
			return store.dispatch(actions.createSession({
				username: "az22",
				password: "12312312312331123"
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.CREATE_SESSION_SUCCESS)
			initialState.auth.token = action.result.token
			return store.dispatch(actions.getUser(createdUser._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USER_SUCCESS)
			confirmationToken = action.result.confirmationToken
			//logout
			delete initialState.auth.token
			return store.dispatch(actions.resendConfirmation({
				email
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.RESENDCONFIRMATION_SUCCESS)
			expect(action.result.message).toEqual("resent confiration email")
			return store.dispatch(actions.createSession({
				username: "az22",
				password: "12312312312331123"
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.CREATE_SESSION_SUCCESS)
			initialState.auth.token = action.result.token
			return store.dispatch(actions.getUser(createdUser._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USER_SUCCESS)
			expect(action.result.confirmationToken).not.toEqual(confirmationToken)
			confirmationToken = action.result.confirmationToken
			//logout
			delete initialState.auth.token
			return store.dispatch(actions.confirmRegistration({
				email,
				confirmationToken
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.CONFIRMATION_SUCCESS)
			expect(action.result.token).not.toBeNull()
			initialState.auth.token = action.result.token
			const user = action.result.user
			user.name.first = "andre"
			return store.dispatch(actions.updateMe(user))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.MEUPDATE_SUCCESS)
			expect(action.result.name.first).toEqual("andre")
			expect(action.result.status).toEqual("active")
			//logout
			delete initialState.auth.token
			return store.dispatch(actions.createSession({
				username: "az22",
				password: "12312312312331123"
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.CREATE_SESSION_SUCCESS)
			initialState.auth.token = action.result.token
			return store.dispatch(actions.deleteUser(createdUser._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USERDELETE_SUCCESS)
		})
	})
})