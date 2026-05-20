import definePlugin from "@utils/types";
import * as Native from "./native";

type LaunchTarget = {
    placeId: string | null;
    linkCode: string;
};

let launchQueue = Promise.resolve();

function launch(url: string) {
    console.log("[InstantRobloxJoin] Launch:", url);
    window.open(url, "_blank");
}

function isRobloxHost(hostname: string) {
    return hostname === "roblox.com" || hostname.endsWith(".roblox.com");
}

function parseLaunchTarget(href: string): LaunchTarget | null {
    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return null;
    }

    if (!isRobloxHost(url.hostname)) return null;

    if (url.pathname.includes("/share")) {
        const code = url.searchParams.get("code");
        if (!code) return null;

        return {
            placeId: null,
            linkCode: code
        };
    }

    const privateCode = url.searchParams.get("privateServerLinkCode");
    if (!privateCode) return null;

    const match = url.pathname.match(/games\/(\d+)/);
    return {
        placeId: match?.[1] ?? null,
        linkCode: privateCode
    };
}

async function launchRoblox(placeId: string | null, linkCode: string) {
    const native = (VencordNative.pluginHelpers as any).InstantRobloxJoin as typeof Native | undefined;

    if (native?.restartRoblox) {
        await native.restartRoblox();
    } else if (native?.killRoblox) {
        await native.killRoblox();
    }

    const url = placeId
        ? `roblox://placeID=${placeId}&linkCode=${linkCode}`
        : `roblox://navigation/share_links?code=${linkCode}&type=Server`;

    launch(url);
}

function queueLaunch(target: LaunchTarget) {
    launchQueue = launchQueue
        .catch(() => void 0)
        .then(() => launchRoblox(target.placeId, target.linkCode))
        .catch(error => {
            console.error("[InstantRobloxJoin] Launch failed:", error);
        });
}

function handleClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest("input, textarea, select, button, [contenteditable='true']")) {
        return;
    }

    const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;

    const launchTarget = parseLaunchTarget(anchor.href);
    if (!launchTarget) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    queueLaunch(launchTarget);
}

export default definePlugin({
    name: "Instant Roblox Join",
    description: "Immediately launch Roblox links without needing to open a browser.",
    authors: [
        {
            name: "swaggyerror",
            id: 865636057960677439n
        }
    ],

    start() {
        document.addEventListener("click", handleClick, true);
        console.log("[InstantRobloxJoin] loaded");
    },

    stop() {
        document.removeEventListener("click", handleClick, true);
    }
});
