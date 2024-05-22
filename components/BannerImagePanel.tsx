"use client";

import { useState } from "react";
import NextImage from "next/image";
import Banner1 from "@/public/Banner1.svg";
import Banner2 from "@/public/Banner2.svg";
import Banner3 from "@/public/Banner3.svg";
import Banner4 from "@/public/Banner4.svg";

const images = [Banner1, Banner2, Banner3, Banner4];

const BannerImagePanel = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <div className="container mx-auto pb-2 pt-4">
      <p className="mb-2 text-grayText">Select an Image</p>
      <div className="flex space-x-4">
        {images.map((src, index) => (
          <button
            key={index}
            className={`rounded border-2 ${selectedImage === index ? "border-primary" : "border-transparent"}`}
            onClick={() => handleImageClick(index)}
          >
            <NextImage
              src={src}
              alt={`Banner ${index + 1}`}
              className="cursor-pointer"
              width={200}
              height={200}
              layout="responsive"
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-center">
        <button
          disabled={selectedImage === null}
          className={`${
            selectedImage === null
              ? "bg-gray-300"
              : "bg-primary hover:bg-primary-dark"
          } mt-4 rounded-lg px-10 py-2 font-medium text-white drop-shadow-lg`}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default BannerImagePanel;
