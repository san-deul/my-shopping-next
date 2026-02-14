
import styles from "./SubTitle.module.css";
/*
const titleMap = {
  "/": null,
  "/login": "로그인",
  "/signup": "회원가입",
  "/mypage": "마이페이지",
  "/order": "주문내역",
};
*/
export default function SubTitle({title}:{title?: string}) {
  //const pathname = usePathname();
  //const title = titleMap[pathname];

  if (!title) return null;

  return (
    <div className={styles.subTitleArea}>
      <h4 className="sub-title">{title}</h4>
    </div>
  );
}
