import React, {Component} from 'react';
import ReactDom from 'react-dom';

import Form from './form'

export default class Search extends Component{
	constructor(props){
		super(props);
		this.dataStructure = {};
		this.submitData = this.submitData.bind(this);
	}

	submitData(obj){
		this.props.onSearch(obj);
	}
	
	render(){

		return (
			<Form metadata = {this.props.config} onSubmitData={this.submitData} dataFormat = {this.dataStructure} cssClassName="form-inline search-candidates-form" />
		)
		
	}
}