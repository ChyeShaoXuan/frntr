import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  name: string;
  category: 'plants' | 'furniture';
  price: number;
  description: string;
  quantity:number;
  image: string;
};

type ProductDetailsProps = {
  products: Product[];
  addToCart: (product: Product) => void;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ products, addToCart }) => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find(p => p.id === parseInt(productId || '', 10));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
      <p>{product.description}</p>
      <p className="font-bold mt-2">${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Quantity: {product.quantity}</p>
      <Button onClick={() => addToCart(product)} className="mt-4">Add to Cart</Button>
    </div>
  );
};

export default ProductDetails;