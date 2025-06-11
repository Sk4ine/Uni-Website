import { useEffect, useState } from "react";
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

  const [catalogProductList, setCatalogProductList] = useState<Product[]>([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProductList));
  }, [cartProductList]);

  function addProduct(productID: number) {
    if (checkProductPresence(productID)) {
      changeProductQuantity(productID, true);
      return;
    }

    setCartProductList((p) => [...p, new CartProduct(productID, 1)]);
  }

  function removeProduct(productID: number) {
    setCartProductList((p) =>
      p.filter((product) => product.productID != productID),
    );
  }

  function decreaseProductQuantity(productID: number) {
    changeProductQuantity(productID, false);
  }

  function checkProductPresence(productID: number): boolean {
    if (
      cartProductList.findIndex((product) => product.productID == productID) !==
      -1
    ) {
      return true;
    }

    return false;
  }

  function changeProductQuantity(productID: number, increase: boolean): void {
    const value: number = increase ? 1 : -1;

    setCartProductList((p) => {
      const newProductList = [...p];
      newProductList[
        newProductList.findIndex((product) => product.productID == productID)
      ].quantity += value;
      return newProductList;
    });
  }

  async function updateCatalogProductList(): Promise<void> {
    async function getProduct(id: number): Promise<Product> {
      try {
        const product: Product = await getProductByID(id);
        return product;
      } catch (err) {
        throw err as AxiosError;
      }
    }

    let products: Product[] = [];

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
  }

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
