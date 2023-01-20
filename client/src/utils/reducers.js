//DECLARATIONS: actions ----------------------------
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from '../utils/actions';

//EXPORT: reducers ------------------------------------
export const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };
        
        //if none of actions, return old state
        default:
            return state;

    }
};
