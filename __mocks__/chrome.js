const chrome = {
    storage: {
        sync: {
            get: jest.fn(),
            set: jest.fn(),
        },
    },
    declarativeNetRequest: {
        getDynamicRules: jest.fn(),
        updateDynamicRules: jest.fn(),
    },
};

global.chrome = chrome;
