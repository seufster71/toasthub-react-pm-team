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

export default function teamReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
    	case 'LOAD_INIT_PM_PERMISSION': {
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
    				orderCriteria: [{'orderColumn':'PM_PERMISSION_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'PM_PERMISSION_TABLE_NAME'}],
    				selected: null,
    				isModifyOpen: false
    			});
    		} else {
    			return state;
    		}
    	}
    	case 'LOAD_LIST_PM_PERMISSION': {
    		if (action.responseJson != null && action.responseJson.params != null) {
    			return Object.assign({}, state, {
    				itemCount: reducerUtils.getItemCount(action),
    				items: reducerUtils.getItems(action),
    				listLimit: reducerUtils.getListLimit(action),
    				listStart: reducerUtils.getListStart(action),
    				selected: null,
    				isModifyOpen: false
    			});
    		} else {
    			return state;
    		}
		}
    	case 'PM_PERMISSION_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.PM_PERMISSION_FORM,inputFields,action.appPrefs,"FORM1");
				
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					applicationSelectList : action.responseJson.params.applicationSelectList,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'PM_PERMISSION_INPUT_CHANGE': {
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
		case 'PM_PERMISSION_ADD_MEMBER': {
			if (action.user != null) {
				return Object.assign({}, state, {
					parent: action.user
				});
			} else {
		        return state;
		    }
		}
		case 'PM_PERMISSION_CLEAR_MEMBER': {
			return Object.assign({}, state, {
				parent: null
			});
		}
		case 'PM_PERMISSION_MEMBER_ROLE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.PM_PERMISSION_MEMBER_FORM,inputFields,action.appPrefs,"FORM1");
				
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
		case 'PM_PERMISSION_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PM_PERMISSION_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PM_PERMISSION_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
    	default:
    		return state;
	}
}
