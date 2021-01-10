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
import BaseContainer from '../../core/container/base-container';


class PMMemberContainer extends BaseContainer {
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
		return this.props.pmmember;
	}
	
	getForm = () => {
		return "PM_MEMBER_FORM";
	}
	
	addRole = (item) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onAddRole',msg:"test"+item.id});
		this.props.history.push({pathname:'/pm-role',state:{parent:item,team:this.props.pmmember.parent}});
	}
	
	onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.pmmember.prefForms.ADMIN_USER_ROLE_FORM,this.props.pmmember.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.saveRolePermission({state:this.props.pmmember});
		} else {
			this.props.actions.setErrors({errors:errors.errorMap});
		}
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMMemberContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
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
				itemState={this.props.pmmember}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmmember.items != null) {
			return (
				<PMMemberView 
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
	pmmember: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmmember:state.pmmember, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(memberActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMMemberContainer);
