import { type Browser, type Page } from 'puppeteer-core';
/** Chrome-for-Testing download folder name per detected platform tag. */
export declare function chromeFolderName(platformTag: string): string;
/** Direct download URL for the Chrome-for-Testing archive. */
export declare function chromeDownloadUrl(platformTag: string, buildId: string): string;
/** A managed install is valid only if the app bundle is complete. */
export declare function isValidManagedInstall(exe: string): boolean;
/**
 * Locate the user's installed Google Chrome. SnapUI is Chrome-only by design:
 * the DevTools Protocol dialect we rely on is a Chromium/Chrome feature, and we
 * officially support only Chrome (a managed Chrome-for-Testing copy counts too).
 */
export declare function findChromeExecutable(): string | null;
export interface BrowserSession {
    browser: Browser;
    page: Page;
    /** Whether we own the browser process (should close it on exit). */
    owned: boolean;
}
/**
 * Attach to an already-running Chrome started with --remote-debugging-port.
 * This is the zero-download path: users test on their own logged-in browser.
 */
export declare function attachToRunningChrome(port?: number): Promise<BrowserSession>;
/**
 * Launch the user's installed Chrome with a fresh, isolated profile.
 * If no Chrome is found, downloads a managed Chromium into ~/.snapui/browser
 * (one-time, ~150MB) so the CLI works out of the box.
 */
export declare function launchIsolatedChrome(url?: string, opts?: {
    headless?: boolean;
}): Promise<BrowserSession>;
/**
 * Ensure a working Chrome exists: reuse the managed Chrome-for-Testing copy if it
 * is healthy, otherwise (re)install it into ~/.snapui/browser. Validates the app
 * bundle after unpacking and retries once — a broken partial install is wiped and
 * downloaded again. If all of that fails we say so clearly: Chrome is required.
 */
export declare function ensureManagedBrowser(): Promise<string>;
/** Navigate to a URL in an existing session if provided. */
export declare function ensurePageAt(session: BrowserSession, url?: string): Promise<void>;
/** Safe teardown that never throws. */
export declare function closeSession(session: BrowserSession): Promise<void>;
/** Read the Chrome DevTools protocol port from file, if user saved it. */
export declare function readSavedPort(): number | null;
/** Cleanly remove SnapUI directory ~/.snapui (managed Chrome binaries, ports, configs). */
export declare function uninstallSnapUI(): {
    path: string;
    existed: boolean;
};
export interface DoctorReport {
    os: string;
    arch: string;
    nodeVersion: string;
    systemChromePath: string | null;
    managedChromeDir: string;
    managedChromeExists: boolean;
    snapDir: string;
    snapDirExists: boolean;
}
/** Diagnoses SnapUI environment status for cross-platform readiness. */
export declare function getDoctorReport(): DoctorReport;
