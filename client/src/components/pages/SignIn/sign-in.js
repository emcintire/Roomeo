import React, { Component } from 'react';
import '../forms.css';

class signIn extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        let response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        });
        const body = await response.text();

        if (response.status !== 200) {
            alert(body);
        } else {
            localStorage.setItem('token', body);
            // this.props.history.push('/');
        }
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div className='form-container'>
                <div className= 'form-content'>
                    <form onSubmit={this.handleSubmit} className='form'>
                        <h1> Sign In </h1>
                        <div className='form-inputs'>
                            <label htmlFor="email" className= 'form-label'>Email</label>
                            <input
                                className='form-input'
                                name="email"
                                type='email'
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='form-inputs'>
                            <label htmlFor="password" className= 'form-label'>Password</label>
                            <input
                                className='form-input'
                                name="password"
                                type='password'
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            <button className='form-button' type='submit'>Login</button>
                        </div>
                        <p>{this.state.responseToPost}</p>
                    </form>
                </div>
            </div>
        );
    }
}

export default signIn;