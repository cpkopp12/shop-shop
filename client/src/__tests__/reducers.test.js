//DECLARATIONS: actions, reducers ----------
import { reducer } from '../utils/reducers';
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from '../utils/actions';

//create sample of what global state will look like
const initialState = {
    products: [],
    categories: [{ name: 'Food' }],
    currentCategory: '1',
};

test('UPDATE_PRODUCts', () => {
    let newState = reducer(initialState, {
        type: UPDATE_PRODUCTS,
        products: [{}, {}]
    });
    expect(newState.products.length).toBe(2);
    expect(initialState.products.length).toBe(0);
});
