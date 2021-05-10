import React, { Component, Fragment } from 'react';
import Talk from 'talkjs';
import './Messages.css';
// import { List, ListItem, ListItemText, Divider } from '@material-ui/core';

class DirectChatPage extends Component {
    constructor(props) {
        super(props);

        this.inbox = undefined;

        this.state = {
            user: '',
            matches: [],
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
                user: body
            });

            Talk.ready
                .then(() => {
                    const me = new Talk.User({
                        id: body._id,
                        name: body.name,
                        role: "default"
                    });
    
                    if (!window.talkSession) {
                        window.talkSession = new Talk.Session({
                            appId: 'tcYZVRdQ',
                            me: me
                        });
                    }

                    // for (let i in body.matches) {
                    //     let other = new Talk.User({
                    //         id: body.matches[i]._id,
                    //         name: body.matches[i].name,
                    //         role: "default"
                    //     });

                    //     // this.setState({
                    //     //     [body.matches[i]._id]: other
                    //     // });
                    if (localStorage.getItem('user')) {
                        let other = new Talk.User({
                            id: JSON.parse(localStorage.getItem('user'))._id,
                            name: JSON.parse(localStorage.getItem('user')).name,
                            role: "default"
                        });

                        const conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(me, other));
                
                        conversation.setParticipant(me);
                        conversation.setParticipant(other);

                        this.inbox = window.talkSession.createInbox({selected: conversation});
                        localStorage.removeItem('user');
                    } else {
                        this.inbox = window.talkSession.createInbox();
                    }

                    this.inbox.mount(this.container);

                }).catch(e => console.error(e));
        }
    };

    componentDidMount = async () => {
        this.getUserData();
    }

    render() {
        return (
            <div className="chat-container">
                <Fragment>
                    <div
                        className="inbox-container"
                        ref={(c) => (this.container = c)}
                    >
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default DirectChatPage;
