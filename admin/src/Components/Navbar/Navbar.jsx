import React from 'react'
import './Navbar'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
<div className='navbar' style={{display: "flex",padding:"10px,50px",boxShadow:"0px 1px 3px -2px #000",marginBottom:"1px",background:"white"}}>  
      <img src={navlogo} className='nav-logo' style={{width:"200px",marginLeft:"15px"}} alt="" />
      <img src={navProfile} alt="" style={{width:"75px",marginRight:"15px"}}/>
    </div>
  )
}

export default Navbar
