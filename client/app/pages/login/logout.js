import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import $ from 'jquery';

import loginStatus from './loginStatus';

export default class CandidateList extends React.Component {
	constructor(props){
		super(props);
		this.logout();
	}

	logout(){
		let that = this;
		$.ajax({
			url: "http://localhost:8082/logout",
			method: 'get',
			success: function(result){
				if(result.type === 'success'){
					loginStatus.status = false;
					loginStatus.username = null;
					browserHistory.push('/login');
				}else{
					browserHistory.push('/');
				}
			}
	    });
	}

	render(){
		return (
			<div></div>
		);
	}
}