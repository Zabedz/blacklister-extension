import {updateRules, onChangedListener} from "../../public/background";

describe("background.js", () => {
    describe("updateRules", () => {
        it("updates rules correctly", () => {
            const blacklistedDomains = ["example.com", "test.com"];

            const getDynamicRules = (callback) => {
                const existingRules = [
                    {
                        id: 1,
                        priority: 1,
                        action: {type: "block"},
                        condition: {urlFilter: "*://example.com/*", resourceTypes: ["main_frame"]}
                    },
                ];
                callback(existingRules);
            };

            const updateDynamicRules = jest.fn();

            updateRules(blacklistedDomains, getDynamicRules, updateDynamicRules);

            expect(updateDynamicRules).toHaveBeenCalled();
        });
    });

    describe("onChangedListener", () => {
        it("reacts to storage changes correctly", () => {
            const changes = {
                blacklistedDomains: {
                    newValue: {0: "example.com"},
                },
            };

            const areaName = "sync";

            const getDynamicRules = (callback) => {
                const existingRules = [];
                callback(existingRules);
            };

            const updateDynamicRules = jest.fn();

            onChangedListener(changes, areaName, getDynamicRules, updateDynamicRules);

            expect(updateDynamicRules).toHaveBeenCalled();
        });

        it("does not react to irrelevant storage changes", () => {
            const changes = {
                irrelevantData: {
                    newValue: {0: "example.com"},
                },
            };

            const areaName = "sync";

            const getDynamicRules = jest.fn();
            const updateDynamicRules = jest.fn();

            onChangedListener(changes, areaName, getDynamicRules, updateDynamicRules);

            expect(getDynamicRules).not.toHaveBeenCalled();
            expect(updateDynamicRules).not.toHaveBeenCalled();
        });
    });
});
