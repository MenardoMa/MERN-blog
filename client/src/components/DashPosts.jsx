import { Table, TableBody, TableRow, TableCell, TableHead, TableHeadCell, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
  
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)

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
                          <TableCell className="font-medium text-red-500 hover:underline cursor-pointer">
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
    </div>
  )
}

export default DashPosts
