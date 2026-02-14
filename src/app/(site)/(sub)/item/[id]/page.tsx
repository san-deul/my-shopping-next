import { productService } from "@/api/services/productService";
import SubTitle from "@/components/layout/SubTitle/SubTitle";
import ProductImgViewer from "@/components/Product/ProductImgViewer";
import ProductInfoBox from "@/components/Product/ProductInfoBox";


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productService.getProductById(id);
  
  return {
    title: `${product?.name || "상품 상세"} - 나의 쇼핑몰`,
    description: product?.description,
  };
}


export default async function Page({ params, }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const product = await productService.getProductById(id);

  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  return (

    <div>
      <SubTitle title="상세페이지" />
      <div className="productDetail">

        <ProductImgViewer product={product} />
        <ProductInfoBox product={product} />
      </div>

    </div>

  )

}
