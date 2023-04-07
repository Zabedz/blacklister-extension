function updateRules(blacklistedDomains) {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const ruleIdsToRemove = rules.flatMap((rule) => rule.id);

        const newRules = blacklistedDomains.map((domain, index) => ({
            id: index + 1,
            priority: 1,
            action: {type: "block"},
            condition: {
                urlFilter: `*://${domain}/*`,
                resourceTypes: ["main_frame"],
            },
        }));
        chrome.declarativeNetRequest.updateDynamicRules(
            {
                removeRuleIds: ruleIdsToRemove,
                addRules: newRules,
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
            }
        );
    });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.blacklistedDomains) {
        let blacklistedDomains = changes.blacklistedDomains.newValue;

        if (typeof blacklistedDomains === "object" && !Array.isArray(blacklistedDomains)) {
            blacklistedDomains = Object.values(blacklistedDomains);
        }
        updateRules(blacklistedDomains);
    }
});
