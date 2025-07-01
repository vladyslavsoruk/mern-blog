import moment from "moment";
import { IoMdThumbsUp } from "react-icons/io";

function Comment({ commentData, onLike, isCommentLikedByUser }) {
  return (
    <div className="flex gap-3 py-5 border-b border-b-gray-300 text-gray-500 text-sm">
      <div className="flex-shrink-0">
        <img
          src={commentData.author.profilePicture}
          alt="user-profile-picture"
          className="w-10 h-10 rounded-full bg-gray-200 object-contain transition duration-200 hover:brightness-75"
        />
      </div>
      <div className="flex-1">
        <div className="flex text-xs gap-2 items-center mb-1">
          <span className="font-bold truncate text-cyan-600 hover:underline">
            @{commentData.author.username}
          </span>
          <span className="text-gray-500">
            {moment(commentData.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 mb-3">{commentData.content}</p>

        <div className="border-t dark:border-t-gray-700 max-w-fit pt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onLike(commentData._id)}
              className={`transition-colors duration-300 ease-in-out ${
                isCommentLikedByUser
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-blue-500"
              }`}
            >
              <IoMdThumbsUp className="text-xl" />
            </button>
            <span>
              {commentData.numberOfLikes > 0 ? commentData.numberOfLikes : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
