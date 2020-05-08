import actions, {TYPES} from '../../actions'
import expect from 'expect'
import {createStore, getActions, getStore} from './test-util'
import fs from 'fs'
import {setStore} from '../../helpers/fetch-util'
import FormData from 'isomorphic-form-data'

describe('user actions', () => {
	it('create user, update, delete', () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

		const email = `test${new Date().getTime()}@barrelproofapps.com`
		let initialState = {
			auth: {}
		}
		const getState = () => initialState
		const store = createStore(getState)
		setStore(store)
		let createdUser = null, confirmationToken = null

		store.dispatch(actions.createSession({
			username: "az22",
			password: "12312312312331123"
		})).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.CREATE_SESSION_SUCCESS)
			initialState.auth.token = action.result.token
			return store.dispatch(actions.createUser({
				name: {
					first: "jimmy",
					last: "johnson"
				},
				username: email,
				email,
				password: "foo",
				sendConfirmation: false
			}))
		}).then(() => {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USERCREATE_SUCCESS)
			expect(action.result.username).toEqual(email)
			createdUser = action.result
			return store.dispatch(actions.getUser(createdUser._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USER_SUCCESS)
			const user = action.result
			user.name.first = "andre"
			return store.dispatch(actions.updateUser(user))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USERUPDATE_SUCCESS)
			expect(action.result.name.first).toEqual("andre")
			return store.dispatch(actions.deleteUser(createdUser._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USERDELETE_SUCCESS)
			return store.dispatch(actions.getUsers({
				page: 1,
				limit: 2
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.USERS_SUCCESS)
			expect(action.result.docs).not.toBeNull()
			action.result.docs.every((user)=> {
				expect(user._id).not.toBeNull()
				expect(user.username).not.toBeNull()
			})
		})
	})
})