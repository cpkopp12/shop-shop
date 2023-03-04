import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
// import { useStoreContext } from "../utils/GlobalState";
// import { 
//   UPDATE_PRODUCTS,
//   REMOVE_FROM_CART,
//   UPDATE_CART_QUANTITY,
//   ADD_TO_CART
// } from "../utils/actions";
import Cart from "../components/Cart"
import { idbPromise } from '../utils/helpers';
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

import { connect } from 'react-redux';
import { 
  UPDATE_PRODUCTS,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART
} from "../reducers/actions";

function Detail(props) {
  // const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const { products, cart } = state;

  useEffect(() => {
    if (props.products.length) { //in global store
      setCurrentProduct(props.products.find(product => product._id === id));
    } else if (data) { //retrived from server
      props.loadProducts(data.products);

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) { //cache from idb
      idbPromise('products', 'get').then((indexedProducts) => {
        props.loadProducts(indexedProducts);
      })
    }
  }, [props.products, data, loading, id]);

  const addToCart = () => {
    const itemInCart = props.cart.find((cartItem) => cartItem._id === id);
  
    if (itemInCart) {
      // dispatch({
      //   type: UPDATE_CART_QUANTITY,
      //   _id: id,
      //   purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      // });
      let newQuantity = parseInt(itemInCart.purchaseQuantity) + 1;
      props.updateCartQuantity(id, newQuantity);
      idbPromise('cart','put', {
        ...itemInCart,
        purchasedQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      })
    } else {
      // dispatch({
      //   type: ADD_TO_CART,
      //   product: { ...currentProduct, purchaseQuantity: 1 }
      // });
      props.addToCart({...currentProduct, purchasedQuantity: 1});
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 })
    }
  };

    const removeFromCart = () => {
      // dispatch({
      //   type: REMOVE_FROM_CART,
      //   _id: currentProduct._id
      // });
      props.removeFromCart(currentProduct._id);
      idbPromise('cart', 'delete', { ...currentProduct });
    }

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              diabled={!props.cart.find(p => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
    cart: state.cart
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProducts: (dbProducts) => {
      dispatch({type: UPDATE_PRODUCTS, products: dbProducts});
    },
    removeFromCart: (id) => {
      dispatch({type: REMOVE_FROM_CART, _id: id})
    },
    updateCartQuantity: (itemId, itemQuantity) => {
      dispatch({type: UPDATE_CART_QUANTITY, _id: itemId, purchaseQuantity: itemQuantity})
    },
    addToCart: (item) => {
      dispatch({type: ADD_TO_CART, product: item})
    }
  }
};
// UPDATE_PRODUCTS,
//   REMOVE_FROM_CART,
//   UPDATE_CART_QUANTITY,
//   ADD_TO_CART
export default connect(mapStateToProps, mapDispatchToProps)(Detail);
