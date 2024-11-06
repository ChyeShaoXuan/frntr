import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Product } from './App'; // Import the Product type

type SellerPageProps = {
  products: Product[];
  sellerId: number;
  addProduct: (product: Product) => void;
  category: string;
  setCategory: (category: 'all' | 'plants' | 'furniture') => void;
};

const SellerPage: React.FC<SellerPageProps> = ({ products, addProduct, category, setCategory }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [productCategory, setProductCategory] = useState<'plants' | 'furniture'>('plants');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(''); // Add state for image
  const [imageFile, setImageFile] = useState<File | null>(null); // Add state for image file

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImageToImgur = async (file: File) => {
    const clientId = 'cffd7fbd583e6bd'; // Replace with your Imgur client ID
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
        body: formData,
      });
      const data = await response.json();
      return data.data.link;
    } catch (error) {
      console.error('Error uploading image to Imgur:', error);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';

    if (imageFile) {
      imageUrl = await uploadImageToImgur(imageFile);
    }

    const newProduct: Product = {
      sellerId: 1, // Replace with the actual seller ID
      id: Date.now(),
      name,
      category: productCategory,
      price,
      description,
      quantity,
      image: imageUrl,
    };

    try {
      const response = await fetch('http://app-load-balancer-internet-103124612.ap-southeast-1.elb.amazonaws.com/addItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        addProduct(newProduct);
        setName('');
        setProductCategory('plants');
        setPrice(0);
        setDescription('');
        setQuantity(0);
        setImage('');
        setImageFile(null);
      } else {
        console.error('Error adding product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);

  return (
    <div className="container mx-auto p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">List a New Product</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <Label htmlFor="category">Category</Label>
          <select id="category" value={productCategory} onChange={(e) => setProductCategory(e.target.value as 'plants' | 'furniture')} className="mt-1 bg-white block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="plants">Plants</option>
            <option value="furniture">Furniture</option>
          </select>
        </div>
        <div className="mb-4">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mb-4">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div className="mb-4">
          <Label htmlFor="image">Image</Label>
          <Input id="image" type="file" onChange={handleImageUpload} />
          {image && <img src={image} alt="Product Preview" className="mt-4 w-full h-48 object-cover rounded" />}
        </div>
        <Button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md">List Product</Button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Your Listed Products</h2>
      <div className="mb-4">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <Select value={category} onValueChange={(value: 'all' | 'plants' | 'furniture' ) => setCategory(value)}>
          <SelectTrigger className='select-trigger'>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectItem className="select-item" value="all">All</SelectItem>
            <SelectItem className="select-item" value="plants">Plants</SelectItem>
            <SelectItem className="select-item" value="furniture">Furniture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="border-2 p-4 rounded border-amber-300 cursor-pointer" onClick={() => handleProductClick(product.id)}>
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p>{product.description}</p>
            <p className="font-bold mt-2">Price: ${product.price}</p>
            <p className="font-bold mt-2">Quantity: {product.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;