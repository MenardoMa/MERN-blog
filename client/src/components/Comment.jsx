import moment from "moment";
import { useEffect, useState  } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ content, onLike }) => {

  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useSelector(state => state.user)
  
  /**
   * 
   * Charge Comment
   * 
   */
  useEffect(() => {

    const getUser = async () => {
      try {
        
        setLoading(true);
        const res = await fetch(`/api/user/${content.userId}`)
        const data = await res.json()

        if(!res.ok){
          console.log(data.message)
        }

        if(res.ok){
          setUser(data)
        }

      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false);
      }
    }
    getUser()
  }, [content.userId])


  return (
    <>
      {
        loading ? (
          <div className="flex border-b p-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex-1 ml-3">
              <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-full bg-gray-300 rounded"></div>
            </div>
          </div>
        ) :
        (
        <div className="flex border-b p-4 border-gray-500 text-sm">
        <div className="flex-shrink-0 mr-3">
            <img 
              className="w-10 h-10 rounded-full bg-gray-200"
              src={user.profilePicture}
              alt={user.username}
            />
            {/* <p>{content.content}</p> */}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold mr-1 text-xs truncate">
              { user ? `@${user.username}` : 'anonyme user'}
            </span>
            <span className="text-gray-500 text-xs">
              { moment(content.createdAt).fromNow()}
            </span>
          </div>
          <p className="text-gray-500 pb-2">
            {content.content}
          </p>
          <div className="flex gap-2 items-center text-sm">
            <button 
              className={
                currentUser && content.likes.includes(currentUser._id)
                  ? "text-blue-500 text-sm cursor-pointer"
                  : "text-gray-400 text-sm cursor-pointer"
              }
              type="button"
              onClick={() => onLike(content._id)}
              >
              <FaThumbsUp
                className="text-sm cursor-pointer"
              />
            </button>
            <p className="text-gray-400">
              {
                content.numberOfLikes > 0 && content.numberOfLikes + " " + 
                (content.numberOfLikes === 1 ? "like" : "likes")
              }
            </p>
          </div>
        </div>
      </div>
        )
      }
    </>
  )
}

export default Comment
