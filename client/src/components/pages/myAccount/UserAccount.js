import React, { Component } from 'react';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../forms.css';
import { AiFillWarning } from "react-icons/ai";

class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', oldPassword: '', newPassword: '', confirmPassword: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () => {
        let response = await fetch('/api/users/getUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userToken: localStorage.getItem('token'),
            }),
        });

        const body = await response.json();
        console.log(body);

        if (response.status !== 200) {
            alert(body);
        } else {
            this.setState({
                email: body.email || '',
            });
        }
    };

    handleDeleteAccount = async () => {
        const response = await fetch('/api/users/deleteAccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
        });

        const body = await response.text();
        if (response.status !== 200) {
            alert(body);
        } else {
            NotificationManager.success(
                'User Account Deleted',
                'Success!',
                3000
            );
            setTimeout(() => {
                this.props.history.push('/');
                window.location.reload(false);
                localStorage.removeItem('token');
            }, 1000);
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.newPassword !== this.state.confirmPassword) {
            alert("Passwords don't match");
        } else {
            const response = await fetch('/api/users/updateAccount', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    email: this.state.email,
                    newPassword: this.state.newPassword,
                    oldPassword: this.state.oldPassword,
                }),
            });

            const body = await response.text();
            if (response.status !== 200) {
                alert(body);
            } else {
                NotificationManager.success('User Account Updated', 'Success!', 3000);
                this.props.history.push('/UserAccount');
            }
        }
    };

    handleChange = (e, key) => {
        this.setState({[key]: e.target.value});
    }

    render() {
        return (
            <div className="form-container">
                <div className="form-content">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <h1> Edit Account settings </h1>
                        <div className="form-inputs">
                            <label htmlFor="password" className="form-label">
                                Email
                            </label>
                            <input
                                className="form-input"
                                name="email"
                                type="text"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={(e) => this.handleChange(e, 'email')}
                            />
                        </div>
                        <br></br>
                        <br></br>
                        <div className="form-inputs">
                            <label htmlFor="password" className="form-label">
                                Old Password
                            </label>
                            <input
                                className="form-input"
                                name="oldPassword"
                                type="password"
                                placeholder="Password"
                                value={this.state.oldPassword}
                                onChange={(e) => this.handleChange(e, 'oldPassword')}
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="password" className="form-label">
                                New Password
                            </label>
                            <input
                                className="form-input"
                                name="newPassword"
                                type="password"
                                placeholder="Password"
                                value={this.state.newPassword}
                                onChange={(e) => this.handleChange(e, 'newPassword')}
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="password" className="form-label">
                                Confirm New Password
                            </label>
                            <input
                                className="form-input"
                                name="confirmPassword"
                                type="password"
                                placeholder="Password"
                                value={this.state.confirmPassword}
                                onChange={(e) => this.handleChange(e, 'confirmPassword')}
                            />
                        </div>
                        <div>
                            <button className="form-button" type="submit">
                                Update Account
                            </button>
                        </div>
                        <div className="button-container">
                            <button
                                className="delete-button"
                                onClick={this.handleDeleteAccount}
                            >
                                <span id="icon">
                                    <AiFillWarning />
                                </span>
                                <span> </span>
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
                <NotificationContainer/>
            </div>
        );
    }
}

export default UserAccount;
