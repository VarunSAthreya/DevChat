import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

import firebase from "../../firebase";

export class UserPanel extends Component {
    state = {
        user: this.props.currentUser,
    };

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
            text: <span>Change Avatar</span>,
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignout}>Sign Out</span>,
        },
    ];

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("Signed Out"));
    };

    render() {
        const { user } = this.state;

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
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;
