import React from 'react';
// import { Link } from 'react-router-dom';
import '../forms.css';

function Privacy() {
    return (
        <div className="privacy-container"> 
            <br></br>
            <h1 className="about-header"> Privacy Policy </h1> <br></br>
            <h2 className="privacy-header"> 1. Limitations </h2>
            <p className="about-content"> Roomeo or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Roomeo, 
                even if Roomeo or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
                Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
            </p>
            <br></br>
            <h2 className="privacy-header"> 2. Revisions and Errata </h2>
            <p className="about-content"> The materials appearing on Roomeo's Website may include technical, typographical, or photographic errors. Roomeo will not promise that any
            of the materials in this Website are accurate, complete, or current. Roomeo may change the materials contained on its Website at any time without
            notice. Roomeo does not make any commitment to update the materials.
            </p>
            <br></br>
            <h2 className="privacy-header"> 3. Links </h2>
            <p className="about-content"> Roomeo has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link
            does not imply endorsement by Roomeo of the site. The use of any linked website is at the user's own risk.
            </p>
            <br></br>
            <h2 className="privacy-header"> 4. Governing Law </h2>
            <p className="about-content"> Any claim related to Roomes's Website shall be governed by the laws of Country without regards to its conflict of law provisions.
            </p>
            <br></br>
        </div>
    )
}

export default Privacy;