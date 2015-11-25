"use strict";

import React, {Component} from 'react';
import {noop, returnFirst} from '../tutils';
import Dom from '../Dom';
import style from 'subschema-styles/Autocomplete-style';
import PropTypes from '../PropTypes';
import lifecycle from '../decorators/lifecycle';
import template from '../decorators/template';

export default class Autocomplete extends Component {

    static contextTypes = {
        loader: PropTypes.loader
    }
    static propTypes = {
        onChange:PropTypes.valueEvent,
        onSelect: PropTypes.event,
        minLength: PropTypes.number,
        autoSelectSingle: PropTypes.bool,
        country: PropTypes.string,
        locale: PropTypes.string,
        useshowing: PropTypes.bool,
        maxInputLength: PropTypes.number,
        itemTemplate: PropTypes.template,
        processor: PropTypes.processor,
        showing: PropTypes.content,
        foundCls: PropTypes.cssClass,
        notFoundCls: PropTypes.cssClass,
        input:PropTypes.string,

    }

    static inputClassName = 'form-control';

    static defaultProps = {
        country: 'US',
        locale: 'en_US',
        foundCls: style.found,
        notFoundCls: style.notFound,
        useshowing: true,
        minLength: 1,
        maxInputLength: 200,
        itemTemplate: 'AutocompleteItemTemplate',
        processor: {
            fetch: function (url, value, component, cb) {

                value = value && value.toLowerCase();
                var data = (component.props.options || []).map(function (v) {
                    return {
                        label: v.label || v.val || v,
                        data: v,
                        val: v.val || v.label || v
                    }
                }).filter(function (v) {
                    var l = ('' + v.val).toLowerCase();

                    if (l.indexOf(value) === 0) {
                        return true;
                    }

//                        return v.indexOf(value) === 0;
                });

                cb(null, data);
            },
            value(obj){
                return obj == null ? null : obj.val || obj;
            },
            format(v){
                return v == null ? null : v.label || v;
            }
        },
        onChange: noop,
        onSelect: noop,
        onBlur: noop,
        onFocus: noop,
        onValid: noop,
        onValidate: noop,
        showing: 'Searching...'
    }


    constructor(props, ...rest) {
        super(props, ...rest);
        var state = this.state || (this.state = {});

        state.suggestions = [];
        state.showing = false;
        state.focus = -1;
        state.input = props.input;
        state.value = props.value;

    }

    componentWillMount() {
        this._processProps(this.props);

    }

    _processProps(props) {
        if (props.value && !props.input) {
            props.processor.fetch(props.url, props.value, this, function (e, o) {
                if (o && o.length === 1) {
                    this.setValue(o[0]);
                } else {
                    this.setState({
                        suggestions: o,
                        showing: true
                    });
                }

            }.bind(this));
        } else if (!props.value && props.input) {
            props.processor.fetch(props.url, props.input, this, function (e, o) {
                this.setState({
                    suggestions: o,
                    showing: true,
                    input: props.input
                });
            }.bind(this));
        }

    }

    setValue(v) {
        var p = this.processor();
        var value = p.value(v);
        var input = p.format(v);
        var length = input && input.length || 0;
        var refs = this.refs;
        this.setState({
            value,
            selected: v,
            input,
            showing: false,
            suggestions: []
        });
    }

    /**
     * Hide could be called when a user has not selected a value.
     *
     * If their is a selected value and input equals its label select it.
     * So if there is only 1 selection select it.
     * If
     */
    hide = (selectValue)=> {
        var {selected, input, suggestions, focus} = this.state, i = 0, l, options, found = false;
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
                this.props.onValidate(selected && selected.val, this.props.value, this.props.name, this.props.path);
                this.setState({suggestions: [], selected, input, showing: false, focus: -1});
            }
        } else {
            this.setState({showing: false, focus: -1, suggestions: []}, this.un)
        }
        //        this.props.onBlur();
    }


    bindDocument() {
        if (this._bound) {
            return;
        }
        this.unbindDocument();
        this._bound = true;
        this._onDocumentClickListener =
            Dom.listen(this, 'click', this.handleDocumentClick);

        this._onDocumentKeyupListener =
            Dom.listen(this, 'keyup', this.handleDocumentKeyUp);

        this._onDocumentKeydownListener =
            Dom.listen(this, 'keypress', this.handleDocumentEnter);
    }

    @lifecycle("componentWillUnmount")
    unbindDocument() {
        this._bound = false;
        if (this._onDocumentClickListener) {
            this._onDocumentClickListener.remove();
        }

        if (this._onDocumentKeyupListener) {
            this._onDocumentKeyupListener.remove();
        }
        if (this._onDocumentKeydownListener) {
            this._onDocumentKeydownListener.remove();
        }
    }


    handleDocumentEnter = (e)=> {

        if (e.keyCode === 13 && this.state.suggestions && this.state.suggestions.length) {
            e.preventDefault();
            e.stopPropagation();
            this.hide(true);
        }
    }


    handleDocumentKeyUp = (e)=> {

        if (e.keyCode === 27) {
            this.hide(false);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState && nextState.suggestions && nextState.suggestions.length) {
            this.bindDocument();
        } else {
            this.unbindDocument();
        }
    }


    handleDocumentClick = (e)=> {
        // If the click originated from within this component
        // don't do anything.
        if (Dom.isNodeInRoot(e.target, this)) {
            return;
        }

        this.hide(false);
    }


    processor() {
        return this.__processor || ( this.__processor = (typeof this.props.processor === 'string' ? this.context.loader.loadProcessor(this.props.processor) : this.props.processor));
    }


    handleSuggestionClick = (o)=> {
        this.onSelect(o);
    }


    onSelect = (o)=> {
        if (this.props.onSelect(o) === false) {
            return;
        }
        var p = this.processor();
        var value = p.value(o);
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
    }


    _handleDispatch = (value)=> {
        this.setState({
            input: value,
            selected: null
        });

        if (this._fetch && this._fetch.cancel) {
            this._fetch.cancel();
        }
        this._fetch = this.processor().fetch(this.props.url, value, this, (err, suggestions) => {
            if (err) {
                return;
            }
            if (this.props.autoSelectSingle && suggestions && suggestions.length === 1) {
                this.onSelect(suggestions[0]);
            } else {
                this.setState({
                    suggestions: suggestions || [],
                    showing: true,
                    input: value
                });
            }
        });
    }


    handleKeyUp = (e)=> {
        if (this.props.onKeyUp) {
            this.props.onKeyUp.call(this, e);
        }
        var focus = this.state.focus, s = this.state.suggestions;
        if (s && s.length) {
            var update = false;
            switch (e.key || e.keyCode) {
                case 'Up':
                case 38:
                case 'ArrowUp':
                {
                    focus = Math.max(-1, focus - 1);
                    update = true;
                    break;
                }
                case 40:
                case 'Down':
                case 'ArrowDown':
                {
                    focus = Math.min(s.length, focus + 1)
                    update = true;
                    break;
                }
                case 'Enter':
                {
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
    }


    @template('itemTemplate')
    itemTemplate(Template) {
        return Template;
    }

    renderSuggestions() {
        var suggestions = this.state.suggestions || [];
        if (this.state.showing === false || suggestions.length === 0) {

            return null;
        }
        var {focus, input} = this.state;
        var processor = this.processor();
        var handleSuggestionClick = this.handleSuggestionClick;
        var CompleteItem = this.itemTemplate();
        return <ul className={style.listGroup}>
            {suggestions.map((item, i) => <CompleteItem
                key={item.val}
                focus={focus === i}
                value={input}
                ref={"item_"+i}
                processor={processor}
                onSelect={handleSuggestionClick}
                data={item}/>)}</ul>


    }

    handleChange = (e) => {
        this._handleDispatch(e.target.value);
    }


    handlePaste = (event) => {
        var items = event.clipboardData && event.clipboardData.items;
        items && items[0] && items[0].getAsString((input)=> {

            this.setState({input, suggestions: [], showing: false});
        });
    }


    handleBlur = (event)=> {
        var suggestions = this.state.suggestions || [];
        if (suggestions.length === 1 && !this.state.selected) {
            this.handleSuggestionClick(suggestions[Math.max(0, this.state.focus)]);
        }
        this.props.onValidate(event);
        this.props.onBlur(event);
    }


    createInput(props) {
        if (this.props.children && this.props.children.length) {
            var handleDispatch = this._handleDispatch;
            return React.Children.map(this.props.children, (child, idx)=> {
                if (child.props.onValueChange) {
                    var {onChange, ...nprops} = props;
                    var onChildChange = child.props.onChange;
                    nprops.onChange = function (val) {
                        onChildChange(val);
                    }
                    var onBlur = nprops.onBlur;
                    nprops.onBlur = (e)=> {
                        this.handleBlur(e);
                        if (onBlur) {
                            onBlur(e);
                        }
                    }
                    /*nprops.onChange = function (e) {
                     this.handleChange(e.target.value);
                     onChildChange && onChildChange.call(this, e);
                     }*/
                    return React.cloneElement(child, nprops);
                } else {
                    return React.cloneElement(child, props);
                }
            });
        }
        var {inputType, type, ...cprops} = props;
        if (inputType) {
            var Input = this.context.loader.loadType(inputType);
            return <Input {...cprops} ref="input" value={this.state.input}/>
        }

        return <input
            id={props.id}
            type="text"
            {...cprops}
            value={this.state.input}
            className={props.className}

        />;
    }

    render() {
        var suggestions = this.state.suggestions || [];
        var {foundCls, notFoundCls, ...props} = this.props;
        props.onChange = this.handleChange;
        props.onPaste = this.handlePaste;
        props.onKeyDown = this.handleKeyUp;
        props.onBlur = this.handleBlur;
        return <div
            className={style.namespace+' '+(suggestions.length > 0 ? foundCls : notFoundCls)} >
            {this.createInput(props)}
            {this.renderSuggestions()}
        </div>
    }

}
