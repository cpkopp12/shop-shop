//DECLARATIONS: actions, useReducer ----------------------------
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from '../utils/actions';
import { useReducer } from 'react';

//EXPORT: reducers ------------------------------------
export const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products]
            };

        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            }
        
        //if none of actions, return old state
        default:
            return state;

    }
};

export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
};
