import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import type { Model, ModelProperty, Program } from "@typespec/compiler";
import { createTestHost, createTestLibrary } from "@typespec/compiler/testing";
import {
  getFieldType,
  getTemplate,
  getFieldset,
  isFieldset,
  getConditional,
  getOptions,
  getPlaceholder,
  getFormConfig,
  isFormConfig,
} from "../src/decorators.js";

// Resolve package root (works from both src/ and dist/test/)
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..", "..");

const SubschemaTestLibrary = createTestLibrary({
  name: "@subschema/typespec",
  packageRoot: pkgRoot,
  jsFileFolder: "dist/src",
  typespecFileFolder: "lib",
});

async function compileWithSubschema(code: string) {
  const host = await createTestHost({ libraries: [SubschemaTestLibrary] });
  host.addTypeSpecFile(
    "main.tsp",
    `import "@subschema/typespec";\nusing Subschema;\n${code}`,
  );
  await host.compile("main.tsp");
  return host.program;
}

function findModel(program: Program, name: string): Model {
  // Check global namespace
  const globalNs = (program as any).getGlobalNamespaceType();
  const model = globalNs.models.get(name);
  if (model) return model;
  // Check child namespaces
  for (const ns of globalNs.namespaces.values()) {
    const m = ns.models.get(name);
    if (m) return m;
  }
  throw new Error(`Model "${name}" not found`);
}

function getProp(model: Model, name: string): ModelProperty {
  const prop = model.properties.get(name);
  if (!prop) throw new Error(`Property "${name}" not found on "${model.name}"`);
  return prop;
}

describe("@field decorator", () => {
  it("stores field type on a property", async () => {
    const program = await compileWithSubschema(`
      model TestForm {
        @field("Text")
        name: string;
      }
    `);
    const model = findModel(program, "TestForm");
    assert.equal(getFieldType(program, getProp(model, "name")), "Text");
  });

  it("supports Select field type", async () => {
    const program = await compileWithSubschema(`
      model TestForm {
        @field("Select")
        country: string;
      }
    `);
    const model = findModel(program, "TestForm");
    assert.equal(getFieldType(program, getProp(model, "country")), "Select");
  });
});

describe("@template decorator", () => {
  it("stores template name on a property", async () => {
    const program = await compileWithSubschema(`
      model TestForm {
        @template("FloatingLabel")
        email: string;
      }
    `);
    const model = findModel(program, "TestForm");
    assert.equal(getTemplate(program, getProp(model, "email")), "FloatingLabel");
  });
});

describe("@fieldset decorator", () => {
  it("marks model as fieldset with legend", async () => {
    const program = await compileWithSubschema(`
      @fieldset("Address Info")
      model Address {
        street: string;
      }
    `);
    const model = findModel(program, "Address");
    assert.equal(isFieldset(program, model), true);
    assert.equal(getFieldset(program, model), "Address Info");
  });

  it("marks model as fieldset without legend", async () => {
    const program = await compileWithSubschema(`
      @fieldset
      model Address {
        street: string;
      }
    `);
    const model = findModel(program, "Address");
    assert.equal(isFieldset(program, model), true);
    assert.equal(getFieldset(program, model), "");
  });
});

describe("@conditional decorator", () => {
  it("stores conditional metadata", async () => {
    const program = await compileWithSubschema(`
      model TestForm {
        @conditional("status", "==")
        details: string;
      }
    `);
    const model = findModel(program, "TestForm");
    const cond = getConditional(program, getProp(model, "details"));
    assert.deepEqual(cond, { expression: "status", operator: "==" });
  });
});

describe("@options decorator", () => {
  it("stores option values", async () => {
    const program = await compileWithSubschema(`
      model TestForm {
        @options("red", "green", "blue")
        color: string;
      }
    `);
    const model = findModel(program, "TestForm");
    assert.deepEqual(getOptions(program, getProp(model, "color")), ["red", "green", "blue"]);
  });
});

describe("@placeholder decorator", () => {
  it("stores placeholder text", async () => {
    const program = await compileWithSubschema(`
      model TestForm {
        @placeholder("Enter your name")
        name: string;
      }
    `);
    const model = findModel(program, "TestForm");
    assert.equal(getPlaceholder(program, getProp(model, "name")), "Enter your name");
  });
});

describe("@formConfig decorator", () => {
  it("marks model as form with template", async () => {
    const program = await compileWithSubschema(`
      @formConfig("WizardTemplate")
      model MyForm {
        name: string;
      }
    `);
    const model = findModel(program, "MyForm");
    assert.equal(isFormConfig(program, model), true);
    assert.deepEqual(getFormConfig(program, model), { template: "WizardTemplate" });
  });

  it("marks model as form without template", async () => {
    const program = await compileWithSubschema(`
      @formConfig
      model MyForm {
        name: string;
      }
    `);
    const model = findModel(program, "MyForm");
    assert.equal(isFormConfig(program, model), true);
    assert.deepEqual(getFormConfig(program, model), {});
  });
});

