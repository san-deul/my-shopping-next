
import Link from "next/link";

import { Category } from "@/types/schema";
import styles from "./Category.module.css"



interface CategoryListProps {
  categories: Category[];
  currentCategory: Category | null;
}



export default function CategoryList({ categories, currentCategory }: CategoryListProps) {

  console.log('categories', categories)
  console.log('currentCategory', currentCategory)
  if (!categories.length || !currentCategory) return null;

  // 현재 카테고리가 상위인지 하위인지 구분
  const isParent = currentCategory.parent_id === null;

  // 상위 카테고리 id 구하기
  const parentId = isParent ? currentCategory.id : currentCategory.parent_id;

  // 하위 카테고리 필터링
  const subCategories = categories.filter(
    (cate) => Number(cate.parent_id) == parentId
  );

  //console.log('subCategoriess-->' , subCategories)
  // 전체 탭 포함
  const allTabs = [
    { id: parentId, name: "전체" },
    ...subCategories,
  ];

  //console.log(" allTabs:", allTabs);

  return (
    <div className={styles.categoryList}>
      {allTabs.map((cate) => (
        <div key={cate.id}>
          <Link
            href={`/shop/${cate.id}`}
            className={` ${cate.id === currentCategory.id ? styles.active :""
              }`}
          >
            {cate.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
