"use client";
import { useState } from "react";

type SidebarProps = {
  onSelect: (view: string) => void;
};

export default function Sidebar({ onSelect }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <button
        onClick={() => onSelect("add")}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        Add Product
      </button>
      <button
        onClick={() => onSelect("edit")}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        Edit Product
      </button>
      <button
        onClick={() => onSelect("delete")}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        Delete Product
      </button>
    </div>
  );
}
