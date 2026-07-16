import { 
    Footer, 
    FooterLinkGroup, 
    FooterLink, 
    FooterTitle, 
    FooterDivider, 
    FooterCopyright, 
    FooterIcon 
} from "flowbite-react";

import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="mt-5">
                    <Link to="/" className="self-center whitespace-normal text-sm text-lg sm:text-xl font-semibold dark:text-white">
                        <span 
                            className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl">
                                Mern
                            </span>
                            Blog
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                        <FooterTitle title="About" />
                        <FooterLinkGroup col>
                            <FooterLink href="#">About</FooterLink>
                            <FooterLink href="#">Privacy Policy</FooterLink>
                            <FooterLink href="#">Licensing</FooterLink>
                            <FooterLink href="#">Contact</FooterLink>
                        </FooterLinkGroup>
                    </div>
                    <div>
                        <FooterTitle title="follow us" />
                        <FooterLinkGroup col>
                            <FooterLink href="#">Privacy Policy</FooterLink>
                            <FooterLink href="#">Licensing</FooterLink>
                        </FooterLinkGroup>
                    </div>
                    <div>
                        <FooterTitle title="legal" />
                        <FooterLinkGroup col>
                            <FooterLink href="#">Privacy Policy</FooterLink>
                            <FooterLink href="#">Licensing</FooterLink>
                        </FooterLinkGroup>
                    </div>
                </div>
            </div>
            <FooterDivider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <FooterCopyright href="#" by="Menardo" year={new Date().getFullYear()} />
                <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                    <FooterIcon href="#" icon={BsFacebook} />
                    <FooterIcon href="#" icon={BsInstagram} />
                    <FooterIcon href="#" icon={BsTwitter} />
                    <FooterIcon href="#" icon={BsGithub} />
                    <FooterIcon href="#" icon={BsDribbble} />
                </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterCom
