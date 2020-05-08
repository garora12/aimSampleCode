import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom';

const EmptyTableMessage = props => {
	return (
		<Grid item sm={12}>
			<div style={{marginTop: 10, marginBottom: 10}}>
				No <span style={{textTransform: 'capitalize'}}>{props.item}s</span> to show.
				{!props.disableAdd &&
					<span>
						{!props.onAdd ?
							<Link
								className="empty-link"
								to={{pathname: props.route, state:{brand:props.brand,deleteStatus:props.deleteStatus}}}
							>
								Add a new {props.item}
							</Link> :
							<span className="empty-link" onClick={props.onAdd} style={{cursor: 'pointer'}}>
								Add a new {props.item}
							</span>
						}
					</span>
				}
			</div>
		</Grid>
	)
}

export default EmptyTableMessage;
