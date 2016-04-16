import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Listing from './listing';


export default class CandidateList extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<Listing />
		);
	}
}