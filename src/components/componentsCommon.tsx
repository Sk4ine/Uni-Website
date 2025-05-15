import artezaLogo from '../assets/Arteza.png';
import shoppingCartIcon from '../assets/shoppingCartIcon.png';
import shoppingCartIconPink from '../assets/shoppinCartIconPink.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import type { Product } from '../classes/product';
import { Link, useLocation } from 'react-router';
import { useContext, useState } from 'react';
import { CartContext } from '../App';

export function NavigationBar() {
  const border: string = location.pathname == "/home" ? "p-[10rem-4px]" : "box-content border-b-4 border-[#EF829A]";

  return (
    <div className={`flex items-end gap-5 justify-center h-40 ${border}`}>
      <img src={artezaLogo} className="h-[80%] object-none"></img>
      <NavigationBarButton text="Главная" url="/home"></NavigationBarButton>
      <NavigationBarButton text="Каталог" url="/catalog"></NavigationBarButton>
      <SearchBar></SearchBar>
      <NavigationBarIcon iconImagePath={shoppingCartIcon} url="/cart"></NavigationBarIcon>
      <NavigationBarButton text="Вход" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></NavigationBarButton>
    </div>
  )
}

function NavigationBarButton({text, url} : {text: string, url: string}) {
  const colors: {[index: string]: string} = {
    pink: "text-[#D5778D] hover:text-[#B36476]",
    gray: "text-[#B5ABA1] hover:text-[#878078]"
  };

  const activeColor: string = (useLocation().pathname == url) ? colors["pink"] : colors["gray"];

  return (
    <Link to={url} className={`${activeColor} font-default h-[65%] m-2 mb-0 p-3 text-center content-center text-4xl`}>{text}</Link>
  )
}

function SearchBar() {
  return (
    <div className='ml-2 h-[65%] content-center'>
      <form className='flex justify-between w-72 border-3 border-[#555555] rounded-4xl p-2'>
        <input type='text' placeholder='Найти' className='inline font-default text-2xl text-[##555555] ml-3 w-[80%] placeholder:text-[#B5ABA1] outline-none indent-1'></input>
        <FontAwesomeIcon className='w-[20%] mt-1 text-[#555555]' icon={faMagnifyingGlass} size='xl' />
      </form>
    </div>
  )
}

function NavigationBarIcon({iconImagePath, url} : {iconImagePath: string, url: string}) {
  const colors: {[index: string]: string} = {
    pink: "bg-[#D5778D] hover:bg-[#B36476]",
    gray: "bg-[#B5ABA1] hover:bg-[#878078]"
  };

  const activeColor: string = (useLocation().pathname == url) ? colors["pink"] : colors["gray"];

  return (
    <a href={url} style={{maskImage: `url(${iconImagePath})`}} className={`${activeColor} flex justify-center items-center h-[65%] w-20 mask-no-repeat mask-center`}></a>
  )
}

export function ProductCard({product} : {product : Product}) {
  const {addProduct} = useContext(CartContext);

  function handleClick() {
    addProduct(product.id);
  }

  return (
    <div className='w-80 flex flex-col items-center justify-between bg-white shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] rounded-2xl'>
      <Link to={`/catalog/${product.id}`} className='flex flex-col items-center'>
        <img src={product.imagePaths[0]} className='mt-[8%] w-[75%] object-cover object-center rounded-2xl'></img>
        <p className='font-default text-4xl text-[#B4A1A6] mt-2'>{product.name}</p>
        <p className='font-default text-4xl text-[#B4A1A6] mt-[-0.3rem] mb-2'>{product.price} руб.</p>
      </Link>

      <button onClick={handleClick} className='w-[90%] flex justify-center gap-2 items-center bg-[#F5D4D5] mb-[8%] rounded-3xl hover:bg-[#E6C8C9] cursor-pointer'>
        <p className='font-default text-4xl text-[#D5778D] py-2'>В корзину</p>
        <img src={shoppingCartIconPink} className='object-none'></img>
      </button>
    </div>
  )
}

export function Footer({phoneNumber, address} : {phoneNumber: string, address: string}) {
  return (
    <div className='bg-[#D9D9D9] h-[356px] mt-9'>
      <div className='ml-[24%] pt-11 text-[#616161] font-default text-5xl'>
        <p className='mb-2'>О нас</p>
        <p className='mb-2'>Телефон: {phoneNumber}</p>
        <p>Адрес: {address}</p>
      </div>
    </div>
  )
}

export function ProductList({children} : {children: React.ReactNode}) {
  return (
    <div className='flex flex-wrap justify-start pl-[11px] w-[1344px] mt-9 gap-x-3.5 gap-y-6'>
      {children}
    </div>
  )
}

export function InputField({fieldName, fieldID, value} : {fieldName: string, fieldID : string, value?: string}) {
  return (
    <div className="flex flex-col items-start">
      <label htmlFor={fieldID} className="font-default text-[#555555] text-3xl">{fieldName}</label>
      <input type="text" name={fieldID} value={value} className="w-80 text-[#555555] text-2xl px-4 py-1.5 rounded-2xl outline-none shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"></input>
    </div>
  )
}