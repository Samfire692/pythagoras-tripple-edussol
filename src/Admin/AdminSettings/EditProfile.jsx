import React, { useState } from 'react'
import { ProfilePic } from './ProfilePic';
import { EditInfo } from './EditInfo';
import { Password } from './Password';
import Masonry from 'react-masonry-css'

export const EditProfile = () => {

  const [active, setActive] = useState("editinfo");
  const breakpoint = {
    default:4,
    1100:3,
    700:2,
    500:1
  }

  return (
    <div>    

      <div>
        <h2 className='font-bold text-2xl'>Edit Profile</h2>
      </div><br />

      <div className=''>
           <div>
              <ProfilePic/>
           </div>
        
           <div className='flex md:flex-row flex-col justify-center'>
              <div className=''>
                <EditInfo/>
              </div>
      
              <div>
                <Password/>
              </div>
           </div>
      </div><br />
    </div>
  )
}
