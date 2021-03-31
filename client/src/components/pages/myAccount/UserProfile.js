import React, { Component } from 'react';
import '../forms.css';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', bio: '', age: '', gender: '', location: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.password !== this.state.confirmPassword) {
            alert("Passwords don't match");
        } else {
            const response = await fetch('/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    bio: this.state.bio,
                    age: this.state.age,
                    gender: this.state.gender,
                    location: this.state.location,
                }),
            });

            const body = await response.text();
            if (response.status !== 200) {
                alert(body);
            } else {
                this.props.history.push('/UserProfile');
            }
        }
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    getData = async () => {
        const response = await fetch('/api/users/', {
            method: 'POST',
            headers: {
                'x-auth-token': this.state.token,
            }
        });
    }

    render() {
        return (
            <div className="form-container">
                <div className="form-content">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <h1> Edit Profile </h1>
                        <div className="form-inputs">
                            <label htmlFor="text" className="form-label">
                                Name
                            </label>
                            <input
                                className="form-input"
                                name="name"
                                type="text"
                                placeholder="Enter your Full Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-inputs">
                            <label className="form-label">Update Bio</label>
                            <input
                                className="form-input-bio"
                                name="bio"
                                type="text"
                                placeholder="Enter your Bio"
                                value={this.state.bio}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="text" className="form-label">
                                Age
                            </label>
                            <input
                                className="form-input"
                                name="age"
                                type="text"
                                placeholder="Age"
                                value={this.state.age}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="form-inputs">
                            <label htmlFor="text" className="form-label">
                                Gender
                            </label>
                            <input
                                className="form-input"
                                name="gender"
                                type="text"
                                placeholder="Gender"
                                value={this.state.gender}
                                onChange={this.handleChange}

                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="text" className="form-label">
                                Location
                            </label>
                            <input
                                className="form-input"
                                name="location"
                                type="text"
                                placeholder="123 Sesame St Plattsburgh, NY United States"
                            />
                        </div>
                        <div>
                            <button className="form-button" type="submit">
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default UserProfile;
