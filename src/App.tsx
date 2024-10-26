import { useState } from 'react';
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
type Product = {
  id: number;
  name: string;
  category: 'plants' | 'furniture';
  price: number;
  description: string;
  quantity: number;
  image: string; // Add image field
};

type CartItem = Product & { quantity: number };

// Mock data
const initialProducts: Product[] = [
  { id: 1, name: "Monstera Deliciosa", category: "plants", price: 30, description: "Beautiful tropical plant", quantity: 10, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHBsYW50fGVufDB8fDB8fHwy' },
  { id: 2, name: "Leather Sofa", category: "furniture", price: 999, description: "Comfortable 3-seater sofa", quantity: 10 , image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29mYXxlbnwwfHwwfHx8Mg%3D%3D'},
  { id: 3, name: "Snake Plant", category: "plants", price: 25, description: "Low-maintenance indoor plant", quantity: 10 , image: 'https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhbnR8ZW58MHx8MHx8fDI%3D'},
  { id: 4, name: "Wooden Dining Table", category: "furniture", price: 450, description: "Solid oak dining table", quantity: 10 , image: 'https://images.unsplash.com/photo-1505409628601-edc9af17fda6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGluaW5nJTIwdGFibGV8ZW58MHx8MHx8fDI%3D'},
];

// Navbar component
function Navbar({ cartItemsCount }: { cartItemsCount: number }) {
  return (
    <nav className="bg-gray-800 text-white p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">FRNTR</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Shop</Link>
          <Link to="/seller" className="hover:text-gray-300">Sell</Link>
          <Link to="/cart" className="hover:text-gray-300 relative">
            <ShoppingCart />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </Link>
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
  setCategory: (category: 'all' | 'plants' | 'furniture') => void;
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

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<'all' | 'plants' | 'furniture'>('all');

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

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const checkout = () => {
    alert(`Checkout completed! Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}`);
    setCart([]);
  };

  return (
    <Router>
      <div className="min-h-screen min-w-screen flex flex-col w-full">
        <Navbar cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/shop" />} /> {/* Redirect to shop */}
            <Route path="/shop" element={<Shop products={products} addToCart={addToCart} category={category} setCategory={setCategory} />} />
            <Route path="/seller" element={<SellerPage products={products} addProduct={addProduct} category={category} setCategory={setCategory} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} checkout={checkout} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:productId" element={<ProductDetails products={products} addToCart={addToCart} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}