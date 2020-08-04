import React, { Component } from "react";
import { Sidebar, Menu, Divider, Button } from "semantic-ui-react";

export class ColorPanel extends Component {
    render() {
        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider>
                    <Button
                        icon="add"
                        size="small"
                        style={{ height: "2.5rem" }}
                        color="blue"
                    />
                </Divider>
            </Sidebar>
        );
    }
}

export default ColorPanel;
