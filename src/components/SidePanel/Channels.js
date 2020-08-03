import React, { Component } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

export class Channels extends Component {
    state = {
        channels: [],
        modal: false,
        channelName: "",
        channelDetails: "",
    };

    // closeModal = () => this.setState({ modal: false });
    // openModal = () => this.setState({ modal: true });
    toggleModal = () => this.setState({ modal: !this.state.modal });

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

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
                </Menu.Menu>

                {/* Add Channel Modal */}

                <Modal basic open={modal} onClose={this.toggleModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form>
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
                        <Button color="green" inverted>
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

export default Channels;
