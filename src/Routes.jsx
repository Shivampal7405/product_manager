import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import Signup from "pages/signup";
import Register from "pages/register";
import ProductDashboard from "pages/product-dashboard";
import AddProduct from "pages/add-product";
import ProductDetails from "pages/product-details";
import EditProduct from "pages/edit-product";
import ProductList from "pages/product-list";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<ProductDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/edit-product" element={<EditProduct />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;