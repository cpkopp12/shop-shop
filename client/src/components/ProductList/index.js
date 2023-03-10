import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
// import { useStoreContext } from '../../utils/GlobalState';
// import { UPDATE_PRODUCTS } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

//redux imports
import { connect } from 'react-redux';
import { UPDATE_PRODUCTS } from '../../reducers/actions'

function ProductList(props) {
  //const [state, dispatch] = useStoreContext();

  //const { currentCategory } = state;
  var filteredProds = [];
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  useEffect(() => {
    if(data) {
      props.loadProducts(data.products);
      // dispatch({
      //   type: UPDATE_PRODUCTS,
      //   products: data.products
      // });
  
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      // add else if to check if `loading` is undefined in `useQuery()` Hook
    } else if (!loading) {
      // since we're offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        props.loadProducts(products);
      });
    }
  }, [data, loading]);

  function filterProducts() {
    if (!props.category) {
      return props.allProducts;
    }
    filteredProds =props.allProducts.filter(product => product.category._id === props.category);
    return filteredProds;
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {props.allProducts.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    allProducts: state.products,
    category: state.currentCategory
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProducts: (dbProducts) => {
      dispatch({type: UPDATE_PRODUCTS, products: dbProducts});
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
