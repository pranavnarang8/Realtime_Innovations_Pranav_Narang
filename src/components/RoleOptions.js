import React from 'react';
import "./RoleOptions.css"
import { useDispatch, useSelector } from 'react-redux';
import { chooseRole, closeOptions, selectOptions } from '../features/roleSlice';

const RoleOptions = () => {
    const option = useSelector(selectOptions);
    const dispatch = useDispatch();

    const roleSelect = (e) => {
        console.log(e.target)
        dispatch(chooseRole({
            profile: e.target.innerText,
        }))
        dispatch(closeOptions())
    }
  return (
    <>
    {option && <div className="roles">
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
    </>
  )
}

export default RoleOptions
