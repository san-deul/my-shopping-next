
import styles from "./Product.module.css";
import ProductActionArea from "./ProductActionArea";

type ProductInfoBoxProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  isNew: boolean;
  isBest: boolean;
};


export default async function ProductInfoBox({
  id, name, description, price, originalPrice, isNew, isBest
}: ProductInfoBoxProps) {



  //const totalPrice = product.price * quantity;

  return (
    <div className={styles.productDetailRight}>

      <div className={styles.tags}>
        {isNew && <span className={`${styles.tag} ${styles.new}`}>NEW</span>}
        {isBest && <span className={`${styles.tag} ${styles.best}`}>BEST</span>}
      </div>
      <h2 className={styles.productName}>{name}</h2>

      

      <p className={styles.desc}>{description}</p>

      <div className={styles.priceBox}>
        <p className={styles.salePrice}>{price.toLocaleString()}원</p>
        {originalPrice && (
          <p className={styles.originalPrice}>
            {originalPrice.toLocaleString()}원
          </p>
        )}
      </div>

      <ProductActionArea productId={id} price={price} />
      
    </div>
  );
}
