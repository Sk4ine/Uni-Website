import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "../classes/product";
import { InputField } from "./componentsCommon";

export function CheckoutSection({product} : {product: Product}) {
  return (
    <div className="flex flex-col items-center mb-48">
      <div className="flex mt-6 w-[1094px] h-16">
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="flex justify-center items-center cursor-pointer text-[#B5ABA1] hover:text-[#878078]">
          <FontAwesomeIcon className='basis-[20%] mt-1' icon={faChevronLeft} size='lg' />
          <p className="font-default text-2xl text-nowrap ml-1">В корзину</p>
        </a>
        <p className="font-default text-[#D5778D] text-6xl absolute left-1/2 transform-[TranslateX(-50%)]">Оформление заказа</p>
      </div>
      <OrderInfo product={product}></OrderInfo>
    </div>
  )
}

function OrderInfo({product} : {product: Product}) {
  return (
    <form className="w-[914px] flex justify-between mt-6">
      <CustomerInfo></CustomerInfo>
      <div className="flex flex-col items-center gap-16">
        <ProductInfo product={product}></ProductInfo>
        <button className="w-[60%] font-default text-[#D5778D] text-4xl bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Заказать</button>
      </div>
    </form>
  )
}

function CustomerInfo() {
  return (
    <div className="flex flex-col">
      <p className="font-default text-[#D5778D] text-4xl">Покупатель</p>
      <div className="flex flex-col mt-4 gap-6">
        <InputField fieldName="Имя" fieldID="firstName"></InputField>
        <InputField fieldName="Фамилия" fieldID="secondName"></InputField>
        <InputField fieldName="Номер телефона" fieldID="phoneNumber"></InputField>
        <InputField fieldName="Электронная почта" fieldID="email"></InputField>
        <InputField fieldName="Адрес пункта выдачи" fieldID="dropsiteAddress"></InputField>
      </div>
    </div>
  )
}

function ProductInfo({product} : {product: Product}) {
  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-4xl">
      <img src={product.imagePaths[0]} className="w-[80%] aspect-square mt-2 object-cover"></img>
      <p className="mt-3">{product.name}</p>
      <p>{product.price} руб.</p>
    </div>
  )
}