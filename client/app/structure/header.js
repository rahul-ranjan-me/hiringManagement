import React, {Component} from 'react';

export default class Header extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
			<header className="jumbotron subhead" id="overview">
				<div className="container">
					<h1>Hiring Management</h1>
					<p className="lead">A simple tool to manage hiring pipelines</p>
					<div id="carbonads-container"><div className="carbonad"></div></div>
				</div>
			</header>
		)
	}
}