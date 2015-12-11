import React, {Component, Children} from 'react';


export default class NavListTemplate extends Component {


    render() {
        return <ul className="nav navbar-nav navbar-right">
            {Children.map((v)=><li>{v}</li>)}
        </ul>
    }

}

