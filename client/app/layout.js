import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Header from './structure/header';
import TopNav from './structure/topNav';

export default class Layout extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<TopNav />
				<Header />
				{this.props.children}
			</div>
		);
	}
}