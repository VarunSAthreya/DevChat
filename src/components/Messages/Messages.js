import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";
import Message from "./Message";
import Spinner from "../../Spinner";
import ProgressBar from "./ProgressBar";

export class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
    };

    componentWillMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListners(channel.id);
        }
    }

    addListners = (channelId) => {
        this.addMessageListner(channelId);
    };

    addMessageListner = (channelId) => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on("child_added", (snap) => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false,
            });
        });
    };

    displayMessages = (messages = []) => {
        return messages.length > 0 ? (
            messages.map((message) => (
                <Message
                    key={message.timestamp}
                    message={message}
                    user={this.state.user}
                />
            ))
        ) : (
            <Spinner content="Fetching Messages..." size="medium" />
        );
    };

    isProgressBarVisible = (percent) => {
        if (percent > 0) {
            this.setState({ progressBar: true });
        }
    };

    render() {
        const {
            messagesRef,
            messages,
            channel,
            user,
            progressBar,
        } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group
                        className={
                            progressBar ? "messages__progress" : "messages"
                        }
                    >
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
