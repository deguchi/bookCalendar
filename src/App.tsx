import React from 'react'
import {Component} from 'react';

interface Props {
}

interface State {
}

class App extends Component<Props, State> {
    constructor(props:Props) {
        super(props)
    }
    render() {
        return (<React.Fragment>
            <div>Hello TightlyTemplate!</div>
        </React.Fragment>);
    }
}

export default App