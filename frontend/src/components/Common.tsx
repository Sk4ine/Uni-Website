import shoppingCartIconPink from '../assets/shoppinCartIconPink.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons'
import type { Product } from '../classes/product';
import { Link } from 'react-router';
import { useContext } from 'react';
import { ProductListContext } from '../contexts/otherContexts';
import { useCartContext } from '../contexts/cartContext';
import { useActiveCategoryContext } from '../contexts/activeCategoryContext';

export function ProductCard({product} : {product : Product}) {
  const cartContext = useCartContext();

  function handleClick() {
    cartContext.addProduct(product.id);
  }

  return (
    <div className='w-80 flex flex-col items-center justify-between bg-white shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] rounded-2xl'>
      <Link to={`/catalog/${product.id}`} className='w-full flex flex-col items-center'>
        <img src={product.imagePaths[0]} className='mt-[8%] w-[75%] object-cover object-center rounded-2xl'></img>
        <p className='font-default text-2xl text-[#B4A1A6] mt-2'>{product.name}</p>
        <p className='font-default text-3xl text-[#B4A1A6] mb-2'>{product.price} руб.</p>
      </Link>
      { cartContext.cartProductList.find((p) => p.productID == product.id) ? (
        <Link to="/cart" className='w-[90%] flex justify-center gap-2 items-center bg-[#F5D4D5] mb-[8%] rounded-3xl hover:bg-[#E6C8C9] cursor-pointer'>
          <p className='font-default text-2xl text-[#D5778D] py-2'>В корзине</p>
          <FontAwesomeIcon className='object-none text-[#D5778D] ml-2' icon={faCircleCheck} size="2xl"></FontAwesomeIcon>
        </Link>
      ) : (
        <button onClick={handleClick} className='w-[90%] flex justify-center gap-2 items-center bg-[#F5D4D5] mb-[8%] rounded-3xl hover:bg-[#E6C8C9] cursor-pointer'>
          <p className='font-default text-2xl text-[#D5778D] py-2'>В корзину</p>
          <img src={shoppingCartIconPink} className='object-none'></img>
        </button>
      )}
    </div>
  )
}

export function Footer({phoneNumber, address} : {phoneNumber: string, address: string}) {
  return (
    <div className='bg-[#D9D9D9] h-[356px] mt-9'>
      <div className='ml-[24%] pt-11 text-[#616161] font-default text-4xl'>
        <p className='mb-2'>О нас</p>
        <p className='mb-2'>Телефон: {phoneNumber}</p>
        <p>Адрес: {address}</p>
      </div>
    </div>
  )
}

export function ProductList() {
  const productListContext = useContext(ProductListContext);
  const activeCategoryContext = useActiveCategoryContext();
  
  const productCards: React.ReactNode[] = [];
  
  for(let i = 0; i < productListContext.length; i++) {
    const curProductCategory = productListContext[i].categoryID;
    if((curProductCategory == activeCategoryContext.activeCategory) || (activeCategoryContext.activeCategory == 0)) {
      productCards.push(<ProductCard key={i} product={productListContext[i]}></ProductCard>);
    }
  }

  return (
    <div className='flex flex-wrap justify-start pl-[11px] w-[1344px] mt-9 gap-x-3.5 gap-y-6'>
      {productCards}
    </div>
  )
}

export function InputField({fieldName, fieldID, value, required, fieldType, disabled} : {fieldName: string, fieldID : string, value?: string, required?: boolean, fieldType?: string, disabled?: boolean}) {
  return (
    <div className="flex flex-col items-start ">
      <label htmlFor={fieldID} className="font-default text-[#555555] text-2xl">{fieldName}</label>
      <input type={fieldType ? fieldType : "text"} name={fieldID} defaultValue={value} required={required} disabled={disabled} className="w-80 text-[#555555] text-xl px-4 py-1.5 rounded-2xl outline-none disabled:bg-[#EBEBEB] shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"></input>
    </div>
  )
}

export function LoadingText() {
  return (
    <div className="flex flex-col items-center mt-24 mb-48">
      <h1 className="font-default text-[#B4A1A6] text-4xl mt-7">Загрузка...</h1>
    </div>
  )
}

export function PageWrapper({children} : {children: React.ReactNode}) {
  return (
    <div className='flex flex-col min-h-[100vh]'>
      {children}
    </div>
  )
}

export function ContentWrapper({children} : {children: React.ReactNode}) {
  return (
    <div className='grow'>
      {children}
    </div>
  )
}