import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "all",
  });
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  // Хук для разбора location.search в объект:
  const getSidebarDataFromURL = (search) => {
    const searchParams = new URLSearchParams(search);
    const result = {
      searchTerm: searchParams.get("searchTerm") || "",
      sort: ["asc", "desc"].includes(searchParams.get("sort"))
        ? searchParams.get("sort")
        : "desc",
      category: [
        "all",
        "uncategorized",
        "react",
        "javascript",
        "angular",
        "vue",
        "next",
        "node",
        "express",
        "nest",
        "java",
        "python",
      ].includes(searchParams.get("category"))
        ? searchParams.get("category")
        : "all",
    };
    setSidebarData(result);
    return result;
  };

  useEffect(() => {
    // При каждом обновлении location.search, вызываем метод getSidebarDataFromURL
    const searchData = getSidebarDataFromURL(location.search);

    const fetchPosts = async () => {
      console.log("FETCHING POSTS!!!");
      console.log(searchData);

      try {
        setLoading(true);
        setError(null);
        let response = null;

        if (searchData.category === "all") {
          response = await fetch(
            `/api/post/get?searchTerm=${searchData.searchTerm}&sort=${searchData.sort}`
          );
        } else {
          response = await fetch(
            `/api/post/get?searchTerm=${searchData.searchTerm}&sort=${searchData.sort}&category=${searchData.category}`
          );
        }

        if (!response.ok) {
          setLoading(false);
          setError("Something went wrong while fetching posts");
          return;
        }

        const data = await response.json();
        setPosts(data.posts);

        if (data.totalPostsAfterFilters > 9) {
          setShowMoreBtn(true);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleShowMoreBtn = async () => {
    const startIndex = posts.length;
    try {
      setLoading(true);

      let response = null;

      if (sidebarData.category === "all") {
        response = await fetch(
          `/api/post/get?startIndex=${startIndex}&searchTerm=${sidebarData.searchTerm}&sort=${sidebarData.sort}`
        );
      } else {
        response = await fetch(
          `/api/post/get?startIndex=${startIndex}&searchTerm=${sidebarData.searchTerm}&sort=${sidebarData.sort}&category=${sidebarData.category}`
        );
      }

      if (!response.ok) {
        setLoading(false);

        setError("Something went wrong while fetching posts");
        return;
      }

      const data = await response.json();
      if (data.posts.length < 9) {
        setShowMoreBtn(false);
      }

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...data.posts];

        if (updatedPosts.length === data.totalPostsAfterFilters) {
          setShowMoreBtn(false);
        }

        return updatedPosts;
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        `There was a problem with the fetch operation: ${error.message}`
      );
    }
  };

  const handleSearchPostsSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col md:flex-row max-w-screen-2xl mx-auto">
      <div className="p-7 md:border-r">
        <form
          onSubmit={handleSearchPostsSubmit}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-3">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, searchTerm: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="whitespace-nowrap font-semibold">
              Sort:
            </label>
            <Select
              value={sidebarData.sort}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, sort: e.target.value })
              }
              id="sort"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="category"
              className="whitespace-nowrap font-semibold"
            >
              Category:
            </label>
            <Select
              value={sidebarData.category}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, category: e.target.value })
              }
              id="category"
            >
              <option value="all">All</option>
              <option value="uncategorized">Uncategorized</option>
              <option value="react">React</option>
              <option value="javascript">JavaScript</option>
              <option value="angular">Angular</option>
              <option value="vue">Vue</option>
              <option value="next">Next</option>
              <option value="node">Node.js</option>
              <option value="express">Express</option>
              <option value="nest">NestJS</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </Select>
          </div>
          <Button type="submit">Search posts</Button>
        </form>
      </div>
      <div className="flex-1 p-3 mx-auto max-w-[1400px]">
        <h1 className="text-3xl font-semibold p-3 mb-5 text-center md:border-b">
          Search results:
        </h1>
        {posts && posts.length > 0 && (
          <div className="flex flex-wrap gap-8 justify-center">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
        {showMoreBtn && (
          <Button className="mx-auto my-5" outline onClick={handleShowMoreBtn}>
            Show more
          </Button>
        )}
        {loading && (
          <div className="justify-self-center">
            <Spinner size="lg" />
            <span className="ml-2 font-semibold text-lg">Loading...</span>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {posts?.length === 0 && !loading && !error && (
          <p className="text-center font-semibold text-xl text-red-500">
            No posts found :(
          </p>
        )}
      </div>
    </div>
  );
}

export default Search;
