import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post/get");
        if (!response.ok) {
          console.error("Something went wrong while fetching posts");
          return;
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-72px)]">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-center text-3xl font-bold lg:text-6xl">
          Welcome to my Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base text-justify">
          Here you'll find a wide range of articles, tutorials, and resources
          designed to help you grow as a developer. Whether you're interested in
          web development, software engineering, programming languages, or best
          practices in the tech industry, there's something here for everyone.
          Dive in and explore the content to expand your knowledge and skills!
        </p>
        <Link to="/search" className="self-center">
          <button className="text-xs sm:text-sm text-teal-500 font-bold hover:bg-teal-500 hover:text-white transition duration-300 py-2 px-4 border border-teal-500 rounded-md">
            View all posts
          </button>
        </Link>
      </div>
      <div className="max-w-6xl mx-auto px-3">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Recent posts
            </h2>
            <div className="flex flex-wrap gap-8 justify-center">
              {posts.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        )}
        <Link
          to={"/search"}
          className="text-lg font-semibold text-teal-500 hover:underline hover:text-teal-400 text-center transition-all duration-300"
        >
          View all posts
        </Link>
      </div>
    </div>
  );
}

export default Home;
