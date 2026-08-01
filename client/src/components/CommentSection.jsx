import { Button, Spinner, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";


const CommentSection = ({ postId }) => {

    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [getComment, setGetComment] = useState([])

    const navigation = useNavigate()

    /**
     * Add Comment
     * 
     * @param {*} e 
     * @returns 
     */
    const handlerComment = async (e) => {
        e.preventDefault()

        try {
            
            setCommentError(null);
            setLoading(true)

            if(comment.length > 200){
                setCommentError("Votre commentaire ne peut pas dépasser 200 caractères.")
                return
            }

            if (!comment.trim()) {
                setCommentError("Veuillez saisir votre commentaire.");
                setLoading(false);
                return;
            }

            const res = await fetch('/api/comment/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({content: comment, postId, userId: currentUser._id})
            })

            const data = await res.json()

            if(!res.ok){
                setCommentError(data.message)
            }

            if(res.ok){
                setComment('')
                setCommentError(null)
                setGetComment((prev) => [data, ...prev]);
            }

        } catch (error) {
            setCommentError(error.message)
        }finally{
            setLoading(false)
        }
    }
    
    /**
     * Get Comment
     * 
     */
    useEffect(() => {
        const fetchComment = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                const data = await res.json()

                if(!res.ok){
                    console.log(data.message)
                }

                if(res.ok){
                    setGetComment(data)
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchComment()
    }, [postId])

    /**
     * Like comment
     * 
     * @param {*} contentId 
     * @returns 
     */
    const handlerLike = async (contentId) => {
        if(!currentUser){
            navigation('/sign-in')
            return
        }

        try {
            
            const res = await fetch(`/api/comment/likeComment/${contentId}`, {
                method: "PUT",
            })

            if(res.ok){
                const data = await res.json()
                setGetComment((prev) =>
                    prev.map((comment) => {
                        if (comment._id === contentId) {
                        return {
                            ...comment,
                            likes: data.likes,
                            numberOfLikes: data.numberOfLikes,
                        };
                        }
                        return comment;
                    })
                );
            }
            
        } catch (error) {
            console.log(error.message)
        }

    }

    return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {
        currentUser 
        ? 
        (
            <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                <p>Signed in as :</p>
                <img 
                    src={currentUser.profilePicture}
                    alt={currentUser.username}
                    className="h-5 w-5 object-cover rounded-full"
                />
                <Link 
                    to={`/dashboard?tab=profile`}
                    className="text-xs text-cyan-600 hover:underline font-semibold"
                >
                    @ {currentUser.username}
                </Link>
            </div>
        )
        :
        (
            <div className="text-sm text-teal-500 my-5 flex gap-1">
                You must be signed in to comment.
                <Link to={`/sign-in`} className="text-blue-500 hover:underline">
                    Sign in
                </Link>
            </div>
        )
      }
      {
        currentUser && (
            <form 
                onSubmit={handlerComment}
                className="border border-teal-500 rounded-md p-3">
                <Textarea 
                    placeholder="Add a comment ..."
                    maxLength={200}
                    rows={3}
                    value={comment || ''}
                    // required
                    onChange={
                        (e) => {
                            setComment(e.target.value)
                            setCommentError(null)
                        }
                    }
                />
                {
                    commentError && (
                        <div className="mt-2">
                            <p className="text-sm text-rose-500">{commentError}</p>
                        </div>
                    )
                }
                <div className="flex justify-between items-center mt-5">
                    <p className="text-gray-500 text-sm">{200 - comment.length} caractères restants</p>
                    <Button 
                        outline 
                        type="submit" 
                        className="cursor-pointer"
                        disabled={loading}
                    >
                        {
                            loading ? 
                            <>
                                <Spinner size="sm" className="mr-2" />
                                <span className="ml-2">Traitement...</span>
                            </> 
                            : 
                            "Submit"
                        } 
                    </Button>
                </div>
            </form>
        )
      }
    {
        getComment.length === 0 ? (
            <div className="my-3 text-sm text-gray-500">
                <p>Pas de commentaire pour ce post</p>
            </div>
        ) : (
            <>
                <div className="text-sm flex items-center gap-1 my-5">
                    <p>{getComment.length > 1 ? 'Commentaires' : 'Commentaire'}</p>
                    <div className="border border-gray-400 py-1 px-2 rounded-sm">
                        <p>{getComment.length}</p>
                    </div>
                </div>
                {
                    getComment.map((comment, key) => (
                        <Comment
                            key={key}
                            content={comment}
                            onLike={handlerLike}
                        />
                    ))
                }
            </>
        )
    }
    </div>
  )
}

export default CommentSection
