import definePlugin from "@utils/types";
import * as Native from "./native";

function launch(url: string) {
    console.log("[InstantRobloxJoin] Launch:", url);
    window.open(url, "_blank");
}

async function launchRoblox(placeId: string | null, linkCode: string) {
    try {
        const native = (VencordNative.pluginHelpers as any).InstantRobloxJoin as typeof Native;
        if (native?.killRoblox) {
            await native.killRoblox(); // WAIT only ~200ms now
        }
    } catch (e) { }

    let url: string;

    if (placeId) {
        url = `roblox://placeID=${placeId}&linkCode=${linkCode}`;
    } else {
        url = `roblox://navigation/share_links?code=${linkCode}&type=Server`;
    }

    // immediate launch (no delay, no retry chains)
    launch(url);
}

function handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.href;
    if (!href.includes("roblox.com")) return;

    let urlObj: URL;
    try {
        urlObj = new URL(href);
    } catch {
        return;
    }

    // SHARE LINK
    if (urlObj.pathname.includes("/share")) {
        const code = urlObj.searchParams.get("code");
        if (!code) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        launchRoblox(null, code);
        return;
    }

    // PRIVATE SERVER LINK
    const privateCode = urlObj.searchParams.get("privateServerLinkCode");
    if (privateCode) {
        const match = urlObj.pathname.match(/games\/(\d+)/);
        const placeId = match?.[1] ?? null;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        launchRoblox(placeId, privateCode);
    }
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