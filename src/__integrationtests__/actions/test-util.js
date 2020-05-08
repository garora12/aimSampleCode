import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


let currentStore = null, marker=0;

export const getStore = () => {
	return currentStore
}
export const createStore = (getState) => {
	marker = 0
	// currentStore = mockStore(getState)
	currentStore = mockStore(getState)
	return currentStore
}

export const clearMarker = () => {
	marker = currentStore.getActions().length
}
export const getActions = (store, latest=false, offset=0) => {
	if (latest){
		marker = marker + offset
		const result = store.getActions().slice(marker)
		clearMarker()
		return result
	}
	return store.getActions().filter((action) => {
		const isLogin = (action.type).indexOf("LOGIN") != -1
		return !isLogin
	})
}
