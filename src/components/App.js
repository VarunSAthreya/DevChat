import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import "./App.css";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MeatPanel from "./MetaPanel/MetaPanel";

const App = ({
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    primaryColor,
    secondaryColor,
}) => (
    <Grid
        columns="equal"
        className="app"
        style={{ background: secondaryColor }}
    >
        <div className="hidden md:block">
            <ColorPanel
                key={currentUser && currentUser.name}
                currentUser={currentUser}
            />
        </div>

        {/* <div className="pl-20"> */}
        <SidePanel
            key={currentUser && currentUser.uid}
            currentUser={currentUser}
            primaryColor={primaryColor}
        />
        {/* </div> */}

        {/* <div className="w-full md:w-auto m-auto"> */}
        <Grid.Column style={{ marginLeft: 320 }}>
            <Messages
                key={currentChannel && currentChannel.id}
                currentChannel={currentChannel}
                currentUser={currentUser}
                isPrivateChannel={isPrivateChannel}
            />
        </Grid.Column>
        {/* </div> */}

        <div className="hidden lg:block mt-4" style={{ width: 300 }}>
            <Grid.Column width={4}>
                <MeatPanel
                    key={currentChannel && currentChannel.name}
                    isPrivateChannel={isPrivateChannel}
                    currentChannel={currentChannel}
                    userPosts={userPosts}
                />
            </Grid.Column>
        </div>
    </Grid>
);

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    userPosts: state.channel.userPosts,
    primaryColor: state.colors.primaryColor,
    secondaryColor: state.colors.secondaryColor,
});

export default connect(mapStateToProps)(App);
