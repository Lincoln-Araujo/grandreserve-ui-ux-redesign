// src/components/Footer.jsx
import logoUNFCCC from "../assets/UNFCCC_logo.svg";

export default function Footer() {
  return (
    <footer
      className="
        mt-10
        bg-gradient-to-r from-[#002d5c] via-[#003366] to-[#001a33]
        text-white
        border-t border-white/10
        py-8
      "
      aria-label="UNFCCC footer"
    >
      <div className="max-w-[1600px] mx-auto px-6 text-center">
        <img
          src={logoUNFCCC}
          alt="UNFCCC"
          className="
            w-12 h-auto mx-auto mb-3
          "
          draggable="false"
        />

         <p className="text-xs text-white/70 mt-1 mb-3">
          United Nations Framework Convention on Climate Change
        </p>    

        <p className="text-xs text-white/40 mt-1">
          Belém Climate Change Conference · COP30 · 2025
        </p>
      </div>
    </footer>
  );
}
