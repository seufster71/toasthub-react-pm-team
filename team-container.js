/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as teamActions from './team-actions';
import fuLogger from '../../core/common/fu-logger';
import PMTeamView from '../../memberView/pm_team/team-view';
import PMTeamModifyView from '../../memberView/pm_team/team-modify-view';
import PMTeamLinkModifyView from '../../memberView/pm_team/team-link-modify-view';
import utils from '../../core/common/utils';


class PMTeamContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"PM_TEAM",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent,this.props.history.location.state.parentType);
		} else {
			this.props.actions.init();
		}
	}

	onListLimitChange = (fieldName, event) => {
		let value = 20;
		if (this.props.codeType === 'NATIVE') {
			value = event.nativeEvent.text;
		} else {
			value = event.target.value;
		}

		let listLimit = parseInt(value);
		this.props.actions.listLimit({state:this.props.pmteam,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.pmteam.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["PM_TEAM_PAGINATION"] != null && this.state["PM_TEAM_PAGINATION"] != ""){
			oldValue = this.state["PM_TEAM_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.pmteam.listLimit);
		this.setState({"PM_TEAM_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.pmteam,listStart});
	}

	onSearchChange = (fieldName, event) => {
		if (event.type === 'keypress') {
			if (event.key === 'Enter') {
				this.onSearchClick(fieldName,event);
			}
		} else {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		}
	}

	onSearchClick = (fieldName, event) => {
		let searchCriteria = [];
		if (fieldName === 'PM_TEAM-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['PM_TEAM-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.pmteam.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['PM_TEAM-SEARCH'];
				option.searchColumn = this.props.pmteam.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.pmteam,searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onOrderBy',msg:"id " + selectedOption});
		let orderCriteria = [];
		if (event != null) {
			for (let o = 0; o < event.length; o++) {
				let option = {};
				if (event[o].label.includes("ASC")) {
					option.orderColumn = event[o].value;
					option.orderDir = "ASC";
				} else if (event[o].label.includes("DESC")){
					option.orderColumn = event[o].value;
					option.orderDir = "DESC";
				} else {
					option.orderColumn = event[o].value;
				}
				orderCriteria.push(option);
			}
		} else {
			let option = {orderColumn:"PM_TEAM_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.pmteam,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmteam.prefForms.PM_TEAM_FORM, this.props.pmteam.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.save({state:this.props.pmteam});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onModify',msg:"item id "+id});
		this.props.actions.modifyItem({id,appPrefs:this.props.appPrefs});
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onDelete',msg:"test"+item.id});
		this.setState({isDeleteModalOpen:false});
		this.props.actions.deleteItem({state:this.props.pmteam,id:item.id});
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	addMember = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onModifyPermissions',msg:"test"+item.id});
		this.props.history.push({pathname:'/pm-member',state:{parent:item}});
	}
	
	onTeamLinkModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onTeamLinkModify',msg:"test"+item.id});
		if (item.productTeam != null) {
			this.props.actions.modifyTeamLink({item,parentType:this.props.pmteam.parentType,appPrefs:this.props.appPrefs});
		} else {
			this.props.actions.modifyTeamLink({item,parentType:this.props.pmteam.parentType,appPrefs:this.props.appPrefs});
		}
	}
	
	onTeamLinkSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onTeamLinkSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmteam.prefForms.PM_TEAM_PRODUCT_FORM,this.props.pmteam.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['PM_TEAM_SEARCH_input'],'searchColumn':'PM_TEAM_TABLE_NAME'};
			this.props.actions.saveTeamLink({state:this.props.pmteam});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.pmteam});
	}
	
	inputChange = (type,field,value,event) => {
		utils.inputChange({type,props:this.props,field,value,event});
	}
	
	goBack = () => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::goBack',msg:"test"});
		this.props.history.goBack();
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onOption',msg:" code "+code});
		switch(code) {
			case 'MODIFY': {
				this.onModify(item);
				break;
			}
			case 'DELETE': {
				this.openDeleteModal(item);
				break;
			}
			case 'DELETEFINAL': {
				this.onDelete(item);
				break;
			}
			case 'MEMBERS': {
				this.addMember(item);
				break;
			}
			case 'MODIFY_LINK': {
				this.onTeamLinkModify(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::render',msg:"Hi there"});
		if (this.props.pmteam.isModifyOpen) {
			return (
				<PMTeamModifyView
				containerState={this.state}
				item={this.props.pmteam.selected}
				inputFields={this.props.pmteam.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.pmteam.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmteam.isTeamLinkOpen) {
			return (
				<PMTeamLinkModifyView
				containerState={this.state}
				itemState={this.props.pmteam}
				appPrefs={this.props.appPrefs}
				onSave={this.onTeamLinkSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmteam.items != null) {
			return (
				<PMTeamView 
				containerState={this.state}
				itemState={this.props.pmteam}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				goBack={this.goBack}
				session={this.props.session}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
 	}
}

PMTeamContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	pmteam: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmteam:state.pmteam, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(teamActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMTeamContainer);
