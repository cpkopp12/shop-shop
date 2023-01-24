//DECLARATIONS: REACT ---------------------------
import React from 'react';

//CARTITEM COMPONENT ==============================
const CartItem = ({ item }) => {
    return(
        <div className='flex-row'>
            <div>
                <img 
                    src={`/images/${item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input
                        type="number"
                        placeholder="1"
                        value={item.purchasedQuantity}
                    />
                    <span
                        role="img"
                        aria-label="trash"
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
};

//EXPORT -------------------
export default CartItem;