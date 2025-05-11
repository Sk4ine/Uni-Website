import artezaLogo from '../assets/Arteza.png';
import shoppingCartIcon from '../assets/shoppingCartIcon.png';
import shoppingCartIconPink from '../assets/shoppinCartIconPink.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import type { Product } from '../classes/product';

export function NavigationBar() {
  return (
    <div className="flex items-end gap-5 justify-center h-40 border-b-4 border-[#EF829A]">
      <img src={artezaLogo} className="h-[80%] object-none"></img>
      <NavigationBarButton text="Главная" color="pink" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></NavigationBarButton>
      <NavigationBarButton text="Каталог" color="gray" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></NavigationBarButton>
      <SearchBar></SearchBar>
      <NavigationBarIcon iconImagePath={shoppingCartIcon} url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></NavigationBarIcon>
      <NavigationBarButton text="Вход" color="gray" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></NavigationBarButton>
    </div>
  )
}

function NavigationBarButton({text, color, url} : {text: string, color: string, url: string}) {
  const colors: {[index: string]: string} = {
    pink: "text-[#D5778D] hover:text-[#B36476]",
    gray: "text-[#B5ABA1] hover:text-[#878078]"
  };

  return (
    <a href={url} className={`${colors[color]} font-default h-[65%] m-2 mb-0 p-3 text-center content-center text-4xl`}>{text}</a>
  )
}

function SearchBar() {
  return (
    <div className='ml-2 h-[65%] content-center'>
      <div className='flex justify-between w-72 border-3 border-[#555555] rounded-4xl p-2'>
        <p className='inline font-default text-2xl text-[#B5ABA1] ml-3 basis-[80%]'>Найти</p>
        <FontAwesomeIcon className='basis-[20%] mt-1 text-[#555555]' icon={faMagnifyingGlass} size='xl' />
      </div>
    </div>
  )
}

function NavigationBarIcon({iconImagePath, url} : {iconImagePath: string, url: string}) {
  return (
    <a href={url} className='flex justify-center items-center h-[65%] w-20'>
      <img src={iconImagePath} className='object-none'></img>
    </a>
  )
}

export function ProductCard({product} : {product : Product}) {
  return (
    <div className='w-80 flex flex-col items-center justify-between bg-white shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] rounded-2xl'>
      <img src={product.imagePaths[0]} className='mt-[8%] w-[75%] object-cover object-center rounded-2xl'></img>
      <p className='font-default text-4xl text-[#B4A1A6] mt-2'>{product.name}</p>
      <p className='font-default text-4xl text-[#B4A1A6] mt-[-0.3rem] mb-2'>{product.price} руб.</p>

      <a href={product.productPageURL} className='w-[90%] flex justify-center gap-2 items-center bg-[#F5D4D5] mb-[8%] rounded-3xl hover:bg-[#E6C8C9]'>
        <p className='font-default text-4xl text-[#D5778D] py-2'>В корзину</p>
        <img src={shoppingCartIconPink} className='object-none'></img>
      </a>
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
  const filteredValue: string = value !== undefined ? value : "";
  return (
    <div className="flex flex-col items-start">
      <label htmlFor={fieldID} className="font-default text-[#555555] text-3xl">{fieldName}</label>
      <input type="text" name={fieldID} value={filteredValue} className="w-80 text-[#555555] text-2xl px-4 py-1.5 rounded-2xl outline-none shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"></input>
    </div>
  )
}