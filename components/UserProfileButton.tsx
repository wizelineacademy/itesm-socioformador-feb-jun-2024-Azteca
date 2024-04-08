import Image from "next/image";

interface UserProfileButtonProps {
  name?: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserProfileButton = ({
  name,
  photoUrl,
  size = "md",
  className,
}: UserProfileButtonProps) => {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-20 w-20",
    lg: "h-32 w-32",
  };
  const isActive = false;
  return (
    <button
      className={`${className} ${isActive ? "bg-primary" : "bg-white"} group rounded-full p-2 drop-shadow-lg`}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={"User profile photo"}
          className={`rounded-full ${sizes[size]}`}
          width={50}
          height={50}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className={`${isActive ? "text-white" : "text-primary"} ${sizes[size]} group-hover:text-white`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      )}
    </button>
  );
};
export default UserProfileButton;
