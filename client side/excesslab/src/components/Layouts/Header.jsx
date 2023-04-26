import React from 'react'
import './header.css'
const Header = () => {
    return (
        <header className='navbar'>
            <div className='navbar__title navbar__item'  onClick={()=>{window.location.href='/'}}>Excess Labs</div>
            <div className='navbar__item' onClick={()=>{window.location.href='/app'}} >Create App</div>
            <div className='navbar__item' onClick={()=>{window.location.href='/wip'}} >Contact</div>
            <div className='navbar__item' onClick={()=>{window.location.href='/wip'}} >Help</div>
        </header>
    )
}

export default Header