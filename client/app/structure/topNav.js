import React, {Component} from 'react';
import { Link } from 'react-router';

export default class TopNav extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="navbar navbar-inverse navbar-fixed-top">
				<div className="navbar-inner">
					<div className="container">
						<div className="nav-collapse collapse">
							<ul className="nav">
								<li><Link to={`/`}>Home</Link></li>
								<li><Link to={`/addCandidates`}>Add New Candidate</Link></li>
							</ul>

							<ul className="nav pull-right">
								<li><Link to={`/login`}>Login</Link></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}