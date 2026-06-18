"use client";

import { useEffect } from "react";

export function ScrollToHash() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromProducts = params.get("from") === "products";
    const hash = window.location.hash.replace("#", "") || (fromProducts ? "products" : "");
    if (!hash) return;
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      if (fromProducts) {
        window.history.replaceState(null, "", "/#" + hash);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
