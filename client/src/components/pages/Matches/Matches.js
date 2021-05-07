import React, { Component } from 'react';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import {
    NotificationContainer,
    NotificationManager,
} from 'react-notifications';
// import { Multiselect } from 'multiselect-react-dropdown';
import './matches.css';
import '../forms.css';
import 'react-notifications/lib/notifications.css';
import default_profile_pic from '../../../images/default_profile_pic.png';
import { ImCross } from "react-icons/im";


class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            images: [],
        };
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () => {
        this.getUserData();
        // this.loadImages();
        // console.log(this.state.images);
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
            this.setState({
                matches: body.matches,
            });
        }
    };
    
    handleUnmatch = async (userId) => {
        const response = await fetch('/api/users/unmatch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                id: userId
            }),
        });

        // const body = await response.json();

        if (response.status !== 200) {
            alert(response);
        } else {
            NotificationManager.success(
                'User unmatched!',
                'Success!',
                3000
            );
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        }


    };

    loadImages = async () => {
        function importAll(r) {
            return r.keys().map(r);
        }
        const Images = importAll(
            require.context('../../../uploads', false, /\.(png|jpe?g|svg)$/)
        );

        this.setState({
            images: Images,
        });

        // console.log(this.state.matches);

        // let profilePic;

        // for (let i in Images) {
        //     if (
        //         Images[i].default.slice(14, 31) === imgPath.slice(0, 17)
        //     ) {
        //         profilePic = Images[i].default;
        //         this.state
        //     }
        // }
    };

    render() {
        return (
            <div className="match-container">
                <h1 className="big-text">Matches</h1>
                {this.state.matches.map((item, index) => {
                    return (
                        <List className="list-container" component="nav">
                           
                            <ListItem className="list-item" button>
                                <ListItemText className="list-text" primary={item.name} />

                                <button className="unmatch-btn" onClick={() => this.handleUnmatch(item._id)}>
                                    <span id="icon">
                                        <ImCross/>
                                    </span>
                                    <span> </span>
                                    Unmatch
                                </button>
                            </ListItem>
                            
                            <Divider />
                        </List>
                    );
                })}

                <NotificationContainer />
            </div>
        );
    }
}

export default Matches;