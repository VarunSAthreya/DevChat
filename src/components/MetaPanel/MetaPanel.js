import React, { Component } from "react";
import { Segment, Accordion, Header, Icon } from "semantic-ui-react";

export class MeatPanel extends Component {
    state = {
        activeIndex: 0,
        privateChannel: this.props.isPrivateChannel,
    };

    setActiveIndex = (event, titleProp) => {
        const { index } = titleProp;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    };

    render() {
        const { activeIndex, privateChannel } = this.state;

        if (privateChannel) return null;

        return (
            <Segment>
                <Header as="h3" attached="top">
                    About # Channel
                </Header>
                <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon namw="info" />
                        Channel Details
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        Details
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon namw="user circle" />
                        Top Posters
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        posters
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon namw="pencil alternate" />
                        Created By
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        creator
                    </Accordion.Content>
                </Accordion>
            </Segment>
        );
    }
}

export default MeatPanel;
