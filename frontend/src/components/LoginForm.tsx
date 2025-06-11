import { Link } from "react-router";
import artezaLogo from "../assets/Arteza.png";
import { InputField } from "./Common";
import { useState } from "react";
import axios from "axios";
import { handleLogin } from "../api/requests/user";
import { useAuthContext } from "../contexts/authContext";

export function HomePageButton() {
  return (
    <Link to={"/home"} className="h-[80%] flex justify-center items-center">
      <img src={artezaLogo} className="h-full object-none"></img>
    </Link>
  );
}

export function NavigationSection() {
  return (
    <div className="flex justify-center h-40 items-end box-content border-b-4 border-[#EF829A]">
      <HomePageButton></HomePageButton>
    </div>
  );
}

export function LoginSection() {
  return (
    <div className="flex flex-col items-center">
      <p className="font-default text-[#D5778D] text-4xl mt-10">Вход</p>
      <LoginForm></LoginForm>
    </div>
  );
}

function LoginForm() {
  const [loginFailMessage, setLoginFailMessage] = useState<string>("");
  const authContext = useAuthContext();

  function login(formData: FormData) {
    async function tryLogin(): Promise<void> {
      try {
        const token = await handleLogin(
          formData.get("email") as string,
          formData.get("password") as string,
        );
        authContext.signIn(token);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          switch (error.response?.status) {
            case 401:
              setLoginFailMessage("Неверный email или пароль");
              break;
            default:
              setLoginFailMessage("Неизвестная ошибка");
              console.log(error);
          }
        }
      }
    }

    tryLogin();
  }

  return (
    <form
      action={login}
      className="mt-6 flex flex-col py-6 px-10 gap-5 items-center rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"
    >
      <InputField
        fieldName="Email"
        fieldID="email"
        required={true}
      ></InputField>
      <PasswordInputField
        fieldName="Пароль"
        fieldID="password"
      ></PasswordInputField>
      <div className="w-full flex flex-col items-center gap-2 mt-4">
        {loginFailMessage.length > 0 ? (
          <p className="font-default text-[#BC4241] text-xl">
            {loginFailMessage}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-[90%] font-default text-[#D5778D] text-3xl py-2 rounded-2xl bg-[#F5D4D5] hover:bg-[#E6C8C9] cursor-pointer"
        >
          Войти
        </button>
      </div>
      <div className="flex flex-col items-center font-default text-[#555555] text-xl">
        <p>Нет учетной записи?</p>
        <Link to={"/auth/registration"} className="text-[#D5778D]">
          {" "}
          Создать
        </Link>
      </div>
    </form>
  );
}

function PasswordInputField({
  fieldName,
  fieldID,
}: {
  fieldName: string;
  fieldID: string;
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="w-full flex justify-between items-end mb-1">
        <p className="font-default text-[#555555] text-2xl">{fieldName}</p>
        <Link to={"/home"} className="font-default text-[#D5778D] text-xl">
          Забыли пароль?
        </Link>
      </div>
      <input
        type="password"
        name={fieldID}
        required
        className="w-80 text-[#555555] text-xl px-4 py-1.5 rounded-2xl outline-none shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]"
      ></input>
    </div>
  );
}

export function EmptySpace() {
  return <div className="h-48"></div>;
}
