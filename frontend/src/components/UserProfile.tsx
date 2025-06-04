import { useContext } from "react";
import type { Order } from "../classes/order";
import { User } from "../classes/user";
import { InputField } from "./Common";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import type { Product } from "../classes/product";

import defaultUserLogo from '../assets/defaultUserLogo.png';
import { useNavigate } from "react-router";
import axios from "axios";
import type { UserResponse } from "../api/responses/apiResponses";
import { useCurrentUserContext } from "../contexts/currentUserContext";

export function UserProfileSection() {
  return (
    <div className="flex flex-col items-center mb-48">
      <UserInfo></UserInfo>
      <OrdersList></OrdersList>
    </div>
  )
}

function UserInfo() {
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
      <p className="font-default text-[#D5778D] text-3xl text-wrap text-center">
        {user.firstName || user.secondName ? `${user.firstName} ${user.secondName}` : `user${user.id}`}
      </p>
    </div>
  )
}

function UserInfoForm({user} : {user: User}) {
  const currentUserContext = useCurrentUserContext();
  const navigate = useNavigate();

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
      <div className="flex justify-start items-center font-default text-[#D5778D] text-3xl">
        <button type="submit" className="w-fit px-6 bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer">Сохранить</button>
      </div>
    </form>
  )
}

function OrdersList() {
  const currentUserContext = useCurrentUserContext();

  if(!currentUserContext.currentUser) {
    return;
  }

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