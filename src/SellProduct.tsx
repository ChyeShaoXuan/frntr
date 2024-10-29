import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from './App';


type SellProductProps = {
  addProduct: (product: Product) => void;
};

const SellProduct: React.FC<SellProductProps> = ({ addProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'plants' | 'furniture'>('plants');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  //need to set image

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now(),
      name,
      category,
      price,
      description,
      quantity,
    };
    addProduct(newProduct);
    setName('');
    setCategory('plants');
    setPrice(0);
    setDescription('');
    setQuantity(0);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">Sell a Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4 bg-white">
          <Label htmlFor="category">Category</Label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as 'plants' | 'furniture')} className="bg-white mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
        <Button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md">List Product</Button>
      </form>
    </div>
  );
};

export default SellProduct;