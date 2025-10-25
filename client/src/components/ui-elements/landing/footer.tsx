import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-background text-black overflow-hidden border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 text-sm text-gray-600 font-extra-light gap-4 md:gap-0">
        <div className="text-center md:text-left">
          © {currentYear} Axoma. All rights reserved.
        </div>

        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-black transition-colors">
            Privacy Policy
          </Link>
          <Link href="/about" className="hover:text-black transition-colors">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
