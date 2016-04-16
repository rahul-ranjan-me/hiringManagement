import React, {Component} from 'react';
import _ from 'lodash';

export default class Header extends Component{
	constructor(props){
		super(props);
		this.onSort = this.onSort.bind(this);
		this.onRowSelected = this.onRowSelected.bind(this);
		this.state = {
			headers : this.props.headers,
			rows : this.props.rows,
			headersHash : {},
			sortedItem : null
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.rows !== this.state.rows){
			this.setState({
				rows : nextProps.rows
			})
		}
	}

	onSort(id, order){
		Object.keys(this.state.headers).map((header) => {
			if(header === id && !header.sorted){
				this.state.headers[header].sorted = true;
			}else{
				this.state.headers[header].sorted = null;
			}
		});

		this.setState(
			{
				"rows" : _.orderBy(this.state.rows, [id], [order]),
				"headers" : this.state.headers	
			}
		);
	}

	onRowSelected(obj){
		this.props.onSelected(obj);
	}

	render(){

		Object.keys(this.props.headers).map((header) => {
			let currentHeader = this.state.headers[header];
			this.state.headersHash[header] = {
				isHidden : !currentHeader.isHidden,
				width : currentHeader.width,
				format : currentHeader.format,
				indent : currentHeader.indent
			}
		});
		
		return (
			<div className="table" style={this.props.cssStyle}>
				{ this.props.headerHiddent ? null : 
					<TableHeading
						headers = {this.state.headers}
						onSort = {this.onSort}
						collapsible = {this.props.collapsible} />
				}

				<TableBody
					rows = {this.state.rows}
					collapsible = {this.props.collapsible}
					onSelected = {this.props.onSelected ? this.onRowSelected : null}
					headersHash = {this.state.headersHash} />
			</div>
		)
	}
}


export class TableHeading extends Component {
	constructor(props){
		super(props);
		this.sortTable = this.sortTable.bind(this);
	}

	sortTable(id, order){
		this.props.onSort(id, order);
	}

	render(){
		let createHeader = (header) => {
			let currentHeader = this.props.headers[header];
			return currentHeader.isHidden ?
				null : 
				<THs header = {currentHeader} key = {currentHeader.id} onSortTable = {this.sortTable} />
		};

		return(
			<ul className = "cols-heading">
				<li className="tableRow TableHeading">
					{this.props.collapsible ? <span className="cell"></span> : null }
					{Object.keys(this.props.headers).map(createHeader)}
				</li>
			</ul>
		)
	}
}


export class THs extends Component {
	constructor(props){
		super(props);
		this.sortTable = this.sortTable.bind(this);
		this.order = this.props.header.sorted ? 'desc' : null
	}

	componentWillMount(){
		if(this.order !== null){
			this.props.onSortTable(this.props.header.id, this.order);
		}
	}

	componentWillUpdated(){
		{this.props.header.sorted === null ? this.order = null : null}
	}

	sortTable(){
		this.order === 'asc' ? this.order = 'desc' : this.order = 'asc';
		this.props.onSortTable(this.props.header.id, this.order);
	}

	render(){
		return(
			<span className="cell" style={{width:this.props.header.width, textAlign:this.props.header.indent}}>
				{this.props.header.sort ?
					<span className={this.order === null?null:'sorted'}>
						<span onClick={this.sortTable} className={'sorting_'+this.order}>{this.props.header.label}</span>
					</span>
					:
					<span style={{width:this.props.header.width}}>
						<span>{this.props.header.label}</span>
					</span>
				}
			</span>
		)
	}
}


export class TableBody extends Component {
	constructor(props){
		super(props);
		this.onRowSelected = this.onRowSelected.bind(this);
	}

	onRowSelected(obj){
		this.props.onSelected(obj);
	}

	render(){
		let createTRs = (td, key) => {
			return <TRs
					key = {td._id}
					items = {td}
					collapsible = {this.props.collapsible}
					onSelected = {this.props.onSelected ? this.onRowSelected : null}
					headersHash = {this.props.headersHash} />;
		};

		return(
			<ul>{this.props.rows.map(createTRs)}</ul>
		)
	}
}

export class TRs extends Component {
	constructor(props){
		super(props);
		this.state = {
			items : this.props.items
		}
		this.toogleChildren = this.toogleChildren.bind(this);
		this.onRowSelected = this.onRowSelected.bind(this);
	}

	ComponentWillReceiveProps(nextProps){
		if(nextProps.items !== this.state.items){
			this.setState({
				items : nextProps.items
			});
		}
	}

	toogleChildren(){
		this.state.items.isChildrenVisible = !this.state.items.isChildrenVisible;
		this.setState({items : this.state.items});
	}

	onRowSelected(){
		this.props.onSelected(this.state.items);
	}

	render(){
		let createTDs = (obj) => {
			return (td, key) => {
				const currentCell = this.props.headersHash[td];
				return currentCell && currentCell.isHidden &&
				(td !== 'children' || td !== 'isVisible') ?

				<span
					className = "cell"
					key = {key}
					style = {{
						width: currentCell.width,
						textAlign : currentCell.indent
					}}>

				{currentCell.format ? currentCell.format(obj, obj[td]) : obj[td]} </span>

				:null;

			}
		};

		let createChildren = (node, key) => {
			return <li className="tableRow tableSubChildren" key={key}>
				<span className="cell"></span>
				{Object.keys(node).map(createTDs(node, true))}
			</li>
		}

		return (
			<li className = "tableRow tableChildren"
				onClick = {this.props.onSelected ? this.onRowSelected : null}
			>
				<div className="rowContainer withChildren" onClick={this.toogleChildren}>
					{this.props.collapsible ?
						this.state.items.children ?
							<span className = "cell toogleRow">
								<span className={this.state.items.isChildrenVisible ? 'glyphicon glyphicon-menu-right glyphicon-menu-right-show' : 'glyphicon glyphicon-menu-right'}></span>
							</span>
							: <span className="cell"></span>
						: null
					}

					{Object.keys(this.state.items).map(createTDs(this.state.items))}
				</div>
				<div className="rowContainer">
					{this.state.items.children && this.props.collapsible && this.state.items.isChildrenVisible ?
						<ul>
							{this.state.items.children.map(createChildren)}
						</ul> : null
					}
				</div>
			</li>
		)
	}

}