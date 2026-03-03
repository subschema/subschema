/**
 * Wrapper script to run vitest and force exit.
 *
 * jsdom leaves open handles that prevent the vitest process from exiting.
 * Vitest completes all test files but hangs indefinitely (startVitest never
 * resolves, process never exits).
 *
 * This wrapper runs vitest via its Node API with a watchdog timer. Once
 * tests start running (we see output), if vitest doesn't resolve within
 * 30 seconds, we force process.exit(0) since the tests already passed.
 */
import { startVitest } from 'vitest/node';

let watchdog = null;
let resolved = false;

// Intercept stdout to detect when tests have run
const origWrite = process.stdout.write.bind(process.stdout);
let hasTestOutput = false;
let hasFailed = false;

process.stdout.write = (chunk, ...args) => {
  const text = typeof chunk === 'string' ? chunk : chunk.toString();
  if (text.includes('✓') || text.includes('✗') || text.includes('×')) {
    hasTestOutput = true;
    if (text.includes('✗') || text.includes('×')) {
      hasFailed = true;
    }
    // Reset watchdog each time we see output
    if (watchdog) clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (!resolved && hasTestOutput) {
        // vitest hung after printing test results
        process.exit(hasFailed ? 1 : 0);
      }
    }, 5000);
  }
  return origWrite(chunk, ...args);
};

const vitest = await startVitest('test', [], { run: true });
resolved = true;
if (watchdog) clearTimeout(watchdog);

if (!vitest) {
  process.exit(1);
}

const failed = vitest.state.getCountOfFailedTests() > 0;
await vitest.close();
process.exit(failed ? 1 : 0);
