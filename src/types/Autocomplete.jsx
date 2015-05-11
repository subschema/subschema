"use strict";

var React = require('../react');
var tu = require('../tutils');
var css = require('../styles/autocomplete.less');
var BasicFieldMixin = require('../BasicFieldMixin');
var LoaderMixin = require('../LoaderMixin');
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

                    value = value.toLowerCase();
                    var data = (component.props.field.options || []).map(function (v) {
                        return {
                            label: v.label || v.val || v,
                            data: v,
                            val: v.val || v.label || v
                        }
                    }).filter(function (v) {
                        var l = v.val.toLowerCase(), v;

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
            showing: 'Searching...'
        }

    },
    getInitialState () {
        return {
            suggestions: [],
            input: '',
            showing: false,
            focus: -1
        }

    },
    getValue(){
        return this.state.value
    },
    setValue(v){
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
    },
    /**
     * Hide could be called when a user has not selected a value.
     *
     * If their is a selected value and input equals its label select it.
     * So if there is only 1 selection select it.
     * If
     */
    hide: function () {
        var {selected, input, suggestions} = this.state, i = 0, l, options, found = false;
        var p = this.getProcessor();
        if (input == null || input.trim() === '') {
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

        this.props.onValidate(selected && selected.val, this.props.value, this.props.name, this.props.path);
        this.setState({suggestions: [], selected, input, showing: false, focus: -1});
    },
    getProcessor(){
      return this.processor();
    },
    removeListener: function () {
        document.removeEventListener("click", this.hide);
    },
    addListener: function () {
        document.addEventListener("click", this.hide);
    },

    handleSuggestionClick: function (o) {
        this.onSelect(o);
    },
    onSelect: function (o) {
        var p = this.getProcessor();
        var value = p.value(o);
        if (this.props.onValueChange(value) !== false) {
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
        if (this._fetch && this._fetch.cancel) {
            this._fetch.cancel();
        }
        var setState = this.setState.bind(this);
        this.setState({
            input: value,
            selected: null
        });
        this._fetch = this.getProcessor().fetch(this.props.url, value, this, function (err, suggestions) {
            if (err) {
                return;
            }
            setState({
                suggestions: suggestions,
                showing: true,
                input: value
            });
        });
    },

    handleKeyUp: function (e) {
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
            this.removeListener();
            return null;
        }
        this.addListener();
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
    },
    handleInvalid: function () {
    },
    render: function () {
        var suggestions = this.state.suggestions,
            name = this.props.name,
            className = 'autocomplete ' + (suggestions.length > 0 ? this.props.foundCls : this.props.notFoundCls);
        var autoFocus = this.props.field && this.props.field.autoFocus || this.props.autoFocus;
        return <div className={className}>
            <input
                ref="input"
                onChange={this.handleChange}
                onPaste={this.handlePaste}
                onBlur={this.handleBlur}
                onKeyUp={this.handleKeyUp}
                type="text"
                value={this.state.input}
                name={name}
                className=" form-control "
                placeholder={this.props.placeholder}
                {...{autoFocus}}
                />
            {this.renderSuggestions()}
        </div>
    }

});

module.exports = Autocomplete;