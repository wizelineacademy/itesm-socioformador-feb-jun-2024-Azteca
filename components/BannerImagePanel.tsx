"use client";

import { useState } from "react";
import { updateBannerId } from "@/services/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const BannerImagePanel = ({ closeModal }: { closeModal: () => void }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const router = useRouter();
  const images = [
    "/Banner0.svg",
    "/Banner1.svg",
    "/Banner2.svg",
    "/Banner3.svg",
    "/Banner4.svg",
  ];

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleBannerSubmit = async () => {
    try {
      await updateBannerId({
        bannerId: `Banner${selectedImage}.svg`,
      }).then(() => {
        router.refresh();
        closeModal();
        toast.success("Banner updated successfully");
      });
    } catch (error) {
      alert("Error updating banner");
    }
  };

  return (
    <div className="mx-auto flex flex-col pb-2 pt-4">
      <p className="mb-2 text-grayText">Select an Image</p>
      <div className="flex space-x-4">
        {images.map((src, index) => (
          <button
            data-testid={`banner-image-${index}`}
            key={index}
            className={`rounded border-2 ${selectedImage === index ? "border-primary" : "border-transparent"}`}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="cursor-pointer"
              width={200}
              height={200}
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
          onClick={handleBannerSubmit}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default BannerImagePanel;
