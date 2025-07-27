import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import { use } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

function PostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(null);
        setLoading(true);

        const response = await fetch(`/api/post/get?slug=${postSlug}`);

        const rPosts = await fetch("/api/post/get?limit=3");
        const rPostsData = await rPosts.json();

        if (!rPosts.ok) {
          console.error("Something went wrong while fetching recent posts");
        }

        if (!response.ok) {
          setError("Something went wrong while fetching the post");
          setLoading(false);
          return;
        }

        const data = await response.json();

        setPost(data.posts[0]);

        if (rPostsData.posts.some((p) => p._id === data.posts[0]._id)) {
          const r = await fetch("/api/post/get?limit=4");
          const d = await r.json();
          setRecentPosts(d.posts.filter((p) => p._id !== data.posts[0]._id));
        } else {
          setRecentPosts(rPostsData.posts);
        }

        setLoading(false);
      } catch (error) {
        setError(`${error.message}`);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  return (
    <main className="relative p-3 flex flex-col items-center max-w-6xl mx-auto min-h-[calc(100vh-62px)]">
      <h1 className="text-3xl mt-10 p-3 font-semibold font-serif max-w-2xl lg:text-4xl">
        {post?.title}
      </h1>
      <Link to={`/search?category=${post?.category}`} className="mt-5">
        <Button color={"gray"} pill size={"xs"}>
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="mt-10 p-3 max-h-[600px] w-full object-contain"
      />
      <div className="flex w-full max-w-2xl text-xs items-center justify-between p-3 border-b border-gray-300">
        <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post?.content.length / 1_000).toFixed(0) === 1
            ? `${(post?.content.length / 1_000).toFixed(0)} min read`
            : (post?.content.length / 1_000).toFixed(0) > 1
            ? `${(post?.content.length / 1_000).toFixed(0)} mins read`
            : ""}
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post?.content }}
        className="mt-10 p-3 text-justify w-full max-w-2xl mx-auto post-content"
      ></div>
      <div className="max-w-4xl w-full mx-auto">
        <CallToAction />
      </div>

      {/* COMMENTS SECTION*/}
      <CommentSection postId={post?._id} />

      {/* RECENT POSTS SECTION */}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5 font-semibold mb-6">Recent articles</h1>
        <div className="flex flex-wrap justify-center gap-6">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 justify-center absolute top-1/2 left-1/2 -translate-x-1/2">
          <Spinner className="w-10 h-10" />
          <span className="text-xl font-medium">Loading...</span>
        </div>
      )}
      {error && <Alert color={"failure"}>{error}</Alert>}
    </main>
  );
}

export default PostPage;
