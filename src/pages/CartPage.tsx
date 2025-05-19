import { CartSection } from "../components/componentsCart";
import { Footer, NavigationBar } from "../components/componentsCommon";

export function CartPage() {
  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CartSection></CartSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}