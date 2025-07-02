import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="group relative w-full sm:w-[430px] border hover:border-2 rounded-md h-[370px] overflow-hidden transition-all">
      <Link to={`/post/${post.slug}`}>
        <div className="bg-gray-100 dark:bg-[rgb(16,23,42)]">
          <img
            src={post.image}
            alt="post image"
            className="h-[260px] w-full object-contain group-hover:h-[200px] transition-all duration-300 z-999"
          />
        </div>
        <div className="p-3 flex flex-col gap-2">
          <h1 className="text-lg font-semibold line-clamp-2">{post.title}</h1>
          <span className="italic text-sm">{post.category}</span>
          <Link
            to={`/post/${post.slug}`}
            className="z-[-10] group-hover:z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 py-2 text-center rounded-md m-2"
          >
            Read article
          </Link>
        </div>
      </Link>
      {/* <Button href={`/post/${post.slug}`}>Read article</Button> */}
    </div>
  );
}
export default PostCard;
