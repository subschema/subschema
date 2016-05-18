"use strict";

import React, {Component} from "react";
import {noop} from "../tutils";
import Dom from "../Dom";
import PropTypes from "../PropTypes";
import RenderTemplate from "../components/RenderTemplate";

export default class Autocomplete extends Component {


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
        foundClass: PropTypes.cssClass,
        notFoundClass: PropTypes.cssClass,
        options: PropTypes.options,
        onInputChange: PropTypes.event,
        style: PropTypes.style,
        url: PropTypes.expression,

    };

    static defaultProps = {
        country: 'US',
        locale: 'en_US',
        useshowing: true,
        minLength: 1,
        maxInputLength: 200,
        itemTemplate: "AutocompleteItemTemplate",
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

    componentWillUpdate(nextProps, nextState) {
        if (nextState && nextState.suggestions && nextState.suggestions.length) {
            this.bindDocument();
        } else {
            this.unbindDocument();
        }
    }


    setValue(v) {
        var p = this.processor();
        var value = p.value(v);
        var input = p.format(v);
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
        var value = props.value;
        if (value && value !== this.state.value) {
            //see if we can get the formatted value from the value, may not work.
            var input = props.processor.format(value);
            if (input == null) {
                //It didn't format to a value, go fetch it so we can display it.
                props.processor.fetch(props.url, value, this, (e, o)=> {
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
                if (this.props.onBlur)
                    this.props.onBlur(selected && selected.val, this.props.value, this.props.name, this.props.path);
                this.setState({suggestions: [], selected, input, showing: false, focus: -1});
            }
        } else {
            this.setState({showing: false, focus: -1, suggestions: []}, this.un)
        }
        //        this.props.onBlur();
    };


    bindDocument = ()=> {
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
    };

    componentWillUnmount() {
        this.unbindDocument();
    }

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
    };


    handleDocumentKeyUp = (e)=> {

        if (e.keyCode === 27) {
            this.hide(false);
        }
    };


    handleDocumentClick = (e)=> {
        // If the click originated from within this component
        // don't do anything.
        if (Dom.isNodeInRoot(e.target, this)) {
            return;
        }

        this.hide(false);
    };


    processor() {
        return this.props.processor;
    }

    handleSuggestionClick = (o)=> {
        this.onSelect(o);
    };

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
    };

    _handleDispatch = (input)=> {
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
    };

    handleChange = (e) => {
        this._handleDispatch(e.target.value);
    };


    handlePaste = (event) => {
        var items = event.clipboardData && event.clipboardData.items;
        items && items[0] && items[0].getAsString((input)=> {

            this.setState({input, suggestions: [], showing: false});
        });
    };


    handleBlur = (event)=> {
        var suggestions = this.state.suggestions || [];
        if (suggestions.length === 1 && !this.state.selected) {
            this.handleSuggestionClick(suggestions[Math.max(0, this.state.focus)]);
        }
        if (this.props.onBlur)
            this.props.onBlur(event);
    };

    renderSuggestions() {
        var suggestions = this.state.suggestions || [];
        if (this.state.showing === false || suggestions.length === 0) {

            return null;
        }
        var {focus, input} = this.state;
        var processor = this.processor();
        var handleSuggestionClick = this.handleSuggestionClick;
        var {itemTemplate} = this.props;
        return <ul className={this.props.listGroupClass}>
            {suggestions.map((item, i) => <RenderTemplate template={itemTemplate}
                                                          key={`autocomplete-${i}`}
                                                          focus={focus === i}
                                                          value={input}
                                                          processor={processor}
                                                          onSelect={handleSuggestionClick}
                                                          data={item}/>)}</ul>


    }

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
        var Input = inputType;
        return <div className={`${namespaceClass} ${(suggestions.length > 0 ? foundClass : notFoundClass)}`}>
            <Input {...inputProps} ref="input"/>
            {this.renderSuggestions()}
        </div>
    }

}
