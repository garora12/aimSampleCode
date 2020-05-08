import _ from 'lodash'
import accounting from 'accounting'


accounting.settings.currency.format = {
	pos : "%s %v",   // for positive values, eg. "$ 1.00" (required)
	neg : "%s (%v)", // for negative values, eg. "$ (1.00)" [optional]
	zero: "%s  -- "  // for zero values, eg. "$  --" [optional]
};


export const formatCurrency = (integerValue, precision=2) => {
	let val = 0
	if (integerValue) {
		val = Number(integerValue)
	}
	return accounting.formatMoney(val.toFixed(2), {
		precision
	});
}

export const formatNumber = (val, precision=2) => {
	if (precision==2){
		return accounting.toFixed(val, 2)
	}
	return accounting.formNumber(val, {
		precision
	})
}
export const formatUserName = (obj,namePath) => {
	var name = _.get(obj, namePath)
	if (!name) {
		return ''
	}
	return `${name.last?(name.first && name.first.slice(0,1))+". "+name.last :name.first}`
}
export const changeCaseFirstLetter=(params) =>{
	if(typeof params === 'string') {
		return params.charAt(0).toUpperCase() + params.slice(1);
	}
	return params;
}

