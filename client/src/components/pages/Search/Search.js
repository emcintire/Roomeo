import React, { Component } from 'react';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import Slider from '@material-ui/core/Slider';
import {
    NotificationContainer,
    NotificationManager,
} from 'react-notifications';
import './search.css';
import './styles.css';
// import '../forms.css';
import 'react-notifications/lib/notifications.css';
import default_profile_pic from '../../../images/default_profile_pic.png';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            bio: '',
            age: '',
            gender: '',
            address: '',
            img: '',
            interests: [],
        };
    }

    getUserData = async () => {
        const response = await fetch('/api/users/getUserData', {
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
                f_distance: body.filters.distance,
                f_ageRange: body.filters.ageRange,
                f_interests: body.filters.interests,
                f_gender: body.filters.gender,
            });
            return body;
        }
    };

    handleLike = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/users/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                id: this.state.id,
            }),
        });

        const body = await response.text();

        if (response.status !== 200) {
            alert(body);
        } else if (body) {
            NotificationManager.success(
                'View your matches to send them a message.',
                'Match!',
                3000
            );
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        } else {
            // console.log(body);
            window.location.reload(false);
        }
    };

    handleDislike = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/users/dislike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                id: this.state.id,
            }),
        });

        if (response.status !== 200) {
            alert(response);
        } else {
            window.location.reload(false);
        }
    };

    handleSliderChange = (name) => (e, value) => {
        this.setState({
            [name]: value,
        });
    };

    handleChange = (e, key) => {
        this.setState({ [key]: e.target.value });
    };

    submitFilters = async () => {
        const response = await fetch('/api/users/updateFilters', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                distance: this.state.f_distance,
                ageRange: this.state.f_ageRange,
                gender: this.state.f_gender,
            }),
        });

        if (response.status !== 200) {
            alert(response);
        } else {
            window.location.reload(false);
        }
    };

    openFilters = () => {
        const modal = document.querySelector('.filters-menu');
        modal.style.display = 'flex';
    };

    closeFilters = () => {
        const modal = document.querySelector('.filters-menu');
        modal.style.display = 'none';
    };

    componentDidMount = async () => {
        const user = await this.getUserData();
        console.log(user.filters.gender);
 
        let response = await fetch('/api/users/getUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                ageRange: user.filters.ageRange,
                gender: user.filters.gender,
                interests: user.filters.interests,
                distance: user.filters.distance,
            }),
        });

        let body = await response.json();

        if (response.status !== 200) {
            alert(body);
        } else {
            if (body.length > 0) {
                this.setState({
                    id: body[0]._id,
                    name: body[0].name,
                    bio: body[0].bio,
                    age: body[0].age,
                    gender: body[0].gender,
                    address: body[0].location.address,
                    img: body[0].img,
                    interests: body[0].interests,
                });
            } else {
                alert(
                    'Out of potential matches in your area! :( Come back later'
                );
            }
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
            <div className="user-container">
                <button className="filters-btn" onClick={this.openFilters}>
                    Filters
                </button>
                <div className="filters-menu">
                    <div className="menu-container">
                        <span className="close" onClick={this.closeFilters}>
                            &times;
                        </span>
                        <h1 className="filters-header"> Edit Filters </h1>
                        <div className="menu-content">
                            <form onSubmit={this.handleSubmit}>
                                <h3 className="filter-titles">
                                    Max Distance
                                    <span className="distance">{`${this.state.f_distance} miles`}</span>
                                </h3>
                                <Slider
                                    defaultValue={50}
                                    min={1}
                                    max={100}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="discrete-slider"
                                    onChange={this.handleSliderChange('f_distance')}
                                />
                                <h3 className="filter-titles">
                                    {' '}
                                    Age Range
                                    {/* <span className="ages">{`${this.state.f_ageRange[0]} to ${this.state.f_ageRange[1]}`}</span> */}
                                </h3>
                                <Slider
                                    defaultValue={[18, 100]}
                                    value={this.state.f_ageRange}
                                    min={18}
                                    max={100}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="discrete-slider"
                                    onChange={this.handleSliderChange('f_ageRange')}
                                />
                                <h3 className="filter-titles">
                                    Show me
                                </h3>
                                <select
                                    className="form-input"
                                    value={this.state.f_gender}
                                    onChange={(e) => this.handleChange(e, 'f_gender')}
                                >
                                    <option name="Women">Women</option>
                                    <option name="Men">Men</option>
                                    <option name="Everyone">Everyone</option>
                                </select>
                                <div className="submit-btn-container">
                                    <button className="submit-btn" onClick={this.submitFilters}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="text-container">
                    <h2 className="name-text">{this.state.name}</h2>
                    <h4 className="bio-text">"{this.state.bio}"</h4>
                    <h4 className="content-text">
                        <span className="title-text">Age:</span> &nbsp;
                        {this.state.age}
                    </h4>
                    <h4 className="content-text">
                        <span className="title-text">Gender:</span> &nbsp;
                        {this.state.gender}
                    </h4>
                    <h4 className="content-text">
                        <span className="title-text">Interests:</span> &nbsp;
                        {this.state.interests.join(', ')}
                    </h4>
                    <h4 className="content-text">
                        <span className="title-text">Address:</span> &nbsp;
                        {this.state.address}
                    </h4>
                </div>
                <img
                    className="profile_pic"
                    src={this.state.img ? profilePic : default_profile_pic}
                    alt="Profile Pic"
                />
                <button className="dislike__btn" onClick={this.handleDislike}>
                    <span id="icon">
                        <FaRegThumbsDown />
                    </span>
                    <span> </span>
                    Dislike
                </button>
                <button className="like__btn" onClick={this.handleLike}>
                    <span id="icon">
                        <FaRegThumbsUp />
                    </span>
                    <span> </span>
                    Like
                </button>
                <NotificationContainer />
            </div>
        );
    }
}

export default Search;
