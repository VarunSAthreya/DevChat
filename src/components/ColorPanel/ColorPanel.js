import React, { Component } from "react";
import {
    Sidebar,
    Menu,
    Divider,
    Button,
    Modal,
    Icon,
    Label,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";

export class ColorPanel extends Component {
    state = {
        modal: false,
    };

    toggleModal = () => this.setState({ modal: !this.state.modal });

    render() {
        const { modal } = this.state;

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
                        <Label content="Primary Color" />

                        <SliderPicker />
                        <Label content="Secondary Color" />
                        <SliderPicker />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted>
                            <Icon name="checkmark" /> Save Colors
                        </Button>

                        <Button color="red" inverted onClic={this.toggleModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default ColorPanel;
