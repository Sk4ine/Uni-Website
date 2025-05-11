import { GlobalVariables } from "../classes/globalVariables";
import type { Product } from "../classes/product"
import type { Review } from "../classes/review";

import ratingStarImage from "../assets/ratingStarIcon.png";
import ratingStarLargeImage from "../assets/ratingStarIconLarge.png";

export function ProductPageSection({children, product} : {children: React.ReactNode, product: Product}) {
  return (
    <div className="flex flex-col items-center mb-48">
      <ProductInfo product={product}></ProductInfo>
      {children}
    </div>
  )
}

function ProductInfo({product} : {product: Product}) {
  return (
    <div className="flex justify-between w-[1100px] mt-10">
      <ProductImages imagePaths={product.imagePaths}></ProductImages>
      <ProductDescription product={product}></ProductDescription>
    </div>
  )
}

function ProductImages({imagePaths} : {imagePaths: string[]}) {
  let altImages: React.ReactNode[] = [];

  for(let i = 1; i < imagePaths.length; i++) {
    altImages.push(<ImageButton imagePath={imagePaths[i]}></ImageButton>)
  }

  return (
    <div className="flex flex-col items-center w-[45%]">
      <img src={imagePaths[0]} className="size-fit object-contain rounded-3xl"></img>
      <div className="flex justify-center items-center mt-4 gap-3">
        {altImages}
      </div>
    </div>
  )
}

function ImageButton({imagePath} : {imagePath: string}) {
  return (
    <button style={{backgroundImage: `url(${imagePath})`}} className={`size-16 bg-contain bg-center cursor-pointer rounded-2xl`}></button>
  )
}

function ProductDescription({product} : {product: Product}) {
  return (
    <div className="flex flex-col items-center w-[55%]">
      <div className="flex flex-col items-center font-default text-[#555555] text-6xl">
        <p>{product.name}</p>
        <p>{product.price} руб.</p>
      </div>
      <button className="w-fit px-16 py-2.5 mt-8 font-default text-[#D5778D] text-6xl bg-[#F5D4D5] hover:bg-[#E6C8C9] rounded-3xl cursor-pointer">В корзину</button>
      <FullInfo product={product}></FullInfo>
    </div>
  )
}


function FullInfo({product} : {product: Product}) {
  let materials: string = "";

  for(let i = 0; i < product.materials.length; i++) {
    materials += product.materials[i];

    if(i == product.materials.length - 1) {
      break;
    }

    materials += ", ";
  }

  return (
    <div className="flex flex-col w-full px-9 mt-6 font-default text-[#B4A1A6] text-4xl">
      <p className="text-[#555555]">Описание</p>
      <div className="flex flex-col gap-1 mt-3">
        <DescriptionItem itemName="Артикул" itemValue={product.partNumber}></DescriptionItem>
        <DescriptionItem itemName="Материал" itemValue={materials}></DescriptionItem>
        <DescriptionItem itemName="Вес" itemValue={product.weightGrams + " г"}></DescriptionItem>
        <DescriptionItem itemName="Производство" itemValue={product.countryOfOrigin}></DescriptionItem>
      </div>
      
    </div>
  )
}

function DescriptionItem({itemName, itemValue} : {itemName: string, itemValue: string | number}) {
  return (
    <div className="flex justify-between">
      <span className="w-fit whitespace-nowrap">{itemName}</span>
      <span className="w-full h-[68%] select-none border-b-3 border-dotted mx-0.5"></span>
      <span className="w-fit text-nowrap">{itemValue}</span>
    </div>
  )
}

export function CustomerReviews({children, product} : {children: React.ReactNode, product: Product}) {
  return (
    <div className="flex justify-between w-[1100px] mt-9">
      <div className="flex flex-col gap-2">
        <p className="font-default text-[#555555] text-5xl">
          Отзывы <span className="text-[#B5ABA1]">{product.customerReviews.length}</span>
        </p>
        <div className="flex flex-col items-center mt-4">
          {children}
        </div>
      </div>
      <Rating product={product}></Rating>
    </div>
  )
}

export function ReviewCard({review} : {review: Review}) {
  return (
    <div className="flex justify-between w-2xl rounded-2xl shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)] p-4">
      <div className="w-[10%] pl-2">
        <img src={review.user.logoImagePath} className="size-12 rounded-full"></img>
      </div>
      <div className="flex flex-col w-[65%] pl-4 font-default text-[#555555] text-3xl">
        <p>
          {review.user.firstName}, {review.date.getDate()} {GlobalVariables.reviewDateMonths[review.date.getMonth()]} {review.date.getFullYear()}
        </p>
        <RatingStars rating={review.rating}></RatingStars>
        <p className="mt-4">{review.comment}</p>
      </div>
      <div className="w-[25%]">
        <img src={review.attachedImagePath} className="size-40 aspect-square rounded-2xl"></img>
      </div>
    </div>
  )
}

function RatingStars({rating} : {rating: number}) {
  const fillPercent: string = `w-[${rating/5*100}%]`;

  return (
    <div className="w-[125px] h-[23px] mt-1">
      <div style={{maskImage: `url(${ratingStarImage})`}} className="bg-[#B5ABA1] w-full h-full">
        <div className={`bg-[#FFD900] ${fillPercent} h-full mask-repeat-x`}></div>
      </div>
    </div>
  )
}

function Rating({product} : {product: Product}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-end items-center">
        <p className="font-default text-[#555555] text-6xl">{product.rating}</p>
        <img src={ratingStarLargeImage} className="size-11 ml-2 pb-1"></img>
      </div>
      <div className="flex flex-col items-end">
        <RatingBar ratingValue={5} percent={100}></RatingBar>
        <RatingBar ratingValue={4} percent={0}></RatingBar>
        <RatingBar ratingValue={3} percent={0}></RatingBar>
        <RatingBar ratingValue={2} percent={0}></RatingBar>
        <RatingBar ratingValue={1} percent={0}></RatingBar>
      </div>
    </div>
  )
}

function RatingBar({ratingValue, percent} : {ratingValue: number, percent: number}) {
  return (
    <div className="flex items-center h-5">
      <p className="font-default text-[#B5ABA1] text-lg mr-2">{ratingValue}</p>
      <div className="w-80 h-2 rounded-2xl bg-[#D9D9D9]">
        <div style={{width: `${percent}%`}} className={`h-full rounded-2xl bg-[#D5778D]`}></div>
      </div>
    </div>
  )
}