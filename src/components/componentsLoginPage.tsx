import { Link, useNavigate } from 'react-router';
import artezaLogo from '../assets/Arteza.png';
import { InputField } from './componentsCommon';
import { useContext, useState } from 'react';
import { CurrentUserContext, useCurrentUserContext, UserListContext, useUserListContext } from './contexts';
import type { User } from '../classes/user';

export function HomePageButton() {
  return (
    <div className="flex justify-center h-40 items-end box-content border-b-4 border-[#EF829A]">
      <Link to={"/home"} className='h-[80%] flex justify-center items-center'>
        <img src={artezaLogo} className="h-full object-none"></img>
      </Link>
    </div>
  )
}

export function LoginSection() {
  return (
    <div className='flex flex-col items-center'>
      <p className='font-default text-[#D5778D] text-5xl mt-10'>Вход</p>
      <LoginForm></LoginForm>
    </div>
  )
}

function LoginForm() {
  const userListContext = useUserListContext();
  const currentUserContext = useCurrentUserContext();
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  console.log(userListContext?.userList);

  function login(formData: FormData) {
    const filteredUserList: User[] = userListContext.userList.filter((user) => user.email == formData.get("email") && user.password == formData.get("password"));

    if(filteredUserList.length == 0) {
      setLoginFailed(true);
      return;
    }

    currentUserContext.setCurrentUser(filteredUserList[0]);
    navigate("/home");
  }

  return (
    <form action={login} className='mt-6 flex flex-col py-6 px-10 gap-5 items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]'>
      <InputField fieldName='Email' fieldID='email' required={true}></InputField>
      <PasswordInputField fieldName='Пароль' fieldID='password'></PasswordInputField>
      <div className='w-full flex flex-col items-center gap-2 mt-4'>
        {loginFailed ?
          <p className='font-default text-[#BC4241] text-2xl'>Неверный email или пароль</p>
        :
          null
        }
        <button type='submit' className='w-[90%] font-default text-[#D5778D] text-4xl py-2 rounded-2xl bg-[#F5D4D5] hover:bg-[#E6C8C9] cursor-pointer'>Войти</button>
      </div>
      <div className='flex flex-col items-center font-default text-[#555555] text-2xl'>
        <p>Нет учетной записи?</p>
        <Link to={"/registration"} className='text-[#D5778D]'> Создать</Link>
      </div>
    </form>
  )
}

function PasswordInputField({fieldName, fieldID} : {fieldName: string, fieldID : string}) {
  return (
    <div className="flex flex-col items-start">
      <div className='w-full flex justify-between items-end mb-1'>
        <p className="font-default text-[#555555] text-3xl">{fieldName}</p>
        <Link to={"/home"} className='font-default text-[#D5778D] text-xl'>Забыли пароль?</Link>
      </div>
      <input type="password" name={fieldID} required className="w-80 text-[#555555] text-2xl px-4 py-1.5 rounded-2xl outline-none shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"></input>
    </div>
  )
}

export function EmptySpace() {
  return (
    <div className='h-48'></div>
  )
}