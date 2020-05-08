export const toKeyedEntry = (attr, o) => {
	const result = {}
	const val = o[attr]
	result[val] = o
	return result
}

export const objectWithoutKey = (o, key) => {
	const result = {
		...o
	}
	delete result[key]
	return result
}