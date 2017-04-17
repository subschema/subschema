import React, {Component} from 'react';
import {render} from 'react-dom';

class App extends Component {

    render() {
        return <h1>Hello</h1>
    }
}
export default function () {

    render(<App/>, document.getElementById('content'));
}