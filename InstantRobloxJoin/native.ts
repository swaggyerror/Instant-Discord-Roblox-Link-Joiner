import { execFile } from "child_process";

const ROBLOX_PLAYER_PROCESS = "RobloxPlayerBeta.exe";
const POLL_INTERVAL_MS = 100;
const EXIT_TIMEOUT_MS = 5000;
const GRACEFUL_EXIT_TIMEOUT_MS = 1500;
const POST_EXIT_DELAY_MS = 300;

function execTask(file: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        execFile(file, args, { windowsHide: true }, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout);
        });
    });
}

async function isProcessRunning(imageName: string): Promise<boolean> {
    try {
        const stdout = await execTask("tasklist", ["/FI", `IMAGENAME eq ${imageName}`, "/FO", "CSV", "/NH"]);
        return stdout.toLowerCase().includes(imageName.toLowerCase());
    } catch {
        return false;
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForProcessExit(imageName: string, timeoutMs: number) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        if (!(await isProcessRunning(imageName))) {
            return true;
        }

        await sleep(POLL_INTERVAL_MS);
    }

    return !(await isProcessRunning(imageName));
}

async function closeProcessGracefully(imageName: string): Promise<boolean> {
    try {
        await execTask("powershell", [
            "-NoProfile",
            "-Command",
            `$p = Get-Process -Name '${imageName.replace(".exe", "")}' -ErrorAction SilentlyContinue; if ($p) { $p.CloseMainWindow() | Out-Null }`
        ]);
    } catch {
        return false;
    }

    return waitForProcessExit(imageName, GRACEFUL_EXIT_TIMEOUT_MS);
}

async function forceKillProcess(imageName: string) {
    const running = await isProcessRunning(imageName);
    if (!running) return false;

    try {
        await execTask("taskkill", ["/F", "/T", "/IM", imageName]);
    } catch {
        // `taskkill` can still return a non-zero exit code while the process is already closing.
    }

    const exited = await waitForProcessExit(imageName, EXIT_TIMEOUT_MS);
    if (!exited) {
        throw new Error(`Timed out waiting for ${imageName} to exit.`);
    }

    return true;
}

export async function killRoblox(): Promise<void> {
    const running = await isProcessRunning(ROBLOX_PLAYER_PROCESS);
    if (!running) return;

    const gracefulExit = await closeProcessGracefully(ROBLOX_PLAYER_PROCESS);
    if (!gracefulExit) {
        await forceKillProcess(ROBLOX_PLAYER_PROCESS);
    }

    await sleep(POST_EXIT_DELAY_MS);
}

export async function restartRoblox(): Promise<void> {
    await killRoblox();
}
