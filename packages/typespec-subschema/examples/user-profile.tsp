import "@subschema/typespec";

using Subschema;

/** Nested address model used as a sub-schema. */
model Address {
  @field("Text")
  @placeholder("123 Main St")
  street: string;

  @field("Text")
  @placeholder("City")
  city: string;

  @field("Text")
  @placeholder("State")
  state: string;

  @field("Text")
  @placeholder("12345")
  zip: string;
}

/** User profile form with a nested address object and conditional fields. */
@formConfig
model UserProfile {
  @field("Text")
  @placeholder("Username")
  username: string;

  @field("Text")
  @placeholder("you@example.com")
  email: string;

  /** Nested address object */
  address: Address;

  @field("Checkbox")
  hasPhone: boolean;

  @field("Text")
  @placeholder("555-0100")
  @conditional("hasPhone", "truthy")
  phone: string;
}

