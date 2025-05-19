import homePageBanner from '../assets/homePageBanner.png';
import { ProductList } from './componentsCommon';

export function HomePageBanner() {
  return (
    <div className="flex bg-[#F5D4D5] justify-center">
      <img src={homePageBanner} className='object-contain'></img>
    </div>
  )
}

export function PopularProductsSection() {
  return (
    <div className='flex flex-col items-center mb-48'>
      <h1 className='font-default text-[#D5778D] text-5xl mt-10 mb-2'>Популярное</h1>
      <ProductList></ProductList>
    </div>
  )
}

