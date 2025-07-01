import moment from "moment";

function Comment({ commentData }) {
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
        <p className="text-gray-500">{commentData.content}</p>
      </div>
    </div>
  );
}

export default Comment;
