(function () {
    /* global chrome */
    /**
     * This function is used to update the rules in the declarativeNetRequest API.
     * @param blacklistedDomains array of domains to blacklist.
     * @param getDynamicRules function to get the existing rules.
     * @param updateDynamicRules function to update the rules.
     */
    function updateRules(blacklistedDomains, getDynamicRules, updateDynamicRules) {
        getDynamicRules((rules) => {
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
            updateDynamicRules(
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

    /**
     * This function is used to listen for changes in the storage API.
     * @param changes object containing the changes in the storage API.
     * @param areaName name of the area in the storage API. We are watching the area "sync".
     * @param getDynamicRules function to get the existing rules.
     * @param updateDynamicRules function to update the rules.
     */
    function onChangedListener(changes, areaName, getDynamicRules, updateDynamicRules) {
        if (areaName === "sync" && changes.blacklistedDomains) {
            let blacklistedDomains = changes.blacklistedDomains.newValue;

            if (typeof blacklistedDomains === "object" && !Array.isArray(blacklistedDomains)) {
                blacklistedDomains = Object.values(blacklistedDomains);
            }
            updateRules(blacklistedDomains, getDynamicRules, updateDynamicRules);
        }
    }

    function setupOnChangedListener() {
        chrome.storage.onChanged.addListener((changes, areaName) => {
            onChangedListener(changes,
                areaName,
                chrome.declarativeNetRequest.getDynamicRules,
                chrome.declarativeNetRequest.updateDynamicRules);
        });
    }

    if (typeof exports !== "undefined") {
        exports.updateRules = updateRules;
        exports.onChangedListener = onChangedListener;
        exports.setupOnChangedListener = setupOnChangedListener;
    } else {
        window.updateRules = updateRules;
        window.onChangedListener = onChangedListener;
        window.setupOnChangedListener = setupOnChangedListener;
    }
})();
