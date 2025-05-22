import { useContext } from "react";
import type { Order } from "../classes/order";
import { User } from "../classes/user";
import { InputField } from "./componentsCommon";
import { ProductListContext, useCurrentUserContext, useOrderListContext, useUserListContext } from "./contexts";
import type { Product } from "../classes/product";

import defaultUserLogo from '../assets/defaultUserLogo.png';
import { useNavigate } from "react-router";
import axios from "axios";
import type { UserResponse } from "../classes/apiResponses";

export function UserProfileSection({children} : {children: React.ReactNode}) {
  return (
    <div className="flex flex-col items-center mb-48">
      {children}
    </div>
  )
}

export function UserInfo() {
  const currentUserContext = useCurrentUserContext();

  if(!currentUserContext.currentUser) {
    return;
  }

  const user: User = currentUserContext.currentUser;

  return (
    <div className="flex justify-between w-[1100px] mt-12">
      <UserLogo user={user}></UserLogo>
      <UserInfoForm user={user}></UserInfoForm>
    </div>
  )
}

function UserLogo({user} : {user: User}) {
  return (
    <div className="flex flex-col items-center w-[30%] gap-4">
      <img src={user.logoImagePath ? user.logoImagePath : defaultUserLogo} className="w-32 h-32 object-cover rounded-full"></img>
      <p className="font-default text-[#D5778D] text-4xl text-wrap text-center">
        {user.firstName || user.secondName ? `${user.firstName} ${user.secondName}` : `user${user.id}`}
      </p>
    </div>
  )
}

function UserInfoForm({user} : {user: User}) {
  const navigate = useNavigate();
  const currentUserContext = useCurrentUserContext();

  function handleSignOutClick() {
    currentUserContext.setCurrentUser(undefined);
    navigate("/home");
  }

  function saveUserInfo(formData: FormData) {
    if(!currentUserContext.currentUser) {
      return;
    }

    const id: number = currentUserContext.currentUser.id;

    const changedUser: User = new User(
      id,
      formData.get("email") as string,
      "",
      formData.get("firstName") as string,
      formData.get("secondName") as string,
      formData.get("phoneNumber") as string
    );

    axios.put(`http://localhost:8080/api/users/${id}`, {firstName: changedUser.firstName, secondName: changedUser.secondName, email: changedUser.email, phoneNumber: changedUser.phoneNumber})
      .then(res => {
        const user: UserResponse = res.data;

        const userName: string[] = user.name.split(" ");

        currentUserContext.setCurrentUser(new User(user.id, user.email, "", userName[0], userName[1], user.phoneNumber));
      })
      .catch(err => console.error(err));
  }

  return (
    <form action={saveUserInfo} className="flex flex-col gap-6 w-[70%] pl-24">
      <div className="flex flex-col flex-wrap h-48 gap-x-5 gap-y-6">
        <InputField fieldName="Имя" fieldID="firstName" value={user.firstName}></InputField>
        <InputField fieldName="Фамилия" fieldID="secondName" value={user.secondName}></InputField>
        <InputField fieldName="Номер телефона" fieldID="phoneNumber" value={user.phoneNumber}></InputField>
        <InputField fieldName="Электронная почта" fieldID="email" value={user.email} required></InputField>
      </div>
      <div className="flex justify-between items-center font-default text-[#D5778D] text-4xl">
        <button type="submit" className="w-fit px-6 bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Сохранить</button>
        <button onClick={handleSignOutClick} className="w-fit px-6 bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Выйти</button>
      </div>
    </form>
  )
}

export function OrdersList() {
  const orderListContext = useOrderListContext();
  const currentUserContext = useCurrentUserContext();

  if(!currentUserContext.currentUser) {
    return;
  }

  const user: User = currentUserContext.currentUser;

  const filteredOrders: Order[] = orderListContext.orderList.filter((order) => order.userID == user.id);

  const orderCards: React.ReactNode[] = [];

  for(let i = 0; i < filteredOrders.length; i++) {
    orderCards.push(<OrderCard key={i} order={filteredOrders[i]}></OrderCard>);
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="font-default text-[#D5778D] text-6xl">Заказы</h1>
      <div className="flex flex-wrap w-[1200px] mt-3 gap-x-3.5 gap-y-6 pl-2.5">
        {orderCards}
      </div>
    </div>
  )
}

export function OrderCard({order} : {order: Order}) {
  const productListContext = useContext(ProductListContext);

  const product: Product = productListContext.filter((p) => p.id == order.product.productID)[0];
  
  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-4xl">
      <img src={product.imagePaths[0]} className="w-[80%] aspect-square mt-2 object-cover rounded-2xl"></img>
      <p className="mt-3">{product.name}</p>
      <p className="">{order.product.quantity} шт.</p>
      <p>{order.cost} руб.</p>
      <p className="text-[#D5778D] mt-3">{order.status}</p>
    </div>
  )
}