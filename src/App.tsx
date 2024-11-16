import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import SellerPage from './SellerPage'; // Import the SellerPage component


// Types
export type Product = {
  sellerId: number;
  id: number;
  name: string;
  category: 'plants' | 'furniture' | 'kitchen';
  price: number;
  description: string;
  quantity: number;
  image: string; // Add image field
};

type CartItem = Product & { quantity: number };

// Mock data
const initialProducts: Product[] = [
  { sellerId:5, id: 1, name: "Monstera Deliciosa", category: "plants", price: 30, description: "Beautiful tropical plant", quantity: 10, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHBsYW50fGVufDB8fDB8fHwy' },
  { sellerId:5, id: 2, name: "Leather Sofa", category: "furniture", price: 999, description: "Comfortable 3-seater sofa", quantity: 10 , image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29mYXxlbnwwfHwwfHx8Mg%3D%3D'},
  { sellerId:5, id: 3, name: "Snake Plant", category: "plants", price: 25, description: "Low-maintenance indoor plant", quantity: 10 , image: 'https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhbnR8ZW58MHx8MHx8fDI%3D'},
  { sellerId:5, id: 4, name: "Wooden Dining Table", category: "furniture", price: 450, description: "Solid oak dining table", quantity: 10 , image: 'https://images.unsplash.com/photo-1505409628601-edc9af17fda6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGluaW5nJTIwdGFibGV8ZW58MHx8MHx8fDI%3D'},
];

const testSellerId = 5;

// Define a type for the fetched item structure
type FetchedItem = [
  number,  // sellerId 
  string,  // productName
  number,  // productId
  number,  // price
  number,  // quantity
  string,  // description
  string,   // category
  string    // image
];

//need api for seller id items? can just filter allitems by seller id?
function filterItemsBySellerId(products: Product[], sellerId: number): Product[] {
  return products.filter(product => product.sellerId === sellerId);
}

// Navbar component
function Navbar({ cartItemsCount }: { cartItemsCount: number }) {
  return (
    <nav className="bg-gray-800 text-white p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">FRNTR</Link>
        <div className="flex items-center space-x-4">
          <Link to="/shop" className="hover:text-gray-300">Shop</Link>
          <Link to="/seller" className="hover:text-gray-300">Sell</Link>
          <Link to="/cart" className="hover:text-gray-300 relative">
            <ShoppingCart />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link to="/login" className="hover:text-gray-300">Logout</Link>
        </div>
      </div>
    </nav>
  );
}

// Shop component
function Shop({ products, addToCart, category, setCategory }: {
  products: Product[];
  addToCart: (product: Product) => void;
  category: string;
  setCategory: (category: 'all' | 'plants' | 'furniture' ) => void;
}) {
  const navigate = useNavigate();
  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <div className="mb-4">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <Select value={category} onValueChange={(value: 'all' | 'plants' | 'furniture') => setCategory(value)}>
          <SelectTrigger className='border-2 w-1/4 mt-4 border-blue-200'>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className = "bg-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="plants">Plants</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="border-2 p-4 rounded border-amber-300 cursor-pointer" onClick={() => handleProductClick(product.id)}>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p>{product.description}</p>
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <p className="font-bold mt-2">Price: ${product.price}</p>
            <p className="font-bold mt-2">Quantity: {product.quantity}</p>
            <Button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="mt-2">Add to Cart</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cart component
function Cart({ cart, removeFromCart, checkout }: {
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
  checkout: () => void;
}) {
  return (
    <div className="container mx-auto p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>${item.price * item.quantity}</span>
              <Button onClick={() => removeFromCart(item.id)} variant="destructive">Remove</Button>
            </div>
          ))}
          <div className="font-bold mt-4">
            Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </div>
          <Button onClick={checkout} className="mt-4">Checkout</Button>
        </>
      )}
    </div>
  );
}

// Checkout component
function Checkout() {
  return (
    <div className="container mx-auto p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <p>Thank you for your purchase!</p>
    </div>
  );
}

// Login Page component (added directly in this file)
function LoginPage() {
  const handleLogin = () => {
    // Redirect to Cognito's hosted UI login page
    window.location.href = "https://frntr-cme.auth.ap-southeast-1.amazoncognito.com/login?client_id=gbgmbggo4fd72avaubjncoije&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fd2o7saukdjel5t.cloudfront.net%2Fshop";
  };

  return (
    <div className="container mx-auto p-4 max-w-md w-full flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-6 py-2 rounded">
        Go to Login Page
      </button>
    </div>
  );
}


export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<'all' | 'plants' | 'furniture'>('all');
  const [itemAddedStatus, setItemAddedStatus] = useState<boolean>(false);

  // Fetch data and merge with initial products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://d2o7saukdjel5t.cloudfront.net/GetAllItems');  //https://localhost:5000/GetAllItems
        const data = await response.json();

        // Transform fetched data to match Product type
        const newProducts: Product[] = data.items.map((item: FetchedItem) => ({
          sellerId: item[0],
          id: item[2], // Ensure this ID is unique (Product ID)
          name: item[1],
          category: item[6] as 'plants' | 'furniture', // Type assertion
          price: item[3],
          description: item[5],
          quantity: item[4],
          image: item[7] // Use a default image or replace with actual image URLs if available
        }));

        // Combine initial products with new products
        const combinedProducts: Product[] = [ ...newProducts]; //can edit to remove mock data

        setProducts(combinedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
    console.log("a")
  }, [itemAddedStatus,]); // should re fetch when item added from seller

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const addProduct = async (product: Product) => {
    // FOR NO DB will add to intial list if useEffect for intial fetch dependcy is [], setProducts(prevProducts => [...prevProducts, product]);
    // POST to db
    let toSend = {
      "Seller_ID": product.sellerId,
      "Item_ID": product.id,
      "Item_Name": product.name,
      "Item_Price": product.price,
      "Item_Qty": product.quantity,
      "Item_Desc": product.description,
      "Category": product.category,
      "Image_URL": product.image
      // how to store image?
    }
    try {
      const response = await fetch('https://d2o7saukdjel5t.cloudfront.net/addItems', {  //https://d2o7saukdjel5t.cloudfront.net/addItems
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(toSend),
      });

      if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Success:', jsonResponse);
          setItemAddedStatus((prevStatus) => !prevStatus); //retriggers useEffect, effectively updating the page to show new list of products

      } else {
          console.error('Error:', response.statusText);
      }
    } catch (error) {
        console.error('Error:', error);
    }


  };

  const checkout = async () => {
    for (const item of cart) {
      let newQuantity = 0;
      let sellerId = 0;
      const itemId = item.id; // Assuming each item has an id property
      for (let i = 0; i < products.length; i++) {
        if (products[i].id === itemId) {
          newQuantity = products[i].quantity - item.quantity; // This would be the quantity you want to set
          sellerId = products[i].sellerId;

        }
      }

      try {
        // Perform the API call to update the item quantity
        const response = await fetch(`https://d2o7saukdjel5t.cloudfront.net/updateItemQty/${sellerId}/${itemId}/${newQuantity}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Check if the response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
  
        // Parse the response JSON
        const result = await response.json();
        console.log('Success:', result);
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    }  
    setItemAddedStatus((prevStatus) => !prevStatus); //retriggers useEffect, effectively updating the page to show new list of products

    alert(`Checkout completed! Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}`);
    setCart([]);
};

  return (
    <Router>
      <div className="min-h-screen min-w-screen flex flex-col w-full">
        <Navbar cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to shop */}
            <Route path="/shop" element={<Shop products={products} addToCart={addToCart} category={category} setCategory={setCategory} />} />
            <Route path="/seller" element={<SellerPage products={filterItemsBySellerId(products, testSellerId)} sellerId={testSellerId} addProduct={addProduct} category={category} setCategory={setCategory} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} checkout={checkout} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:productId" element={<ProductDetails products={products} addToCart={addToCart} />} />
            <Route path="/login" element={<LoginPage />} /> {/* Add Login route here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
