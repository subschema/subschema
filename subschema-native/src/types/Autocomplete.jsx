import React, {PureComponent} from 'react';
import {View, FlatList, TouchableHighlight, Text} from 'react-native';
import RenderTemplate from "subschema-core/lib/RenderTemplate";
import PropTypes from 'subschema-prop-types';
import {styleClass} from '../PropTypes';

class Suggestions extends PureComponent {
    renderItem(item, index) {
        return <RenderTemplate key={`suggestions-${index}`} {...this} data={item} focus={item.focus === index}/>
    };

    render() {
        const {suggestions, style, ...props} = this.props;

        return <View style={style}>
            {suggestions.map(this.renderItem, props)}
        </View>
    }
}
class AutocompleteItemTemplate extends PureComponent {
    static displayName = 'AutocompleteItemTemplate';
    static propTypes = {
        onSelect: PropTypes.event,
        itemClass: styleClass,
        focusedClass: styleClass,
        data: PropTypes.any,
        value: PropTypes.any,
        underlayColor: PropTypes.any
    };

    static defaultProps = {
        data: null,
        value: null,
        focus: false,
        processor: null,
        underlayColor: '#bbb'
    };

    handleClick = (e) => {
        this.props.onSelect(this.props.data);
    };

    render() {
        const {data, focus, itemClass, focusedClass, value, processor} = this.props;
        const __html = processor.format(data, value, true);
        if (!__html) {
            return null;
        }
        return (<View style={itemClass} underlayColor={this.props.underlayColor}>
            <Text onPress={this.handleClick}>{__html}</Text>
        </View>)
    }
}

export default class Autocomplete extends PureComponent {


    static propTypes = {
        inputType: PropTypes.type,
        onChange: PropTypes.valueEvent,
        onSelect: PropTypes.event,
        minLength: PropTypes.number,
        autoSelectSingle: PropTypes.bool,
        useshowing: PropTypes.bool,
        maxInputLength: PropTypes.number,
        itemTemplate: PropTypes.template,
        processor: PropTypes.processor,
        showing: PropTypes.content,
        options: PropTypes.options,
        onInputChange: PropTypes.event,
        style: PropTypes.style,
        url: PropTypes.expression,
        foundClass: styleClass,
        notFoundClass: styleClass,
        suggestionsClass: styleClass,
        itemClass: styleClass,


    };

    static defaultProps = {
        country: 'US',
        locale: 'en_US',
        useshowing: true,
        minLength: 1,
        maxInputLength: 200,
        itemTemplate: AutocompleteItemTemplate,
        inputType: {
            type: 'Text',
            propTypes: {value: PropTypes.any},
            defaultProps: {value: ''}
        },
        processor: 'OptionsProcessor',
        showing: 'Searching...',
        input: 'input',
        inputValue: 'input'
    };

    state = {suggestions: [], showing: false, focus: -1};

    componentWillMount() {
        this._processProps(this.props);
    }

    componentWillReceiveProps(props, context) {
        this._processProps(props);
    }

    setValue(v) {
        const p = this.processor();
        const value = p.value(v);
        const input = p.format(v);
        this.setState({
            value,
            selected: v,
            input,
            showing: false,
            suggestions: []
        });
    }

    /** In the event that the value does not have the meta data for displaying
     * We will try to fetch the object and format it.
     * @param props
     * @private
     */
    _processProps(props) {
        let value = props.value;
        if (value && value !== this.state.value) {
            //see if we can get the formatted value from the value, may not work.
            var input = props.processor.format(value);
            if (input == null) {
                //It didn't format to a value, go fetch it so we can display it.
                props.processor.fetch(props.url, value, this, (e, o) => {
                    if (o && o.length === 1) {
                        this.setValue(o[0]);
                    } else {
                        this.setState({
                            suggestions: o,
                            showing: true
                        });
                    }

                });
            } else {
                this.setState({input, value});
            }
        }
    }

    /**
     * Hide could be called when a user has not selected a value.
     *
     * If their is a selected value and input equals its label select it.
     * So if there is only 1 selection select it.
     * If
     */
    hide = (selectValue) => {
        let {selected, input, suggestions, focus} = this.state, i = 0, l, options, found = false;
        suggestions = suggestions || [];
        if (selectValue) {


            var p = this.getProcessor();
            if (selectValue && focus > -1) {

                selected = suggestions[focus];
            } else if (input == null || input.trim() === '') {
                selected = null;
                input = null;
            } else if (!selected || input !== selected.label) {
                if (suggestions.length === 1) {
                    selected = suggestions[0];
                    input = selected.label;
                } else {
                    selected = null;
                    options = suggestions;
                    l = options.length;
                    for (; i < l; i++) {
                        var opt = options[i];
                        if (opt.label === input) {
                            selected = opt;
                            input = opt.label;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        input = null;
                    }
                }
            }
            if (selected !== this.state.selected) {
                this.onSelect(selected);
            } else {
                if (this.props.onBlur)
                    this.props.onBlur(selected && selected.val, this.props.value, this.props.name, this.props.path);
                this.setState({suggestions: [], selected, input, showing: false, focus: -1});
            }
        } else {
            this.setState({showing: false, focus: -1, suggestions: []}, this.un)
        }
        //        this.props.onBlur();
    };


    processor() {
        return this.props.processor;
    }

    handleSuggestionClick = (o) => {
        this.onSelect(o);
    };

    onSelect = (o) => {
        if (this.props.onSelect(o) === false) {
            return;
        }
        const p = this.processor();
        const value = p.value(o);
        if (this.props.onChange(value) !== false) {
            var input = p.format(o);
            this.setState({
                suggestions: [],
                showing: false,
                focus: -1,
                selected: o,
                value,
                input
            });
        }
    };

    _handleDispatch = (input) => {
        this.setState({
            input,
            selected: null
        });

        if (this._fetch && this._fetch.cancel) {
            this._fetch.cancel();
        }
        const _this = this;
        this._fetch = this.processor().fetch(this.props.url, input, this, (err, suggestions) => {
            if (err) {
                return;
            }
            if (_this.props.autoSelectSingle && suggestions && suggestions.length === 1) {
                _this.onSelect(suggestions[0]);
            } else {
                _this.props.onInputChange(input);
                _this.setState({
                    suggestions: suggestions || [],
                    showing: true,
                    input
                });
            }
        });
    };


    handleKeyUp = ({nativeEvent}) => {
        const e = nativeEvent;
        if (this.props.onKeyUp) {
            this.props.onKeyUp.call(this, e);
        }
        let focus = this.state.focus, s = this.state.suggestions;
        if (s && s.length) {
            let update = false;
            switch (e.key || e.keyCode) {
                case 'Up':
                case 38:
                case 'ArrowUp': {
                    focus = Math.max(-1, focus - 1);
                    update = true;
                    break;
                }
                case 40:
                case 'Down':
                case 'ArrowDown': {
                    focus = Math.min(s.length, focus + 1)
                    update = true;
                    break;
                }
                case 'Enter': {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (s.length) {
                        this.handleSuggestionClick(s[Math.max(this.state.focus, 0)]);
                        this.setState({suggestions: [], showing: false, focus: -1});

                        return;
                    }
                    this.hide();
                    break;
                }
            }
            if (update) {
                //e.preventDefault();
                this.setState({focus});
            }
        }
    };

    handleChange = (value) => {
        this._handleDispatch(value);
    };


    handleBlur = (event) => {
        const {suggestions = []} = this.state;
        if (suggestions.length === 1 && !this.state.selected) {
            this.handleSuggestionClick(suggestions[Math.max(0, this.state.focus)]);
        }
        if (this.props.onBlur)
            this.props.onBlur(event);
    };

    renderSuggestions() {
        const {suggestions = []} = this.state;
        if (this.state.showing === false || suggestions.length === 0) {
            return null;
        }
        return <Suggestions
            key="suggestions"
            style={this.props.suggestionsClass}
            suggestions={this.state.suggestions}
            template={this.props.itemTemplate}
            onSelect={this.handleSuggestionClick}
            processor={this.props.processor}
            focus={this.state.focus}
            itemClass={this.props.itemClass}
            input={this.state.input}/>


    }

    _layout = ({nativeEvent: {layout: {height}}}) => {
        console.log('layout', height);
        this._height = height;
    };

    render() {
        const suggestions = this.state.suggestions || [];
        const {foundClass, namespaceClass, inputType, id, input, notFoundClass} = this.props;
        const inputProps = {
            onPaste: this.handlePaste,
            onKeyDown: this.handleKeyUp,
            onBlur: this.handleBlur,
            onChange: this.handleChange,
            value: this.state.input,
            id
        };
        const Input = inputType;
        return <View style={namespaceClass}
                     onLayout={this._layout}>
            <Input {...inputProps} key="input"/>
            {this.renderSuggestions()}
        </View>
    }

}
