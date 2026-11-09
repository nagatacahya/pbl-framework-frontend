// hooks/use-products.ts
import { useState, useEffect } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await productService.getAll();
    if (res.success) setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  return { products, loading, refresh: fetchProducts };
}