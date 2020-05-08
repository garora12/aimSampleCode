import {config} from './../app-config'
export const operatorUtil = (single, isUrl) => {
	let useOperator = config.isOperator
	let value

	if (useOperator && single) {
		value = 'operator'
	} else if (useOperator && !single) {
		value = 'operators'
	} else if (!useOperator && single) {
		value = 'manufacturer'
	} else {
		value = 'manufacturers'
	}


	if (!isUrl) {
		return value.charAt(0).toUpperCase() + value.slice(1)
	} else {
		return value
	}
}
