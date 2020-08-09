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
import { connect } from "react-redux";

import firebase from "../../firebase";
import { setColors } from "../../actions";

export class ColorPanel extends Component {
    state = {
        modal: false,
        primary: "",
        secondary: "",
        user: this.props.currentUser,
        userColors: [],
        userRef: firebase.database().ref("users"),
    };

    componentDidMount() {
        if (this.state.user) {
            this.addListener(this.state.user.uid);
        }
    }

    addListener = (userId) => {
        let userColor = [];
        this.state.userRef
            .child(`${userId}/colors`)
            .on("child_added", (snap) => {
                userColor.unshift(snap.val());
                this.setState({ userColors: userColor });
            });
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

    displayColors = (colors) =>
        colors.length > 0 &&
        colors.map((color, i) => (
            <React.Fragment key={i}>
                <Divider />
                <div
                    className="color__container"
                    onClick={() =>
                        this.props.setColors(color.primary, color.secondary)
                    }
                >
                    <div
                        className="color__square"
                        style={{ background: color.primary }}
                    >
                        <div
                            className="color__overlay"
                            style={{ background: color.secondary }}
                        ></div>
                    </div>
                </div>
            </React.Fragment>
        ));

    render() {
        const { modal, primary, secondary, userColors } = this.state;

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

                {this.displayColors(userColors)}

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

export default connect(null, { setColors })(ColorPanel);
