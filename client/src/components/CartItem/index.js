//DECLARATIONS: REACT ---------------------------
import React from 'react';
// import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../reducers/actions';
import { idbPromise } from '../../utils/helpers';
//redux imports
import { connect } from 'react-redux';

//CARTITEM COMPONENT ==============================
const CartItem = (props) => {
    console.log(props);
    // const [, dispatch] = useStoreContext();

    const removeFromCart = (item) => {
        props.removeFromCart(item._id);
        // dispatch({
        //     type: REMOVE_FROM_CART,
        //     _id: item._id
        // });
        idbPromise('cart', 'delete', { ...item });
    }

    const onChange = (e) => {
        
        const value = e.target.value;

        if (value === '0') {
            props.removeFromCart(props.item._id);
            // dispatch({
            //     type: REMOVE_FROM_CART,
            //     _id: item._id
            // });

            idbPromise('cart', 'delete', { ...props.item });
        } else {
            props.updateCartQuantity(props.item._id, value);
            // dispatch({
            //     type: UPDATE_CART_QUANTITY,
            //     _id: item._id,
            //     purchasedQuantity: parseInt(value)
            // });

            idbPromise('cart', 'put', { ...props.item, purchaseQuantity: parseInt(value) });
        }

    }

    return (
        <div className='flex-row'>
            <div>
                <img 
                    src={`/images/${props.item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{props.item.name}, ${props.item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input
                        type="number"
                        placeholder="1"
                        value={props.item.purchaseQuantity}
                        onChange={onChange}
                    />
                    <span
                        role="img"
                        aria-label="trash"
                        onClick={() => removeFromCart(props.item)}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
};



const mapDispatchToProps = (dispatch) => {
    return {
        removeFromCart: (id) => {
            dispatch({type: REMOVE_FROM_CART, _id: id})
        },
        updateCartQuantity: (id, quantity) => {
            dispatch({type: UPDATE_CART_QUANTITY, _id: id, purchaseQuantity: parseInt(quantity) })
        }
    }

};

//EXPORT -------------------
export default connect(mapDispatchToProps)(CartItem);