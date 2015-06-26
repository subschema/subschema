var React = require('react');
var WizardProgressLess = require('../styles/wizard-progress.less');
var WizardProgressTemplate = React.createClass({
    getDefaultProps(){
        return {
            index: 0,
            done: 'progtrckr-done',
            todo: 'progtrckr-todo',
            doing: 'progtrckr-doing',
            fieldsets: [],
            onClick(e){
            }
        }
    },
    getStyle(i) {
        var length = this.props.fieldsets.length, indx = this.props.index;
        if (i < indx || indx == length) {
            return this.props.done;
        }
        else if (i === indx) {
            return this.props.doing;
        }

        return this.props.todo;


    },
    render(){
        return <ol className="progtrckr">{
            this.props.fieldsets.map((s, i) =>
                    <li value={i} key={'li'+i}
                        className={this.getStyle(i)}
                        onClick={this.props.onClick}>
                        <em>{i + 1}</em>
                        <span>{s.legend}</span>
                    </li>
            )}
        </ol>;
    }
});

module.exports = WizardProgressTemplate;