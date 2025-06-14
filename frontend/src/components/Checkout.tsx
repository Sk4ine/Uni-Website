import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../classes/product";
import { InputField, LoadingMessage } from "./Common";
import { Link } from "react-router";
import type { CartProduct } from "../classes/cartProduct";
import { useCheckoutProductDataContext } from "../contexts/checkoutProductDataContext";
import { useCartContext } from "../contexts/cartContext";
import { useCheckoutProductContext } from "../contexts/checkoutProductContext";
import { addOrder } from "../api/requests/orders";
import { useUserInfoContext } from "../contexts/userInfoContext";

export function CheckoutSection() {
  const checkoutProductDataContext = useCheckoutProductDataContext();

  return (
    <div className="flex flex-col items-center mb-48">
      <div className="flex mt-6 w-[1094px] h-16">
        <Link
          to="/cart"
          className="flex justify-center items-center cursor-pointer text-[#B5ABA1] hover:text-[#878078]"
        >
          <FontAwesomeIcon className="basis-[20%] mt-1" icon={faChevronLeft} size="lg" />
          <p className="font-default text-xl text-nowrap ml-1">В корзину</p>
        </Link>
        <p className="font-default text-[#D5778D] text-5xl absolute left-1/2 transform-[TranslateX(-50%)]">
          Оформление заказа
        </p>
      </div>
      <OrderInfo product={checkoutProductDataContext}></OrderInfo>
    </div>
  );
}

function OrderInfo({ product }: { product: Product }) {
  const cartContext = useCartContext();
  const checkoutProductContext = useCheckoutProductContext();

  function makeOrder(formData: FormData) {
    const cartProduct: CartProduct | undefined = checkoutProductContext.checkoutProduct;

    async function addNewOrder(cartProduct: CartProduct) {
      try {
        await addOrder(
          formData.get("shippingAddress") as string,
          cartProduct.productID,
          cartProduct.quantity,
        );
      } catch (error) {
        console.log(error);
      }
    }

    if (!cartProduct) {
      return;
    }

    addNewOrder(cartProduct);

    cartContext.removeProduct(cartProduct.productID);

    checkoutProductContext.setCheckoutProduct(undefined);
  }

  return (
    <form action={makeOrder} className="w-[914px] flex justify-between mt-6">
      <CustomerInfo></CustomerInfo>
      <div className="flex flex-col items-center gap-16">
        <ProductInfo product={product}></ProductInfo>
        <button
          type="submit"
          className="w-[60%] font-default text-[#D5778D] text-3xl bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer"
        >
          Заказать
        </button>
      </div>
    </form>
  );
}

function CustomerInfo() {
  const { userLoading, useUserInfo } = useUserInfoContext();
  const userInfo = useUserInfo();

  if (userLoading) {
    return <LoadingMessage text="Загрузка данных пользователя..." heightVH={50}></LoadingMessage>;
  }

  return (
    <div className="flex flex-col">
      <p className="font-default text-[#D5778D] text-3xl">Покупатель</p>
      <div className="flex flex-col mt-4 gap-6">
        <InputField
          fieldName="Имя"
          fieldID="firstName"
          disabled={true}
          value={userInfo.firstName}
        ></InputField>
        <InputField
          fieldName="Фамилия"
          fieldID="secondName"
          disabled={true}
          value={userInfo.secondName}
        ></InputField>
        <InputField
          fieldName="Номер телефона"
          fieldID="phoneNumber"
          disabled={true}
          value={userInfo.phoneNumber}
        ></InputField>
        <InputField
          fieldName="Электронная почта"
          fieldID="email"
          disabled={true}
          value={userInfo.email}
          required
        ></InputField>
        <InputField fieldName="Адрес пункта выдачи" fieldID="shippingAddress" required></InputField>
      </div>
    </div>
  );
}

function ProductInfo({ product }: { product: Product }) {
  const cartContext = useCartContext();

  const quantity = cartContext.cartProductList.find((p) => p.productID == product.id)?.quantity;

  if (!quantity) return;

  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-3xl">
      <img
        src={product.imagePaths[0]}
        alt=""
        className="w-[80%] aspect-square mt-2 object-cover"
      ></img>
      <p className="mt-3">{product.name}</p>
      <p>{quantity} шт.</p>
      <p>{product.price * quantity} руб.</p>
    </div>
  );
}
