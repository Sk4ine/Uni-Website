import { Link, useNavigate } from "react-router";
import { InputField } from "./componentsCommon";
import { HomePageButton } from "./componentsLoginPage";
import { useContext, useState } from "react";
import { CurrentUserContext, UserListContext } from "./contexts";
import { User } from "../classes/user";

export function RegistrationSection() {
  return (
    <div className='flex flex-col items-center'>
      <p className='font-default text-[#D5778D] text-5xl mt-10'>Регистрация</p>
      <RegistrationForm></RegistrationForm>
    </div>
  )
}

export function RegistrationForm() {
  const navigate = useNavigate();
  const userListContext = useContext(UserListContext);

  const currentUserContext = useContext(CurrentUserContext);

  const [registrationFailMessage, setRegistrationFailMessage] = useState("");

  function registration(formData: FormData) {
    if(!userListContext || !currentUserContext) {
      return;
    }
    
    if(formData.get("email") === null) {
      return;
    }

    if(formData.get("password") !== formData.get("passwordConfirmation")) {
      setRegistrationFailMessage("Пароль и подтверждение не совпадают");
      return;
    }

    const newUser: User = new User(userListContext.userList.length + 1, formData.get("email") as string, formData.get("password") as string)

    userListContext.setUserList((userList) => [...userList, newUser]);
    
    navigate("/login")
  }

  return (
    <form action={registration} className='w-[400px] mt-6 flex flex-col py-6 px-10 gap-5 items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]'>
      <InputField fieldName='Email' fieldID='email' required={true}></InputField>
      <InputField fieldName='Пароль' fieldID='password' fieldType="password" required={true}></InputField>
      <InputField fieldName='Подтверждение пароля' fieldID='passwordConfirmation' fieldType="password" required={true}></InputField>
      <div className='w-full flex flex-col items-center gap-2 mt-4 flex-wrap'>
        {registrationFailMessage.length != 0 ?
          <p className='font-default text-[#BC4241] text-2xl text-center'>{registrationFailMessage}</p>
        :
          null
        }
        <button type='submit' className='w-full font-default text-[#D5778D] text-3xl py-2 rounded-2xl bg-[#F5D4D5] hover:bg-[#E6C8C9] cursor-pointer'>Зарегистрироваться</button>
      </div>
      <div className='flex flex-col items-center font-default text-[#555555] text-2xl'>
        <p>Уже есть учетная запись?</p>
        <Link to={"/login"} className='text-[#D5778D]'> Войти</Link>
      </div>
    </form>
  )
}