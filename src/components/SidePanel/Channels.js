import React, { Component } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";

import firebase from "../../firebase";

export class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        modal: false,
        channelName: "",
        channelDetails: "",
        channelsRef: firebase.database().ref("channels"),
        firstLoad: true,
        activeChannel: "",
    };

    componentDidMount() {
        this.addListners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    addListners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on("child_added", (snap) => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () =>
                this.setFirstChannel()
            );
        });
    };

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({ firstLoad: false });
    };

    // closeModal = () => this.setState({ modal: false });
    // openModal = () => this.setState({ modal: true });
    toggleModal = () => this.setState({ modal: !this.state.modal });

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    };

    isFormValid = ({ channelName, channelDetails }) =>
        channelName && channelDetails;

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
            },
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: "", channelDetails: "" });
                this.toggleModal();

                console.log("channel added");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    };

    setActiveChannel = (channel) => {
        this.setState({ activeChannel: channel.id });
    };

    // displayChannels = (channels) => {
    //     channels.length > 0 &&
    //         channels.map((channel) => {
    //             return (
    //                 <Menu.Item
    //                     key={channel.id}
    //                     onClick={() => console.log(channel)}
    //                     name={channel.name}
    //                     style={{ opacity: 0.7 }}
    //                 >
    //                     asd
    //                 </Menu.Item>
    //             );
    //         });
    // };

    render() {
        const { channels, modal } = this.state;

        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: "2em" }}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS{" "}
                        </span>{" "}
                        ({channels.length}){" "}
                        <Icon name="add" onClick={this.toggleModal} />
                    </Menu.Item>
                    {/* Channels */}

                    {/* {this.displayChannels(channels)} */}

                    {channels.length > 0 &&
                        channels.map((channel) => {
                            return (
                                <Menu.Item
                                    key={channel.id}
                                    onClick={() => this.changeChannel(channel)}
                                    name={channel.name}
                                    style={{ opacity: 0.7 }}
                                    active={
                                        channel.id === this.state.activeChannel
                                    }
                                >
                                    # {channel.name}
                                </Menu.Item>
                            );
                        })}
                </Menu.Menu>

                {/* Add Channel Modal */}

                <Modal basic open={modal} onClose={this.toggleModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button
                            color="green"
                            inverted
                            onClick={this.handleSubmit}
                        >
                            <Icon name="checkmark" /> Add
                        </Button>

                        <Button color="red" inverted onClick={this.toggleModal}>
                            <Icon name="checkmark" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(null, { setCurrentChannel })(Channels);
