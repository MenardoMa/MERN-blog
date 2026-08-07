import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Search = () => {

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const location = useLocation()


  useEffect(() => {

    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const sortFromUrl = urlParams.get('sort')
    const categoryFromUrl = urlParams.get('category')

    if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
        setSidebarData({
            ...sidebarData,
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl
        })
    }

    const fetchPosts = async () => {
        try {
            
            setLoading(true)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getPosts?${searchQuery}`)

            if(!res.ok){
                console.log(res)
                return
            }

            if(res.ok){
                const data = await res.json()
                setPosts(data.posts)

                if(data.posts.length === 9){
                    setShowMore(true)
                }else{
                    setShowMore(false)
                }

            }

        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    fetchPosts()

  }, [location.search])

  return (
    <div>
       <div>
            <form action="">
                <div>
                    <label htmlFor="">Search Term :</label>
                    <TextInput
                        placeholder="Search..."
                        id="searchTerm"
                        type="text"
                    />
                </div>
            </form>
       </div>
    </div>
  )
}

export default Search
