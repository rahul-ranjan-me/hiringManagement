import React, {Component} from 'react';
import ReactDom from 'react-dom';

export default class Form extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.sendData = this.sendData.bind(this);
		this.state = {
			metadata : this.props.metadata
		};
		this.valueToSend = this.props.dataFormat;
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.metadata !== this.state.metadata){
			this.setState({
				metadata : nextProps.metadata
			})
		}
	}

	sendData(event){
		event.preventDefault();
		this.props.onSubmitData(this.valueToSend);
	}

	handleChange(value, field){
		this.valueToSend[field.id] = value;
	}

	render(){
		
		let createForm = (fieldType, key) => {
			if(fieldType.type === 'text'){
				return <TypeText key={key} field = {fieldType} onChange={this.handleChange} />
			}else if(fieldType.type === 'password'){
				return <TypePassword key={key} field = {fieldType} onChange={this.handleChange}  />
			}else if(fieldType.type === 'textarea'){
				return <TypeTextarea key={key} field = {fieldType} onChange={this.handleChange}  />
			}else if(fieldType.type === 'select'){
				return <Select key={key} field = {fieldType} onChange={this.handleChange}  />
			}else if(fieldType.type === 'subForm'){
				return <Subform key={key} field = {fieldType} onChange={this.handleChange}  />
			}
		};

		return (
			<form className={this.props.cssClassName} onSubmit={this.sendData}>
				{this.state.metadata.map(createForm)}
				<div className="control-group">
					<div className="controls">
						<button type="submit" className="btn btn-default" onClick={this.sendData}>Submit</button>
					</div>
				</div>
			</form>
		)
		
	}
}

export class TypeText extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onChange(this.refs.textInput.value, this.props.field);
	}

	render(){
		return(
			<div className="control-group">
				<label className="control-label" htmlFor={this.props.field.id}>{this.props.field.label}</label>
				<div className="controls">
					<input 
						type="text" 
						id={this.props.field.id} 
						placeholder={this.props.field.placeholder ? this.props.field.placeholder:null} 
						ref="textInput"
						defaultValue={this.props.field.value ? this.props.field.value:undefined} 
						onChange={this.handleChange}
					/>
				</div>
			</div>
		)
	}
}

export class TypePassword extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onChange(this.refs.textPassword.value, this.props.field);
	}

	render(){
		return(
			<div className="control-group">
				<label className="control-label" htmlFor={this.props.field.id}>{this.props.field.label}</label>
				<div className="controls">
					<input 
						type="password" 
						id={this.props.field.id} 
						placeholder={this.props.field.placeholder ? this.props.field.placeholder:null} 
						ref="textPassword"
						defaultValue={this.props.field.value ? this.props.field.value:undefined} 
						onChange={this.handleChange}
					/>
				</div>
			</div>
		)
	}
}

export class TypeTextarea extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onChange(this.refs.textareaInput.value, this.props.field);
	}

	render(){
		return(
			<div className="control-group">
				<label className="control-label" htmlFor={this.props.field.id}>{this.props.field.label}</label>
				<div className="controls">
					<textarea 
						id={this.props.field.id}
						placeholder={this.props.field.placeholder ? this.props.field.placeholder:null}
						ref="textareaInput"
						defaultValue={this.props.field.value ? this.props.field.value:undefined}
						onChange={this.handleChange}
					>
					</textarea>
				</div>
			</div>
		)
	}
}

export class Select extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onChange(this.refs.selectInput.value, this.props.field);
	}

	render(){
		let createOption = (option, key) => {
			return <Options data={option} key={key} />
		};

		return(
			<div className="control-group">
				<label className="control-label" htmlFor={this.props.field.id}>{this.props.field.label}</label>
				<div className="controls">
					<select 
						id={this.props.field.id} 
						onChange={this.handleChange} 
						defaultValue={this.props.field.value ? this.props.field.value:undefined}
						ref="selectInput"
					>
						{this.props.field.options.map(createOption)}
					</select>
				</div>
			</div>
		)
	}
}

export class Options extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<option value={this.props.data.value}>{this.props.data.label}</option>
		)
	}
}

export class Subform extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.subFormArray = {};
	}

	handleChange(value, field){
		this.subFormArray[field.id] = value;
		this.props.onChange(this.subFormArray, this.props.field);
	}

	render(){

		let createForm = (fieldType, key) => {
			if(fieldType.type === 'text'){
				return <TypeText key={key} field = {fieldType} onChange={this.handleChange} />
			}else if(fieldType.type === 'textarea'){
				return <TypeTextarea key={key} field = {fieldType} onChange={this.handleChange}  />
			}else if(fieldType.type === 'select'){
				return <Select key={key} field = {fieldType} onChange={this.handleChange}  />
			}else if(fieldType.type === 'subForm'){
				return <Subform key={key} field = {fieldType} onChange={this.handleChange}  />
			}
		};

		return(
			<div>
				<h5>{this.props.field.label}</h5>
				<div className="nestedForm">
					{this.props.field.formField.map(createForm)}				
				</div>
			</div>
		)
	}
}