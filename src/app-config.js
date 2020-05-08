let override = {}

if (window.AimAppConfig) {
	console.log("overriding", window.AimAppConfig)
	override = window.AimAppConfig
}

const defaults = {
	//API_URL: 'http://localhost:3005',
	API_URL: 'https://api-qa.scilicet.app',
	//API_URL: 'https://api.aimincentives.net',
	NEW_APP_URL: 'https://qa.scilicet.app/',
	ALLOW_REDIRECT:false,
	LOGOUT_SESSION_TIMEOUT: 60 * 60 * 1000,
	AUTO_LOGOUT_SESSION_TIMEOUT: 30 * 1000,
	// API_URL:'https://api-dev.aimrebates.com',
	version: "1.0.4",
	snackbarHideTime: 30000,
	isOperator: true,
	paging: {
		BODYSTYLES: 100,
		CAMPAIGNS: 100,
		CAMPAIGN_GROUPS: 100,
		CAMPAIGN_INDIVIDUALS: 100,
		CAMPAIGNSALES: 100,
		GETCALENDARMONTHS: 100,
		DEALERSHIPSALES: 100,
		DEALERSHIPS: 100,
		DEALERSHIPS_FOR_OEM: 100,
		DIMENSION: 100,
		INCENTIVEREQUESTS: 100,
		INCENTIVEREQUESTSTATE: 100,
		INCENTIVES: 100,
		MAKES: 100,
		ALLMAKES: 100,
		MODELS: 100,
		OEMS: 100,
		PRODUCTS: 100,
		PRODUCTSALL: 100,
		REGIONS: 100,
		ROLES: 100,
		STATES: 100,
		TENANTROLES: 100,
		TRIMS: 100,
		USERS: 100,
		DEALERSHIPPRODUCTS: 100,
		USER_LOGS: 100,
		GETOPERTORSALESREPORT: 100
	},
	years: {
		default: [2017, 2018, 2019, 2020, 2021, 2022],
		products: [2017, 2018, 2019, 2020, 2021, 2022, 9999]
	}
}
export const config = {
	...defaults,
	...override
}
