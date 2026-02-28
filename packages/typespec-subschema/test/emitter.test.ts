import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import type { Model, Program } from "@typespec/compiler";
import { createTestHost, createTestLibrary, resolveVirtualPath } from "@typespec/compiler/testing";
import { $onEmit } from "../src/emitter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..", "..");

const SubschemaTestLibrary = createTestLibrary({
  name: "@subschema/typespec",
  packageRoot: pkgRoot,
  jsFileFolder: "dist/src",
  typespecFileFolder: "lib",
});

async function compileAndEmit(code: string) {
  const host = await createTestHost({ libraries: [SubschemaTestLibrary] });
  host.addTypeSpecFile(
    "main.tsp",
    `import "@subschema/typespec";\nusing Subschema;\n${code}`,
  );
  await host.compile("main.tsp");

  const outDir = resolveVirtualPath("tsp-output");

  // Call the emitter directly
  await $onEmit({
    program: host.program,
    emitterOutputDir: outDir,
    options: {},
    perf: { track: () => ({ end: () => {} }) } as any,
  });

  return { program: host.program, host };
}

function getEmittedJson(host: any): any {
  for (const [path, content] of host.fs) {
    if (path.includes("subschema-form.json")) {
      return JSON.parse(content);
    }
  }
  throw new Error("subschema-form.json not found in emitted files");
}

function getEmittedTs(host: any): string {
  for (const [path, content] of host.fs) {
    if (path.includes("subschema-form.ts")) {
      return content;
    }
  }
  throw new Error("subschema-form.ts not found in emitted files");
}

function getEmittedFile(host: any, filename: string): string {
  for (const [path, content] of host.fs) {
    if (path.includes(filename)) {
      return content;
    }
  }
  throw new Error(`${filename} not found in emitted files`);
}

describe("$onEmit emitter", () => {
  it("emits basic form schema with field types", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model ContactForm {
        @field("Text")
        @doc("Your full name")
        name: string;

        @field("Text")
        email: string;

        @field("Select")
        @options("General", "Support", "Sales")
        subject: string;

        @field("TextArea")
        @placeholder("Enter your message...")
        message: string;
      }
    `);

    const json = await getEmittedJson(host);
    assert.equal(json.schema.name.type, "Text");
    assert.equal(json.schema.name.title, "Your full name");
    assert.equal(json.schema.email.type, "Text");
    assert.equal(json.schema.subject.type, "Select");
    assert.deepEqual(json.schema.subject.options, [
      { label: "General", value: "General" },
      { label: "Support", value: "Support" },
      { label: "Sales", value: "Sales" },
    ]);
    assert.equal(json.schema.message.type, "TextArea");
    assert.equal(json.schema.message.placeholder, "Enter your message...");
  });

  it("adds required validator for non-optional properties", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model TestForm {
        @field("Text")
        name: string;
      }
    `);

    const json = await getEmittedJson(host);
    const validators = json.schema.name.validators;
    assert.ok(validators);
    assert.ok(validators.some((v: any) => v.type === "required"));
  });

  it("emits conditional metadata", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model TestForm {
        @field("Select")
        @options("General", "Support")
        type: string;

        @field("Text")
        @conditional("type", "==")
        details: string;
      }
    `);

    const json = await getEmittedJson(host);
    assert.deepEqual(json.schema.details.conditional, {
      listen: "type",
      operator: "equals",
    });
  });

  it("infers field types from scalar types", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model TestForm {
        name: string;
        age: int32;
        active: boolean;
      }
    `);

    const json = await getEmittedJson(host);
    assert.equal(json.schema.name.type, "Text");
    assert.equal(json.schema.age.type, "Number");
    assert.equal(json.schema.active.type, "Checkbox");
  });

  it("emits TypeScript value interfaces", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model ContactForm {
        @field("Text")
        name: string;

        @field("Select")
        @options("General", "Support", "Sales")
        subject: string;

        @field("TextArea")
        message: string;
      }
    `);

    const ts = await getEmittedTs(host);
    assert.ok(ts.includes("export interface ContactFormValues"));
    assert.ok(ts.includes("name: string;"));
    assert.ok(ts.includes('"General" | "Support" | "Sales"'));
    assert.ok(ts.includes("message: string;"));
  });

  it("emits meta-schema", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model TestForm {
        @field("Text")
        name: string;
      }
    `);

    const metaSchema = JSON.parse(await getEmittedFile(host, "subschema-form.schema.json"));
    assert.equal(metaSchema.$schema, "http://json-schema.org/draft-07/schema#");
    assert.ok(metaSchema.definitions.FieldSchema);
    assert.ok(metaSchema.definitions.ValidatorConfig);
    assert.ok(metaSchema.definitions.ConditionalConfig);
  });

  it("emits llms.txt", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model TestForm {
        @field("Text")
        name: string;
      }
    `);

    const llmsTxt = await getEmittedFile(host, "llms.txt");
    assert.ok(llmsTxt.includes("## Field Types"));
    assert.ok(llmsTxt.includes("## Validators"));
    assert.ok(llmsTxt.includes("## Decorators"));
    assert.ok(llmsTxt.includes("@field"));
  });

  it("handles nested models as subSchema", async () => {
    const { host } = await compileAndEmit(`
      model Address {
        @field("Text")
        street: string;

        @field("Text")
        city: string;
      }

      @formConfig
      model ContactForm {
        @field("Text")
        name: string;

        address: Address;
      }
    `);

    const json = await getEmittedJson(host);
    assert.equal(json.schema.address.type, "Object");
    assert.ok(json.schema.address.subSchema);
    assert.equal(json.schema.address.subSchema.schema.street.type, "Text");
    assert.equal(json.schema.address.subSchema.schema.city.type, "Text");
  });

  it("handles formConfig with template", async () => {
    const { host } = await compileAndEmit(`
      @formConfig("WizardTemplate")
      model TestForm {
        @field("Text")
        name: string;
      }
    `);

    const json = await getEmittedJson(host);
    assert.equal(json.template, "WizardTemplate");
  });

  it("marks conditional fields as optional in TS interface", async () => {
    const { host } = await compileAndEmit(`
      @formConfig
      model TestForm {
        @field("Select")
        @options("A", "B")
        type: string;

        @field("Text")
        @conditional("type", "==")
        details: string;
      }
    `);

    const ts = await getEmittedTs(host);
    assert.ok(ts.includes("details?: string;"));
  });
});

