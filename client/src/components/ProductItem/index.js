import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from '../../utils/helpers'; 
//redux imports
import { connect } from 'react-redux';
// import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../reducers/actions'

function ProductItem(props) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = props.item; //props.item

  const [state, dispatch] = useStoreContext();
  // const { cart } = state;

  const addToCart = () => {
    // find the cart item with the matching id
    console.log(props.cart);
    const itemInCart = props.cart.find((cartItem) => cartItem._id === _id);
    console.log(itemInCart);
  
    // if there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...props.item, purchaseQuantity: 1 }//props.item*************
      });
      idbPromise('cart', 'put', { ...props.item, purchaseQuantity: 1 });//props.item*************
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    cart: state.cart,
    item: ownProps
  }
}

export default connect(mapStateToProps)(ProductItem);
