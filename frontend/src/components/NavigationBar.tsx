import {faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router";
import { useCartContext } from "../contexts/cartContext";
import { useCurrentUserContext } from "../contexts/currentUserContext";

import defaultUserLogo from '../assets/defaultUserLogo.png';
import artezaLogo from '../assets/Arteza.png';
import shoppingCartIcon from '../assets/shoppingCartIcon.png';
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export function NavigationBar() {
  const border: string = location.pathname == "/home" ? "p-[10rem-4px]" : "box-content border-b-4 border-[#EF829A]";

  return (
    <div className={`flex items-end gap-5 justify-center h-40 bg-white ${border}`}>
      <img src={artezaLogo} className="h-[80%] object-none"></img>
      <NavigationBarButton text="Главная" url="/home"></NavigationBarButton>
      <NavigationBarButton text="Каталог" url="/catalog"></NavigationBarButton>
      <SearchBar></SearchBar>
      <CartIcon></CartIcon>
      <AccountButton></AccountButton>
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
    <Link to={url} className={`${activeColor} font-default h-[65%] m-2 mb-0 p-3 text-center content-center text-3xl`}>{text}</Link>
  )
}

function UserLogoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentUserContext = useCurrentUserContext();

  const colors: {[index: string]: string} = {
    pink: "bg-[#D5778D] group-hover:bg-[#B36476]",
    gray: "bg-[#B5ABA1] group-hover:bg-[#878078]"
  };

  const curLocation = useLocation().pathname;

  const activeColor: string = (curLocation == "/user-profile") ? colors["pink"] : colors["gray"];

  function handleSignOut() {
    currentUserContext.setCurrentUser(undefined);
    if(curLocation == "/user-profile") {
      navigate("/home");
      return;
    }
    
    navigate(0);
  }

  useEffect(() => {
    console.log(currentUserContext.currentUser?.id);
    axios.get<boolean>(`http://localhost:8080/api/users/${currentUserContext.currentUser?.id}/is-admin`)
      .then(res => {
        setIsAdmin(res.data);
      })
      .catch(err => console.log(err));

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(true)} className={`flex justify-center items-center group cursor-pointer`}>
        <div style={{maskImage: `url(${defaultUserLogo})`}} className={`${activeColor} size-[50px] mask-contain mask-no-repeat mask-center`}></div>
      </button>

      {isOpen && (
        <div className="absolute translate-x-[-50%] left-[50%] mt-2 bg-white rounded-xl shadow-lg ring-1 ring-[#555555]/10 z-10">
          <div className="flex flex-col text-lg font-default">
            <Link to="/user-profile" className="pl-4 pr-10 py-2 text-[#555555] hover:bg-gray-100 rounded-t-xl">
              Профиль
            </Link>

            {isAdmin && (
              <Link to="/admin-panel" className="text-nowrap pl-4 pr-10 py-2 text-[#555555] hover:bg-gray-100">
                Админ панель
              </Link>
            )}

            <button onClick={handleSignOut} className="text-left pl-4 pr-10 py-2 text-[#BC4241] hover:bg-gray-100 rounded-b-xl cursor-pointer">
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function AccountButton() {
  const currentUserContext = useCurrentUserContext();

  return (
    <div className="flex justify-center items-center h-[65%] w-20">
      { currentUserContext.currentUser !== undefined ? (
        <UserLogoButton></UserLogoButton>
      ) : (
        <NavigationBarButton text="Вход" url="/login"></NavigationBarButton>
      )}
    </div>
  )
}

function SearchBar() {
  return (
    <div className='ml-2 h-[65%] content-center'>
      <form className='flex justify-between w-72 border-2 border-[#878078] rounded-4xl p-2'>
        <input type='text' placeholder='Найти' className='inline font-default text-xl text-[#878078] ml-3 w-[80%] placeholder:text-[#878078] outline-none indent-1'></input>
        <FontAwesomeIcon className='w-[20%] mt-1 text-[#878078]' icon={faMagnifyingGlass} size='xl' />
      </form>
    </div>
  )
}

function CartIcon() {
  const cartContext = useCartContext();

  const colors: {[index: string]: string} = {
    pink: "bg-[#D5778D] group-hover:bg-[#B36476]",
    gray: "bg-[#B5ABA1] group-hover:bg-[#878078]"
  };

  const activeColor: string = (useLocation().pathname == "/cart") ? colors["pink"] : colors["gray"];

  return (
    <Link to={"/cart"} className={`flex justify-center items-center h-[65%] w-20 group`}>
      <div className='relative size-[50px]'>
        <div style={{maskImage: `url(${shoppingCartIcon})`}} className={`${activeColor} size-full mask-contain mask-no-repeat mask-center`}></div>
        <div style={{visibility: cartContext.cartProductList.length > 0 ? "visible" : "hidden"}} className='size-[20px] flex justify-center items-center absolute right-[-8px] top-0 rounded-full bg-[#D5778D]'>
          <p className='font-default text-[16px] text-white pt-[0.115rem]'>{cartContext.cartProductList.length}</p>
        </div>
      </div>
      
    </Link>
  )
}