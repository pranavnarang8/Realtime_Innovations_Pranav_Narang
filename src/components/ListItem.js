import React from 'react';
import "./ListItem.css"

const ListItem = ({listType}) => {
  return (
    <>
    <div className='listItem__mobile'>
      <p>Pranav Narang</p>
      <span>UI Developer</span>
      <span>From 22nd Jul,2023</span>
    </div>
    </>
  )
}

export default ListItem
