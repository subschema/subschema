import "@subschema/typespec";

using Subschema;

/** A simple flat contact form with validation. */
@formConfig
model ContactForm {
  @field("Text")
  @placeholder("Enter your full name")
  name: string;

  @field("Text")
  @placeholder("you@example.com")
  email: string;

  @field("Select")
  @options("General Inquiry", "Bug Report", "Feature Request")
  subject: string;

  @field("TextArea")
  @placeholder("Tell us more...")
  message: string;
}

