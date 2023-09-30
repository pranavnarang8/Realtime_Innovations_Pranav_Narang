import React, { useState } from 'react';
import "./Header.css"

const Header = ({title}) => {
    
  return (
    <>
    <div className='header__mobile'>
      <h2>{title}</h2>
    </div>
    </>
  )
}

export default Header
