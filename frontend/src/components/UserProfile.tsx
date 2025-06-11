import { useContext } from "react";
import type { Order } from "../classes/order";
import { User } from "../classes/user";
import { InputField } from "./Common";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import type { Product } from "../classes/product";
import defaultUserLogo from "../assets/defaultUserLogo.png";
import { useUserInfoContext } from "../contexts/userInfoContext";

export function UserProfileSection({ ordersLoading }: { ordersLoading: boolean }) {
  const { userLoading } = useUserInfoContext();

  return (
    <div className="flex flex-col items-center mb-48">
      {userLoading ? <LoadingUserInfo /> : <UserInfo />}
      <OrdersList ordersLoading={ordersLoading}></OrdersList>
    </div>
  );
}

function UserInfo() {
  const { useUserInfo } = useUserInfoContext();

  return (
    <div className="flex justify-between w-[1100px] mt-12 animate-fade-in">
      <UserLogo user={useUserInfo()}></UserLogo>
      <UserInfoForm user={useUserInfo()}></UserInfoForm>
    </div>
  );
}

function LoadingUserInfo() {
  return (
    <div className="flex justify-between w-[1100px] mt-12">
      <div key={0} className="flex flex-col items-center w-[30%] gap-4">
        <div
          key={0}
          className="size-32 rounded-full from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr"
        />
        <div
          key={1}
          className="w-full h-9 from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr rounded-2xl"
        />
      </div>
      <div key={1} className="flex flex-col gap-6 w-[70%] pl-24">
        <div className="flex flex-col flex-wrap h-48 gap-x-5 gap-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex flex-col items-start gap-1">
              <div
                key={0}
                className="w-36 h-8 from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr rounded-2xl"
              />
              <div
                key={1}
                className="w-80 h-10 from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr rounded-2xl"
              />
            </div>
          ))}
        </div>
        <div className="w-52 h-11 rounded-2xl from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr"></div>
      </div>
    </div>
  );
}

function LoadingOrderList() {
  return (
    <div className="flex flex-wrap w-[1200px] mt-3 gap-x-3.5 gap-y-6 pl-2.5">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center w-96 rounded-2xl from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse bg-linear-to-tr"
        >
          <div className="w-4/5 aspect-square mt-2" />
          <div className="h-9 mt-3"></div>
          <div className="h-9"></div>
          <div className="h-9"></div>
          <div className="h-9 mt-3"></div>
        </div>
      ))}
    </div>
  );
}

function UserLogo({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center w-[30%] gap-4">
      <img src={defaultUserLogo} alt="userLogo" className="size-32 object-cover "></img>
      <p className="font-default text-[#D5778D] text-3xl text-wrap text-center">
        {user.firstName || user.secondName ? `${user.firstName} ${user.secondName}` : "user"}
      </p>
    </div>
  );
}

function UserInfoForm({ user }: { user: User }) {
  const { updateUser } = useUserInfoContext();

  function saveUserInfo(formData: FormData) {
    updateUser(
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
        <InputField
          fieldName="Номер телефона"
          fieldID="phoneNumber"
          value={user.phoneNumber}
        ></InputField>
        <InputField
          fieldName="Электронная почта"
          fieldID="email"
          value={user.email}
          required
        ></InputField>
      </div>
      <div className="flex justify-start items-center font-default text-[#D5778D] text-3xl">
        <button
          type="submit"
          className="w-fit px-6 bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-2xl py-1 cursor-pointer"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}

function OrdersList({ ordersLoading }: { ordersLoading: boolean }) {
  const userOrders: Order[] = useContext(OrderListContext);

  const orderCards: React.ReactNode[] = [];

  for (let i = 0; i < userOrders.length; i++) {
    orderCards.push(<OrderCard key={i} order={userOrders[i]}></OrderCard>);
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="font-default text-[#D5778D] text-5xl">Заказы</h1>

      {userOrders.length == 0 && !ordersLoading ? (
        <p className="font-default text-[#B4A1A6] text-4xl mt-8">У вас нет заказов</p>
      ) : (
        <div className="flex flex-wrap w-[1200px] mt-3 gap-x-3.5 gap-y-6 pl-2.5">
          {ordersLoading ? <LoadingOrderList /> : orderCards}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const productListContext = useContext(ProductListContext);

  const product: Product = productListContext.filter((p) => p.id == order.productID)[0];

  return (
    <div className="flex flex-col items-center w-96 rounded-2xl py-4 shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] font-default text-[#B4A1A6] text-3xl animate-fade-in">
      <img
        src={product.imagePaths[0]}
        alt=""
        className="w-[80%] aspect-square mt-2 object-cover rounded-2xl"
      ></img>
      <p className="mt-3">{product.name}</p>
      <p className="">{order.productQuantity} шт.</p>
      <p>{order.cost} руб.</p>
      <p className="text-[#D5778D] mt-3">{order.status}</p>
    </div>
  );
}
