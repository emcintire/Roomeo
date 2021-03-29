import React from 'react';
import '../forms.css';

function UserProfile() {
    return (
        <div className='form-container'>
            <div className= 'form-content'>
                <form className='form'>
                    <h1> Edit Profile </h1>
                    <div className='form-inputs'>
                        <label className= 'form-label'>Update Bio</label>
                        <input
                            className='form-input-bio'
                            name="bio"
                            type="text"
                            placeholder="Enter your Bio"
                            />
                        </div>
                        <div className='form-inputs'>
                            <label htmlFor="text" className= 'form-label'>Location</label>
                            <input
                                className='form-input'
                                name="location"
                                type='text'
                                placeholder=""
                            />
                        </div>
                        <div>
                            <button className='form-button' type='submit'>Update Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

export default UserProfile
