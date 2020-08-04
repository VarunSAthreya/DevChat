import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = ({ content, size }) => (
    <Dimmer active>
        <Loader size={size} content={content} />
    </Dimmer>
);

export default Spinner;
