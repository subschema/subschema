var React = require('../react');
var tu = require('../tutils');

var ButtonsTemplate = React.createClass({
    mixins: [require('../LoaderMixin')],
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
            onClick: function (event, action, btn) {

            }
        }
    },

    makeButtons(){
        var onClick = this.props.onClick;
        return this.props.buttons.map((b)=> {
            onClick = b.onClick || onClick;
            var btn = tu.isString(b) ? {
                action: b,
                label: b,
                onClick
            } : tu.extend({}, b, {onClick});
            if (this.props.buttonClass) {
                btn.buttonClass = (btn.buttonClass || '') + ' ' + this.props.buttonClass;
            }
            btn.template = this.props.loader.loadTemplate(b.template || this.props.buttonTemplate);
            return btn;
        })
    },

    render(){
        return <div className="form-group">
            <div className={this.props.buttonsClass}>
                {this.makeButtons().map((b, i)=> {
                    var Template = b.template;
                    return <Template key={"btn-"+i} {...b} />
                })}
            </div>
        </div>
    }

})

module.exports = ButtonsTemplate;