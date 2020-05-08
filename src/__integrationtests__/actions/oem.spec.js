import actions, {TYPES} from '../../actions'
import expect from 'expect'
import {createStore, getActions, getStore} from './test-util'
import fs from 'fs'
import {setStore} from '../../helpers/fetch-util'
import FormData from 'isomorphic-form-data'

describe('oem actions', () => {
	it('get oems and oem', () => {
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
			return store.dispatch(actions.getOems({page:1,limit:5}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.OEMS_SUCCESS)
			expect(action.result.docs).not.toBeNull()
			action.result.docs.every((oem)=> {
				expect(oem._id).not.toBeNull()
				expect(oem.name).not.toBeNull()
			})
			singleOem = action.result.docs[0]
			return store.dispatch(actions.getOem(singleOem._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.OEM_SUCCESS)
			const oem = action.result
			expect(oem._id).not.toBeNull()
			expect(oem.name).not.toBeNull()
		})
	})
	it('create oem, update, delete', () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

		const name = `test${new Date().getTime()}`
		let initialState = {
			auth: {}
		}
		const getState = () => initialState
		const store = createStore(getState)
		setStore(store)
		let createdOem = null, confirmationToken = null

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
			expect(action.type).toEqual(TYPES.OEMCREATE_SUCCESS)
			expect(action.result.name).toEqual(name)
			createdOem = action.result
			return store.dispatch(actions.getOem(createdOem._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.OEM_SUCCESS)
			const oem = action.result
			oem.name = `${name} 22`
			return store.dispatch(actions.updateOem(oem))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.OEMUPDATE_SUCCESS)
			expect(action.result.name).toEqual(`${name} 22`)
			return store.dispatch(actions.deleteOem(createdOem._id))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.OEMDELETE_SUCCESS)
			return store.dispatch(actions.getOems({
				page: 1,
				limit: 2
			}))
		}).then(()=> {
			const action = getActions(store, true, 1)[0]
			expect(action.type).toEqual(TYPES.OEMS_SUCCESS)
			expect(action.result.docs).not.toBeNull()
			action.result.docs.every((user)=> {
				expect(user._id).not.toBeNull()
				expect(user.username).not.toBeNull()
			})
		})
	})
})