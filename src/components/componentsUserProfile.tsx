import type { Order } from "../classes/order";
import type { User } from "../classes/user";
import { InputField } from "./componentsCommon";

export function UserProfileSection({children} : {children: React.ReactNode}) {
  return (
    <div className="flex flex-col items-center mb-48">
      {children}
    </div>
  )
}

export function UserInfo({user} : {user: User}) {
  return (
    <div className="flex gap-24 w-[1030px] mt-12">
      <UserLogo user={user}></UserLogo>
      <UserInfoForm user={user}></UserInfoForm>
    </div>
  )
}

function UserLogo({user} : {user: User}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <img src={user.logoImagePath} className="w-32 h-32 object-cover rounded-full"></img>
      <p className="font-default text-[#D5778D] text-4xl text-nowrap">{user.firstName} {user.secondName}</p>
    </div>
  )
}

function UserInfoForm({user} : {user: User}) {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col flex-wrap h-48 gap-x-5 gap-y-6">
        <InputField fieldName="Имя" fieldID="firstName" value={user.firstName}></InputField>
        <InputField fieldName="Фамилия" fieldID="secondName" value={user.secondName}></InputField>
        <InputField fieldName="Номер телефона" fieldID="phoneNumber"></InputField>
        <InputField fieldName="Электронная почта" fieldID="email"></InputField>
      </div>
      <button className="w-fit px-6 font-default text-[#D5778D] text-4xl bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Сохранить</button>
    </form>
  )
}

export function OrdersList({children} : {children: React.ReactNode}) {
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="font-default text-[#D5778D] text-6xl">Заказы</h1>
      <div className="flex flex-wrap w-[1200px] mt-3 gap-x-3.5 gap-y-6 pl-2.5">
        {children}
      </div>
    </div>
  )
}

export function OrderCard({order} : {order: Order}) {
  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-4xl">
      <img src={order.product.imagePaths[0]} className="w-[80%] aspect-square mt-2 object-cover"></img>
      <p className="mt-3">{order.product.name}</p>
      <p>{order.cost} руб.</p>
      <p className="text-[#D5778D]">{order.status}</p>
    </div>
  )
}