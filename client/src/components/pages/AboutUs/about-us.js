// import React from 'react';
// import './about-us.css';
// // import { Link } from 'react-router-dom';

// function aboutUs() {
//     return (
//         <div className="about-container">
//             <div className="all-wrapper">
//             <h1 className="about-header"> About Us</h1>
//             <p className="about-content">
//                 Roomeo is a service tailored to fit your rooming dreams. We keep
//                 you in mind at every step to ensure you have the best
//                 experience. 
//                 <br></br>
//                 <br></br>
//                 Roomeo has users do quick background checks and gives the option to link social media accounts so both 
//                 roommates can feel more confident and secure in the process. Once you're ready to message a potential “Roome," 
//                 you can do so through the app so you don't have to exchange any personal contact information until you're ready.
//                 You can look for someone to move into your open space, move into a vacant room 
//                 someone else is offering or find a new roommate to look for an entirely new apartment with.
//                 Members can match based on testimonials from friends, hobbies, interests and questions answered through their 
//                 profiles. Roomster allows users to link their social accounts, so this app tends to have more 
//                 data to find the perfect match. Once you find a potential roommate that looks promising, 
//                 you can connect with them through the Roomster mailbox.


//             </p>
//             </div>
//         </div>
//     );
// }

// export default aboutUs;

import React from 'react'
import HeroSection from '../../HeroSection'
import {
  homeObjOne, homeObjTwo
} from './about-us-data'

function aboutUs() {
    return (
        <>
          <HeroSection {...homeObjOne} />
          <HeroSection {...homeObjTwo} />

        </>
    );
}

export default aboutUs
