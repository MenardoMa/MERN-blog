import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  
  const { postSlug } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)

  const [recentPosts, setRecentPosts] = useState([])
  const [loadingRecentPosts, setLoadingRecentPosts] = useState(true);

  /**
   * 
   * Get Post, Par rapport a son slug
   * 
   */
    useEffect(() => {
        
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getPosts?slug=${postSlug}`)
                const data = await res.json()

                if(!res.ok){
                    setError(true)
                    return
                }

                if(res.ok){
                    setPost(data.posts[0])
                    setError(false)
                }

            } catch (error) {
                console.log(error.message)
            setError(true)
            }finally{
                setLoading(false)
            }
        }

        fetchPost()

    }, [postSlug])

  /**
   * Recent Posts
   * 
   */
    useEffect(() => {
        
        if (!post) return;

        const fetchRecentPosts = async () => {
            
            setLoadingRecentPosts(true);
            
            try {
            const res = await fetch(`/api/post/getPosts?limit=4`);
            const data = await res.json();

            if (res.ok) {
                setRecentPosts(
                data.posts
                    .filter((p) => p._id !== post._id)
                    .slice(0, 3)
                );
            }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingRecentPosts(false);
            }
        };

        fetchRecentPosts();
    }, [post]);


    return (
    <>
        {
            loading ? 
            (
                <div className="flex justify-center mx-auto items-center py-10">
                    <Spinner size="xl" />
                </div>
            )
            : 
            (
                <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                    <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                        {post && post.title}
                    </h1>
                    <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
                        <Button color='gray' pill size="xs" className="cursor-pointer">
                            {post && post.category}
                        </Button>
                    </Link>
                    <div className="mt-10 w-full h-[600px] overflow-hidden">
                        <img
                            src={post && post.image}
                            alt={post && post.title}
                            className="object-cover size-full"
                        />
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-300 p-3 mx-auto w-full">
                        <span className="text-sm text-zinc-500">
                            {post && new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-zinc-500">
                            {post && (post.content.length / 1000).toFixed(0)} mins read
                        </span>
                    </div>
                    <div 
                        dangerouslySetInnerHTML={{__html: post && post.content}}
                        className="ql-editor p-3 max-w-4xl mx-auto w-full post-content"
                    >

                    </div>
                    <div className="max-w-6xl my-6 mx-auto w-full">
                        <CallToAction />
                    </div>
                    <CommentSection postId={post?._id} />

                    {/* Recent Posts */}
                    <div className="flex flex-col items-center mb-5">
                        <h1 className="mt-5 text-xl font-semibold">Articles récents</h1>

                        <div className="mt-5 flex flex-col flex-wrap justify-center gap-4 sm:flex-row sm:gap-6">
                            {loadingRecentPosts
                            ? [...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full sm:w-[400px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="h-52 w-full bg-gray-300 dark:bg-gray-700" />

                                    <div className="flex flex-col gap-3 p-5">
                                    <div className="h-6 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
                                    <div className="mt-2 h-10 w-32 rounded-md bg-gray-300 dark:bg-gray-700" />
                                    </div>
                                </div>
                                ))
                            : recentPosts.map((post) => (
                                <PostCard key={post._id} post={post} />
                                ))}
                        </div>
                    </div>
                    {/* Recent Posts */}
                </main>
            )
        }
    </>
  )
}

export default PostPage
