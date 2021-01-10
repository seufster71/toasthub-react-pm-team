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
import PMRolePermissionModifyView from '../../memberView/pm_team/role-permission-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';


class PMPermissionContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent);
		} else {
			this.props.actions.init();
		}
	}
	
	getState = () => {
		return this.props.pmpermission;
	}
	
	getForm = () => {
		return "PM_PERMISSION_FORM";
	}

	onRolePermissionModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onRolePermissionModify',msg:"test"+item.id});
		if (item.rolePermission != null) {
			this.props.actions.modifyRolePermission({permission:item,appPrefs:this.props.appPrefs});
		} else {
			this.props.actions.modifyRolePermission({permission:item,appPrefs:this.props.appPrefs});
		}
	}
	
	onRolePermissionSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onRolePermissionSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmpermission.prefForms.PM_ROLE_PERMISSION_FORM,this.props.pmpermission.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.saveRolePermission({state:this.props.pmpermission});
		} else {
			this.props.actions.setErrros({errors:errors.errorMap});
		}
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'MODIFY_ROLE_PERMISSION': {
				this.onRolePermissionModify(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'PMPermissionContainer::render',msg:"Hi there"});
		if (this.props.pmpermission.isModifyOpen) {
			return (
				<PMPermissionModifyView
				itemState={this.props.pmpermission}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmpermission.isRolePermissionOpen) {
			return (
				<PMRolePermissionModifyView
				itemState={this.props.pmpermission}
				appPrefs={this.props.appPrefs}
				onSave={this.onRolePermissionSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmpermission.items != null) {
			return (
				<PMPermissionView 
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
	pmpermission: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmpermission:state.pmpermission, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(permissionActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMPermissionContainer);
