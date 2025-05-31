import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../classes/product";
import { InputField } from "./componentsCommon";
import { useContext } from "react";
import { ProductListContext, useCartContext, useCheckoutProductContext, useCheckoutProductDataContext, useCurrentUserContext, useUserListContext } from "./contexts";
import { Link, useNavigate } from "react-router";
import type { CartProduct } from "../classes/cartProduct";
import { User } from "../classes/user";
import { Order } from "../classes/order";
import axios from "axios";

export function CheckoutSection() {
  const checkoutProductDataContext = useCheckoutProductDataContext();

  return (
    <div className="flex flex-col items-center mb-48">
      <div className="flex mt-6 w-[1094px] h-16">
        <Link to="/cart" className="flex justify-center items-center cursor-pointer text-[#B5ABA1] hover:text-[#878078]">
          <FontAwesomeIcon className='basis-[20%] mt-1' icon={faChevronLeft} size='lg' />
          <p className="font-default text-xl text-nowrap ml-1">В корзину</p>
        </Link>
        <p className="font-default text-[#D5778D] text-5xl absolute left-1/2 transform-[TranslateX(-50%)]">Оформление заказа</p>
      </div>
      <OrderInfo product={checkoutProductDataContext}></OrderInfo>
    </div>
  )
}

function OrderInfo({product} : {product: Product}) {
  const cartContext = useCartContext();
  const checkoutProductContext = useCheckoutProductContext();
  const currentUserContext = useCurrentUserContext();
  const navigate = useNavigate();

  function makeOrder(formData: FormData) {
    const cartProduct: CartProduct | undefined = checkoutProductContext.checkoutProduct;

    if(!cartProduct) return;

    cartContext.removeProduct(cartProduct.productID);

    axios.post(`http://localhost:8080/api/users/${currentUserContext.currentUser?.id}/orders`, {
      shippingAddress: formData.get("shippingAddress") as string,
      productID: cartProduct.productID,
      productQuantity: cartProduct.quantity
      })
      .catch(err => console.log(err));

    navigate("/cart");
    
    checkoutProductContext.setCheckoutProduct(undefined);
  }

  return (
    <form action={makeOrder} className="w-[914px] flex justify-between mt-6">
      <CustomerInfo></CustomerInfo>
      <div className="flex flex-col items-center gap-16">
        <ProductInfo product={product}></ProductInfo>
        <button type="submit" className="w-[60%] font-default text-[#D5778D] text-3xl bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Заказать</button>
      </div>
    </form>
  )
}

function CustomerInfo() {
  const currentUserContext = useCurrentUserContext();

  const fieldDisabled: boolean = currentUserContext.currentUser ? true : false;

  return (
    <div className="flex flex-col">
      <p className="font-default text-[#D5778D] text-3xl">Покупатель</p>
      <div className="flex flex-col mt-4 gap-6">
        <InputField fieldName="Имя" fieldID="firstName" disabled={fieldDisabled} value={currentUserContext.currentUser?.firstName}></InputField>
        <InputField fieldName="Фамилия" fieldID="secondName" disabled={fieldDisabled} value={currentUserContext.currentUser?.secondName}></InputField>
        <InputField fieldName="Номер телефона" fieldID="phoneNumber" disabled={fieldDisabled} value={currentUserContext.currentUser?.phoneNumber}></InputField>
        <InputField fieldName="Электронная почта" fieldID="email" disabled={fieldDisabled} value={currentUserContext.currentUser?.email} required></InputField>
        <InputField fieldName="Адрес пункта выдачи" fieldID="shippingAddress" required></InputField>
      </div>
    </div>
  )
}

function ProductInfo({product} : {product: Product}) {
  const cartContext = useCartContext();

  const quantity = cartContext.cartProductList.find((p) => p.productID == product.id)?.quantity;

  if(!quantity) return;

  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-3xl">
      <img src={product.imagePaths[0]} className="w-[80%] aspect-square mt-2 object-cover"></img>
      <p className="mt-3">{product.name}</p>
      <p>{quantity} шт.</p>
      <p>{product.price * quantity} руб.</p>
    </div>
  )
}