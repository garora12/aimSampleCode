import _ from 'lodash'
import { SubmissionError } from 'redux-form';
export const errorMessage = result => {
	if (result.errors) {
		const newObj = {}
		Object.values(result.errors).forEach((err)=>{
			let value = err.message
			if (err.kind === 'required') {
				value = 'Required Field'
				err.message = value
			}
			_.set(newObj, err.path, value)
		})
		result.submissionErrors = new SubmissionError(newObj)
		return result
	} else {
		return result
	}
}
