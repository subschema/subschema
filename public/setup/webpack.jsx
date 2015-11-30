var React = require('react');
var Highlight = require('../Highlight.jsx');
var WebpackSetup = React.createClass({
    render(){
        return (<div>
            <h3>Webpack</h3>
            <fieldset>
                <legend></legend>
                <p className="lead">
                    You can use whatever preprocessor packaging you want, but I use webpack, so that is what we will
                    document. This is just what I do, more info can be found on webpack's <a
                    href="http://webpack.github.io/docs/">site</a>
                </p>

                <div className="panel">
                    <div className="panel-heading">
                        <h3>Installing Webpack</h3>
                    </div>
                    <div className="panel-body">
                        <p>First we need some dependencies</p>
                        <Highlight lang='bash'>
                            <div>$ npm i webpack --save-dev</div>
                            <div>$ npm i babel-loader --save-dev</div>
                            <div>$ npm i less-loader --save-dev</div>
                            <div>$ npm i react --save-dev</div>
                            <div>$ npm i react-loader --save-dev</div>
                            <div>$ npm i css-loader --save-dev</div>
                            <div>$ npm i webpack-dev-server --save-dev</div>
                            <div>#And most importantly</div>
                            <div></div>
                            <div>$ npm i subschema --save-dev</div>
                        </Highlight>

                        <p>Then we need some configuration</p>

                        <Highlight lang='javascript'>
                            {require('raw!../../webpack.config.js')}
                        </Highlight>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-heading">
                        <h3>Setting Up Package.json</h3>
                    </div>
                    <div className="panel-body">
                        <p>First we should add a few scripts to package.json</p>
                        <Highlight lang='javascript'>

                            {`
    //add a scripts scection if you don't have one
    "scripts":{
      "start": "webpack-dev-server --content-base ./public/",
      "webpack": "webpack --config webpack.config.js -p"
    }

`}
                        </Highlight>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-heading">
                        <h3>Setuping up app.jsx</h3>
                    </div>
                    <div className="panel-body">
                        <p>In this doc your html belongs in ./public/index.html</p>
                        <Highlight lang='html'>
                            {require('!!raw!../index.html')}

                        </Highlight>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-heading">
                        <h3>Running Webpack</h3>
                    </div>
                    <div className="panel-body">
                        <p>When your developing</p>
                        <Highlight lang='bash'>

                            {`
  $ npm start &
  $ open http://localhost:8080/webpack-dev-server/

`}
                        </Highlight>

                        <p>When your deploying</p>
                        <Highlight lang='bash'>

                            {`
  $ npm run webpack

`}
                        </Highlight>
                    </div>
                </div>
            </fieldset>
        </div>);
    }
});
module.exports = WebpackSetup;

