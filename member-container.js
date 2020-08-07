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
import * as memberActions from './member-actions';
import fuLogger from '../../core/common/fu-logger';
import PMMemberView from '../../memberView/pm_team/member-view';
import PMMemberModifyView from '../../memberView/pm_team/member-modify-view';
import utils from '../../core/common/utils';


class PMMemberContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"PM_MEMBER",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent);
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
		this.props.actions.listLimit({state:this.props.pmmember,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.pmmember.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["PM_MEMBER_PAGINATION"] != null && this.state["PM_MEMBER_PAGINATION"] != ""){
			oldValue = this.state["PM_MEMBER_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.pmmember.listLimit);
		this.setState({"PM_MEMBER_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.pmmember,listStart});
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
		if (fieldName === 'PM_MEMBER-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['PM_MEMBER-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.pmmember.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['PM_MEMBER-SEARCH'];
				option.searchColumn = this.props.pmmember.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.pmmember,searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onOrderBy',msg:"id " + selectedOption});
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
			let option = {orderColumn:"PM_MEMBER_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.pmmember,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmmember.prefForms.PM_MEMBER_FORM, this.props.pmmember.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.save({state:this.props.pmmember});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onModify',msg:"item id "+id});
		this.props.actions.modifyItem({id,appPrefs:this.props.appPrefs});
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onDelete',msg:"test"+item.id});
		this.setState({isDeleteModalOpen:false});
		this.props.actions.deleteItem({state:this.props.pmmember,id:item.id});
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.pmmember});
	}
	
	inputChange = (type,field,value,event) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::inputChange',msg:"test"});
		utils.inputChange({type,props:this.props,field,value,event});
		let val = "";
		if (this.props.codeType === 'NATIVE') {
			val = event.nativeEvent.text;
		} else {
			if (event != null) {
				if (event.target != null) {
					val = event.target.value;
				} else {
					val = event;
				}
			} else {
				val = value;
			}
		}
		if (type === "SELECT") {
			this.props.actions.selectListUpdate({field,"value":val});
		}
	}

	addRole = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onAddRole',msg:"test"+item.id});
		this.props.history.push({pathname:'/pm-role',state:{parent:item,team:this.props.pmmember.parent}});
	}
	
	onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmmember.prefForms.ADMIN_USER_ROLE_FORM,this.props.pmmember.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['PM_MEMBER_SEARCH_input'],'searchColumn':'PM_MEMBER_TABLE_NAME'};
			this.props.actions.saveRolePermission({state:this.props.pmmember});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	goBack = () => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::goBack',msg:"test"});
		this.props.history.goBack();
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onOption',msg:" code "+code});
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
			case 'ROLES': {
				this.addRole(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::render',msg:"Hi there"});
		if (this.props.pmmember.isModifyOpen) {
			return (
				<PMMemberModifyView
				containerState={this.state}
				itemState={this.props.pmmember}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmmember.items != null) {
			return (
				<PMMemberView 
				containerState={this.state}
				itemState={this.props.pmmember}
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

PMMemberContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	pmmember: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmmember:state.pmmember, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(memberActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMMemberContainer);
