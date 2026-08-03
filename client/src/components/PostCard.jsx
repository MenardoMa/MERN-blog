import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    
    return (
    <div 
        className="w-full sm:w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <Link to={`/post/${post.slug}`}>
            <img
            src={post.image}
            alt={post.title}
            className="h-52 w-full object-cover"
            />
        </Link>

        <div className="flex flex-col gap-3 p-5">
            <span className="w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
            {post.category}
            </span>

            <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
            {post.title}
            </h2>

            <Link
            to={`/post/${post.slug}`}
            className="mt-2 w-fit rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
            >
            Lire l'article
            </Link>
        </div>
    </div>
  )
}

export default PostCard
