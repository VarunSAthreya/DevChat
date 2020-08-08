import React, { Component } from "react";
import {
    Sidebar,
    Menu,
    Divider,
    Button,
    Modal,
    Icon,
    Label,
    Segment,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";

import firebase from "../../firebase";

export class ColorPanel extends Component {
    state = {
        modal: false,
        primary: "",
        secondary: "",
        user: this.props.currentUser,
        userRef: firebase.database().ref("users"),
    };

    toggleModal = () => this.setState({ modal: !this.state.modal });

    handleChangePrimary = (color) => this.setState({ primary: color.hex });

    handleChangeSecondary = (color) => this.setState({ secondary: color.hex });

    handleSaveColors = () => {
        if (this.state.primary && this.state.secondary) {
            this.saveColors(this.state.primary, this.state.secondary);
        }
    };

    saveColors = (primary, secondary) => {
        this.state.userRef
            .child(`${this.state.user.uid}/colors`)
            .push()
            .update({
                primary,
                secondary,
            })
            .then(() => {
                console.log("Colors Added");
                this.toggleModal();
            })
            .catch((err) => console.error(err));
    };

    render() {
        const { modal, primary, secondary } = this.state;

        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button
                    icon="add"
                    size="small"
                    // style={{ height: "2.5rem" }}
                    color="blue"
                    onClick={this.toggleModal}
                />
                {/* Color Picker Modal */}

                <Modal basic open={modal} onClose={this.toggleModal}>
                    <Modal.Header>Chose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary Color" />
                            <SliderPicker
                                color={primary}
                                onChange={this.handleChangePrimary}
                            />
                        </Segment>

                        <Segment inverted>
                            <Label content="Secondary Color" />
                            <SliderPicker
                                color={secondary}
                                onChange={this.handleChangeSecondary}
                            />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="green"
                            inverted
                            onClick={this.handleSaveColors}
                        >
                            <Icon name="checkmark" /> Save Colors
                        </Button>

                        <Button color="red" inverted onClick={this.toggleModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default ColorPanel;
