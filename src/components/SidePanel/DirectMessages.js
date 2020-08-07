import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import firebase from "../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

class DirectMessages extends Component {
    state = {
        currentUser: this.props.currentUser,
        users: [],
        userRef: firebase.database().ref("users"),
        connectedRef: firebase.database().ref(".info/connected"),
        presenceRef: firebase.database().ref("presence"),
    };

    componentDidMount() {
        if (this.state.currentUser) {
            this.addListenter(this.state.currentUser.uid);
        }
    }

    addListenter = (currentUserUid) => {
        let loadedUsers = [];
        this.state.userRef.on("child_added", (snap) => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user["uid"] = snap.key;
                user["status"] = "offline";
                loadedUsers.push(user);
                this.setState({ user: loadedUsers });
            }
        });

        this.state.connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect((err) => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            }
        });

        this.state.presenceRef.on("child_added", (snap) => {
            if (currentUserUid !== snap.key) {
                // add status to the user
                this.addStatusToUser(snap.key);
            }
        });

        this.state.presenceRef.on("child_removed", (snap) => {
            if (currentUserUid !== snap.key) {
                // add status to the user
                this.addStatusToUser(snap.key, false);
            }
        });
    };

    addStatusToUser = (userId, connected = true) => {
        const updatedUser = this.state.user.reduce((acc, user) => {
            if (user.uid === userId) {
                user["status"] = `${connected ? "online" : "offline"}`;
            }
            return [...acc, user];
        }, []);
        this.setState({ users: updatedUser });
    };

    isUserOnline = (user) => user.status === "online";

    changeChannel = (user) => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name,
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
    };

    getChannelId = (userId) => {
        const currentUserId = this.state.currentUser.uid;
        console.log(currentUserId);
        return userId < currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`;
    };

    render() {
        const { users } = this.state;

        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="mail" /> DIRECT MESSAGES
                    </span>{" "}
                    ({users.length})
                </Menu.Item>
                {/* Users to send DM */}

                {users.map((user) => (
                    <Menu.Item
                        key={user.uid}
                        onClick={() => this.changeChannel(user)}
                        style={{ opacity: 0.7, fontStyle: "italic" }}
                    >
                        <Icon
                            name="circle"
                            color={this.isUserOnline(user) ? "green" : "red"}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
    DirectMessages
);