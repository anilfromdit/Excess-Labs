import React from 'react'
import './home.css'
const Home = () => {
  return (
    <div class="hero">
    <div class="hero-text-box">
      <h1 class="heading-primary">
      Simplify your <span>backend</span> infrastructure with <span> Excess</span> Labs
      </h1>
      <p class="hero-description">
      Our comprehensive BaaS platform offers everything you need to build and deploy your applications quickly and efficiently.
      </p>
      <a href="/apps" class="btn btn--fill margin-right-btn"
        >Create App
      </a>
      <a href="#" class="btn btn--outline margin-right-btn"
        >Learn more &darr;
      </a>
    </div>
    <div class="hero-img-box">
      
    </div>
    <div class="delivered-meals">
      <div class="delivered-imgs">
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-1.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-2.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-3.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-4.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-5.jpg" alt="Customer photo" />
        <img src="https://prayagtandon.github.io/Omnifood-Project/Hero-section/img/customers/customer-6.jpg" alt="Customer photo" />
      </div>
      <p class="delivered-text">
        <span>99+</span> Apps Created This Week!
      </p>
    </div>
  </div>
  )
}

export default Home