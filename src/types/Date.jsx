import React, {Component} from '../React';
import FieldMixin from '../FieldMixin';
import Constants from '../Constants';
import css from '../css';
import field from '../decorators/field'

@field
export default class DateInput extends Component {
    static inputClassName = Constants.inputClassName

    asInputValue() {
        if (this.state.value == null) {
            return '';
        }
        return new Date(this.state.value).toISOString().substring(0, 10);

    }


    handleDateChange = (e)=> {
        this.props.onChange(e);
        var value = this.valueFromEvt(e);
        this.handleChange(new Date(value).getTime());
    }


    render() {
        var {onBlur,onValueChange,onChange, className, fieldAttrs, ...props} = this.props;
        return <input onBlur={this.handleValidate} onChange={this.handleDateChange} id={this.props.name}
                      className={css.forField(this)} type="date"
                      value={this.asInputValue()}
            {...props}
            {...fieldAttrs}
        />
    }
}

module.exports = DateInput;