const settings = {
    primary: -1
};

function buttonNormalizer(value) {
    let buttons;
    let hasPrimary = false;
    if (value == null || buttons == false) {
        return value;
    }
    if (typeof value === 'string') {
        buttons = value.split(/,\s*/).map(function (btn) {
            return {
                action: btn,
                label : btn,
                name  : `@${btn}`
            }
        });

    } else if (Array.isArray(value)) {
        let hasChange = false;
        buttons       = value.map(function (btn) {
            if (typeof btn === 'string') {
                hasChange = true;
                return {
                    action: btn,
                    label : btn,
                    name  : `@${btn}`
                }
            } else {
                const { action, label, name, ...rest } = btn;

                if ('primary' in btn) {
                    hasPrimary = true;
                }

                if (action && label && name) {
                    return btn;
                }
                hasChange = true;
                if (label && !action) {
                    rest.action = label.toLowerCase();
                } else {
                    rest.action = action;
                }
                if (action && !label) {
                    rest.label = action;
                } else {
                    rest.label = label;
                }
                if (!name) {
                    rest.name = `@${rest.label}-${rest.action}`;
                } else {
                    rest.name = name;
                }
                return rest;
            }
        });
        //if it has no changes return the original to prevent possible
        // rerender.
        if (!hasChange) {
            buttons = value;
        }
    } else if (value.buttons) {
        //if buttons are normal than we return the same value, so it doesn't
        //change anything.
        value.buttons = buttonNormalizer(value.buttons).buttons;
        return value;
    } else {
        return {
            buttons: buttonNormalizer(Object.keys(value).map(function (action) {
                if (typeof value[action] === 'string') {
                    return {
                        action,
                        label: value[action]
                    }
                }
                return {
                    ...value[action],
                    action
                };
                return ret;
            })).buttons
        }
    }
    if (!hasPrimary && settings.primary) {
        const p = buttons.slice(settings.primary)[0];
        if (p) {
            p.primary = true
        }
    }
    return { buttons };
}
export default function buttons(Clazz, key) {


    Clazz::this.property(key, buttonNormalizer);
}
