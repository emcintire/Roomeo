import React, { Component } from 'react';
import '../forms.css';

class signUp extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', name: '', password: '', confirmPassword: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.password !== this.state.confirmPassword) {
            alert("Passwords don't match");
        } else {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                }),
            });
        
            const body = await response.text();
            if (response.status !== 200) {
                alert(body);
            } else {
                localStorage.setItem('token', body);
                this.props.history.push('/');
                window.location.reload(false);
            }
        }
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div>
                <div className="form-container">
                    <div className="form-content">
                        <form onSubmit={this.handleSubmit} className="form">
                            <h1> Create Account </h1>
                            <div className="form-inputs">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    className="form-input"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your Full Name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-inputs">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    className="form-input"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-inputs">
                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Password
                                </label>
                                <input
                                    className="form-input"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-inputs">
                                <label
                                    htmlFor="confirmPassword"
                                    className="form-label"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    className="form-input"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChange}
                                />
                            </div>
                            {/* <div className="form-inputs">
                                <input
                                    type="checkbox"
                                />
                                <p> Accept the <span>Terms and Conditions</span> </p>
                            </div> */}
                            <div>
                                <button className="form-button" type="submit">
                                    Create Account
                                </button>
                                {/* <p>Already have an account? <span>Sign In</span></p> */}
                            </div>
                            <p>{this.state.responseToPost}</p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default signUp;
