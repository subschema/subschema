"use strict";

var React = require('../react');
var tu = require('../tutils');
var autocompleteLess = require('../styles/autocomplete.less');
var BasicFieldMixin = require('../BasicFieldMixin');
var LoaderMixin = require('../LoaderMixin');
var css = require('../css');
var Dom = require('../Dom');
var Autocomplete = React.createClass({
    mixins: [BasicFieldMixin, LoaderMixin],
    propTypes: {
        name: React.PropTypes.string.isRequired,
        /* processor: React.PropTypes.shape({
         fetch: React.PropTypes.func.isRequired
         }).isRequired,*/
        //optional
        onChange: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        minLength: React.PropTypes.number,
        foundCls: React.PropTypes.string,
        notFoundCls: React.PropTypes.string

    },
    statics: {
        inputClassName: 'form-control'
    },
    getDefaultProps: function () {
        var self = this;
        return {
            country: 'US',
            locale: 'en_US',
            foundCls: 'found',
            notFoundCls: 'notfound',
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
            onChange: function (e) {

            },
            onSelect: function (e) {

            },
            onBlur(){
            },
            onFocus(){
            },
            onValid(){
            },
            onValidate(){
            },
            showing: 'Searching...'
        }

    },
    getInitialState () {
        var value = this.props.value;
        var input = this.props.input;
        return {
            suggestions: [],
            showing: false,
            focus: -1,
            input,
            value
        }

    },
    _processProps(props){
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

    },
    /*  componentWillMount(){
     //        this._processProps(this.props);
     },*/
    getValue(){
        return this.state.value
    },
    setValue(v){
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
        }, function () {
//            refs && refs.input && refs.input.getDOMNode().setSelectionRange(length, length);
        });
    },
    /**
     * Hide could be called when a user has not selected a value.
     *
     * If their is a selected value and input equals its label select it.
     * So if there is only 1 selection select it.
     * If
     */
        hide(selectValue) {
        var {selected, input, suggestions, focus} = this.state, i = 0, l, options, found = false;
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
            this.setState({showing: false, focus: -1, suggestions: []})
        }
        //        this.props.onBlur();
    },
    componentWillUnmount(){
        this.unbindDocument();

    },
    componentWillMount(){
        this._processProps(this.props);
    },
    componentDidMount(){
        this.bindDocument();
    },
    bindDocument() {
        this.unbindDocument();
        this._onDocumentClickListener =
            Dom.listen(this, 'click', this.handleDocumentClick);

        this._onDocumentKeyupListener =
            Dom.listen(this, 'keyup', this.handleDocumentKeyUp);

        this._onDocumentKeydownListener =
            Dom.listen(this, 'keypress', this.handleDocumentEnter);
    },

    unbindDocument() {
        if (this._onDocumentClickListener) {
            this._onDocumentClickListener.remove();
        }

        if (this._onDocumentKeyupListener) {
            this._onDocumentKeyupListener.remove();
        }
        if (this._onDocumentKeydownListener) {
            this._onDocumentKeydownListener.remove();
        }
    },
    handleDocumentEnter(e){
//        console.log('keyUp', e.key);
        if (e.keyCode === 13 && this.state.suggestions.length) {
            e.preventDefault();
            e.stopPropagation();
            this.hide(true);
        }
    },
    handleDocumentKeyUp(e) {

        if (e.keyCode === 27) {
            this.hide(false);
        }
    },

    handleDocumentClick(e) {
        // If the click originated from within this component
        // don't do anything.
        if (Dom.isNodeInRoot(e.target, React.findDOMNode(this))) {
            return;
        }

        this.hide(false);
    },

    getProcessor(){
        return this.processor();
    },

    handleSuggestionClick: function (o) {
        this.onSelect(o);
    },
    onSelect: function (o) {
        if (this.props.onSelect(o) === false) {
            return;
        }
        var p = this.getProcessor();
        var value = p.value(o);
        if (this.props.handleChange.call(this.props, value) !== false) {
            this.setState({
                suggestions: [],
                showing: false,
                focus: -1,
                selected: o,
                value: value,
                input: p.format(o)
            });
        }
    },
    _handleDispatch: function (value) {
        this.setState({
            input: value,
            selected: null
        });

        if (this._fetch && this._fetch.cancel) {
            this._fetch.cancel();
        }
        this._fetch = this.getProcessor().fetch(this.props.url, value, this, (err, suggestions) => {
            if (err) {
                return;
            }
            this.setState({
                suggestions: suggestions,
                showing: true,
                input: value
            });
        });
    },

    handleKeyUp: function (e) {
        if (this.props.onKeyUp) {
            this.props.onKeyUp.call(this, e);
        }
        var focus = this.state.focus, s = this.state.suggestions;
        if (s.length) {
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
                     if (e){
                         e.preventDefault();
                         e.stopPropagation();
                     }
                    if (this.state.suggestions.length) {
                        this.handleSuggestionClick(this.state.suggestions[Math.max(this.state.focus, 0)]);
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
    },

    renderSuggestions: function () {
        var suggestions = this.state.suggestions;
        if (this.state.showing === false || suggestions.length === 0) {

            return null;
        }
        this.bindDocument();
        var {focus, input} = this.state;
        var processor = this.processor();
        var handleSuggestionClick = this.handleSuggestionClick;
        var CompleteItem = this.template('itemTemplate');
        return <ul className="list-group">
            {suggestions.map((item, i) => <CompleteItem
                key={item.val}
                focus={focus === i}
                value={input}
                ref={"item_"+i}
                processor={processor}
                onSelect={handleSuggestionClick}
                data={item}/>)}</ul>


    },

    handleChange: function (e) {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
        this._handleDispatch(e.target.value);
    },

    handlePaste: function (event) {
        var items = event.clipboardData && event.clipboardData.items;
        items && items[0] && items[0].getAsString(this._handleKey.bind(this));
    },
    handleBlur: function (event) {
        if (this.state.suggestions.length === 1 && !this.state.showing && !this.state.selected) {
            this.handleSuggestionClick(this.state.suggestions[Math.max(0, this.state.focus)]);
        } else {
            this.handleInvalid();
        }
        this.props.onBlur.call(this, event);
    },
    handleInvalid: function () {
    },

    createInput(props){
        if (this.props.children && this.props.children.length) {
            var handleDispatch = this._handleDispatch;
            return React.Children.map(this.props.children, (child, idx)=> {
                if (child.props.onValueChange) {
                    var {onChange, ...nprops} = props;
                    var onChildChange = child.props.onChange;
                    nprops.onValueChange = function (val) {
                        handleDispatch(val);
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
        if (props.inputType) {
            var Input = this.props.loader.loadType(props.inputType);
            return <Input {...props} value={this.state.input}/>
        }
        return <input
            type="text"
            ref="input"
            value={this.state.input}
            className={css.forField(this)}
            {...props}
            />;
    },
    render: function () {
        var suggestions = this.state.suggestions;
        var {onChange,onPaste, children, fieldAttrs, field,value, onBlur,notFoundCls, foundCls,minLength,maxInputLength,onSelect,processor,onValid,onValidate,country,locale,useshowing, itemTemplate, onKeyUp,  ...props} = this.props;
        props.onChange = this.handleChange;
        props.onPaste = this.handlePaste;
        props.onKeyDown = this.handleKeyUp;
        props.onBlur = this.handleBlur;
        return <div
            className={ 'autocomplete '+(suggestions.length > 0 ? foundCls : notFoundCls)} {...fieldAttrs}>
            {this.createInput(props)}
            {this.renderSuggestions()}
        </div>
    }

});

module.exports = Autocomplete;