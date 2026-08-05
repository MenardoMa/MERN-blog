import { Button, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowNarrowUp, HiOutlineDocument, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

function DashboardComp() {
    
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])

    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)

    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)

    const [loading, setLoading] = useState(true);

    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        
        /**
         * Fetch Users
         */
        const fetchUsers = async () => {
            const res = await fetch("/api/user/getUsers?limit=5");
            const data = await res.json();

            if (res.ok) {
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
            setLastMonthUsers(data.lastMonthUser);
            }
        };

        /**
         * Fetch Posts
         */
        const fetchPosts = async () => {
            const res = await fetch("/api/post/getPosts?limit=5");
            const data = await res.json();

            if (res.ok) {
            setPosts(data.posts);
            setTotalPosts(data.totalPosts);
            setLastMonthPosts(data.lastMonthPosts);
            }
        };

        /**
         * Fetch Comments
         */
        const fetchComments = async () => {
            const res = await fetch("/api/comment/getComments?limit=5");
            const data = await res.json();

            if (res.ok) {
            setComments(data.comments);
            setTotalComments(data.totalComments);
            setLastMonthComments(data.lastMonthComments);
            }
        };

        /**
         * Fetch Data
         */
        const fetchData = async () => {
            try {
                setLoading(true);

                await Promise.all([
                    fetchUsers(),
                    fetchPosts(),
                    fetchComments(),
                ]);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.isAdmin) {
            fetchData();
        }

    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
    <div className="p-3 md:mx-auto">
        <div className="flex-wrap flex gap-4 justify-center">
            <div className="flex flex-col p-3 gap-4 md:w-74 w-full rounded-sm shadow">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-gray-500 text-md uppercase">Total users</h3>
                        <p className="text-2xl">{totalUsers}</p>
                    </div>
                    <HiOutlineUserGroup 
                            className="text-teal-600 rounded-full text-2xl"
                        />
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp />
                        {lastMonthUsers}
                    </span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            <div className="flex flex-col p-3 gap-4 md:w-74 w-full rounded-sm shadow">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-gray-500 text-md uppercase">Total Comment</h3>
                        <p className="text-2xl">{totalComments}</p>
                    </div>
                    <HiAnnotation 
                            className="text-teal-600 rounded-full text-2xl"
                        />
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp />
                        {lastMonthComments}
                    </span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            <div className="flex flex-col p-3 gap-4 md:w-74 w-full rounded-sm shadow">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                        <p className="text-2xl">{totalPosts}</p>
                    </div>
                    <HiOutlineDocument 
                            className="text-teal-600 rounded-full text-2xl"
                        />
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp />
                        {lastMonthPosts}
                    </span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center py-3 mx-auto">
            <div className="flex flex-col w-full md:w-auto shadow p-2 rounded-sm">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recent users</h1>
                    <Button
                        outline
                        className="cursor-pointer"
                    >
                        <Link to="?tab=users">
                            See all
                        </Link>
                    </Button>
                </div>
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                        <TableHeadCell>User image</TableHeadCell>
                        <TableHeadCell>Username</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {
                            users && users.map(user => (
                                <TableRow key={user._id}>
                                <TableCell>
                                    <img 
                                        src={user.profilePicture} 
                                        alt={user.username} 
                                        className="w-10 h-10 rounded-full bg-gray-500"
                                    />
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col w-full md:w-auto shadow p-2 rounded-sm">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recent comments</h1>
                    <Button
                        outline
                        className="cursor-pointer"
                    >
                        <Link to="?tab=comment">
                            See all
                        </Link>
                    </Button>
                </div>
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                        <TableHeadCell>Comment content</TableHeadCell>
                        <TableHeadCell>Likes</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y" >
                        {
                            comments && comments.map(comment => (
                                <TableRow key={comment._id}>
                                <TableCell className="w-3xs">
                                    <p className="line-clamp-2">{comment.content}</p>
                                </TableCell>
                                <TableCell>{comment.numberOfLikes}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col w-full md:w-auto shadow p-2 rounded-sm">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className="text-center p-2">Recent Posts</h1>
                    <Button
                        outline
                        className="cursor-pointer"
                    >
                        <Link to="?tab=posts">
                            See all
                        </Link>
                    </Button>
                </div>
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                        <TableHeadCell>Post image</TableHeadCell>
                        <TableHeadCell>Post Title</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {
                            posts && posts.map(post => (
                                <TableRow key={post._id}>
                                <TableCell>
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-10 h-10 rounded-full bg-gray-500"
                                    />
                                </TableCell>
                                <TableCell className="w-3xs">
                                    <p>{post.title}</p>
                                </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
  )
}

export default DashboardComp
