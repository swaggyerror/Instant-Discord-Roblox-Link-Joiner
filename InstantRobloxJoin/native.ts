import { exec } from "child_process";

export function killRoblox(): Promise<void> {
    return new Promise((resolve) => {
        // kill both at the same time (parallel, not sequential)
        exec("taskkill /F /IM Bloxstrap.exe 2>nul");
        exec("taskkill /F /IM RobloxPlayerBeta.exe 2>nul");

        // small safety buffer (not 2 full seconds anymore)
        setTimeout(resolve, 800);
    });
}