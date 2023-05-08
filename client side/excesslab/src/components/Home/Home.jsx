import React from 'react'
import './home.css'
const Home = () => {
  return (
    <div className="hero">
    <div className="hero-text-box">
      <h1 className="heading-primary">
      Simplify your <span>backend</span> infrastructure with <span> Excess</span> Labs
      </h1>
      <p className="hero-description">
      Our comprehensive BaaS platform offers everything you need to build and deploy your applications quickly and efficiently.
      </p>
      <a href="/apps" className="btn btn--fill margin-right-btn"
        >Create App
      </a>
      <a href="#" className="btn btn--outline margin-right-btn"
        >Learn more &darr;
      </a>
    </div>
    <div className="hero-img-box">
      
    </div>
    <div className="delivered-meals">
      <div className="delivered-imgs">
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-1.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-2.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-3.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-4.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-5.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-6.jpg" alt="Customer photo" />
      </div>
      <p className="delivered-text">
        <span>99+</span> Apps Created This Week!
      </p>
    </div>
  </div>
  )
}

export default Home