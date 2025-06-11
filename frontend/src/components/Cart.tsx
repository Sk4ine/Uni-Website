import type { Product } from "../classes/product";
import { Link, useNavigate } from "react-router";
import { useCartContext } from "../contexts/cartContext";
import { useCheckoutProductContext } from "../contexts/checkoutProductContext";
import { useContext } from "react";
import {
  ErrorMessageContext,
  IsLoadingContext,
} from "../contexts/otherContexts";

export function CartSection() {
  return (
    <div className="flex flex-col items-center mb-48">
      <h1 className="font-default text-[#D5778D] text-4xl mt-7">Корзина</h1>
      <CartProductList />
    </div>
  );
}

function CartProductList() {
  const { cartProductList, catalogProductList } = useCartContext();
  const isLoading = useContext(IsLoadingContext);
  const errorMessage = useContext(ErrorMessageContext);

  let content: React.ReactNode[] = cartProductList.map((product, index) => (
    <CartProduct
      key={index}
      product={catalogProductList[index]}
      quantity={product.quantity}
    ></CartProduct>
  ));

  if (isLoading || content.length === 0) {
    content = [...Array(2)].map((_, index) => (
      <LoadingCartProduct key={index} />
    ));
  } else if (errorMessage != "") {
    content = [
      <p className="font-default text-[#B4A1A6] text-3xl">{errorMessage}</p>,
    ];
  }

  if (cartProductList.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center mt-16">
        <p className="font-default text-[#B4A1A6] text-3xl">Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="w-[960px] mt-7">
      <div className="flex flex-col items-center gap-5">{content}</div>
    </div>
  );
}

function CartProduct({
  product,
  quantity,
}: {
  product: Product;
  quantity: number;
}) {
  return (
    <div className="w-full h-64 flex justify-between items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] animate-fade-in">
      <Link
        to={`/catalog/${product.id}`}
        className="h-[88%] ml-4 rounded-2xl w-1/4"
      >
        <img
          src={product.imagePaths[0]}
          className="h-full aspect-square rounded-2xl object-contain"
        ></img>
      </Link>
      <div className="flex justify-between items-start pl-8 pr-6 w-3/4 self-start mt-10">
        <ProductInfo
          productName={product.name}
          quantity={quantity}
          productID={product.id}
        ></ProductInfo>
        <OrderActions
          productPrice={product.price}
          quantity={quantity}
          productID={product.id}
        ></OrderActions>
      </div>
    </div>
  );
}

function LoadingCartProduct() {
  return (
    <div className="w-full h-64 rounded-2xl from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr" />
  );
}

function ProductInfo({
  productName,
  quantity,
  productID,
}: {
  productName: string;
  quantity: number;
  productID: number;
}) {
  return (
    <div className="w-[50%] flex flex-col justify-center items-center">
      <p className="font-default text-[#B4A1A6] text-4xl">{productName}</p>
      <QuantityCounter
        quantity={quantity}
        productID={productID}
      ></QuantityCounter>
    </div>
  );
}

function QuantityCounter({
  quantity,
  productID,
}: {
  quantity: number;
  productID: number;
}) {
  const cartContext = useCartContext();

  function handleClickRemove() {
    cartContext.decreaseProductQuantity(productID);
  }

  function handleClickAdd() {
    cartContext.addProduct(productID);
  }

  return (
    <div className="w-42 mt-4 flex justify-between items-center px-4 rounded-4xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-4xl">
      <button
        disabled={quantity == 1 ? true : false}
        style={quantity == 1 ? { cursor: "default" } : { cursor: "pointer" }}
        onClick={handleClickRemove}
        className="w-8 text-[#B4A1A6]"
      >
        -
      </button>
      <p className="text-[#B4A1A6]">{quantity}</p>
      <button
        onClick={handleClickAdd}
        className="w-8 text-[#D5778D] cursor-pointer"
      >
        +
      </button>
    </div>
  );
}

function OrderActions({
  productPrice,
  productID,
  quantity,
}: {
  productPrice: number;
  productID: number;
  quantity: number;
}) {
  const cartContext = useCartContext();
  const checkoutProductContext = useCheckoutProductContext();
  const navigate = useNavigate();

  function handleRemoveProduct() {
    cartContext.removeProduct(productID);
  }

  function handleMakeOrder() {
    checkoutProductContext.setCheckoutProduct(
      cartContext.cartProductList.find((p) => p.productID == productID),
    );
    navigate("/checkout");
  }

  return (
    <div className="flex flex-col items-center font-default">
      <p className="text-[#B4A1A6] text-4xl">{productPrice * quantity} руб.</p>
      <button
        onClick={handleMakeOrder}
        className="bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-4xl text-[#D5778D] text-3xl cursor-pointer mt-5 py-1.5 px-4"
      >
        Оформить заказ
      </button>
      <button
        onClick={handleRemoveProduct}
        className="text-2xl text-[#B5ABA1] hover:text-[#BC4241] mt-1 cursor-pointer"
      >
        Удалить товар
      </button>
    </div>
  );
}
