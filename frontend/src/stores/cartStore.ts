import { create } from "zustand";
import { CartProduct } from "../classes/cartProduct";
import type { Product } from "../classes/product";
import { getProductByID } from "../api/requests/products";
import type { AxiosError } from "axios";
import axios from "axios";

interface CartState {
  cartProductList: CartProduct[];
  catalogProductList: Product[];
  checkProductPresence: (productID: number) => boolean;
  changeProductQuantity: (productID: number, increase: boolean) => void;
  addProduct: (productID: number) => void;
  removeProduct: (productID: number) => void;
  decreaseProductQuantity: (productID: number) => void;
  updateCatalogProductList: () => Promise<void>;
  initializeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartProductList: getCartFromLocalStorage(),
  catalogProductList: [],

  checkProductPresence: (productID: number): boolean => {
    if (get().cartProductList.findIndex((product) => product.productID == productID) !== -1) {
      return true;
    }

    return false;
  },

  changeProductQuantity: (productID: number, increase: boolean): void => {
    const value: number = increase ? 1 : -1;

    const newProductList = [...get().cartProductList];
    newProductList[
      newProductList.findIndex((product) => product.productID == productID)
    ].quantity += value;

    set({ cartProductList: newProductList });
  },

  addProduct: (productID: number): void => {
    if (get().checkProductPresence(productID)) {
      get().changeProductQuantity(productID, true);
      return;
    }

    set({ cartProductList: [...get().cartProductList, new CartProduct(productID, 1)] });
  },

  removeProduct: (productID: number): void => {
    set({
      cartProductList: get().cartProductList.filter((product) => product.productID != productID),
    });
  },

  decreaseProductQuantity: (productID: number): void => {
    get().changeProductQuantity(productID, false);
  },

  updateCatalogProductList: async (): Promise<void> => {
    async function getProduct(id: number): Promise<Product> {
      try {
        const product: Product = await getProductByID(id);
        return product;
      } catch (err) {
        throw err as AxiosError;
      }
    }

    const products: Product[] = [];

    for (let i = 0; i < get().cartProductList.length; i++) {
      try {
        products.push(await getProduct(get().cartProductList[i].productID));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status) {
          get().removeProduct(get().cartProductList[i].productID);
          console.log(
            `Товар ID: ${get().cartProductList[i].productID} не найден и удален из корзины: ${error}`,
          );
        }

        throw error as AxiosError;
      }
    }
    set({ catalogProductList: products });
  },

  initializeCart: (): void => {
    localStorage.setItem("cart", JSON.stringify(get().cartProductList));
  },
}));

let currentCartProductList: CartProduct[] = useCartStore.getState().cartProductList;

useCartStore.subscribe((state) => {
  if (JSON.stringify(state.cartProductList) !== JSON.stringify(currentCartProductList)) {
    localStorage.setItem("cart", JSON.stringify(state.cartProductList));
    currentCartProductList = state.cartProductList;
  }
});

function getCartFromLocalStorage(): CartProduct[] {
  try {
    const savedCart = localStorage.getItem("cart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Ошибка при чтении корзины из localStorage", error);
    return [];
  }
}

export const useCartProductList = (): CartProduct[] =>
  useCartStore((state) => state.cartProductList);
export const useCatalogProductList = (): Product[] =>
  useCartStore((state) => state.catalogProductList);

export const useCheckProductPresence = (): ((productID: number) => boolean) =>
  useCartStore((state) => state.checkProductPresence);
export const useChangeProductQuantity = (): ((productID: number, increase: boolean) => void) =>
  useCartStore((state) => state.changeProductQuantity);
export const useAddProduct = (): ((productID: number) => void) =>
  useCartStore((state) => state.addProduct);
export const useRemoveProduct = (): ((productID: number) => void) =>
  useCartStore((state) => state.removeProduct);
export const useDecreaseProductQuantity = (): ((productID: number) => void) =>
  useCartStore((state) => state.decreaseProductQuantity);
export const useUpdateCatalogProductList = (): (() => Promise<void>) =>
  useCartStore((state) => state.updateCatalogProductList);
export const useInitializeCart = (): (() => void) => useCartStore((state) => state.initializeCart);
