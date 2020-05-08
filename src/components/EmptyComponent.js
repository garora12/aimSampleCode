import React from 'react'
import Grid from '@material-ui/core/Grid'

const EmptyComponent = props => {
	return (
		<Grid item sm={props.size} />
	)
}

export default EmptyComponent;
