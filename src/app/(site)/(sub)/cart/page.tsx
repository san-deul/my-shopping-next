import CartFooter from "@/components/cart/CartFooter";
import CartHeader from "@/components/cart/CartHeader";
import CartList from "@/components/cart/CartList";
import SubTitle from "@/components/layout/SubTitle/SubTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "장바구니",
  description: "장바구니 화면",
  keywords: ["장바구니",],
};

export default function Page(
) {

  return (
    <div>
      <SubTitle title="장바구니" />
      <div className="cartContainer">
        <CartHeader />
        <CartList />
        <CartFooter />
      </div>

    </div>
  )

}