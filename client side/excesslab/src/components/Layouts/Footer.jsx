import React from 'react'
import './footer.css'
import {AiFillGithub,AiFillLinkedin} from 'react-icons/ai'

const Footer = () => {
    return (
        <footer class="footer-distributed">

            <div class="footer-left">

                <h3 onClick={()=>{window.location.href='/'}} >Excess<span>Labs</span></h3>

                <p class="footer-links">
                    <a href="/" class="link-1">Home</a>

                    <a href="/wip">Blog</a>

                    <a href="/wip">Pricing</a>

                    <a href="/wip">About</a>

                    <a href="/wip">Faq</a>

                    <a href="https://www.linkedin.com/in/anilfromdit/">Contact</a>
                </p>

                <p class="footer-company-name">Excess Labs © 2023</p>
            </div>

            <div class="footer-center">

                <div>
                    <p><span>Anil Gulati</span></p>
                </div>

                <div>
                    <p>+91 925-639-1000</p>
                </div>

                <div>
                    <p><a href="mailto:support@company.com">anilfromdit@gmail.com</a></p>
                </div>

            </div>

            <div class="footer-right">

                <p class="footer-company-about">
                    <span>About the company</span>
                    Excess Labs is a BaaS project that aims to simplify the software development process for developers.    </p>

                <div class="footer-icons">
                    <a href="https://www.linkedin.com/in/anilfromdit/"><AiFillLinkedin size={35}/> </a>
                    <a href="https://github.com/anilfromdit"> <AiFillGithub size={35}/></a>

                </div>

            </div>

        </footer>
    )
}

export default Footer