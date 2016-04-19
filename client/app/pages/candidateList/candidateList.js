import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Listing from './listing';

import loginStatus from '../login/loginStatus';

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