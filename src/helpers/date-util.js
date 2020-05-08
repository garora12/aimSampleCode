let moment = require('moment-timezone');

export const getTimeZone = () => {
	// Important: This may not be supported in all browswers
	return moment.tz.guess()
}
export const getDateAccordingToLocal = (currentDate) => {
	let timezone = getTimeZone()
	return moment(currentDate).tz(timezone).format()
}
export const addHours = (originalDate, hours) => {

	if (hours != 0) {
		return new Date(originalDate).getTime() + (3600000 * hours)
	} else {
		return originalDate
	}

}

export const formatDate = (date, tz,format="M/D/YY") => {
	let newDate = moment(new Date(date))
	newDate = newDate.tz(getTimeZone())
	return newDate.format(format)
}

export const getLocalTime = (utcDate, hourOffset = 0) => {

	if (hourOffset > 0) {
		utcDate = addHours(utcDate, hourOffset)
	}

	return moment.utc(utcDate).local()
}

export const toLocalTimeFormatted = (utcDate, hourOffset = 0) => {
	return getLocalTime(utcDate, hourOffset).format('M/D/YY')
}

export const checkFormattedDate = (object) => {
	if (object._id && moment(object._id).isValid()) {
		object._id = toLocalTimeFormatted(object._id, 13)
		object.date = object._id
	} else if (object.date && moment(object.date).isValid()) {
		object.date = toLocalTimeFormatted(object.date, 13)
	}
	return object
}

export const convertChartUtcDatesToLocal = (data, startDateUtc, endDateUtc) => {
	// Required to deep copy to avoid reference updates.
	const chartData = JSON.parse(JSON.stringify(data))
	if (chartData && chartData.docs && chartData.docs.length > 0) {
		const endDateLocal = getLocalTime(endDateUtc).add(1, 'day')
		chartData.docs = chartData.docs
			.map(dayData => checkFormattedDate(dayData))
			.filter(dayData => new Date(dayData.date) <= endDateLocal)
	}
	return chartData
}
