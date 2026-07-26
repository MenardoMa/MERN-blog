import { 
  Table, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead, 
  TableHeadCell, 
  Button,
  Modal, 
  ModalBody, 
  ModalHeader,
  Spinner
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIDToDelete, setPostIDToDelete] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * 
   * Get Posts
   * 
   */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`)
        const data = await res.json()

        if(res.ok){
          setUserPosts(data.posts)
          if(data.post.length < 9){
            setShowMore(false)
          }
        }

      } catch (error) {
        console.log(error)
      }
    }

    if(currentUser.isAdmin){
      fetchPost()
    }

  }, [currentUser._id])

  /**
   * Show more post 
   * 
   */
  const handlerShowMore = async () => {
    
    const startIndex = userPosts.length

    try {
      
      const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()

      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.posts])
        if(data.posts.length < 9){
          setShowMore(false)
        }
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const handlerDeletePost = async (e) => {
    
    e.preventDefault()
    setLoading(true)

    try {
      
      const res = await fetch(`/api/post/deletepost/${postIDToDelete}/${currentUser._id}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if(!res.ok){
        console.log(data.message)
      }else{
        setUserPosts((prev) => prev.filter((post) => post._id != postIDToDelete ))
      }

      console.log(data.message)


    } catch (error) {
      console.log(error)
    }finally{
      setShowModal(false)
      setLoading(false)
    }
  }
  
  return (
    <div className="overflow-x-scroll table-auto md:mx-auto p-3">
        {
          userPosts.length > 0 ? 
          <>
            <Table hoverable className="shadow-md">
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Date update</TableHeadCell>
                    <TableHeadCell>Post image</TableHeadCell>
                    <TableHeadCell>Posts title</TableHeadCell>
                    <TableHeadCell>Category</TableHeadCell>
                    <TableHeadCell>Delete</TableHeadCell>
                    <TableHeadCell>Edit</TableHeadCell>
                  </TableRow>
                </TableHead>
                {
                  userPosts.map((post) => {
                    return (
                      <TableBody key={post._id}>
                        <TableRow>
                          <TableCell>
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Link to={`/post/${post.slug}`}>
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-20 h-20 object-cover bg-gray-500 border border-gray-500"
                              />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link to={`/post/${post.slug}`}>
                                {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell 
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                            onClick={() => {
                              setShowModal(true) 
                              setPostIDToDelete(post._id)
                            }}
                          >
                            <span>Delete</span>
                          </TableCell>
                          <TableCell>
                            <Link className="text-teal-500 font-medium hover:underline cursor-pointer" to={`/update-post/${post._id}`}>
                              <span>Edit</span>
                            </Link>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })
                }
            </Table>
            {
              showMore && (
                <button 
                  onClick={handlerShowMore} 
                  className="w-full text-teal-500 text-sm self-auto mx-auto cursor-pointer py-7">
                  voir plus +
                </button>
              )
            }
          </> 
          : 
          <>
            <p>Vous n'avez pas de posts.</p>
          </>
        }
        <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer cet article ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button 
                  color="red"
                  onClick={handlerDeletePost}
                  className="cursor-pointer"
                >
                  {
                    loading ? 
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Suppression...
                      </>
                     : 
                      "Oui, supprimer"
                    
                  }
                </Button>
                <Button 
                  color="alternative" 
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer"
                >
                  Non, annuler
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
    </div>
  )
}

export default DashPosts
