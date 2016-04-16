import React, {Component} from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import { browserHistory } from 'react-router';

import candidateConfig from './candidatesConfig.js';
import Form from '../../components/form';

export default class ShowCandidate extends React.Component {
	constructor(props){
		super(props);
		this.getCandidateDetails();
		this.submitData = this.submitData.bind(this);
		this.makeAction = this.makeAction.bind(this);
		this.dataStructure = {};
		this.state = {
			message: false,
			userInfo:[],
			visibleTab : 'viewDetails',
			candidateDetail: {}
		}
		this.messageProp = {};
		this.buildTabConfig = [
			{
				id: 'viewDetails',
				label: 'View Details'
			},
			{
				id: 'editDetails',
				label: 'Edit Details'
			},
			{
				id: 'provideFeedback',
				label: 'Provide Feedback'
			},
			{
				id: 'scheduleInterview',
				label: 'Schedule Interview'
			}
		];
	}

	makeAction(id){
		if(id === 'provideFeedback'){
			browserHistory.push('/feedback/'+this.props.params.email);
		}else if(id === 'scheduleInterview'){
			browserHistory.push('/schedule/'+this.props.params.email);
		}else{
			this.setState({visibleTab : id });
		}
	}

	buildCandidateConfig(result, context){
		for(var i in candidateConfig){
			if(candidateConfig[i].type !== 'subForm'){
				candidateConfig[i].value = result[candidateConfig[i].id]
			}else{
				candidateConfig[i].formField[0].value = result[candidateConfig[i].id][candidateConfig[i].id+'_date'];
				candidateConfig[i].formField[1].value = result[candidateConfig[i].id][candidateConfig[i].id+'_feedback'];
			}
		}
		this.setState({userInfo:candidateConfig})
	}

	getCandidateDetails(){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/getCandidateDetails/"+this.props.params.email,
			method: 'GET',
			dataType : 'JSON',
			success: function(result){	
				that.setState({candidateDetail: result});
				that.buildCandidateConfig(result, that);
	      	}
	    });
	}

	submitData(data){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/updateCandidate/"+this.props.params.email,
			method: 'post',
			data :data,
			dataType : 'JSON',
			success: function(result){
				console.log(result)
	      		window.scrollTo(0, 0);
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
	      			}, 5000
	      		);
	    	}
	    });

		if(data.recruiterName){
		    $.ajax({
				url: "http://localhost:8082/addRecruiter",
				method: 'post',
				data :{recruiterName: data.recruiterName},
				dataType : 'JSON',
				success: function(result){
		      		
		    	}
		    });
		}
	}

	render(){
		let cssClassName = "alert alert-"+this.messageProp.type, 
		createLi = (li) => {
			if(li.type === 'subForm'){
				return <li key={li.id}><label>{li.label}</label> <span>( {li.formField[0].value} ) {li.formField[1].value}</span></li>;
			}else{
				return <li key={li.id}><label>{li.label}</label> <span>{li.value}</span></li>;
			}
		},
		createTabs = (tab) => {
			return <LinkTab details={tab} key={tab.id} onTabClick={this.makeAction} activeTab={this.state.visibleTab} />;
		};


		return (
			<div className="container">
				<div className="row">
					<div className="span12 main-holder">
						{this.state.message === true ? 
							<div className={cssClassName}>
								{this.messageProp.messageBody}
							</div> : 
						null}

						<h3>{this.state.candidateDetail.firstName} {this.state.candidateDetail.lastName}'s details</h3>

						<ul className="nav nav-tabs">
							{this.buildTabConfig.map(createTabs)}
						</ul>



						{this.state.visibleTab === 'editDetails' ? 
							<div>
								<h3>View candidates</h3>
								<Form 
									metadata = {candidateConfig} 
									onSubmitData={this.submitData} 
									dataFormat = {this.dataStructure} 
									cssClassName="form-horizontal column2 edit-candidate" />
							</div>
						:
							<ul className="view-candidate">
								{this.state.userInfo.map(createLi)}
							</ul>
						}

					</div>
				</div>
			</div>
		);
	}
}

export class LinkTab extends Component{
	constructor(props){
		super(props);
		this.tabClick = this.tabClick.bind(this);
	}

	tabClick(){
		this.props.onTabClick(this.props.details.id);
	}

	render(){
		return(
			<li className={this.props.details.id === this.props.activeTab ? 'active' : null}><a href="#" onClick={this.tabClick}>{this.props.details.label}</a></li>
		)
	}
} 