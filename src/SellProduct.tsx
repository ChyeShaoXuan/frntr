import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from './App'; // Import the Product type

type SellProductProps = {
  sellerId: number;
  addProduct: (product: Product) => void;
};

const SellProduct: React.FC<SellProductProps> = ({ sellerId, addProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'plants' | 'furniture'>('plants');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(''); // Add state for image
  const [imageFile, setImageFile] = useState<File | null>(null); // Add state for image file

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
      sellerId,
      id: Date.now(),
      name,
      category,
      price,
      description,
      quantity,
      image: imageUrl,
    };

    addProduct(newProduct);
    setName('');
    setCategory('plants');
    setPrice(0);
    setDescription('');
    setQuantity(0);
    setImage('');
    setImageFile(null);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">Sell a Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <Label htmlFor="category">Category</Label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as 'plants' | 'furniture')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
    </div>
  );
};

export default SellProduct;