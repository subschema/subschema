var React = require('react');
var SampleMgr = require('./SampleMgr.jsx');
var SampleNav = require('./SampleNav.jsx');
var Router = require('react-router');
var { RouteHandler, Link } = Router;


var Sample = React.createClass({

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState(){
        return {
            loadData: false,
            loadErrors: false
        }
    },

    toggleData(e){

        e && e.preventDefault();
        var ld = !this.state.loadData;
        this.setState({loadData: ld});
        SampleMgr.valueManager().update('loadData', ld);

    },
    toggleErrors(e){

        e && e.preventDefault();
        var ld = !this.state.loadErrors;
        this.setState({loadErrors: ld});
        SampleMgr.valueManager().update('loadErrors', ld);
    },
    dataCls(){
        return this.state.loadData ? 'active' : '';
    },
    errorsCls(){
        return this.state.loadErrors ? 'active' : '';
    },
    setupCls(name, active){
        return 'list-group-item ' + (name === active ? 'active' : '');
    },
    render() {
        var params = this.context.router.getCurrentParams(), setupCls = this.setupCls;
        var setup = params.setup;
        return (

            <div className="container-fluid">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Subschema</a>
                        </div>
                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li className={this.dataCls()}><a onClick={this.toggleData} href="#">Data</a></li>
                                <li className={this.errorsCls()}><a onClick={this.toggleErrors} href="#">Errors</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="row">
                    <div className="col-md-2">
                        <h3>Examples</h3>
                        <SampleNav activeSample={params.sample} samples={SampleMgr.getAll()}/>
                        <h3>Develop</h3>

                        <div className="list-group left-nav">
                            <Link to="setup"
                                  className={setupCls('webpack', setup)}
                                  key='webpack'
                                  params={{setup: 'webpack'}}>Webpack</Link>
                            <Link to="setup"
                                  className={setupCls('loader', setup)}
                                  key='loader'
                                  params={{setup: 'loader'}}>Loaders</Link>
                            <Link to="setup"
                                  className={setupCls('schema', setup)}
                                  key='schema'
                                  params={{setup: 'schema'}}>Schema Builder</Link>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <RouteHandler {...params}/>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = Sample;