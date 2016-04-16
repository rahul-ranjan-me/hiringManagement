import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import $ from 'jquery';

import Form from '../../components/form';


export default class CandidateList extends React.Component {
	constructor(props){
		super(props);
		this.getCandidateDetails();
		this.handleChange = this.handleChange.bind(this);
		this.submitData = this.submitData.bind(this);
		this.state = {
			tabsData : {},
			visibleTab: 'screening',
			message: false
		}
		this.metadata = {
			screening: [
				{
					'id' : 'screening_date',
					'label' : 'Date',
					'type' : 'text',
					'value': ''
				},
				{
					'id' : 'screening_feedback',
					'label' : 'Feedback',
					'type' : 'textarea',
					'value': ''
				}
			],
			management : [
				{
					'id' : 'management_date',
					'label' : 'Date',
					'type' : 'text',
					'value': ''
				},
				{
					'id' : 'management_feedback',
					'label' : 'Feedback',
					'type' : 'textarea',
					'value': ''
				}
			],
			technical: [
				{
					'id' : 'technical_date',
					'label' : 'Date',
					'type' : 'text',
					'value': ''
				},
				{
					'id' : 'technical_feedback',
					'label' : 'Feedback',
					'type' : 'textarea',
					'value': ''
				}
			]
		};

		this.dataStructureScreening = {
	        "screening_date" : "",
	        "screening_feedback" : ""
		}
		this.dataStructureTechnical = {
	        "technical_date" : "",
	        "technical_feedback" : ""
		}
		this.dataStructureManagement = {
	        "management_date" : "",
	        "management_feedback" : ""
		}
		this.messageProp = {};
	}

	getCandidateDetails(){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/getCandidateDetails/"+this.props.params.email,
			method: 'GET',
			dataType : 'JSON',
			success: function(result){
				let data = {
					screening : {
						label: 'Screening',
						date: result.screening.screening_date,
						feedback: result.screening.screening_feedback,
						name: result.firstName + ' '+result.lastName
					},
					management : {
						label: 'Management',
						date: result.management.management_date,
						feedback: result.management.management_feedback,
						name: result.firstName + ' '+result.lastName
					},
					technical : {
						label: 'Technical',
						date: result.technical.technical_date,
						feedback: result.technical.technical_feedback,
						name: result.firstName + ' '+result.lastName
					}
				}
	      		that.setState({tabsData:data});
	      	}
	    });
	}

	handleChange(tab){
		this.setState({'visibleTab':tab})
	}

	submitData(obj){

		let dataToPost = {
			nodeToUpdate : this.state.visibleTab,
			dataToUpdate : obj
		};
		const that = this;

		$.ajax({
			url: "http://localhost:8082/updateCandidateFeedback/"+this.props.params.email,
			method: 'post',
			dataType : 'JSON',
			data: dataToPost,
			success: function(result){
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
	}

	render(){

		let createTabs = (tab, key) => {
			return <Tab data={this.state.tabsData[tab]} tab={tab} key={key} visibleTab={this.state.visibleTab} onChange={this.handleChange} />
		},
		cssClassName = "alert alert-"+this.messageProp.type;

		return (
			<div className="container">
				<div className="row">
					<div className="span12 main-holder">
						{this.state.message === true ? 
							<div className={cssClassName}>
								{this.messageProp.messageBody}
							</div> : 
						null}

						<h3>Candidate's Feedback</h3>
						<ul className="nav nav-tabs">
							
							{Object.keys(this.state.tabsData).map(createTabs)}
							<li><Link to={`/candidate/`+this.props.params.email}>View Details</Link></li>
						</ul>
						
						<div className="tabs-container">
							{ this.state.visibleTab === 'screening' ? 
								<div>
									<h5>Screening feedback for <em>{this.state.tabsData.screening ? this.state.tabsData.screening.name : null}</em></h5>
									<Form 
										metadata={this.metadata.screening} 
										onSubmitData={this.submitData} 
										dataFormat = {this.dataStructureScreening} 
										cssClassName="form-horizontal" />
								</div>
								: null
							}

							{ this.state.visibleTab === 'management' ? 
								<div>
									<h5>Management feedback for <em>{this.state.tabsData.screening ? this.state.tabsData.screening.name : null}</em></h5>
									<Form 
										metadata={this.metadata.management} 
										onSubmitData={this.submitData} 
										dataFormat = {this.dataStructureManagement} 
										cssClassName="form-horizontal" /> 
								</div>
								: null
							}

							{ this.state.visibleTab === 'technical' ? 
								<div>
									<h5>Technical feedback for <em>{this.state.tabsData.screening ? this.state.tabsData.screening.name : null}</em></h5>
									<Form 
										metadata={this.metadata.technical} 
										onSubmitData={this.submitData} 
										dataFormat = {this.dataStructureTechnical} 
										cssClassName="form-horizontal" /> 
								</div>
								: null
							}
						</div>

					</div>
				</div>
			</div>
		);
	}
}

export class Tab extends Component{
	constructor(props){
		super(props);
		this.showTab = this.showTab.bind(this);
	}

	showTab(){
		this.props.onChange(this.props.tab)
	}

	render(){
		return(
			<li className={this.props.visibleTab === this.props.tab ? 'active' : null}><a href="#" onClick={this.showTab}>{this.props.data.label}</a></li>
		)
	}
}