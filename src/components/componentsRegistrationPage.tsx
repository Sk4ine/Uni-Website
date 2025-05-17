import { Link } from "react-router";
import { InputField } from "./componentsCommon";
import { HomePageButton } from "./componentsLoginPage";

export function RegistrationSection() {
  return (
    <div className='flex flex-col items-center'>
      <p className='font-default text-[#D5778D] text-5xl mt-10'>Регистрация</p>
      <RegistrationForm></RegistrationForm>
    </div>
  )
}

export function RegistrationForm() {
  return (
    <form className='mt-6 flex flex-col py-6 px-10 gap-5 items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]'>
      <InputField fieldName='Email' fieldID='email'></InputField>
      <InputField fieldName='Пароль' fieldID='password'></InputField>
      <InputField fieldName='Подтверждение пароля' fieldID='passwordConfirmation'></InputField>
      <button type='submit' className='w-full font-default text-[#D5778D] mt-4 text-3xl py-2 rounded-2xl bg-[#F5D4D5] hover:bg-[#E6C8C9] cursor-pointer'>Зарегистрироваться</button>
      <div className='flex flex-col items-center font-default text-[#555555] text-2xl'>
        <p>Уже есть учетная запись?</p>
        <Link to={"/login"} className='text-[#D5778D]'> Войти</Link>
      </div>
    </form>
  )
}