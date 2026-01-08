"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export default function DashboardLayout() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Almonds", price: 500, stock: 100 },
    { id: 2, name: "Cashews", price: 700, stock: 50 },
    { id: 3, name: "Raisins", price: 300, stock: 200 },
  ]);

  const [view, setView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addProduct = (product: Product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
    setView("list");
  };

  const updateProduct = (updated: Product) => {
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    setView("list");
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setView("list");
  };

  const renderContent = () => {
    switch (view) {
      case "list":
        return (
          <ProductList
            products={products}
            onEdit={(p) => {
              setSelectedProduct(p);
              setView("edit");
            }}
            onDelete={(p) => {
              setSelectedProduct(p);
              setView("delete");
            }}
          />
        );
      case "add":
        return <AddProduct onAdd={addProduct} />;
      case "edit":
        return selectedProduct ? (
          <EditProduct product={selectedProduct} onUpdate={updateProduct} />
        ) : null;
      case "delete":
        return selectedProduct ? (
          <DeleteProduct product={selectedProduct} onDelete={deleteProduct} />
        ) : null;
      default:
        return <ProductList products={products} onEdit={() => {}} onDelete={() => {}} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelect={(val) => setView(val)} />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">{renderContent()}</div>
    </div>
  );
}
