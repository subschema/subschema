export default ({
  "schema": {
    "email": {
      "type": "Text",
      "validators": [
        "required",
        "email"
      ]
    },
    "password": {
      "type": "Password",
      "validators": [
        "required"
      ]
    },
    "remember": {
      "type": "Checkbox",
      "title": "Remember Me?"
    },
    "lollipops": {
      "type": "List",
      "canEdit": true,
      "canAdd": true,
      "canReorder": true,
      "canDelete": true
    }
  },
//  "template": "WizardTemplate",
  "fieldsets": [
    {
      "legend": "List",
      "fields": "lollipops"
    },
    {
      "legend": "Login",
      "fields": [
        "email",
        "password"
      ]
    },
    {
      "legend": "Switch",
      "fields": "remember"
    },
    {
      "legend": "Done",
      "buttons": [
        {
          "label": "Submit",
          "primary": true
        },
        "Cancel"
      ]
    }
  ]
});
