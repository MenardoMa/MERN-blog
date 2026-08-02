import { Button, Spinner, Textarea } from "flowbite-react";
import moment from "moment";
import { useEffect, useState  } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ content, onLike, onEdit, onSave, isEditing, cancelEdit }) => {

  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(state => state.user)

  const [editedContent, setEditedContent] = useState(content.content)
  const [editedContentError, setEditedContentError] = useState('')
  const [loadingOnSave, setLoadingOnSave] = useState(false)
  
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


  /**
   * 
   * Save editer
   * 
   */
  const handlerSaveEditing = async () => {
    
    if (!editedContent.trim()) {
      setEditedContentError("Le commentaire est vide");
      return
    }

    try {

      setLoadingOnSave(true)
      const res = await fetch(`/api/comment/editComment/${content._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: editedContent
        })
      })

      if(res.ok){
        onSave(content, editedContent);
      }
      
    } catch (error) {
      console.log(error.message)
    }finally{
      setLoadingOnSave(false)
    }
  }

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
          {
            isEditing ? (
              <>
                  <Textarea 
                    className="mb-2"
                    placeholder="Add a comment ..."
                    value={ editedContent }
                    onChange={(e) => setEditedContent(e.target.value)}
                />
                {
                  editedContentError && (
                    <p className="text-sm text-red-500 my-2">{editedContentError}</p>
                  )
                }
                <div className="flex gap-1 justify-end text-xs">
                  <Button
                    type="button"
                    size="xs"
                    className="cursor-pointer flex items-center"
                    onClick={handlerSaveEditing}
                    disabled={loadingOnSave}
                  >
                    {
                      loadingOnSave 
                      ? 
                      <>
                        <Spinner size="sm" className="mr" />
                        <span>Traitement...</span>
                      </> 
                      : ( "Save" )
                    }
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    className="cursor-pointer bg-red-600 text-white border-none hover:opacity-85 hover:bg-red-400"
                     onClick={cancelEdit}
                  >
                    Annuler
                  </Button>
                </div>
              </>
            ) :
            <>
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
                {
                  currentUser && (currentUser._id === content.userId || currentUser.isAdmin) && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500 cursor-pointer"
                      onClick={onEdit}
                    >
                      Edit
                    </button>
                  )
                }
              </div>
            </>
          }
        </div>
      </div>
        )
      }
    </>
  )
}

export default Comment
