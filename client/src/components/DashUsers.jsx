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



const DashUsers = () => {
  
    
  const { currentUser } = useSelector(state => state.user)
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIDToDelete, setUserIDToDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true);

  /**
   * 
   * Get Posts
   * 
   */
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);

      try {
        const res = await fetch(`/api/user/getUsers`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);

          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  /**
   * Show more post 
   * 
   */
  const handlerShowMore = async () => {
    
    const startIndex = users.length

    try {
      
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`)
      const data = await res.json()

      if(res.ok){
        setUsers((prev) => [...prev, ...data.users])
        if(data.users.length < 9){
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
  const handlerDeleteUser = async (e) => {
    
    e.preventDefault()
    setLoading(true)

    try {
      
      const res = await fetch(`/api/user/delete/${userIDToDelete}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if(!res.ok){
        console.log(data.message)
      }else{
        setUsers((prev) => prev.filter((post) => post._id != userIDToDelete ))
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
      {loadingUsers ? (
        <div className="flex justify-center mx-auto items-center py-10">
          <Spinner size="xl" />
        </div>
      ) : users.length > 0 ? (
        <div className="overflow-x-scroll table-auto md:mx-auto p-3">
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableRow>
                <TableHeadCell>Date Create</TableHeadCell>
                <TableHeadCell>User image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Admin</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-20 h-20 object-cover bg-gray-500 border border-gray-500"
                      />
                  </TableCell>

                  <TableCell>
                      {user.username}
                  </TableCell>

                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {
                        user.isAdmin ? (<FaCheck/>) : (<FaTimes />)
                    }
                </TableCell>
                  <TableCell
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setUserIDToDelete(user._id);
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
                  Êtes-vous sûr de vouloir supprimer cet user ?
                </h3>

                <div className="flex justify-center gap-4">
                  <Button
                    color="red"
                    className="cursor-pointer"
                    onClick={handlerDeleteUser}
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
          <p className="text-gray-500">Vous n'avez pas de users.</p>
        </div>
      )}
    </>
  )
}

export default DashUsers
