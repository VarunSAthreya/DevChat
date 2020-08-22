import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

export class SidePanel extends Component {
    render() {
        const { currentUser, primaryColor } = this.props;
        return (
            <Menu
                size="huge"
                inverted
                fixed="left"
                vertical
                style={{
                    background: primaryColor,
                    fontSize: "1.2rem",
                    paddingLeft: 60,
                }}
            >
                <UserPanel
                    primaryColor={primaryColor}
                    currentUser={currentUser}
                />
                <Starred currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
            </Menu>
        );
    }
}

export default SidePanel;
