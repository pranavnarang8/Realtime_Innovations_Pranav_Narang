import React from 'react';
import "./RoleOptions.css"
import { useDispatch, useSelector } from 'react-redux';
import { chooseRole, closeOptions, resetProfile, selectOptions } from '../features/roleSlice';

const RoleOptions = ({desktop}) => {
    const option = useSelector(selectOptions);
    const dispatch = useDispatch();

    const roleSelect = (e) => {
        console.log(e.target)
        dispatch(chooseRole({
            profile: e.target.innerText,
        }))
        dispatch(resetProfile(null))
        dispatch(closeOptions())
    }
  return (
    <>
    {option && !desktop && <div className="roles">
      <div className="roleItems" onClick={(e) => roleSelect(e)}>
        <p>Product Design</p>
      </div>
      <div className="roleItems" onClick={(e) => roleSelect(e)}>
        <p>Flutter Developer</p>
      </div>
      <div className="roleItems" onClick={(e) => roleSelect(e)}>
        <p>QA Tester</p>
      </div>
      <div className="roleItems" onClick={(e) => roleSelect(e)}>
        <p>Product Owner</p>
      </div>
    </div>}
    {option && desktop && 
    <div className={`roles__container ${option && "roles__opacity"}`}>
    <div className='roles__desktop'>
    <div className="roleItems__desktop" onClick={(e) => roleSelect(e)}>
        <p>Product Design</p>
      </div>
      <div className="roleItems__desktop" onClick={(e) => roleSelect(e)}>
        <p>Flutter Developer</p>
      </div>
      <div className="roleItems__desktop" onClick={(e) => roleSelect(e)}>
        <p>QA Tester</p>
      </div>
      <div className="roleItems__desktop" onClick={(e) => roleSelect(e)}>
        <p>Product Owner</p>
      </div>
    </div>
    </div>
    }
    </>
  )
}

export default RoleOptions
