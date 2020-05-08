import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux'
import EditToolbar from './EntityTableComponents/EditToolbar'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		height: '80vh'
	},
	table: {
		minWidth: 1020,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
});
class Search extends Component {
	constructor(props){
		super(props)
	}
	render(){
		const { classes } = this.props;
		return (
			<div>
				<Paper className={classes.root}>
					<EditToolbar numSelected={0} title={'Search'} />
				</Paper>
			</div>
		)
	}
};
Search.propTypes = {
	classes: PropTypes.object.isRequired,
};
export default compose(
	withStyles(styles)
)(Search);

