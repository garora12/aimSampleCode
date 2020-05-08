export const typeUtil = (types) => {
	let result = {}
	types.every((type)=> {
		result[type] = type
		result[`${type}_SUCCESS`] = `${type}_SUCCESS`
		result[`${type}_ERROR`] = `${type}_ERROR`
		return true
	})
	return result
}
