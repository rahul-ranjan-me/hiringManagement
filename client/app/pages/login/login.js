import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import $ from 'jquery';

import Form from '../../components/form';


export default class CandidateList extends React.Component {
	constructor(props){
		super(props);
		this.submitData = this.submitData.bind(this);
		this.state = {
			message: false
		}
		this.metadata = [
			{
				'id' : 'username',
				'label' : 'User name',
				'type' : 'text',
				'value': ''
			},
			{
				'id' : 'password',
				'label' : 'Password',
				'type' : 'password',
				'value': ''
			}
		];

		this.dataStructure = {
			username: '',
			password: ''
		};
		this.messageProp = {};
	}

	submitData(obj){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/login",
			method: 'post',
			dataType : 'JSON',
			data: obj,
			success: function(result){
				that.messageProp = result;
				if(result.type === 'success'){
					that.setState({message: true});
					browserHistory.push('/listCandidates');
				}else{
					that.setState({message: true});
				}
			}
	    });
	}

	render(){

		let cssClassName = "alert alert-"+this.messageProp.type,
			message = this.messageProp.message;

		return (
			<div className="container">
				<div className="row">
					<div className="span12 main-holder">
						{this.state.message === true ? 
							<div className={cssClassName}>
								{message}
							</div> : 
						null}

						<Form 
							metadata={this.metadata} 
							onSubmitData={this.submitData} 
							dataFormat = {this.dataStructure} 
							cssClassName="form-horizontal" /> 

					</div>
				</div>
			</div>
		);
	}
}