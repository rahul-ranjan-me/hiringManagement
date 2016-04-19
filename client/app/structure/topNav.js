import React, {Component} from 'react';
import { Link } from 'react-router';

import loginStatus from '../pages/login/loginStatus';

export default class TopNav extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLoggedIn : loginStatus.status
		}
	}

	componentDidMount(){
		var that = this;
		Object.defineProperty(loginStatus, 'status', {
		    get: function() { return this.value; },
		    set: function(newValue) {
		    	that.setState({isLoggedIn: newValue, username: loginStatus.username})
		    }
		});
		that.setState({username: loginStatus.username})
		Object.defineProperty(loginStatus, 'username', {
		    get: function() { return this.value; },
		    set: function(newValue) {
		    	console.log('new', newValue)
		    	that.setState({username: newValue})
		    }
		});
	}

	render(){
		return (
			<div className="navbar navbar-inverse navbar-fixed-top">
				<div className="navbar-inner">
					<div className="container">
						<div className="nav-collapse collapse">
							<ul className="nav">
								<li><Link to={`/`}>Home</Link></li>
								{ this.state.isLoggedIn ?
									<li><Link to={`/addCandidates`}>Add New Candidate</Link></li>
								  : null
								}
							</ul>

							<ul className="nav pull-right">
								<li>
								{this.props.status}
								{ this.state.isLoggedIn ?
									<Link to={`/logout`}>({this.state.username}) Logout</Link>
									:
									<Link to={`/login`}>Login</Link>
								}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}