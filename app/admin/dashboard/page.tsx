"use client";

import CreateProduct from "@/components/admin/CreateProduct";
import EditProduct from "@/components/admin/EditProduct";
import DeleteProduct from "@/components/admin/DeleteProduct";
import { useState, useEffect, useCallback } from "react";
import {
  FiHome,
  FiChevronDown,
  FiPlusCircle,
  FiEdit,
  FiTrash,
  FiShoppingBag,
  FiUsers,
  FiUser,
  FiLogOut,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiMenu,
  FiX,
} from "react-icons/fi";
import CreateCategory from "@/components/admin/CreateCategory";
import AdminOrders from "@/components/admin/AdminOrders";

const DashboardHome = () => <div>Welcome to Dashboard</div>;


const OrdersCanceled = () => <div>Canceled Orders</div>;
const OrdersDelivered = () => <div>Delivered Orders</div>;
const Users = () => <div>Users List</div>;
const Profile = () => <div>User Profile</div>;

type Page =
  | "home"
  | "product-category"
  | "addProduct"
  | "editProduct"
  | "deleteProduct"
  | "orders"
  | "ordersCanceled"
  | "ordersDelivered"
  | "users"
  | "profile";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<Page>("home");

  const [openProducts, setOpenProducts] = useState(true);
  const [openOrders, setOpenOrders] = useState(true);

 
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useCallback((page: Page) => {
    setActivePage(page);
    setMobileOpen(false); 
  }, []);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <DashboardHome />;
      case "product-category":
        return <CreateCategory />;
      case "addProduct":
        return <CreateProduct />;
      case "editProduct":
        return <EditProduct />;
      case "deleteProduct":
        return <DeleteProduct />;
      case "orders":
        return <AdminOrders />;
      case "ordersCanceled":
        return <OrdersCanceled />;
      case "ordersDelivered":
        return <OrdersDelivered />;
      case "users":
        return <Users />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardHome />;
    }
  };

  const itemBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-left transition";
  const inactive = "text-gray-700 hover:bg-gray-100";
  const active = "bg-blue-100 text-blue-600 font-medium";

  return (
    <div className="min-h-screen bg-gray-50 ">
    
      <header className="md:hidden sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="w-9" /> 
        </div>
      </header>

     
      <div className="flex">
       
        <div
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 bg-black/40 z-30 md:hidden ${
            mobileOpen ? "block" : "hidden"
          }`}
        />

      
        <aside
          className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-white border-r shadow-sm p-6 transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
          aria-label="Sidebar"
        >
   
          <div className="flex items-center justify-between md:hidden mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiX />
            </button>
          </div>


          <h1 className="hidden md:block text-2xl font-bold mb-6 text-gray-800">
            Admin Dashboard
          </h1>


          <button
            onClick={() => navigate("home")}
            className={`${itemBase} ${activePage === "home" ? active : inactive} w-full`}
          >
            <FiHome /> Home
          </button>


          <div className="mt-4">
            <button
              onClick={() => setOpenProducts((s) => !s)}
              className={`${itemBase} ${inactive} w-full justify-between`}
              aria-expanded={openProducts}
              aria-controls="products-group"
            >
              <span className="flex items-center gap-3">
                <FiPlusCircle />
                Manage Products
              </span>
              <FiChevronDown
                className={`transition-transform ${openProducts ? "rotate-180" : ""}`}
              />
            </button>

            <div
              id="products-group"
              className={`${openProducts ? "block" : "hidden"} mt-2 ml-9 flex flex-col gap-1`}
            >
              <button
                onClick={() => navigate("product-category")}
                className={`${itemBase} ${
                  activePage === "product-category" ? active : inactive
                }`}
              >
                <FiPlusCircle /> Add Category 
              </button>
              <button
                onClick={() => navigate("addProduct")}
                className={`${itemBase} ${
                  activePage === "addProduct" ? active : inactive
                }`}
              >
                <FiPlusCircle /> Add Product
              </button>
              <button
                onClick={() => navigate("editProduct")}
                className={`${itemBase} ${
                  activePage === "editProduct" ? active : inactive
                }`}
              >
                <FiEdit /> Update Product
              </button>
              <button
                onClick={() => navigate("deleteProduct")}
                className={`${itemBase} ${
                  activePage === "deleteProduct" ? active : inactive
                }`}
              >
                <FiTrash /> Delete Product
              </button>
            </div>
          </div>

     
          <div className="mt-4">
            <button
              onClick={() => setOpenOrders((s) => !s)}
              className={`${itemBase} ${inactive} w-full justify-between`}
              aria-expanded={openOrders}
              aria-controls="orders-group"
            >
              <span className="flex items-center gap-3">
                <FiShoppingBag />
                Orders
              </span>
              <FiChevronDown
                className={`transition-transform ${openOrders ? "rotate-180" : ""}`}
              />
            </button>

            <div
              id="orders-group"
              className={`${openOrders ? "block" : "hidden"} mt-2 ml-9 flex flex-col gap-1`}
            >
              <button
                onClick={() => navigate("orders")}
                className={`${itemBase} ${
                  activePage === "orders" ? active : inactive
                }`}
              >
                <FiList /> Total Orders
              </button>
              <button
                onClick={() => navigate("ordersCanceled")}
                className={`${itemBase} ${
                  activePage === "ordersCanceled" ? active : inactive
                }`}
              >
                <FiXCircle /> Canceled Orders
              </button>
              <button
                onClick={() => navigate("ordersDelivered")}
                className={`${itemBase} ${
                  activePage === "ordersDelivered" ? active : inactive
                }`}
              >
                <FiCheckCircle /> Delivered Orders
              </button>
            </div>
          </div>


          <div className="mt-4">
            <button
              onClick={() => navigate("users")}
              className={`${itemBase} ${activePage === "users" ? active : inactive} w-full`}
            >
              <FiUsers /> Users
            </button>
          </div>

  
          <div className="mt-auto pt-6">
            <button
              onClick={() => navigate("profile")}
              className={`${itemBase} ${inactive} w-full`}
            >
              <FiUser /> Profile
            </button>
            <button
              onClick={() => navigate("profile")}
              className="mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-100 transition w-full"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </aside>

       
        <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
