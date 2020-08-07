import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../firebase";
import Message from "./Message";
// import Spinner from "../../Spinner";

class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
        numUniqueUsers: "",
        searchTerm: "",
        searchLoading: false,
        searchResult: [],
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref("privateMessages"),
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
        const ref = this.getMessagesRef();
        ref.child(channelId).on("child_added", (snap) => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false,
            });
            this.countUniqueUsers(loadedMessages);
        });
    };

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    };

    handelSearchChange = (event) => {
        this.setState(
            {
                searchTerm: event.target.value,
                searchLoading: true,
            },
            () => this.handelSearchMesssages()
        );
    };

    handelSearchMesssages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResult = channelMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResult });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    };

    countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
        this.setState({ numUniqueUsers });
    };

    displayMessages = (messages = []) => {
        return (
            messages.length > 0 &&
            messages.map((message) => (
                <Message
                    key={message.timestamp}
                    message={message}
                    user={this.state.user}
                />
            ))
        );
        // : (
        //     <Spinner content="Fetching Messages..." size="medium" />
        // );
    };

    isProgressBarVisible = (percent) => {
        if (percent > 0) {
            this.setState({ progressBar: true });
        }
    };

    displayChannelName = (channel) => {
        return channel
            ? `${this.state.privateChannel ? "@" : "#"} ${channel.name}`
            : ``;
    };

    render() {
        const {
            messagesRef,
            messages,
            channel,
            user,
            progressBar,
            numUniqueUsers,
            searchTerm,
            searchResult,
            searchLoading,
            privateChannel,
        } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handelSearchChange={this.handelSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                />

                <Segment>
                    <Comment.Group
                        className={
                            progressBar ? "messages__progress" : "messages"
                        }
                    >
                        {searchTerm
                            ? this.displayMessages(searchResult)
                            : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
