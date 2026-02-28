import { type EmitContext, emitFile, resolvePath } from "@typespec/compiler";

export async function $onEmit(context: EmitContext) {
  if (!context.program.compilerOptions.noEmit) {
    await emitFile(context.program, {
      path: resolvePath(context.emitterOutputDir, "subschema-form.json"),
      content: "{}\n",
    });
  }
}

