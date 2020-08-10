import React, { Component } from "react";
import {
    Grid,
    Header,
    Icon,
    Dropdown,
    Image,
    Modal,
    Input,
    Button,
} from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";

import firebase from "../../firebase";

export class UserPanel extends Component {
    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: "",
        croppedImage: "",
        blob: "",
        uploadCroppedImage: "",
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        metadata: {
            contentType: "image/jpeg",
        },
    };

    toggleModal = () => this.setState({ modal: !this.state.modal });

    dropdownOptions = () => [
        {
            key: "user",
            text: (
                <span>
                    Signed in as <strong>{this.state.user.displayName}</strong>
                </span>
            ),
            disabled: true,
        },
        {
            key: "avatar",
            text: <span onClick={this.toggleModal}>Change Avatar</span>,
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignout}>Sign Out</span>,
        },
    ];

    uploadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state;

        storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata)
            .then((snap) => {
                snap.ref.getDownloadURL().then((downloadUrl) => {
                    this.setState({ uploadCroppedImage: downloadUrl }, () =>
                        this.changeAvatar()
                    );
                });
            });
    };

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadCroppedImage,
            })
            .then(() => {
                console.log("PhotoURL updated");
                this.toggleModal();
            })
            .catch((err) => {
                console.error(err);
            });

        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadCroppedImage })
            .then(() => {
                console.log("User avatar updated");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    handleChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.setState({ previewImage: reader.result });
            });
        }
    };

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("Signed Out"));
    };

    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob,
                });
            });
        }
    };

    render() {
        const { user, modal, previewImage, croppedImage } = this.state;

        const { primaryColor } = this.props;

        return (
            <Grid style={{ background: primaryColor }}>
                <Grid.Column>
                    <Grid.Row style={{ paddinf: "1.2em", margin: 0 }}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                        {/* User Drop Down */}
                        <Header
                            style={{ padding: "0.5em" }}
                            floated="left"
                            as="h4"
                            inverted
                        >
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image
                                            src={user.photoURL}
                                            spaced="right"
                                            avatar
                                        />
                                        {user.displayName}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </Grid.Row>

                    {/* Change User Avatar */}
                    <Modal basic open={modal} onClose={this.toggleModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                onChange={this.handleChange}
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                            />

                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {/* Image Screen */}
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={(node) =>
                                                    (this.avatarEditor = node)
                                                }
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>

                                    <Grid.Column>
                                        {/* Cropped image preview */}
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: "3.5em auto" }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>

                        <Modal.Actions>
                            {croppedImage && (
                                <Button
                                    color="green"
                                    inverted
                                    onClick={this.uploadCroppedImage}
                                >
                                    <Icon name="save" /> Change Avatar
                                </Button>
                            )}

                            <Button
                                color="green"
                                inverted
                                onClick={this.handleCropImage}
                            >
                                <Icon name="image" /> Preview Avatar
                            </Button>

                            <Button
                                color="red"
                                inverted
                                onClick={this.toggleModal}
                            >
                                <Icon name="remove" /> Camcel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;
