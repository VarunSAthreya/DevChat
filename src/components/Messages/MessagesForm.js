import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

export class MessagesForm extends Component {
    state = {
        message: "",
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        uploadState: "",
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        typingRef: firebase.database().ref("typing"),
        percentUploaded: 0,
    };

    toggleModal = () => this.setState({ modal: !this.state.modal });

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleKeyDown = () => {
        const { message, typingRef, channel, user } = this.state;

        if (message) {
            typingRef.child(channel.id).child(user.uid).set(user.displayName);
        } else {
            typingRef.child(channel.id).child(user.uid).remove();
        }
    };

    sendMessage = () => {
        const { getMessagesRef } = this.props;

        const { message, channel, typingRef, user } = this.state;

        if (message) {
            this.setState({ loading: true });

            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: "", errors: [] });
                    typingRef.child(channel.id).child(user.uid).remove();
                })
                .catch((err) => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: [...this.state.errors, err],
                    });
                });
        } else {
            this.setState({
                errors: [...this.state.errors, { message: "Add a message" }],
            });
        }
    };

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL,
            },
        };
        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = this.state.message;
        }

        return message;
    };

    getPath = () => {
        if (this.props.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`;
        } else {
            return "chat/public";
        }
    };

    uploadFile = (file, metaData) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

        this.setState(
            {
                uploadState: "uploading",
                uploadTask: this.state.storageRef
                    .child(filePath)
                    .put(file, metaData),
            },
            () => {
                this.state.uploadTask.on(
                    "state_changed",
                    (snap) => {
                        const percentUploaded = Math.round(
                            (snap.bytesTransferred / snap.totalBytes) * 100
                        );
                        this.props.isProgressBarVisible(percentUploaded);
                        this.setState({ percentUploaded });
                    },
                    (err) => {
                        console.error(err);
                        this.setState({
                            errors: [...this.state.errors, err],
                            uploadState: "errror",
                            uploadTask: null,
                        });
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then((downloadUrl) => {
                                this.sendFileMessage(
                                    downloadUrl,
                                    ref,
                                    pathToUpload
                                );
                            })
                            .catch((err) => {
                                console.error(err);
                                this.setState({
                                    errors: [...this.state.errors, err],
                                    uploadState: "errror",
                                    uploadTask: null,
                                });
                            });
                    }
                );
            }
        );
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: "done" });
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    errors: [...this.state.errors, err],
                });
            });
    };

    render() {
        const {
            errors,
            message,
            loading,
            modal,
            uploadState,
            percentUploaded,
        } = this.state;

        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    onChange={this.handleChange}
                    onKeyDowm={this.handleKeyDown}
                    value={message}
                    style={{ marginBottom: "0.7em" }}
                    label={<Button icon={"add"} />}
                    labelPosition="left"
                    className={
                        errors.some((error) =>
                            error.message.includes("message")
                        )
                            ? "error"
                            : ""
                    }
                    placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />

                    <Button
                        color="teal"
                        disabled={uploadState === "uploading"}
                        onClick={this.toggleModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
                <FileModal
                    modal={modal}
                    closeModal={this.toggleModal}
                    uploadFile={this.uploadFile}
                />
                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />
            </Segment>
        );
    }
}

export default MessagesForm;
