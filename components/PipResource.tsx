import ArticleIcon from "./icons/ArticleIcon";
import BookIcon from "./icons/BookIcon";
import VideoIcon from "./icons/VideoIcon";

interface InterfacePipResource {
  title: string;
  description: string;
  type: string;
  link: string;
}

const PipResource = ({
  title,
  description,
  type,
  link,
}: InterfacePipResource) => {
  const renderIcon = () => {
    switch (type) {
      case "video":
        return <VideoIcon size="h-10 w-10" color="text-primary" />;
      case "book":
        return <BookIcon size="h-10 w-10" color="text-primary" />;
      case "article":
        return <ArticleIcon size="h-10 w-10" color="text-primary" />;
      default:
        return <ArticleIcon size="h-10 w-10" color="text-primary" />;
    }
  };

  const renderButtonLabel = () => {
    switch (type) {
      case "video":
        return "Watch it";
      case "book":
        return "Get it";
      case "article":
        return "Read it";
      default:
        return "Read it";
    }
  };

  return (
    <div className="box-border flex h-48 w-52 shrink-0 flex-col rounded-xl bg-white p-3 shadow-lg">
      <header className="flex items-center">
        {renderIcon()}
        <p className="text-md ms-3 text-wrap font-semibold">{title}</p>
      </header>
      <p className="font-regular mb-2 mt-3 h-full overflow-hidden text-ellipsis text-xs  text-[#9E9E9E]">
        {description}
      </p>
      <button className="mx-auto w-fit rounded-full bg-primary px-7 py-1 text-xs font-medium text-white">
        <a href={link}>{renderButtonLabel()}</a>
      </button>
    </div>
  );
};

export default PipResource;
