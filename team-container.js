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
import BaseContainer from '../../core/container/base-container';


class PMTeamContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent,this.props.history.location.state.parentType);
		} else {
			this.props.actions.init();
		}
	}
	
	getState = () => {
		return this.props.pmteam;
	}
	
	getForm = () => {
		return "PM_TEAM_FORM";
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
			this.props.actions.saveTeamLink({state:this.props.pmteam});
		} else {
			this.props.actions.setErrors({errors:errors.errorMap});
		}
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PMTeamContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
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
				itemState={this.props.pmteam}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmteam.isTeamLinkOpen) {
			return (
				<PMTeamLinkModifyView
				itemState={this.props.pmteam}
				appPrefs={this.props.appPrefs}
				onSave={this.onTeamLinkSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.pmteam.items != null) {
			return (
				<PMTeamView 
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
	pmteam: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, pmteam:state.pmteam, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(teamActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PMTeamContainer);
