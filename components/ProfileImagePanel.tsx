"use client";

import { useState } from "react";
import { Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

const ProfileImagePanel = () => {
  const [file, setFile] = useState<FileWithPath[]>([]);

  const preview = file.map((image, index) => {
    const imageUrl = URL.createObjectURL(image);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt="Image Preview"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        style={{
          width: "200px",
          height: "200px",
          margin: "auto",
        }}
      />
    );
  });

  return (
    <div className="mt-6">
      {file.length === 0 ? (
        <Dropzone
          onDrop={(file) => setFile(file)}
          onReject={(file) => console.log("rejected files", file)}
          maxSize={5 * 1024 ** 2}
          maxFiles={1}
          accept={IMAGE_MIME_TYPE}
        >
          <div className="pointer-events-none flex min-h-56 flex-col items-center justify-center  text-center">
            <p className=" text-xl">Drag image here or click to select file</p>
            <p className="text-md text-grayText">
              Attach one image to change your profile picture, should not exceed
              5mb
            </p>
          </div>
        </Dropzone>
      ) : (
        preview
      )}
      <div className="mb-2 mt-2 flex justify-center gap-10">
        <button
          disabled={file.length === 0}
          className={`${
            file.length === 0 ? "bg-gray-300" : "bg-white hover:bg-white/80"
          } mt-4 rounded-lg px-10 py-2 font-medium text-primary drop-shadow-lg`}
          onClick={() => setFile([])}
        >
          Reset
        </button>
        <button
          disabled={file.length === 0}
          className={`${
            file.length === 0
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

export default ProfileImagePanel;
