import { Button } from "flowbite-react";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl text-center">
        <div className="flex-1 justify-center items-center flex flex-col">
            <h2 className="text-2xl">Want to learn more about Javascript</h2>
            <p className="text-gray-500 my-2">
                Checkout these resources with 100 Javascript Projects
            </p>
            <a
                href="https://100jsprojects.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button className="cursor-pointer">
                    100 Javascript Projects
                </Button>
            </a>
        </div>
        <div className="p-7 flex-1">
            <img 
                // src="https://read.learnyard.com/content/images/2024/07/logo.png"
                src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto" 
                alt="" 
            />
        </div>
    </div>
  )
}

export default CallToAction
