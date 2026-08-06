import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction"
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Spinner } from "flowbite-react";

const Home = () => {

  const [posts, setPosts] = useState()
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async() => {
      try {
        
        setLoadingPosts(true);

        const res = await fetch('/api/post/getPosts')
        const data = await res.json()
        
        if (res.ok) {
          setPosts(data.posts);
        }
      
    } catch (error) {
        console.log(error.message)
      } finally {
        setLoadingPosts(false);
      }

    }
    fetchPosts()
  }, [])

  return (
    <div>
        <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Hey everyone!
            As seen in my latest YouTube tutorial, you can now get the complete
            source code for this premium, animated developer portfolio.
            This isn't just a template; it's a complete, modern React project built with the best
          </p>
          <Link 
            to={"/search"}
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">
            View all posts
          </Link>
        </div>
        <div className="p-3 bg-amber-100 dark:bg-slate-700">
          <CallToAction />
        </div>
        {/* Posts */}
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
          <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold">Recent Posts</h2>
              {loadingPosts ? (
                <div className="flex flex-wrap gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full sm:w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 animate-pulse"
                    >
                      {/* Image */}
                      <div className="h-52 w-full bg-gray-300 dark:bg-gray-700" />
                      {/* Contenu */}
                      <div className="flex flex-col gap-4 p-5">
                        <div className="h-6 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <div className="space-y-2">
                          <div className="h-5 w-full rounded bg-gray-300 dark:bg-gray-700" />
                          <div className="h-5 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
                        </div>
                        <div className="mt-2 h-10 w-32 rounded-md bg-gray-300 dark:bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-4">
                    {posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                      />
                    ))}
                  </div>
                  <Link
                    to="/search"
                    className="text-center text-lg text-teal-500 hover:underline"
                  >
                    View all
                  </Link>
                </>
              ) : (
                <p className="text-center text-gray-500">
                  Aucun article récent.
                </p>
              )}
          </div>
        </div>
        {/* Posts */}
    </div>
  )
}

export default Home
