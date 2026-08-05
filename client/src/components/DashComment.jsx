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
import { FaCheck, FaTimes } from "react-icons/fa";



const DashComment = () => {
  
    
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIDToDelete, setCommentIDToDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingComment, setLoadingComment] = useState(true);

  /**
   * 
   * Get Posts
   * 
   */
  useEffect(() => {
    const fetchComment = async () => {
      setLoadingComment(true);

      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (res.ok) {
          setComment(data.comments);

          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingComment(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComment();
    }
  }, [currentUser._id]);

  /**
   * Show more post 
   * 
   */
  const handlerShowMore = async () => {
    
    const startIndex = comment.length

    try {
      
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`)
      const data = await res.json()

      if(res.ok){
        setComment((prev) => [...prev, ...data.comment])
        if(data.comment.length < 9){
          setShowMore(false)
        }
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * 
   * Delete Post
   * 
   * @param {*} e 
   */
  const handlerDeleteComment = async (e) => {
    
    e.preventDefault()
    setLoading(true)

    try {
      
      const res = await fetch(`/api/user/admin/delete/${commentIDToDelete}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if(!res.ok){
        console.log(data.message)
      }else{
        setComment((prev) => prev.filter((post) => post._id != commentIDToDelete ))
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
    <>
      {loadingComment ? (
        <div className="flex justify-center mx-auto items-center py-10">
          <Spinner size="xl" />
        </div>
      ) : comment.length > 0 ? (
        <div className="overflow-x-scroll table-auto md:mx-auto p-3">
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableRow>
                <TableHeadCell>Date UpdatedAt</TableHeadCell>
                <TableHeadCell>Comment Content</TableHeadCell>
                <TableHeadCell>Nombre of likes</TableHeadCell>
                <TableHeadCell>Post Id</TableHeadCell>
                <TableHeadCell>User Id</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {comment.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                      {comment.content}
                  </TableCell>

                  <TableCell>
                      {comment.numberOfLikes}
                  </TableCell>

                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>
                    { comment.userId }
                </TableCell>
                  <TableCell
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setCommentIDToDelete(comment._id);
                    }}
                  >
                    Delete
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <button
              onClick={handlerShowMore}
              className="w-full text-teal-500 text-sm mx-auto cursor-pointer py-7"
            >
              Voir plus +
            </button>
          )}

        <Modal
            show={showModal}
            size="md"
            onClose={() => setShowModal(false)}
            popup
          >
            <ModalHeader />
            <ModalBody>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Êtes-vous sûr de vouloir supprimer ce commentaire ?
                </h3>

                <div className="flex justify-center gap-4">
                  <Button
                    color="red"
                    className="cursor-pointer"
                    onClick={handlerDeleteComment}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Suppression...
                      </>
                    ) : (
                      "Oui, supprimer"
                    )}
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
      ) : (
        <div className="flex justify-center flex-col mx-auto gap-4 py-10">
          <p className="text-gray-500">Vous n'avez pas des commentaires.</p>
        </div>
      )}
    </>
  )
}

export default DashComment
