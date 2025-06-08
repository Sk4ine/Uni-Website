import { useContext } from "react";
import type { Order } from "../classes/order";
import { User } from "../classes/user";
import { InputField, LoadingMessage } from "./Common";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import type { Product } from "../classes/product";
import defaultUserLogo from '../assets/defaultUserLogo.png';
import { useUserInfoContext } from "../contexts/userInfoContext";

export function UserProfileSection({ordersLoading} : {ordersLoading: boolean}) {
  const userInfoContext = useUserInfoContext();

  return (
    <div className="flex flex-col items-center mb-48">
      {userInfoContext.userLoading ? (
        <LoadingMessage text="Загрузка профиля..." heightVH={50}></LoadingMessage>
      ) : (
        <UserInfo></UserInfo>
      )}

      {ordersLoading ? (
        <LoadingMessage text="Загрузка заказов..." heightVH={50}></LoadingMessage>
      ) : (
        <OrdersList></OrdersList>
      )}
    </div>
  )
}

function UserInfo() {
  const userInfoContext = useUserInfoContext();

  return (
    <div className="flex justify-between w-[1100px] mt-12">
      <UserLogo user={userInfoContext.useUserInfo()}></UserLogo>
      <UserInfoForm user={userInfoContext.useUserInfo()}></UserInfoForm>
    </div>
  )
}

function UserLogo({user} : {user: User}) {
  return (
    <div className="flex flex-col items-center w-[30%] gap-4">
      <img src={defaultUserLogo} className="size-32 object-cover "></img>
      <p className="font-default text-[#D5778D] text-3xl text-wrap text-center">
        {user.firstName || user.secondName ? `${user.firstName} ${user.secondName}` : "user"}
      </p>
    </div>
  )
}

function UserInfoForm({user} : {user: User}) {
  const userInfoContext = useUserInfoContext();

  function saveUserInfo(formData: FormData) {
    userInfoContext.updateUser(
      localStorage.getItem("jwtToken"),
      formData.get("firstName") as string,
      formData.get("secondName") as string,
      formData.get("email") as string,
      formData.get("phonenumber") as string,
    );
  }

  return (
    <form action={saveUserInfo} className="flex flex-col gap-6 w-[70%] pl-24">
      <div className="flex flex-col flex-wrap h-48 gap-x-5 gap-y-6">
        <InputField fieldName="Имя" fieldID="firstName" value={user.firstName}></InputField>
        <InputField fieldName="Фамилия" fieldID="secondName" value={user.secondName}></InputField>
        <InputField fieldName="Номер телефона" fieldID="phoneNumber" value={user.phoneNumber}></InputField>
        <InputField fieldName="Электронная почта" fieldID="email" value={user.email} required></InputField>
      </div>
      <div className="flex justify-start items-center font-default text-[#D5778D] text-3xl">
        <button type="submit" className="w-fit px-6 bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Сохранить</button>
      </div>
    </form>
  )
}

function OrdersList() {
  const userOrders: Order[] = useContext(OrderListContext);

  const orderCards: React.ReactNode[] = [];

  for(let i = 0; i < userOrders.length; i++) {
    orderCards.push(<OrderCard key={i} order={userOrders[i]}></OrderCard>);
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="font-default text-[#D5778D] text-5xl">Заказы</h1>
      <div className="flex flex-wrap w-[1200px] mt-3 gap-x-3.5 gap-y-6 pl-2.5">
        {orderCards}
      </div>
    </div>
  )
}

function OrderCard({order} : {order: Order}) {
  const productListContext = useContext(ProductListContext);

  const product: Product = productListContext.filter((p) => p.id == order.productID)[0];
  
  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-3xl">
      <img src={product.imagePaths[0]} className="w-[80%] aspect-square mt-2 object-cover rounded-2xl"></img>
      <p className="mt-3">{product.name}</p>
      <p className="">{order.productQuantity} шт.</p>
      <p>{order.cost} руб.</p>
      <p className="text-[#D5778D] mt-3">{order.status}</p>
    </div>
  )
}