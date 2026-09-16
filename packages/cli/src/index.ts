#!/usr/bin/env node
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { runCaptureFlow } from './flows/capture.js';
import { showConfig } from './flows/config.js';

const BANNER = pc.magenta('⬒') + ' ' + pc.bold(pc.magenta('snapui'));

async function main() {
  console.log(
    `
${BANNER} ${pc.dim('v0.1.0')} — ${pc.dim('click any element → get a real component')}
`,
  );

  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'config') {
    await showConfig();
    return;
  }

  if (command === 'uninstall' || command === 'clean' || command === '--uninstall') {
    const { uninstallSnapUI } = await import('./core/index.js');
    const res = uninstallSnapUI();
    if (res.existed) {
      p.log.success(pc.green(`SnapUI directory (${res.path}) and managed Chrome cache purged cleanly.`));
    } else {
      p.log.info(pc.dim(`SnapUI directory (${res.path}) was already clean or missing.`));
    }
    return;
  }

  if (command === 'doctor') {
    const { getDoctorReport } = await import('./core/index.js');
    const report = getDoctorReport();
    p.log.step(pc.bold('SnapUI Diagnostics'));
    console.log(`  ${pc.dim('OS:')} ${report.os} (${report.arch})`);
    console.log(`  ${pc.dim('Node:')} ${report.nodeVersion}`);
    console.log(`  ${pc.dim('System Chrome:')} ${report.systemChromePath ? pc.green(report.systemChromePath) : pc.yellow('Not found (Managed Chrome fallback ready)')}`);
    console.log(`  ${pc.dim('Managed Chrome Dir:')} ${report.managedChromeDir} (${report.managedChromeExists ? pc.green('Installed') : pc.dim('Not downloaded yet')})`);
    console.log(`  ${pc.dim('SnapUI Cache Dir:')} ${report.snapDir} (${report.snapDirExists ? pc.green('Active') : pc.dim('Clean')})`);
    return;
  }

  if (command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  const url = args.find((a) => a.startsWith('http'));
  await runCaptureFlow(url);
}

function printHelp() {
  console.log(`Usage: snapui [command] [url]

Commands:
  (default)        Start an interactive capture session
  config           View / edit SnapUI settings (LLM keys, defaults)
  doctor           Run system diagnostics (Chrome, OS, Node, cache)
  uninstall        Purge ~/.snapui cache and private Chrome downloads
  --help           Show this help

Examples:
  ${pc.cyan('npx snapui-cli')}
  ${pc.cyan('npx snapui-cli https://stripe.com')}
  ${pc.cyan('npx snapui-cli doctor')}
  ${pc.cyan('npx snapui-cli uninstall')}
`);
}

main().catch((err) => {
  p.log.error(err?.message ?? String(err));
  process.exit(1);
});
