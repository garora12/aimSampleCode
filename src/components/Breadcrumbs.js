import React, { Component } from 'react';
import actions from './../actions';
import { withRouter } from 'react-router-dom'
import {compose} from 'redux'
import { connect } from 'react-redux';
import ChevronRight from '@material-ui/icons/ChevronRight';
import {operatorUtil} from '../helpers/operator-util'
import * as _ from 'lodash'

const chevronStyle = {
	fontSize: 12,
	paddingLeft: 7,
	paddingRight: 5,
	position: 'relative',
	top: 2
}

class BreadCrumbs extends Component {
	render() {
		let showCrumb = true;
		const loc = this.props.location.pathname
		let urlCrumbs = loc.split('/').filter(c => c.length > 0);
		if (urlCrumbs.length === 2 && urlCrumbs[0] === 'operators') {
			showCrumb = false;
		}
		const goto = ({state, url}) => (e) => {
			e.preventDefault()
			this.props.dispatch(actions.gotoNav({
				history: this.props.history,
				url,
				state
			}))
		}

		const location = this.props.location.pathname
		const defaultCrumbs = location.split('/').filter(c => c.length > 0)
		let crumbs = location.split('/').filter(c => c.length > 0)
		if (crumbs.indexOf('invitations') > -1) {
			let index = crumbs.indexOf('invitations')
			crumbs.splice(index, 1)
		}

		// oems
		if (this.props.oems) {
			let oem = {}
			let oemMember = {}
			let oemInvite = {}
			let campaign = {}
			let product = {}
			let make = {}
			let region = {}
			let member = {}
			let model = {}
			let incentive = {}
			let trim = {}
			let inviteName, oemName, userName


			//oem
			if (this.props.oems.byId[this.props.match.params.oemId]) {
				oem = this.props.oems.byId[this.props.match.params.oemId]
				if (this.props.match.params.memberId) {
					oemMember = oem.members.find(m => m.user._id === this.props.match.params.memberId)
				} else if (this.props.match.params.invitationId) {
					oemInvite = this.props.invitations.tenantInvitations.find(i => i._id === this.props.match.params.invitationId)
				}
				oemName = crumbs.indexOf(this.props.match.params.oemId)
				crumbs[oemName] = oem.name;
				showCrumb = true;
				userName = crumbs.indexOf(this.props.match.params.memberId)
				crumbs[userName] = oemMember.user ? oemMember.user.fullname : 'New User'
				inviteName = crumbs.indexOf(this.props.match.params.invitationId)
			} else if (this.props.match.params.oemId && this.props.match.params.oemId != 'new'){
				this.props.dispatch(actions.getOem(this.props.match.params.oemId))
			} else {
				oem.name = operatorUtil(true)
			}

			if(oemInvite && oemInvite.person) {
				crumbs[inviteName] = oemInvite.person.name.first + ' ' + oemInvite.person.name.last
			} else if (oemInvite && oemInvite.user) {
				crumbs[inviteName] = oemInvite.user.name.first + ' ' + oemInvite.user.name.last
			} else {
				crumbs[inviteName] = 'New Invite'
			}

			//campaign
			if (this.props.campaigns.byId[this.props.match.params.campaignId]) {
				campaign = this.props.campaigns.byId[this.props.match.params.campaignId]
			} else if (this.props.match.params.campaignId && this.props.match.params.campaignId != 'new'){
				this.props.dispatch(actions.getCampaign(this.props.match.params.oemId, this.props.match.params.campaignId))
			} else {
				campaign.name = 'New Campaign'
			}
			let campaignName = crumbs.indexOf(this.props.match.params.campaignId)
			crumbs[campaignName] = campaign.name
			//product
			if (this.props.products.byId[this.props.match.params.productId]) {
				product = this.props.products.byId[this.props.match.params.productId]
			} else if (this.props.match.params.productId && this.props.match.params.productId != 'new'){
				this.props.dispatch(actions.getProduct(this.props.match.params.oemId, this.props.match.params.productId))
			} else {
				product.name = 'New Product'
			}
			let productName = crumbs.indexOf(this.props.match.params.productId)
			crumbs[productName] = product.name
			//brand
			if (this.props.makes.byId[this.props.match.params.makeId]) {
				make = this.props.makes.byId[this.props.match.params.makeId]
			} else if (this.props.match.params.makeId && this.props.match.params.makeId != 'new'){
				this.props.dispatch(actions.getMake(this.props.match.params.oemId, this.props.match.params.makeId))
			} else {
				make.name = 'New Brand'
			}
			let makeName = crumbs.indexOf(this.props.match.params.makeId)
			// need to account for brands and manufacturers being named the same thing --- added extra space
			crumbs[makeName] = make.name + ' '
			//region
			if (this.props.regions.byId[this.props.match.params.regionId]) {
				region = this.props.regions.byId[this.props.match.params.regionId]
			} else if (this.props.match.params.regionId && this.props.match.params.regionId != 'new'){
				this.props.dispatch(actions.getRegion(this.props.match.params.oemId, this.props.match.params.regionId))
			} else {
				region.name = 'New Region'
			}
			let regionName = crumbs.indexOf(this.props.match.params.regionId)
			crumbs[regionName] = region.name
			//model
			if (this.props.models.byId[this.props.match.params.modelId]) {
				model = this.props.models.byId[this.props.match.params.modelId]
			} else if (this.props.match.params.modelId && this.props.match.params.modelId != 'new'){
				this.props.dispatch(actions.getModel(this.props.match.params.oemId, this.props.match.params.makeId, this.props.match.params.modelId))
			} else {
				model.name = 'New Model'
			}
			let modelName = crumbs.indexOf(this.props.match.params.modelId)
			crumbs[modelName] = model.name
			//trim
			if (this.props.trims.byId[this.props.match.params.trimId]) {
				trim = this.props.trims.byId[this.props.match.params.trimId]
			} else if (this.props.match.params.trimId && this.props.match.params.trimId != 'new'){
				this.props.dispatch(actions.getTrim(this.props.match.params.oemId, this.props.match.params.makeId, this.props.match.params.modelId, this.props.match.params.trimId))
			} else {
				trim.name = 'New Trim'
			}
			let trimName = crumbs.indexOf(this.props.match.params.trimId)
			crumbs[trimName] = trim.name

			//incentive editor
			if (this.props.incentives.byId[this.props.match.params.incentiveId]) {
				incentive = this.props.incentives.byId[this.props.match.params.incentiveId]
			} else if (this.props.match.params.incentiveId && this.props.match.params.incentiveId != 'new') {
				this.props.dispatch(actions.getIncentive(this.props.match.params.oemId, this.props.match.params.campaignId, this.props.match.params.incentiveId))
			} else {
				incentive.name = 'New Incentive'
			}
			let incentiveName = crumbs.indexOf(this.props.match.params.incentiveId)
			crumbs[incentiveName] = incentive.name
		}

		// dealerships
		if (this.props.dealerships) {
			let dealership = {}
			let incentiveRequest = {}
			let dealershipMember = {}
			let dealershipInvite = {}
			let dealershipName, userName, inviteName

			//dealership
			if (this.props.dealerships.byId[this.props.match.params.dealershipId]) {
				dealership = this.props.dealerships.byId[this.props.match.params.dealershipId]

				if (this.props.match.params.memberId) {
					dealershipMember = dealership.members.find(m => m.user._id === this.props.match.params.memberId)
				} else if (this.props.match.params.invitationId) {
					dealershipInvite = this.props.invitations.tenantInvitations.find(i => i._id === this.props.match.params.invitationId)
				}
				dealershipName = crumbs.indexOf(this.props.match.params.dealershipId)
				crumbs[dealershipName] = dealership.name
				userName = crumbs.indexOf(this.props.match.params.memberId)
				crumbs[userName] = dealershipMember.user ? dealershipMember.user.fullname : 'New User'
				inviteName = crumbs.indexOf(this.props.match.params.invitationId)

			} else if (this.props.match.params.dealershipId && this.props.match.params.dealershipId != 'new'){
				this.props.dispatch(actions.getDealership(this.props.match.params.dealershipId))
			} else {
				dealership.name = 'New Dealership'
			}

			if(dealershipInvite && dealershipInvite.person) {
				crumbs[inviteName] = dealershipInvite.person.name.first + ' ' + dealershipInvite.person.name.last
			} else if (dealershipInvite && dealershipInvite.user) {
				crumbs[inviteName] = dealershipInvite.user.name.first + ' ' + dealershipInvite.user.name.last
			} else {
				crumbs[inviteName] = 'New Invite'
			}

			//incentive request
			if (this.props.incentiveRequests.byId[this.props.match.params.incentiveRequestId]) {
				incentiveRequest = this.props.incentiveRequests.byId[this.props.match.params.incentiveRequestId]
			} else if (this.props.match.params.dealershipId && this.props.match.params.incentiveRequestId != 'new'){
				// this.props.dispatch(actions.getIncentiveRequest(this.props.match.params.dealershipId, this.props.match.params.incentiveRequestId))
			} else {
				incentiveRequest.fullname = 'New Incentive Request'
			}
			let incentiveName = crumbs.indexOf(this.props.match.params.incentiveRequestId)
			crumbs[incentiveName] = incentiveRequest.fullname
		}

		//admin
		if (this.props.users) {
			let user = {}

			if (this.props.users.byId[this.props.match.params.userId]) {
				user = this.props.users.byId[this.props.match.params.userId]
			} else if (this.props.match.params.userId && this.props.match.params.userId != 'new'){
				this.props.dispatch(actions.getUser(this.props.match.params.userId))
			} else {
				user.fullname = 'New User'
			}
			let userName = crumbs.indexOf(this.props.match.params.userId)
			crumbs[userName] = user.fullname
		}
		crumbs = _.map(crumbs, (crumb)=>{
			if (crumb === 'members' ||
				crumb === 'brands' ||
				crumb === 'products' ||
				crumb === 'campaigns' ||
				crumb === 'models' ||
				crumb === 'makes' ||
				crumb === 'trims' ||
				crumb === 'reports' ||
				crumb === 'charts' ||
				crumb === 'projections' ||
				crumb === 'dealerships' ||
				crumb === 'admin' ||
				crumb === 'users' ||
				crumb === 'incentives') {
				return crumb.charAt(0).toUpperCase() + crumb.slice(1);
			} else {
				return crumb
			}
		})
		let lastCrumb = crumbs[crumbs.length - 1]
		return (
			<div className="breadCrumbs">
				{crumbs && crumbs.map((crumb,index) => {
					let crumbName = crumb
					if (crumb == "my-invitations") {
						crumbName = "Invitations"
					}
					if (crumbName === 'manufacturers' || crumbName === 'operators') {
						crumbName = operatorUtil(false)
					}
					let crumbPath = location.split('/', index + 2).join('/')
					if (crumb === 'admin') {
						crumbPath = '/admin/users'
					}
					return (
						<span key={`${crumb}-${index}-${location}`}>
							{crumbs.length > 1 && crumb != lastCrumb ?
								<span
									onClick={ goto({url: crumbPath }) }
									className='active-link-style'
								>
									{crumbName}
								</span> :
								<span style={{color: '#304ffe'}}> {  showCrumb ? crumbName : '' } </span>
							}
							{crumb != lastCrumb &&
								<ChevronRight style={chevronStyle} />
							}
						</span>
					)
				})}

			</div>
		)
	}
}

export default compose(
	withRouter,
	connect(
		({oems, dealerships, campaigns, products, makes, models, regions, members, incentiveRequests, incentives, users, trims, invitations}, {location, history}) =>
			({
				oems,
				dealerships,
				campaigns,
				products,
				makes,
				models,
				regions,
				members,
				incentiveRequests,
				incentives,
				users,
				location,
				history,
				trims,
				invitations
			}),
		dispatch =>
			({
				dispatch: dispatch
			})
	),
)(BreadCrumbs);


