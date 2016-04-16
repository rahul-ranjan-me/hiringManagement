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
		this.getCandidateDetails();
		this.state = {
			userInfo : {}
		};
		this.messageProp = {};
		this.metadata = [
			{
				'id' : 'date',
				'label' : 'Date',
				'type' : 'text',
				'value': ''
			},
			{
				'id' : 'interviewer',
				'label' : 'Interviewer',
				'type' : 'select',
				'options': [
					{
						'label' : 'Please select',
						'value' : ''
					},
					{
						'label' : 'Rahul Ranjan',
						'value' : 'rahul.smile@gmail.com|Rahul Ranjan'
					},
					{
						'label' : 'Mohammad Arif',
						'value' : 'mohammad.arif@gmail.com|Mohammad Arif'
					},
					{
						'label' : 'Ravinder Rawat',
						'value' : 'sinvara@gmail.com|Ravinder Rawat'
					},
					{
						'label' : 'Dinesh Joshi',
						'value' : 'dineshintown@gmail.com|Dinesh Joshi'
					}
				]
			},
			{
				'id' : 'interviewType',
				'label' : 'Select interview type',
				'type' : 'select',
				'options': [
					{
						'label' : 'Please select',
						'value' : ''
					},
					{
						'label' : 'Screening',
						'value' : 'Screening'
					},
					{
						'label' : 'Technical',
						'value' : 'Technical'
					},
					{
						'label' : 'Management',
						'value' : 'Management'
					}
				]
			}
		];
		this.dataStructure = {};
	}

	getCandidateDetails(){
		let that = this;
		$.ajax({
			url: "http://localhost:8082/getCandidateDetails/"+this.props.params.email,
			method: 'GET',
			dataType : 'JSON',
			success: function(result){				
	      		that.setState({userInfo:result});
	      	}
	    });
	}

	submitData(obj){
		let that = this,
			objToSend = {},
			interviewerEmail = obj.interviewer.substring(0,obj.interviewer.indexOf('|')),
			interviewerName = obj.interviewer.substring(obj.interviewer.indexOf('|')+1, obj.interviewer.length);
		
		objToSend = {
			interviewerEmail : interviewerEmail,
			interviewerName : interviewerName,
			interviewDate: obj.date,
			interviewType: obj.interviewType,
			recruiterName : this.state.userInfo.recruiterName,
			intervieweeFirstName: this.state.userInfo.firstName,
			intervieweeLastName : this.state.userInfo.lastName,
			intervieweeEmail : this.state.userInfo.email
		}

		$.ajax({
			url: "http://localhost:8082/schedule/"+this.props.params.email,
			method: 'post',
			dataType : 'JSON',
			data: objToSend,
			success: function(result){
				if(result.type === 'error'){
	      			that.messageProp.type = 'error';
	      		}else{
	      			that.messageProp.type = 'success';
	      		}
	      		that.messageProp.messageBody = result.message;
	      		that.setState({'message' : true});
	      		window.setTimeout(
	      			function(){
	      				that.setState({'message' : false});
	      				browserHistory.push('/');
	      			}, 5000
	      		);
	      	}
	    });
	}

	render(){

		let cssClassName = "alert alert-"+this.messageProp.type;

		return (
			<div className="container">
				<div className="row">
					<div className="span12 main-holder">

						{this.state.message === true ? 
							<div className={cssClassName}>
								{this.messageProp.messageBody}
							</div> : 
						null}

						<h3>Schedule interview for {this.state.userInfo.firstName} {this.state.userInfo.lastName}</h3>
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