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
import reducerUtils from '../../core/common/reducer-utils';

export default function memberReducer(state = {}, action) {
	switch(action.type) {
    	case 'LOAD_INIT_PM_MEMBER': {
    		if (action.responseJson != null && action.responseJson.params != null) {
    			return Object.assign({}, state, {
    				prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
    				prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
    				prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
    				columns: reducerUtils.getColumns(action),
    				itemCount: reducerUtils.getItemCount(action),
    				items: reducerUtils.getItems(action),
    				listLimit: reducerUtils.getListLimit(action),
    				listStart: reducerUtils.getListStart(action),
    				orderCriteria: [{'orderColumn':'PM_MEMBER_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'PM_MEMBER_TABLE_NAME'}],
    				paginationSegment: 1,
    				selected: null,
    				isModifyOpen: false,
    				isSelectListOpen: false,
    				pageName:"MEMBER",
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null,
					searchValue:""
    			});
    		} else {
    			return state;
    		}
    	}
    	case 'LOAD_LIST_PM_MEMBER': {
    		if (action.responseJson != null && action.responseJson.params != null) {
    			return Object.assign({}, state, {
    				itemCount: reducerUtils.getItemCount(action),
    				items: reducerUtils.getItems(action),
    				listLimit: reducerUtils.getListLimit(action),
    				listStart: reducerUtils.getListStart(action),
    				paginationSegment: action.paginationSegment,
    				selected: null,
    				isModifyOpen: false,
    				isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null
    			});
    		} else {
    			return state;
    		}
		}
    	case 'PM_MEMBER_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.PM_MEMBER_FORM,inputFields,action.appPrefs,"FORM1");
				
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true,
					isSelectListOpen: false
				});
			} else {
				return state;
			}
		}
		case 'PM_MEMBER_INPUT_CHANGE': {
			if (action.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields[action.params.field] = action.params.value;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
		        return state;
		    }
		}
		case 'PM_MEMBER_SELECT_CHANGE': {
			if (action.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields[action.params.field.name] = action.params.value;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
		        return state;
		    }
		}
		case 'PM_MEMBER_SELECT_CLICK': {
			if (action.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields[action.params.field.name] = action.params.value;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				clone.isSelectListOpen = false;
				return clone;
			} else {
		        return state;
		    }
		}
		case 'PM_MEMBER_SELECT_LIST': {
			let list = [];
			if (action.responseJson.params.items != null) {
				let items = action.responseJson.params.items;
				for (let i = 0; i < items.length; i++) {
					let extra = items[i].firstname + " " + items[i].middlename + " " + items[i].lastname;
					list.push({"label":items[i].username,"value":items[i].id, "extra":extra});
				}
			}
			return Object.assign({}, state, {
				selectList: list,
				isSelectListOpen: true
			});
		}
		case 'PM_MEMBER_ADD_PARENT': {
			if (action.parent != null) {
				return Object.assign({}, state, {
					parent: action.parent
				});
			} else {
		        return state;
		    }
		}
		case 'PM_MEMBER_CLEAR_PARENT': {
			return Object.assign({}, state, {
				parent: null
			});
		}
		case 'PM_MEMBER_MEMBER_ROLE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.PM_MEMBER_FORM,inputFields,action.appPrefs,"FORM1");
				
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				} else {
					action.responseJson.params.item = {roleId:action.responseJson.params.roleId};
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isUserRoleOpen: true
				});
			} else {
				return state;
			}
		}
		case 'PM_MEMBER_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PM_MEMBER_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PM_MEMBER_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'PM_MEMBER_SET_ERRORS': {
			return Object.assign({}, state, {
				errors: action.errors
			});
		}
		case 'PM_MEMBER_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'PM_MEMBER_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
    	default:
    		return state;
	}
}
