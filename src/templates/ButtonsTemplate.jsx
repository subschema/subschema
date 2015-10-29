var React = require('../react');
var tu = require('../tutils');
var style = require('../styles/ButtonsTemplate-style');
var ButtonsTemplate = React.createClass({
    mixins: [require('../LoaderMixin')],
    getDefaultProps(){
        return {
            buttonsClass: style.buttonsClass,
            buttonClass: style.buttonClass,
            buttonTemplate: 'ButtonTemplate',
            buttons: [{
                action: 'submit',
                label: 'Submit',
                template: 'Button'
            }],
            onButtonClick: function (event, action, btn, value) {

            }
        }
    },

    makeButtons(buttons){
        var onClick = this.props.onButtonClick || this.props.onClick;
        return buttons.map((b)=> {
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
        var {buttons,buttonsClass} = this.props;
        if (buttons.buttons) {
            buttonsClass = buttons.buttonsClass || buttonsClass;
            buttons = buttons.buttons
        }
        return <div className={style.formGroup}>
            <div className={buttonsClass}>
                {this.makeButtons(buttons).map((b, i)=> {
                    var Template = b.template;
                    return <Template key={"btn-"+i} {...b} loader={this.props.loader}
                                     valueManager={this.props.valueManager}/>
                })}
            </div>
        </div>
    }

})

module.exports = ButtonsTemplate;