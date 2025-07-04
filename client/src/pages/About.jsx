function About() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex justify-center items-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font-semibold my-7">
            About{" "}
            <span className="px-2 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg text-white">
              Vlad's
            </span>{" "}
            Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6 text-justify">
            <p>
              Welcome to{" "}
              <span className="px-2 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg text-white">
                Vlad's
              </span>{" "}
              Blog! This blog was created by a small team of developers who are
              passionate about technology and coding. It's our personal project
              to share thoughts and ideas with the world. We love writing about
              technologies, coding, and everything in between.
            </p>
            <p>
              On this blog, you'll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. Auhors of this blog are always learning and exploring
              new technologies, so be sure to check back often for new content!
            </p>
            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
