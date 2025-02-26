import React, { useState, useEffect } from 'react';
import './Product.css';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { db, auth, getDoc, doc, setDoc, updateDoc,addDoc } from './firebase'; // Adjust path as needed

function Product() {
  const [products, setProducts] = useState([]); // State to store products
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [requestedProduct, setRequestedProduct] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };
  
    const fetchCart = async () => {
      const userId = auth.currentUser?.uid; // Retrieve user ID
      if (!userId) {
        console.error('User not authenticated');
        return; // Stop execution if the user is not authenticated
      }
  
      const userRef = doc(db, 'users', userId);
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userCart = userDoc.data().cart || [];
          setCart(userCart);
        }
      } catch (error) {
        console.error('Error fetching cart: ', error);
      }
    };
  
    fetchProducts();
    fetchCart();
  }, []); // Empty dependency array ensures this runs once on mount
  

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = async (product, quantity) => {
    if (quantity < 1) {
      setError('Please select a valid quantity.');
      return;
    }
    if (product.qty < quantity) {
      setError(`Only ${product.qty} ${product.name}(s) are available in stock!`);
      return;
    }
  
    setError('');
  
    try {
      const userId = auth.currentUser?.uid; // Get user ID
      if (!userId) {
        console.error('User not authenticated');
        return;
      }
  
      const userRef = doc(db, 'users', userId);
      const productRef = doc(db, 'products', product.id); // Reference to the product in Firestore
  
      // Fetch the current product data from Firestore to ensure up-to-date information
      const productSnapshot = await getDoc(productRef);
      if (!productSnapshot.exists()) {
        setError('Product does not exist.');
        return;
      }
  
      const productData = productSnapshot.data();
      if (productData.qty < quantity) {
        setError(`Only ${productData.qty} ${product.name}(s) are available in stock!`);
        return;
      }
  
      // Update the product's remaining quantity in Firestore
      await updateDoc(productRef, {
        qty: productData.qty - quantity,
      });
  
      // Fetch user's cart from Firestore
      const userDoc = await getDoc(userRef);
      let updatedCart = [];
      if (userDoc.exists()) {
        const existingCart = userDoc.data().cart || [];
        const existingItemIndex = existingCart.findIndex((item) => item.id === product.id);
        if (existingItemIndex > -1) {
          // If the product already exists in the cart, update its quantity
          updatedCart = [...existingCart];
          updatedCart[existingItemIndex].cartQty += quantity;
        } else {
          // Otherwise, add the product to the cart
          updatedCart = [...existingCart, { ...product, cartQty: quantity }];
        }
      } else {
        // If the user document doesn't exist, create it with the new cart
        updatedCart = [{ ...product, cartQty: quantity }];
      }
  
      // Update the user's cart in Firestore
      await updateDoc(userRef, { cart: updatedCart });
  
      // Update the cart state in the app
      setCart(updatedCart);
  
      scrollToTop();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    }
  };
  

  const handleUpdateCartItem = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, cartQty: quantity } : item
      )
    );
  };

  const handleRemoveFromCart = async (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  
    // Retrieve the current user's ID (uid)
    const userId = auth.currentUser?.uid;
  
    if (!userId) {
      console.error('User not authenticated');
      return; // Stop execution if the user is not authenticated
    }
  
    try {
      const userRef = doc(db, 'users', userId);
  
      // Update the cart in Firebase
      await updateDoc(userRef, {
        cart: updatedCart,
      });
    } catch (error) {
      console.error('Error updating cart in Firebase: ', error);
    }
  };
  

  const handleRequestProduct = async () => {
    if (!requestedProduct.trim()) {
      setRequestMessage('Please enter a product name to request.');
      return;
    }

    // Prepare the request data
    const requestData = {
      name: 'User',  // Replace this with actual user information (e.g., logged-in user)
      product: requestedProduct,
      quantity: 1,  // You can change this based on your need or input field
      date: new Date().toISOString(),
      status: 'unfulfilled',
    };

    try {
      // Add request to Firebase
      await addDoc(collection(db, 'requests'), requestData);
      setRequestMessage(`Request submitted for: ${requestedProduct}`);
      setRequestedProduct('');
      setTimeout(() => setRequestMessage(''), 3000); // Clear message after 3 seconds
      scrollToTop();  // Scroll to the top when a request is submitted
    } catch (e) {
      console.error("Error adding document: ", e);
      setRequestMessage('Failed to submit request.');
    }
    alert(`Request submitted for: ${requestedProduct}`);
    setRequestedProduct('');
    scrollToTop();
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });  // Passing cart through navigation state
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-page">
      <button 
        onClick={() => navigate('/user-dash')} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          padding: '10px 20px', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' ,
          width:100,
          backgroundColor: 'black'
        }}
      >
        Back
      </button>
      <header className="product-header">
        <h1>Product List</h1>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </header>

      {error && <p className="error-message">{error}</p>}

      {requestMessage && <div className="request-notification">{requestMessage}</div>}

      <div className="product-container">
        <div className="product-list" style={{ padding: 50 }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-box ${product.qty < 5 ? 'low-stock' : ''}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.qty}</p>
              <input
                type="number"
                min="1"
                max={product.qty}
                defaultValue="1"
                className="quantity-input"
                style={{ width: 50, marginBottom: 10 }}
                id={`quantity-${product.id}`}
              />
              <button
                onClick={() =>
                  handleAddToCart(
                    product,
                    parseInt(
                      document.getElementById(`quantity-${product.id}`).value,
                      10
                    )
                  )
                }
                disabled={product.qty < 1}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 0',
                  }}
                >
                  <div>
                    <span>{item.name}</span>
                    <input
                      type="number"
                      min="1"
                      max={item.qty}
                      value={item.cartQty}
                      onChange={(e) =>
                        handleUpdateCartItem(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      style={{ width: 50, marginLeft: 10 }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="remove-button"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                      fontSize: '16px',
                      lineHeight: '1',
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && (
            <button onClick={handleCheckout} className="checkout-button">
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>

      <div className="request-product" style={{ alignItems: 'center' }}>
        <h2 style={{ marginLeft: 10 }}>Request a Product</h2>
        <input
          type="text"
          placeholder="Enter product name..."
          value={requestedProduct}
          onChange={(e) => setRequestedProduct(e.target.value)}
          className="request-input"
          style={{ width: 500, marginLeft: 10 }}
        />
        <button onClick={handleRequestProduct} className="request-button" style={{ margin: 10 }}>
          Request Product
        </button>
      </div>
    </div>
  );
}

export default Product;
