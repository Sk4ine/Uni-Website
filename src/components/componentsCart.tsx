import type { Product } from "../classes/product"

export function CartSection({children} : {children : React.ReactNode}) {
  return (
    <div className="flex flex-col items-center mb-48">
      <h1 className="font-default text-[#D5778D] text-6xl mt-7">Корзина</h1>
      <CartProductList>
        {children}
      </CartProductList>
    </div>
  )
}

function CartProductList({children} : {children: React.ReactNode}) {
  return (
    <div className="w-[960px]">
      <p className="font-default text-[#B5ABA1] text-2xl ml-5 mb-5">Выбрать</p>
      <div className="flex flex-col items-center gap-5">
        {children}
      </div>
    </div>
  )
}

export function CartProduct({product, quantity} : {product: Product, quantity: number}) {
  return (
    <div className="w-full h-64 flex justify-between items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]">
      <img src={product.imagePaths[0]} className='h-[88%] ml-4 object-contain rounded-2xl basis-1/4'></img>
      <div className="flex justify-between items-start pl-8 pr-6 basis-3/4 self-start mt-10">
        <ProductInfo productName={product.name} quantity={quantity}></ProductInfo>
        <OrderActions productPrice={product.price}></OrderActions>
      </div>
    </div>
  )
}

function ProductInfo({productName, quantity} : {productName: string, quantity: number}) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-default text-[#B4A1A6] text-5xl">{productName}</p>
      <QuantityCounter quantity={quantity}></QuantityCounter>
    </div>
  )
}

function QuantityCounter({quantity} : {quantity: number}) {
  return (
    <div className="w-42 mt-4 flex justify-between items-center px-4 rounded-4xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-5xl">
      <button className="w-8 text-[#B4A1A6] cursor-pointer">-</button>
      <p className="text-[#B4A1A6]">{quantity}</p>
      <button className="w-8 text-[#D5778D] cursor-pointer">+</button>
    </div>
  )
}

function OrderActions({productPrice} : {productPrice: number}) {
  return (
    <div className="flex flex-col items-center font-default">
      <p className="text-[#B4A1A6] text-5xl">{productPrice} руб.</p>
      <button className="bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-4xl text-[#D5778D] text-4xl cursor-pointer mt-5 py-1.5 px-4">Оформить заказ</button>
      <button className="text-3xl text-[#B5ABA1] hover:text-[#BC4241] mt-1 cursor-pointer">Удалить товар</button>
    </div>
  )
}