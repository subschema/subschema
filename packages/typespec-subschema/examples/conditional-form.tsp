import "@subschema/typespec";

using Subschema;

/** Personal info fieldset. */
@fieldset("Personal Information")
model PersonalInfo {
  @field("Text")
  @placeholder("First name")
  firstName: string;

  @field("Text")
  @placeholder("Last name")
  lastName: string;
}

/** Preferences fieldset with conditional fields. */
@fieldset("Preferences")
model Preferences {
  @field("Select")
  @options("Email", "Phone", "Mail")
  contactMethod: string;

  @field("Text")
  @placeholder("you@example.com")
  @conditional("contactMethod", "equals")
  contactEmail: string;

  @field("Text")
  @placeholder("555-0100")
  @conditional("contactMethod", "equals")
  contactPhone: string;

  @field("Checkbox")
  newsletter: boolean;

  @field("Select")
  @options("Daily", "Weekly", "Monthly")
  @conditional("newsletter", "truthy")
  frequency: string;
}

/** A form demonstrating multiple conditional fields and fieldset grouping. */
@formConfig
model ConditionalForm {
  ...PersonalInfo;
  ...Preferences;
}

