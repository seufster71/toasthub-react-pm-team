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
import * as roleActions from './role-actions';
import fuLogger from '../../core/common/fu-logger';
import PMRoleView from '../../memberView/pm_team/role-view';
import PMRoleModifyView from '../../memberView/pm_team/role-modify-view';
import PMMemberRolesModifyView from '../../memberView/pm_team/member-roles-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';


class PMRoleContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent,this.props.history.location.state.team);
		} else {
			this.props.actions.init();
		}
	}
	
	getState = () => {
		return this.props.pmrole;
	}
	
	getForm = () => {
		return "PM_ROLE_FORM";
	}
	
	addPermissions = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onModifyPermissions',msg:"test"+item.id});
		this.props.history.push({pathname:'/pm-permission',state:{parent:item}});
	}

	onMemberRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onMemberRoleModify',msg:"test"+item.id});
		if (item.memberRole != null) {
			this.props.actions.modifyMemberRole({role:item,appPrefs:this.props.appPrefs});
		} else {
			this.props.actions.modifyMemberRole({role:item,appPrefs:this.props.appPrefs});
		}
	}
	
	onMemberRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onMemberRoleSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmrole.prefForms.PM_MEMBER_ROLE_FORM,this.props.pmrole.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['PM_ROLE_SEARCH_input'],'searchColumn':'PM_ROLE_TABLE_NAME'};
			this.props.actions.saveMemberRole({state:this.props.pmrole});
		} else {
			this.props.actions.setErrors({errors:errors.errorMap});
		}
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'MODIFY_MEMBER_ROLE': {
				this.onMemberRoleModify(item);
				break;
			}
			case 'PERMISSIONS': {
				this.addPermissions(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'PMRoleContainer::render',msg:"Hi there"});
		if (this.props.pmrole.isModifyOpen) {
			return (
				<PMRoleModifyView
				itemState={this.props.pmrole}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmrole.isMemberRoleOpen) {
			return (
				<PMMemberRolesModifyView
				itemState={this.props.pmrole}
				appPrefs={this.props.appPrefs}
				onSave={this.onMemberRoleSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmrole.items != null) {
			return (
				<PMRoleView 
				itemState={this.props.pmrole}
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

PMRoleContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	pmrole: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmrole:state.pmrole, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(roleActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMRoleContainer);
