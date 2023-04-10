import {shallowMount} from "@vue/test-utils";
import BlacklistManager from "@/components/BlacklistManager.vue";

// Mock the chrome.storage.sync methods
const storageGetMock = jest.fn();
const storageSetMock = jest.fn();
global.chrome = {
    storage: {
        sync: {
            get: storageGetMock,
            set: storageSetMock,
        },
    },
};

// Mock the window.updateRules method
const updateRulesMock = jest.fn();
global.window.updateRules = updateRulesMock;

// Mock the chrome.declarativeNetRequest.updateDynamicRules method
const updateDynamicRulesMock = jest.fn();
global.chrome.declarativeNetRequest = {
    updateDynamicRules: updateDynamicRulesMock,
};

describe("BlacklistManager.vue", () => {
    let wrapper;

    beforeEach(() => {
        storageGetMock.mockClear();
        storageSetMock.mockClear();
        updateDynamicRulesMock.mockClear();
        wrapper = shallowMount(BlacklistManager);
    });

    it("renders the component correctly", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it("adds a domain", async () => {
        wrapper.setData({newDomain: "example.com"});
        wrapper.vm.addDomain();

        expect(wrapper.vm.blacklistedDomains).toContain("example.com");
        expect(wrapper.vm.newDomain).toBe("");
        expect(wrapper.vm.hasChanges).toBe(true);
    });

    it("removes a domain", () => {
        wrapper.setData({blacklistedDomains: ["example.com"]});
        wrapper.vm.removeDomain(0);

        expect(wrapper.vm.blacklistedDomains).not.toContain("example.com");
        expect(wrapper.vm.hasChanges).toBe(true);
    });

    it("saves the updated domains", async () => {
        wrapper.setData({
            blacklistedDomains: ["example.com"],
            hasChanges: true,
        });
        wrapper.vm.save();

        expect(storageSetMock).toBeCalledWith(
            {blacklistedDomains: ["example.com"]},
            expect.any(Function)
        );

        // Simulate the callback
        storageSetMock.mock.calls[0][1]();

        expect(updateRulesMock).toBeCalled();
        expect(wrapper.vm.hasChanges).toBe(false);
    });
});
