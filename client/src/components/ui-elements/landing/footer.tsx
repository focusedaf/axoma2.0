import React from "react";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background text-black overflow-hidden border-t border-white/10">
      <div className="flex justify-center items-center p-6 text-sm text-gray-600 font-extra-light">
        © {new Date().getFullYear()} Axoma. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
