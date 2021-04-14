import React, { Component } from 'react';
import Select from 'react-select';
import 'react-notifications/lib/notifications.css';
import {
    NotificationContainer,
    NotificationManager,
} from 'react-notifications';
import '../forms.css';
import default_profile_pic from '../../../images/default_profile_pic.png';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            bio: '',
            age: '',
            gender: '',
            address: '',
            img: '',
            interests: [],
            interests2: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Options for the interests Select element
    options = [
        { value: 'Sports', label: 'Sports' },
        { value: 'Going Out', label: 'Going Out' },
        { value: 'Reading', label: 'Reading' },
        { value: 'Late Nights', label: 'Late Nights' },
        { value: 'Early Mornings', label: 'Early Mornings' },
        { value: 'Movies', label: 'Movies' },
        { value: 'Binging TV Shows', label: 'Binging TV Shows' },
        { value: 'Hiking', label: 'Hiking' },
        { value: 'Pop Music', label: 'Pop Music' },
        { value: 'Rap Music', label: 'Rap Music' },
        { value: 'Country Music', label: 'Country Music' },
        { value: 'Rock Music', label: 'Rock Music' },
        { value: 'Indie Music', label: 'Indie Music' },
    ];

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

        if (response.status !== 200) {
            alert(body);
        } else {
            this.setState({
                name: body.name || '',
                bio: body.bio || '',
                age: body.age || '',
                gender: body.gender || '',
                address: body.location.address || '',
                img: body.img,
                interests: body.interests || '',
                interests2: body.interests || '',
            });
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        
        let userInterests;

        userInterests = [];
        for (let i in this.state.interests) {
            if (typeof(this.state.interests[i]) === 'object' ) {
                userInterests.push(this.state.interests[i].label);
            }
            else {
                userInterests.push(this.state.interests[i]);
            }
        }

        const response = await fetch('/api/users/updateProfile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                name: this.state.name,
                bio: this.state.bio,
                age: this.state.age,
                gender: this.state.gender,
                address: this.state.address,
                interests: userInterests,
            }),
        });

        const body = await response.text();
        if (response.status !== 200) {
            alert(body);
        } else {
            NotificationManager.success(
                'User Profile Updated',
                'Success!',
                3000
            );
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        }
        
    };

    handleChange = (e, key) => {
        this.setState({ [key]: e.target.value });
    };

    handleInterestsChange = (selectedOption) => {
        this.setState({ interests: selectedOption });
    };

    handleSubmitImage = async (event) => {
        //Handles when a user uploads an image
        event.preventDefault();

        let file = new FormData();
        let imagedata = document.querySelector('input[type="file"]').files[0];
        file.append('file', imagedata);

        const response = await fetch('/api/users/img', {
            method: 'POST',
            headers: {
                'x-auth-token': localStorage.getItem('token'),
            },
            body: file,
        });

        const body = await response.text();
        if (response.status !== 200) {
            alert(body);
        } else {
            NotificationManager.success('Image uploaded', 'Success!', 3000);
            window.location.reload(false);
        }
    };

    render() {
        function importAll(r) {
            return r.keys().map(r);
        }
        const Images = importAll(
            require.context('../../../uploads', false, /\.(png|jpe?g|svg)$/)
        );
        let profilePic;

        for (let i in Images) {
            if (
                Images[i].default.slice(14, 31) === this.state.img.slice(0, 17)
            ) {
                profilePic = Images[i].default;
            }
        }

        return (
            <div className="form-container">
                <div className="form-content">
                    <h1 className="form-header"> Edit Profile </h1>
                    <div className="img-container">
                        <img
                            className="profile-pic"
                            src={
                                this.state.img
                                    ? profilePic
                                    : default_profile_pic
                            }
                            alt="Profile Pic"
                        />
                    </div>
                    <form
                        className="form-img-buttons"
                        encType="multipart/form-data"
                        onSubmit={this.handleSubmitImage}
                    >
                        <input type="file" name="file" />
                        <input type="submit" value="Submit" />
                    </form>
                    <form className="form" onSubmit={this.handleSubmit}>
                        <div className="form-inputs-small">
                            <label htmlFor="text" className="form-label">
                                Name
                            </label>
                            <input
                                className="form-input"
                                name="name"
                                type="text"
                                placeholder="Enter your Full Name"
                                value={this.state.name}
                                onChange={(e) => this.handleChange(e, 'name')}
                            />
                        </div>
                        <div className="form-inputs-small">
                            <label htmlFor="text" className="form-label">
                                Age
                            </label>
                            <input
                                className="form-input"
                                name="age"
                                type="text"
                                placeholder="Age"
                                value={this.state.age}
                                onChange={(e) => this.handleChange(e, 'age')}
                            />
                        </div>
                        <div className="form-inputs-small-gender">
                            <label htmlFor="text" className="form-label">
                                Gender
                            </label>
                            <select
                                className="form-input"
                                value={this.state.gender}
                                onChange={(e) => this.handleChange(e, 'gender')}
                            >
                                <option name="male"> Male</option>
                                <option name="female">Female</option>
                                <option name="other">Other</option>
                            </select>
                        </div>
                        <div className="form-inputs">
                            <label className="form-label">Update Bio</label>
                            <textarea
                                className="form-input-bio"
                                name="bio"
                                type="text"
                                placeholder="Enter your Bio"
                                value={this.state.bio}
                                onChange={(e) => this.handleChange(e, 'bio')}
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="text" className="form-label">
                                Interests: &emsp; {this.state.interests2.join(', ')}
                            </label>
                            <Select
                                onChange={value => this.handleInterestsChange(value)}
                                options={this.options}
                                isMulti
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="text" className="form-label">
                                Location
                            </label>
                            <input
                                className="form-input"
                                name="address"
                                type="text"
                                placeholder="123 Sesame St Plattsburgh, NY United States"
                                value={this.state.address}
                                onChange={(e) =>
                                    this.handleChange(e, 'address')
                                }
                            />
                        </div>
                        <div>
                            <button className="form-button" type="submit">
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
                <NotificationContainer />
            </div>
        );
    }
}

export default UserProfile;
