import {
	fetchApi
} from '../helpers/fetch-util';
import {typeUtil} from '../helpers/type-util'
import {getLimit} from '../helpers/page-util'
import {getTimeZone} from '../helpers/date-util';
import moment from 'moment-timezone'

export const TYPES = typeUtil([
	'CAMPAIGNS',
	'CAMPAIGN',
	'CAMPAIGNCREATE',
	'CAMPAIGNDELETE',
	'CAMPAIGNSDELETE',
	'CAMPAIGNUPDATE',
	'GROUPS',
	'CAMPAIGNCLEARFLASH',
	'CAMPAIGNCLEARPROPS',
	'MESSAGE'
])

export const clearCampaignFlash = () => (dispatch) => {
	dispatch({
		type: `${TYPES.CAMPAIGNCLEARFLASH}`
	})

	return Promise.resolve()
};

export const clearCampaignProps = () => (dispatch) => {
	dispatch({
		type: `${TYPES.CAMPAIGNCLEARPROPS}`
	})

	return Promise.resolve()
};


export const getCampaigns = (oem,brand,product,status, {page, limit = -1, sort = "-startDate"}) => (dispatch) => {
	limit = getLimit(TYPES.CAMPAIGNS, limit)
	let reqBody={brandId:brand,productId:product,status,limit,page,sort}
	return fetchApi({
		method: 'POST',
		url: `/oems/${oem}/campaigns/new`,
		params: {
			oem,
		},
		body:reqBody,
		type: TYPES.CAMPAIGNS,
		dispatch
	});
};

export const getCampaign = (oem, campaign) => (dispatch) => {
	return fetchApi({
		method: 'GET',
		url: `/oems/${oem}/campaigns/${campaign}`,
		params: {
			oem
		},
		type: TYPES.CAMPAIGN,
		dispatch
	});
};

export const getGroups = (oem,hideEmptyCampaigns,showOnlyActivePaused,showOnlyWithCap,productId,brandId) => (dispatch) => {
	return fetchApi({
		method: 'GET',
		url: `/oems/${oem}/groups?hideEmptyCampaigns=${hideEmptyCampaigns}&showOnlyActivePaused=${showOnlyActivePaused}&showOnlyWithCap=${showOnlyWithCap}&productId=${productId}&brandId=${brandId}`,
		params: {
			oem
		},
		type: TYPES.GROUPS,
		dispatch
	});
};

export const createCampaign = (oem, params) => (dispatch) => {
	params.timeZone = getTimeZone()
	let time = moment()
	params.startDate = moment(params.startDate).set({
		hour: time.get('hour'),
		minute: time.get('minute'),
		second: time.get('second')
	})
	params.endDate = moment(params.endDate).set({
		hour: time.get('hour'),
		minute: time.get('minute'),
		second: time.get('second')
	})
	params.startDate = params.startDate.tz(params.timeZone).format();
	params.endDate = params.endDate.tz(params.timeZone).format();

	params.totalBudgetAmount = params.totalBudgetAmount;
	params.volumeGoal =  params.volumeGoal;
	params.perunitvalue = params.perunitvalue;

	return fetchApi({
		method: 'POST',
		url: `/oems/${oem}/campaigns`,
		params: {
			...params,
			oem
		},
		body: params,
		type: TYPES.CAMPAIGNCREATE,
		dispatch
	});
};

export const deleteCampaign = (oem, campaign) => (dispatch) => {
	return fetchApi({
		method: 'DELETE',
		url: `/oems/${oem}/campaigns/${campaign}`,
		params: {
			campaign,
			oem
		},
		type: TYPES.CAMPAIGNDELETE,
		dispatch
	});
};

export const deleteCampaigns = (oem, campaignArray) => (dispatch) => {
	return fetchApi({
		method: 'POST',
		url: `/oems/${oem}/campaigns/deleteCampaigns`,
		params: {
			campaignArray,
			oem
		},
		body: {
			campaignArray,
		},
		type: TYPES.CAMPAIGNSDELETE,
		dispatch
	});
};

export const showMessage = (message) => (dispatch) => {
	dispatch({
		type: `${TYPES.MESSAGE}`,
		message: message,
	});
};

export const updateCampaign = (oem, params) => (dispatch) => {
	params.timeZone = getTimeZone()
	let time = moment()
	params.startDate = moment(params.startDate).set({
		hour: time.get('hour'),
		minute: time.get('minute'),
		second: time.get('second')
	})
	params.endDate = moment(params.endDate).set({
		hour: time.get('hour'),
		minute: time.get('minute'),
		second: time.get('second')
	})
	params.startDate = moment(params.startDate).tz(params.timeZone).format();
	params.endDate = moment(params.endDate).tz(params.timeZone).format();
	params.totalBudgetAmount = params.totalBudgetAmount;
	params.volumeGoal = params.volumeGoal;
	params.perunitvalue = params.perunitvalue;

	return fetchApi({
		method: 'PUT',
		url: `/oems/${oem}/campaigns/${params._id}`,
		params: {
			...params,
			oem
		},
		body: params,
		type: TYPES.CAMPAIGNUPDATE,
		dispatch
	});
};
