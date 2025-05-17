import { Link } from 'react-router';
import artezaLogo from '../assets/Arteza.png';
import { InputField } from './componentsCommon';

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
  return (
    <form className='mt-6 flex flex-col py-6 px-10 gap-5 items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]'>
      <InputField fieldName='Email' fieldID='email'></InputField>
      <PasswordInputField fieldName='Пароль' fieldID='password'></PasswordInputField>
      <button type='submit' className='w-[90%] font-default text-[#D5778D] mt-4 text-4xl py-2 rounded-2xl bg-[#F5D4D5] hover:bg-[#E6C8C9] cursor-pointer'>Войти</button>
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
      <input type="text" name={fieldID} className="w-80 text-[#555555] text-2xl px-4 py-1.5 rounded-2xl outline-none shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"></input>
    </div>
  )
}

export function EmptySpace() {
  return (
    <div className='h-48'></div>
  )
}