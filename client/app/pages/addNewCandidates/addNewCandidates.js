import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import { Link } from 'react-router';

import metadata from './newCandidatesConfig.js';
import Form from '../../components/form';

export default class AddNewCandidates extends Component{
	constructor(props){
		super(props);
		this.submitData = this.submitData.bind(this);
		this.state = {
			metadata : [],
			message:false,
			email:''
		}
		this.dataStructure = {
		    "firstName" : "",
		    "lastName" : "",
		    "skill" : "",
		    "position" : "",
		    "email" : "",
		    "mobile" : "",
		    "status" : "",
		    "dob" : "",
		    "recruiterName":"",
		    "screening" : {
		        "screening_date" : "",
		        "screening_feedback" : ""
		    },
		    "technical" : {
		        "technical_date" : "",
		        "technical_feedback" : ""
		    },
		    "management" : {
		        "management_date" : "",
		        "management_feedback" : ""
		    }
		}
		this.messageProp = {};
	}

	componentDidMount(){
		this.setState({metadata:metadata})
	}

	submitData(data){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/addCandidates",
			method: 'post',
			data :data,
			dataType : 'JSON',
			success: function(result){
				window.scrollTo(0, 0);
	      		if(result.type === 'error'){
	      			that.messageProp.type = 'error';
	      		}else{
	      			that.messageProp.type = 'success';
	      		}
	      		that.messageProp.messageBody = result.message;
	      		that.setState({'message' : true, email: data.email});
	      	}
	    });

	    $.ajax({
			url: "http://localhost:8082/addRecruiter",
			method: 'post',
			data :{recruiterName: data.recruiterName},
			dataType : 'JSON',
			success: function(result){
	      		
	    	}
	    });
	}

	render(){
		let cssClassName = "alert alert-"+this.messageProp.type;
		return(
			<div className="container">
				<div className="row">
					<div className="span12 main-holder">

						{this.state.message === true ? 
							<div className={cssClassName}>
								{this.messageProp.messageBody}
							</div> : 
						null}

						{this.messageProp.type === 'success' ? 
							<p>Want to <Link to={`/schedule/`+this.state.email}>schedule an interview</Link> with the candidate or go back to listing by <Link to={`/`}>clicking here</Link>.</p> : 
						null}


						<h3>Add new candidates</h3>

						<Form metadata = {this.state.metadata} onSubmitData={this.submitData} dataFormat = {this.dataStructure} cssClassName="form-horizontal column2" />

					</div>
				</div>
			</div>
		)
	}
}