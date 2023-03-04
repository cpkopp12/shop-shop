import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
//import { useStoreContext } from '../../utils/GlobalState';
//import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { connect } from 'react-redux';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../reducers/actions';

function CategoryMenu(props) {
  //const [state, dispatch] = useStoreContext();
  //const { categories } = state;
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    //update state when categoryData changes
    if (categoryData) {
      props.loadCategories(categoryData.categories);
      // dispatch({
      //   type: UPDATE_CATEGORIES,
      //   categories: categoryData.categories
      // });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      })
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        props.loadCategories(categories);
      });
    }
  }, [categoryData, loading, props]);

  const handleClick = id => {
    props.changeCurrentCategory(id);
    // dispatch({
    //   type: UPDATE_CURRENT_CATEGORY,
    //   currentCategory: id
    // });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {props.allCategories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    allCategories: state.categories,
    currentCategory: state.currentCategory
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: (dbCategories) => {
      dispatch({type: UPDATE_CATEGORIES, categories: dbCategories});
    },
    changeCurrentCategory: (currentCategoryId) => {
      dispatch({type: UPDATE_CURRENT_CATEGORY, currentCategory: currentCategoryId});
    }
  }
};




export default connect(mapStateToProps, mapDispatchToProps)(CategoryMenu);
