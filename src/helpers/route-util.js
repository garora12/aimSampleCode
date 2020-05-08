import actions from '../actions';
import {operatorUtil} from './operator-util'


let _store = null
export const setStore = (s) => {
	_store = s
}

export const defaultRoute = (history, dispatch) => {
	let state = _store.getState()
	let {auth} = state


	if (auth.user && auth.user.role && auth.user.role.permissions.admin) {
		history.push(`/${operatorUtil(false, true)}`)

		return Promise.resolve()
	} else {
		return Promise.all([
			dispatch(actions.getOems({})),
			dispatch(actions.getDealerships({})),
			dispatch(actions.getMyInvitations())
		]).then(()=> {
			state = _store.getState()
			const oems = state.oems.page.docs,
				dealerships = state.dealerships.page.docs,
				invitations = state.invitations.myInvitations
			if (invitations.length > 0) {
				history.push('/my-invitations')
			} else if (dealerships.length >0) {
				const tenant = dealerships[0]
				const membership = getMembership(tenant)
				const permissions = Object.values(membership.role.permissions)
				const isDealerAdmin = permissions.every((p)=>{
					return p != false
				})
				if (isDealerAdmin) {
					history.push(`/dealerships/${tenant._id}/members`)
				} else if (membership.role.permissions.readIncentives) {
					history.push(`/dealerships/${tenant._id}/incentives`)
				} else {
					history.push(`/dealerships/${tenant._id}`)
				}
			} else if (oems.length > 0) {
				const tenant = oems[0]
				const membership = getMembership(tenant)
				const permissions = Object.values(membership.role.permissions)
				const isOemAdmin = permissions.every((p)=>{
					return p != false
				})
				if (isOemAdmin){
					history.push(`/${operatorUtil(false, true)}/${tenant._id}/members`)
				} else if (membership.role.permissions.approveIncentives) {
					history.push(`/${operatorUtil(false, true)}/${tenant._id}/campaigns`)
				} else {
					history.push(`/${operatorUtil(false, true)}/${tenant._id}`)
				}
			} else {
				history.push('/my-invitations')
			}
		})
	}
}

export const getMembership = (tenant) => {
	if (!tenant) {
		return
	}
	let state = _store.getState()
	let {auth} = state
	var member = tenant.members.find((m)=> {
		const result = m.user._id == auth.user._id
		return result
	})
	return member
}

export const hasTenantPermission = (tenant, permission) => {
	if (isAdmin()) {
		return true
	}
	let member = getMembership(tenant)
	return member && member.role.permissions[permission]
}

export const isAdmin = () => {
	let state = _store.getState()
	let {auth} = state
	return auth.user.role.permissions.admin
}
