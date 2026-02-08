import myIcon from "@/assets/images/pc_my.png";
import cartIcon from "@/assets/images/pc_cart.png";
import { MenuItem } from "../types/menu";


// 상단 Nav메뉴
export const navMenus : MenuItem[] = [
  {
    key: "glowly",
    label: "GLOWLY",
    href:"/brandstory",
    children: [
      { key:"brand-1", href: "/brandstory", label: "브랜드소개" },

    ],
  },
  {
    key: "shop",
    label: "상품구매",
    href:"/shop/all",
    children: [
      { key: "shop-all", href: "/shop/all", label: "전체상품" },
      { key: "shop-10", href: "/shop/10", label: "스킨케어" },
      { key: "shop-20", href: "/shop/20", label: "메이크업" },
      { key: "shop-30", href: "/shop/30", label: "헤어케어" },
      { key: "shop-40", href: "/shop/40", label: "바디케어" },
    ],
  },
  { key: "review", label: "사용후기", href: "/review" },
  { key: "membership", label: "멤버십", href: "/membership" },
  { key: "event", label: "이벤트", href: "/event" },
  {
    key: "support",
    label: "고객센터",
    href:"/notice",
    children: [
      { key: "support-1", href: "/notice", label: "공지사항" },
      { key: "support-2", href: "/qa", label: "1:1문의" },
    ],
  },
];

//유틸메뉴
export const utilMenus = [
  {
    key: "my",
    icon: myIcon,
    href: "#",
   /* children: [
      { key: 1, label: "회원가입", to: "/join" },
      { key: 2, label: "로그인", to: "/login" },
      { key: 3, label: "마이페이지", to: "/mypage" },
    ],*/
  },
  {
    key: "cart",
    icon: cartIcon,
    href: "/cart",
    badge: 0, // 장바구니 갯수
  },

];


// 버튼 누르면 열리는 AllMenus
export const allMenus = [
  {
    key: "all",
    label: "전체상품보기",
    href: "/shop/all",
  },
  {
    key: 2,
    label: "GLOWLY",
    href: "/",
    children: [{ label: "브랜드소개", href: "" }, { label: "인증사항", href: "" }]
  },
  {
    key: "shop10",
    label: "스킨케어",
    href: "/shop/10",
    children: [{ label: "스킨/토너", href: "/shop/1010" }, { label: "로션", href: "/shop/1020" }, { label: "크림", href: "/shop/1030" }]
  },
  {
    key: "shop20",
    label: "메이크업",
    href: "/shop/20",
    children: [{ label: "베이스", href: "/shop/2010" }, { label: "아이", href: "/shop/2020" }, { label: "립", href: "/shop/2030" }]
  },
  {
    key: "shop30",
    label: "헤어케어",
    href: "/shop/30",
    children: [{ label: "샴푸", href: "/shop/3010" }, { label: "린스", href: "/shop/3020" }, { label: "트리트먼트", href: "/shop/3030" }]
  },
  {
    key: "shop40",
    label: "바디케어",
    href: "/shop/40",
    children: [{ label: "로션", href: "/shop/4010" }, { label: "핸드케어", href: "/shop/4020" }, { label: "풋케어", href: "/shop/4030" }]
  },
  {
    key: "support",
    label: "고객센터",
    href: "/",
    children: [{ label: "공지사항", href: "/" }]
  },

]


// 모바일메뉴
export const mobileMenus = [
  {
    key: "all",
    href:"/shop/all",
    label: "전체상품",
  },
  {
    key: "glowly",
    label: "GLOWLY",
    children: [
      { href: "/brandstory", label: "브랜드소개" },

    ],
  },
  {
    key: "shop10",
    label: "스킨케어",
    children: [{ label: "스킨/토너", href: "/shop/1010" }, { label: "로션", href: "/shop/1020" }, { label: "크림", href: "/shop/1030" }]
  },
  {
    key: "shop20",
    label: "메이크업",
    href: "/shop/20",
    children: [{ label: "베이스", href: "/shop/2010" }, { label: "아이", href: "/shop/2020" }, { label: "립", href: "/shop/2030" }]
  },
  {
    key: "shop30",
    label: "헤어케어",
    href: "/shop/30",
    children: [{ label: "샴푸", href: "/shop/3010" }, { label: "린스", href: "/shop/3020" }, { label: "트리트먼트", href: "/shop/3030" }]
  },
  {
    key: "shop40",
    label: "바디케어",
    href: "/shop/40",
    children: [{ label: "로션", href: "/shop/4010" }, { label: "핸드케어", href: "/shop/4020" }, { label: "풋케어", href: "/shop/4030" }]
  },
  { key: "review", label: "사용후기", href: "/review" },

  {
    key: "support",
    label: "고객센터",
    children: [
      { href: "/notice", label: "공지사항" },
      { href: "/qa", label: "1:1문의" },

    ],
  },
];