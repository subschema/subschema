var React = require('../react');
var tu = require('../tutils');
var loader = require('../loader');

var ButtonsTemplate = React.createClass({
    getDefaultProps(){
        return {
            buttonsClass: 'btn-group',
            buttonClass: 'btn',
            buttonTemplate: 'ButtonTemplate',
            buttons: [{
                action: 'Submit',
                label: 'Submit',
                template: 'Button'
            }],
            handler: function (event, action, btn) {

            }
        }
    },
    makeButtons(){
        var handler = this.props.handler;
        return this.props.buttons.map((b)=> {
            var btn = tu.isString(b) ? {
                action: b,
                label: b,
                handler
            } : tu.extend({}, b, {handler});
            if (this.props.buttonClass) {
                btn.buttonClass = (btn.buttonClass || '') + ' ' + this.props.buttonClass;
            }
            btn.template = loader.loadTemplate(b.template || this.props.buttonTemplate);
            return btn;
        })
    },

    render(){
        return <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
                <div className={this.props.buttonsClass}>
                    {this.makeButtons().map((b, i)=> {
                        var Template = b.template;
                        return <Template key={"btn-"+i} {...b} />
                    })}
                </div>
            </div>
        </div>
    }

})

module.exports = ButtonsTemplate;