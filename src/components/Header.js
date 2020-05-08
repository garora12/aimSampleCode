import React, { Component } from 'react'
import { Redirect, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import {compose} from 'redux'
import logo from '../images/logo_xparent150x30.png'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Person from '@material-ui/icons/Person';
import Settings from '@material-ui/icons/SettingsApplications';
import actions from '../actions';
import Search from '@material-ui/icons/Search';
import Menu from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import { NavLink } from 'react-router-dom'
import Badge from '@material-ui/core/Badge';

const styles = theme => ({
	appBar: {
		// Make the app bar z-index always one more than the drawer z-index
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: '#FFFFFF',
		height: '80px',
		padding: '0 33px',
		borderBottom: '1px solid #D7D7D7',
		boxShadow: 'none !important'
	},
	toolbar: theme.mixins.toolbar,
	badge: {
		bottom: 5,
		right: -15,
		width: 20,
		height: 20,
		// The border color match the background color.
		border: `2px solid ${
			theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
		}`,
	},
});

class Header extends Component {
	constructor(props) {
		super(props)
		this.handleSearch = this.handleSearch.bind(this)
		this.handleProfile = this.handleProfile.bind(this)
		this.checkInvitations = this.checkInvitations.bind(this)
		this.showSearch = this.showSearch.bind(this)
	}
	handleSearch(e) {
		e.preventDefault()
		this.props.dispatch(actions.gotoNav({
			history: this.props.history,
			url: '/search',
			state:{}
		}))
	}
	handleProfile(e) {
		e.preventDefault()
		this.props.dispatch(actions.gotoNav({
			history: this.props.history,
			url: '/my-invitations',
			state:{}
		}))
	}
	checkInvitations(){
		const self =this
		const {myInvitations, loadedMyInvitations, flash} = this.props.invitations
		if (flash && flash.error){
			return []
		}
		if (this.props.auth.loggedin && !loadedMyInvitations ){
			this.props.dispatch(actions.getMyInvitations())
			return []
		} else {
			return myInvitations
		}
	}
	showSearch(e){
		console.log('show the search field')
	}

	render() {
		const { classes } = this.props;
		const myInvitations = this.checkInvitations()

		return (
			<AppBar
				position="absolute"
				className={classes.appBar}
			>
				<Toolbar>
					{this.props.auth.loggedin ?
						<div className={'header-main-left'} style={{position: 'relative', right: 47,height:'75px'}}>
							<IconButton
								style={{color: '#103A6C', marginTop: 3, width: 'auto', height: 'auto'}}
								onClick={this.props.toggleDrawer}
								id="app-menu-button"
							>
								<Menu />
							</IconButton>
							<a href={'https://www.scilicet.com/'} target={'_blank'}>
								<img src={logo} className="header-logo" alt="logo"/>
							</a>
						</div> :
						<div className={'header-main-left'} style={{position: 'relative', right: 47,height:'75px'}}>
							<a href={'https://www.scilicet.com/'}  target={'_blank'}>
								<img src={logo} style={{marginLeft:'48px'}} className="header-logo" alt="logo"/>
							</a>
						</div>
					}
					{this.props.auth.loggedin && (
						<div style={{marginLeft: 'auto'}}>
							{/*<span className="search-component">
								<IconButton
									style={{backgroundColor: 'inherit'}}
									onClick={this.showSearch}
								>
									<Search style={{
											color: '#B0B0B2',
											backgroundColor: '#F5F5F5',
											padding: '5px',
											borderRadius: '7px'
										}}
									/>
								</IconButton>
							</span>*/}
							<div style={{
									display: 'inline-block',
									color: '#7D7D7D',
									verticalAlign: 'middle',
									paddingRight: '5px'
								}}
							>
								{this.props.auth.user.username}
							</div>
							<IconButton
								onClick={this.handleProfile}
								color="inherit"
								aria-label="Person"
								style={{width: 'auto', height: 'auto'}}
							>
								{myInvitations.length != 0 ?
									<Badge badgeContent={myInvitations.length} color="primary" classes={{ badge: classes.badge }}>
										<Person style={{color: '#093C6C',}} />
									</Badge> :
									<Person style={{color: '#093C6C'}} />
								}
							</IconButton>
						</div>
					)}
					{!this.props.auth.loggedin && (
						<div className="non-logged-header" style={{marginLeft: 'auto'}}>
							<NavLink to='/login'>
								Login
							</NavLink>
							{/*
								<span> / </span>
								<NavLink to='/signup'>
									Sign Up
								</NavLink>
							*/}
						</div>
					)}
				</Toolbar>
			</AppBar>
		)
	}
}

export default compose(
	withRouter,
	connect(
		({ auth, invitations}, {history}) =>
			({
				auth,
				invitations,
				history
			}),
		dispatch =>
			({
				dispatch: dispatch
			})
	),
	withStyles(styles)
)(Header);
