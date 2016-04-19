import React, {Component} from 'react';
import reactDOM from 'react-dom';
import $ from 'jquery';
import { browserHistory } from 'react-router';

import Grid from '../../components/grid';
import {headers} from './listConfig';
import searchConfig from './searchConfig'
import Search from '../../components/search';

export default class Layout extends Component{
	constructor(props){
		super(props);
		this.getCandidateRecords();
		this.onSelected = this.onSelected.bind(this);
		this.searchCandidate = this.searchCandidate.bind(this);
		this.pullSearch = this.pullSearch.bind(this);
		this.state = {
			candidateList : [],
			showSearch : false
		}
	}

	getCandidateRecords(){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/getAllCandidates", 
			success: function(result){
				if(result.type === 'notLoggedIn'){
					browserHistory.push('/login');
				}else{
	      			that.setState({candidateList: result})
	      		}
	    	}
	    });
	}

	onSelected(obj){
		browserHistory.push('/candidate/'+obj.email);
	}

	searchCandidate(data){
		var that = this;
		$.ajax({
			url: "http://localhost:8082/searchCandidate",
			method: 'post',
			data :data,
			dataType : 'JSON',
			success: function(result){
	      		that.setState({candidateList: result})
	    	}
	    });
	}

	pullSearch(){
		this.setState({showSearch:!this.state.showSearch});
		if(!this.state.showSearch){
			window.scrollTo(0,140);
		}
	}

	render(){
		let searchClassName = "container search"+this.state.showSearch;
		let iconClassName = "icon-white icon-arrow-down";
		if(this.state.showSearch){
			iconClassName = "icon-white icon-arrow-up";
		}else{
			iconClassName = "icon-white icon-arrow-down";
		}

		return (
			<div>

				<div className={searchClassName}>
					<div >
						<span className="search-button pull-right" onClick={this.pullSearch}><i className={iconClassName}></i> Search <i className={iconClassName}></i></span>
						{this.state.showSearch ? 
							<div className="main-holder search-candidates">
								<Search config= {searchConfig} onSearch={this.searchCandidate} />
							</div>
						: null }
					</div>
				</div>

				<div className="container">
					<div>
	     				<div className="main-holder">
	     					<h3>Candidates List</h3>
							<Grid 
								headers = {headers}
								rows = {this.state.candidateList}
								collapsible = {false}
								cssStyle = {{width: "100%"}}
								onSelected = {this.onSelected}
							/>
						</div>
			      	</div>
		    	</div>
		    </div>					      		
		)
	}
}