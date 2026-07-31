import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import CallToAction from "../components/CallToAction";

const PostPage = () => {
  const { postSlug } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)

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
                setError(true)
            }

        } catch (error) {
           setError(true)
        }finally{
            setLoading(false)
        }
    }

    fetchPost()

  }, [postSlug])

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
                    <div className="">
                        <CallToAction />
                    </div>
                </main>
            )
        }
    </>
  )
}

export default PostPage
