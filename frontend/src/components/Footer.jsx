import React from "react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  // Home page par footer hide karne ke liye check
  if (location.pathname === "/" || location.pathname === "/ai") return null;

  return (
    <footer className=" bg-gray-50 text-gray-600 text-center py-8 mt-16 border-t border-gray-200">
      <div className="max-w-5xl mx-auto text-sm sm:text-base">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-800">Universe</span>. All rights reserved.
      </div>
      <div className="mt-2 flex justify-center gap-4 text-gray-500 text-xs sm:text-sm">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Help</a>
      </div>
    </footer>
  );
}
