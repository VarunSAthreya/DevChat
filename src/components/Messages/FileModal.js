import React, { Component } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

class FileModal extends Component {
    state = {
        file: null,
        authorized: ["image/jpeg", "image/png"],
    };

    addFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            this.setState({ file });
        }
    };

    sendFile = () => {
        const { file } = this.state;
        const { uploadFile, closeModal } = this.props;

        if (file !== null) {
            if (this.isAuthorized(file.name)) {
                // send file
                const metaData = { contentType: mime.lookup(file.name) };
                uploadFile(file, metaData);
                closeModal();
                this.clearFile();
            }
        }
    };

    // CHECK IF THE FILE IS .JPG, .PNG
    isAuthorized = (fileName) =>
        this.state.authorized.includes(mime.lookup(fileName));

    clearFile = () => this.setState({ file: null });

    render() {
        const { modal, closeModal } = this.props;

        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image File</Modal.Header>
                <Modal.Content>
                    <Input
                        onChange={this.addFile}
                        fluid
                        label="File types: jpg, png"
                        name="file"
                        type="file"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.sendFile} color="green" inverted>
                        <Icon name="checkmark" /> Send
                    </Button>

                    <Button onClick={closeModal} color="red" inverted>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default FileModal;