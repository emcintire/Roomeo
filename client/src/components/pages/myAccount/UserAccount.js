import React from 'react';
import '../forms.css';

function UserAccount() {
    return (
        <div className='form-container'>
            <div className= 'form-content'>
                <form className='form'>
                    <h1> Account settings </h1>
                        <h2> Change Password </h2>
                        <div className='form-inputs'>
                            <label htmlFor="password" className= 'form-label'>New Password</label>
                            <input
                                className='form-input'
                                name="password"
                                type='password'
                                placeholder="Password"
                            />
                        </div>
                        <div className='form-inputs'>
                            <label htmlFor="password" className= 'form-label'>Confirm New Password</label>
                            <input
                                className='form-input'
                                name="password"
                                type='password'
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <button className='form-button' type='submit'>Update Account</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

export default UserAccount
