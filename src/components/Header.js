import React, { useState } from 'react';
import "./Header.css"
import { useSelector } from 'react-redux';
import { selectOptions } from '../features/roleSlice';

const Header = ({title}) => {
  const option = useSelector(selectOptions)
    
  return (
    <>
    <div className={`header__mobile ${option && 'header__opacity'}`}>
      <h2>{title}</h2>
    </div>
    </>
  )
}

export default Header
