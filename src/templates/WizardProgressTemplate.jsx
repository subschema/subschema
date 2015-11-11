var React = require('../React');
var styles = require('subschema-styles/WizardProgressTemplate-style');
var WizardProgressTemplate = React.createClass({
    getDefaultProps(){
        return {
            index: 0,
            done: styles.done,
            todo: styles.todo,
            doing: styles.doing,
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
        return <ol className={styles.namespace}>{
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