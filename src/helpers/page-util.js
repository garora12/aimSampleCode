import {config} from './../app-config'


export const getLimit = (type, value) => {
	if (value < 0 || !value){
		return config.paging[type]
	} else {
		return value
	}
}