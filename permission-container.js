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
import * as permissionActions from './permission-actions';
import fuLogger from '../../core/common/fu-logger';
import PMPermissionView from '../../memberView/pm_team/permission-view';
import PMPermissionModifyView from '../../memberView/pm_team/permission-modify-view';
import utils from '../../core/common/utils';


class PMPermissionContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"PM_PERMISSION",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
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
		this.props.actions.listLimit({state:this.props.pmpermission,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.pmpermission.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["PM_PERMISSION_PAGINATION"] != null && this.state["PM_PERMISSION_PAGINATION"] != ""){
			oldValue = this.state["PM_PERMISSION_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.pmpermission.listLimit);
		this.setState({"PM_PERMISSION_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.pmpermission,listStart});
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
		if (fieldName === 'PM_PERMISSION-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['PM_PERMISSION-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.pmpermission.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['PM_PERMISSION-SEARCH'];
				option.searchColumn = this.props.pmpermission.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.pmpermission,searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onOrderBy',msg:"id " + selectedOption});
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
			let option = {orderColumn:"PM_PERMISSION_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.pmpermission,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmpermission.prefForms.PM_PERMISSION_FORM, this.props.pmpermission.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.save({state:this.props.pmpermission});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onModify',msg:"item id "+id});
		this.props.actions.modifyItem({id,appPrefs:this.props.appPrefs});
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onDelete',msg:"test"+item.id});
		this.setState({isDeleteModalOpen:false});
		this.props.actions.deleteItem({state:this.props.pmpermission,id:item.id});
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	onModifyPermissions = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onModifyPermissions',msg:"test"+item.id});
		this.props.history.push({pathname:'/admin-permissions',state:{parent:item}});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.pmpermission});
	}
	
	inputChange = (fieldName,switchValue,event) => {
		let value = "";
		if (switchValue === "DATE") {
			value = event.toISOString();
		} else {
			value = switchValue;
		}
		utils.inputChange(this.props,fieldName,value);
	}

	onUserRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onUserRoleModify',msg:"test"+item.id});
		if (item.userRole != null) {
			this.props.actions.modifyUserRole({userRoleId:item.userRole.id,roleId:item.id,appPrefs:this.props.appPrefs});
		} else {
			this.props.actions.modifyUserRole({roleId:item.id,appPrefs:this.props.appPrefs});
		}
	}
	
	onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmpermission.prefForms.ADMIN_USER_ROLE_FORM,this.props.pmpermission.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['PM_PERMISSION_SEARCH_input'],'searchColumn':'PM_PERMISSION_TABLE_NAME'};
			this.props.actions.saveRolePermission({state:this.props.pmpermission});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	goBack = () => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::goBack',msg:"test"});
		this.props.history.goBack();
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onOption',msg:" code "+code});
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
			case 'MODIFY_USER_ROLE': {
				this.onUserRoleModify(item);
				break;
			}
			case 'MODIFY_PERMISSION': {
				this.onModifyPermissions(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::render',msg:"Hi there"});
		if (this.props.pmpermission.isModifyOpen) {
			return (
				<PMPermissionModifyView
				containerState={this.state}
				item={this.props.pmpermission.selected}
				inputFields={this.props.pmpermission.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.pmpermission.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				applicationSelectList={this.props.pmpermission.applicationSelectList}/>
			);
		} else if (this.props.pmpermission.items != null) {
			return (
				<PMPermissionView 
				containerState={this.state}
				itemState={this.props.pmpermission}
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

PMPermissionContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	pmpermission: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmpermission:state.pmpermission, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(teamActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMPermissionContainer);
