import React, { Component } from 'react';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import {
    NotificationContainer,
    NotificationManager,
} from 'react-notifications';
import './matches.css';
import '../forms.css';
import 'react-notifications/lib/notifications.css';
import default_profile_pic from '../../../images/default_profile_pic.png';

class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            matches: [],
            images: [],
        };
    }

    componentDidMount = async () => {
        this.getUserData();
    };

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
            for (let i in body.matches) {
                await this.getUserDataWithId(body.matches[i]._id);  //Adds each user to this.state with their id as their key
            }
            this.setState({
                user: body,
                matches: body.matches,
            });
        }
    };

    //Adds each user to this.state with their id as their key
    getUserDataWithId = async (id) => { 
        const response = await fetch('/api/users/getUserDataWithId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        });

        const body = await response.json();

        if (response.status !== 200) {
            alert(body);
        } else {
            this.setState({
                [id]: body 
            });
        }
    };

    handleMessage = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.props.history.push('/messages');
    };

    handleUnmatch = async (userId) => {
        const response = await fetch('/api/users/unmatch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                id: userId,
            }),
        });

        if (response.status !== 200) {
            alert(response);
        } else {
            NotificationManager.success('User unmatched!', 'Success!', 3000);
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        }
    };

    openProfile = (id) => {
        const modal = document.querySelector(`#id-${id}.modal`);
        modal.style.display = 'block';
    };

    closeProfile = (id) => {
        const modal = document.querySelector(`#id-${id}.modal`);
        modal.style.display = 'none';
    };

    loadImages = (user) => {
        function importAll(r) {
            return r.keys().map(r);
        }
        const Images = importAll(
            require.context('../../../uploads', false, /\.(png|jpe?g|svg)$/)
        );
        let profilePic;

        if (user.img !== '') {
            for (let i in Images) {
                if (
                    Images[i].default.slice(14, 31) === user.img.slice(0, 17)
                ) {
                    profilePic = Images[i].default;
                    return profilePic;
                }
            }
        } else {
            return default_profile_pic
        }
    };

    render() {

        return (
            <div className="match-container">
                <h1 className="big-text">Matches</h1>
                {this.state.matches.map((item, index) => {

                    return (
                        
                        <div className="list-container">
                            <div className="modal" id={'id-' + item._id}>
                                <div className="modal_content">
                                    <span
                                        className="close"
                                        onClick={() =>
                                            this.closeProfile(item._id)
                                        }
                                    >
                                        &times;
                                    </span>
                                    <img
                                        className="profile-picture"
                                        src={this.loadImages(item)}
                                        alt="Profile Pic"
                                    />
                                    <div className="text-container">
                                        <h2 className="name">
                                            {this.state[item._id].name}
                                        </h2>
                                        <h4 className="bio">"{this.state[item._id].bio}"</h4>
                                    </div>
                                    <div className="content-container">
                                        <h4 className="content">
                                            <span className="title">Age:</span>{' '}
                                            &nbsp;{this.state[item._id].age}
                                        </h4>
                                        <h4 className="content">
                                            <span className="title">
                                                Gender:
                                            </span>{' '}
                                            &nbsp;{this.state[item._id].gender}
                                        </h4>
                                        <h4 className="content"><span className="title">Interests:</span> &nbsp;{(this.state[item._id].interests).join(", ")}</h4>
                                        <h4 className="content">
                                            <span className="title">
                                                Address:
                                            </span>{' '}
                                            &nbsp;{this.state[item._id].location.address}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <List component="nav">
                                <ListItem
                                    className="list-item"
                                    button
                                    onClick={() => this.openProfile(item._id)}
                                >
                                    <img
                                        className="small-pic"
                                        src={this.loadImages(item)}
                                        alt="Profile Pic"
                                    />
                                    <ListItemText
                                        className="list-text"
                                        primary={item.name}
                                    />
                                    <button
                                        className="message-btn"
                                        onClick={() => this.handleMessage(item)}
                                    >
                                        Message
                                    </button>
                                    <button
                                        className="unmatch-btn"
                                        onClick={() =>
                                            this.handleUnmatch(item._id)
                                        }
                                    >
                                        Unmatch
                                    </button>
                                </ListItem>

                                <Divider />
                            </List>
                            
                        </div>
                    );
                })}

                <NotificationContainer />
            </div>
        );
    }
}

export default Matches;
