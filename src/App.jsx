import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct.jsx";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        setError(`Failed to fetch data: ${error.message}`);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <>
      <NavBar uniqueCategories={uniqueCategories} />
      <Routes>
        <Route
          path="/"
          element={<HomePage products={products} error={error} />}
        />
        <Route
          path="/products"
          element={<Products products={products} error={error} />}
        />
        <Route
          path="/products/category/:category"
          element={<Products products={products} error={error} />}
        />
        <Route
          path="/products/details/:id"
          element={
            <ProductDetails
              products={products}
              error={error}
              refreshProducts={fetchProducts}
            />
          }
        />
        <Route
          path="/add-product"
          element={
            <AddProduct
              uniqueCategories={uniqueCategories}
              refreshProducts={fetchProducts}
            />
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <EditProduct
              uniqueCategories={uniqueCategories}
              refreshProducts={fetchProducts}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {error && <p className="text-danger">{error}</p>}
    </>
  );
}

export default App;
