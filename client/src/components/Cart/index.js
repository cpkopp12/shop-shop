//DECLARATIONS: react, cartItem, auth, css, global state, 
// query_checkout, stripe, toggle cart action, lazy query-----------------------
import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
// import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../reducers/actions';
import { idbPromise } from '../../utils/helpers';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { connect } from 'react-redux';
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');


//CArt COMPONENT ============================
const Cart = (props) => {
    // const [state, dispatch] = useStoreContext();
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            props.addMultipleToCart(cart)
            // dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] })
        };

        if (!props.currentCart.length) {
            getCart();
        }
    }, [props.currentCart.length, props]);

    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session })
            });
        }
    }, [data])

    function toggleCart() {
        props.toggleCartWindow();
        // dispatch({ type: TOGGLE_CART })
    };

    function claculateTotal() {
        let sum = 0;
        props.currentCart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    };

    function submitCheckout() {
        const productIds = [];
        //array of ids for query
        props.currentCart.forEach((item) => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id);
            }
        });
        //run query
        getCheckout({
            variables: { products: productIds }
        });
    };

    if (!props.cartWindowOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                <span 
                    role="img"
                    aria-label="trash">
                        🛒
                </span>
            </div>
        );
    }

    return (
        <div className="cart">
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {props.currentCart.length ? (
                <div> 
                    {props.currentCart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className='flex-row space-between'>
                        <strong>Total: ${claculateTotal()}</strong>
                        {
                            Auth.loggedIn() ?
                                <button onClick={submitCheckout}>
                                    Checkout
                                </button>
                                :
                                <span>(log in to check out)</span>
                        }
                    </div>
                </div>
            ):( 
                <h3>
                    <span role="img" aria-label="shocked">
                        😱
                    </span>
                    You haven't added anything to your cart yet!
                </h3>
            )}
        </div>
    );
};
// state.cart
// TOGGLE_CART, ADD_MULTIPLE_TO_CART
const mapStateToProps = (state) => {
    return {
        currentCart: state.cart,
        cartWindowOpen: state.cartOpen
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleCartWindow: () => {
            dispatch({type: TOGGLE_CART})
        },
        addMultipleToCart: (newProds) => {
            dispatch({type: ADD_MULTIPLE_TO_CART, products: newProds});
        }
        
    };
};

//EXPORT ------------------
export default connect(mapStateToProps,mapDispatchToProps)(Cart);