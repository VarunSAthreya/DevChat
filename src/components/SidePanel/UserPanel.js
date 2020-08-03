import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

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
        return (
            <Grid style={{ background: "#4c3c4c" }}>
                <Grid.Column>
                    <Grid.Row style={{ paddinf: "1.2em", margin: 0 }}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                    </Grid.Row>

                    {/* User Drop Down */}
                    <Header
                        style={{ padding: "0.5em" }}
                        floated="left"
                        as="h4"
                        inverted
                    >
                        <Dropdown
                            trigger={<span>{this.state.user.displayName}</span>}
                            options={this.dropdownOptions()}
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;
