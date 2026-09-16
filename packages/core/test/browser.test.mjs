import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromeDownloadUrl, chromeFolderName, findChromeExecutable, PANEL_SOURCE } from '@snapui/core';

test('chromeFolderName maps platform tags to Chrome-for-Testing folders', () => {
  assert.equal(chromeFolderName('mac_arm'), 'mac-arm64');
  assert.equal(chromeFolderName('mac'), 'mac-x64');
  assert.equal(chromeFolderName('linux'), 'linux64');
  assert.equal(chromeFolderName('win32'), 'win32');
  assert.equal(chromeFolderName('win64'), 'win64');
  assert.throws(() => chromeFolderName('sunos'));
});

test('chromeDownloadUrl builds the canonical CfT archive URL', () => {
  assert.equal(
    chromeDownloadUrl('mac_arm', '153.0.8010.36'),
    'https://storage.googleapis.com/chrome-for-testing-public/153.0.8010.36/mac-arm64/chrome-mac-arm64.zip',
  );
  assert.equal(
    chromeDownloadUrl('linux', '153.0.8010.36'),
    'https://storage.googleapis.com/chrome-for-testing-public/153.0.8010.36/linux64/chrome-linux64.zip',
  );
});

test('findChromeExecutable returns null or an existing path (Chrome only)', () => {
  const exe = findChromeExecutable();
  if (exe !== null) assert.equal(existsSync(exe), true);
  else assert.ok(true);
});

test('PANEL_SOURCE appends style element to DOM', () => {
  assert.match(PANEL_SOURCE, /appendChild\(style\)/);
});
