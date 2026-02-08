



import myIcon from "../../../assets/images/pc_my.png"
import cartIcon from "../../../assets/images/pc_cart.png"
// import wishIcon from "../../../assets/images/wish.png"

import Link from "next/link";
import styles from "./mobileUtil.module.scss";
import Image from "next/image";
import useAuthStore from "../../../store/useAuthStore";

interface MobileUtilProps {
  closeMobileMenu: () => void; // 인자 없고 리턴 없는 함수라는 뜻
}

export default function MobileUtil({ closeMobileMenu }: MobileUtilProps) {

  const { user, logout } = useAuthStore();

  return (
    <div className={styles.mobile_util}>
      <div>
        {!user ? (
          <Link href="/login" onClick={closeMobileMenu}>
            <p>
              <Image
                src={myIcon}
                alt="로그인" />
            </p>
            <p>로그인</p>
          </Link>
        ) : (
          <button onClick={() => { logout(); closeMobileMenu(); }}>
            <p><Image src={myIcon} alt="로그아웃" width={24} height={24} /></p>
            <p>로그아웃</p>
          </button>
        )}

      </div>
      <div>
        <Link href="/join" onClick={closeMobileMenu}>
          <p>
            <Image
              src={myIcon}
              alt="회원가입" />
          </p>
          <p>회원가입</p>
        </Link>
      </div>
      <div>
        <Link href="/cart" onClick={closeMobileMenu}>
          <p>
            <Image
              src={cartIcon}
              alt="장바구니" />
          </p>
          <p>장바구니</p>
        </Link>
      </div>

    </div>
  )
}