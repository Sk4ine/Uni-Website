import { Link, useNavigate } from "react-router";
import { InputField } from "./componentsCommon";
import { useState } from "react";
import { useUserListContext } from "./contexts";
import { User } from "../classes/user";
import axios from "axios";

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
  const userListContext = useUserListContext();

  const [registrationFailMessage, setRegistrationFailMessage] = useState("");

  function registration(formData: FormData) {    
    if(formData.get("password") !== formData.get("passwordConfirmation")) {
      setRegistrationFailMessage("Пароль и подтверждение не совпадают");
      return;
    }

    axios.post("http://localhost:8080/api/users", {email: formData.get("email") as string, password: formData.get("password") as string})
      .then(() => {
        navigate("/login");
      })
      .catch(err => {
        if(axios.isAxiosError(err)) {
          switch (err.response?.status) {
            case 409:
              setRegistrationFailMessage("Пользователь с таким email уже существует");
              break;
            default:
              setRegistrationFailMessage("Неизвестная ошибка");
              console.log(err);
          }
        }
      });
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