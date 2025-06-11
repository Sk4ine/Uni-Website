import { useCallback, useEffect, useState } from "react";
import { CartProduct } from "../classes/cartProduct";
import { CartContext } from "../contexts/cartContext";
import type { Product } from "../classes/product";
import type { AxiosError } from "axios";
import { getProductByID } from "../api/requests/products";
import axios from "axios";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartProductList, setCartProductList] = useState<CartProduct[]>(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (e) {
      console.error("Ошибка при чтении корзины из localStorage", e);
      return [];
    }
  });

  const checkProductPresence = useCallback(
    (productID: number): boolean => {
      if (cartProductList.findIndex((product) => product.productID == productID) !== -1) {
        return true;
      }

      return false;
    },
    [cartProductList],
  );

  const changeProductQuantity = useCallback((productID: number, increase: boolean): void => {
    const value: number = increase ? 1 : -1;

    setCartProductList((p) => {
      const newProductList = [...p];
      newProductList[
        newProductList.findIndex((product) => product.productID == productID)
      ].quantity += value;
      return newProductList;
    });
  }, []);

  const [catalogProductList, setCatalogProductList] = useState<Product[]>([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProductList));
  }, [cartProductList]);

  const addProduct = useCallback(
    (productID: number) => {
      if (checkProductPresence(productID)) {
        changeProductQuantity(productID, true);
        return;
      }

      setCartProductList((p) => [...p, new CartProduct(productID, 1)]);
    },
    [changeProductQuantity, checkProductPresence],
  );

  const removeProduct = useCallback((productID: number) => {
    setCartProductList((p) => p.filter((product) => product.productID != productID));
  }, []);

  const decreaseProductQuantity = useCallback(
    (productID: number) => {
      changeProductQuantity(productID, false);
    },
    [changeProductQuantity],
  );

  const updateCatalogProductList = useCallback(async (): Promise<void> => {
    async function getProduct(id: number): Promise<Product> {
      try {
        const product: Product = await getProductByID(id);
        return product;
      } catch (err) {
        throw err as AxiosError;
      }
    }

    const products: Product[] = [];

    for (let i = 0; i < cartProductList.length; i++) {
      try {
        products.push(await getProduct(cartProductList[i].productID));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status) {
          removeProduct(cartProductList[i].productID);
          console.log(
            `Товар ID: ${cartProductList[i].productID} не найден и удален из корзины: ${error}`,
          );
        }

        throw error as AxiosError;
      }
    }

    setCatalogProductList(products);
  }, [cartProductList, removeProduct]);

  return (
    <CartContext.Provider
      value={{
        cartProductList,
        catalogProductList,
        addProduct,
        removeProduct,
        decreaseProductQuantity,
        updateCatalogProductList,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
