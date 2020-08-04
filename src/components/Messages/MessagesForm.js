import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";

export class MessagesForm extends Component {
    render() {
        return (
            <Segment className="message__form">
                <Input
                    name="message"
                    style={{ marginBottom: "0.7em" }}
                    label={<Button icon={"add"} />}
                    labelPosition="left"
                    placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />

                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="colud upload"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessagesForm;
