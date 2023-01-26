export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}


//indexedDB helper function
export function ibdPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open db connection with name 'shop-shop' version 1
    const request = window.indexedDB.open('shop-shop', 1);

    //create vars for db reference, transaction, and object store
    let db, tx, store;

    //if the version has changed or first time using db, 
    //run this to create the three object stores
    request.onupgradeneeded = function(e) {
      const db = request.result;
      //store for each data type, _id = primary key
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id'});
      db.createObjectStore('cart', { keyPath: '_id' })
    };

    // handle any errors with connecting
    request.onerror = function(e) {
      console.log('There was an error');
    };

    // on db open success
    request.onsuccess = function(e) {
      // db = reference to the database
      db = request.result;

      //open a transaction to carry out storeName param, 
      //must match object store name
      tx = db.transaction(storeName, 'readwrite');

      //save ref to that object store
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      tx.oncomplete = function() {
        db.close();
      }

    };

  });
}