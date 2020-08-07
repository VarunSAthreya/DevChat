import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import { setCurrentChannel, setPrivateChannel } from "../../actions";

class Starred extends Component {
    state = {
        starredChannels: [],
        activeChannel: "",
    };

    displayChannels = (starredChannels) => {
        return (
            starredChannels.length > 0 &&
            starredChannels.map((channel) => {
                return (
                    <Menu.Item
                        key={channel.id}
                        onClick={() => this.changeChannel(channel)}
                        name={channel.name}
                        style={{ opacity: 0.7 }}
                    >
                        # {channel.name}
                    </Menu.Item>
                );
            })
        );
    };

    setActiveChannel = (channel) => {
        this.setState({ activeChannel: channel.id });
    };

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };

    render() {
        const { starredChannels } = this.state;

        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED{" "}
                    </span>{" "}
                    ({starredChannels.length}){" "}
                </Menu.Item>
                {/* Channels */}

                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        );
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
