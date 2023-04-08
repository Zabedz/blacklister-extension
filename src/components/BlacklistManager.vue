<template>
  <div class="blacklist-manager bg-light p-4">
    <h1>Domain Blacklister</h1>
    <div class="input-group my-3">
      <input v-model="newDomain" class="form-control"/>
      <div class="input-group-append">
        <button @click="addDomain" class="btn add-button">Add</button>
      </div>
    </div>
    <ul class="list-group">
      <li v-for="(domain, index) in blacklistedDomains" :key="index"
          class="list-group-item d-flex justify-content-between align-items-center">
        {{ domain }}
        <button @click="removeDomain(index)" class="btn btn-link text-danger btn-sm p-0">
          <span class="material-icons">clear</span>
        </button>
      </li>
    </ul>
    <button @click="save" class="btn"
            :class="{ 'btn-secondary': !hasChanges, 'btn-primary': hasChanges }"
            :disabled="!hasChanges">Save
    </button>
  </div>
</template>

<script>
export default {
  /* global chrome */
  data() {
    return {
      blacklistedDomains: [],
      newDomain: "",
      hasChanges: false,
    };
  },
  created() {
    chrome.storage.sync.get("blacklistedDomains", (data) => {
      if (data && data.blacklistedDomains) {
        for (const index in data.blacklistedDomains) {
          this.blacklistedDomains.push(data.blacklistedDomains[index]);
        }
      } else {
        this.blacklistedDomains = [];
      }
    });
  },

  methods: {
    addDomain() {
      this.newDomain && this.blacklistedDomains.push(this.newDomain);
      this.newDomain = "";
      this.hasChanges = true;
    },
    removeDomain(index) {
      this.blacklistedDomains.splice(index, 1);
      this.hasChanges = true;
    },
    save() {
      chrome.storage.sync.set({blacklistedDomains: this.blacklistedDomains}, () => {
        this.updateRules(this.blacklistedDomains);
        this.hasChanges = false;
      });
    },

    updateRules(blacklistedDomains) {
      const ruleIds = blacklistedDomains.map((domain, index) => index + 1);
      const rules = blacklistedDomains.map((domain, index) => ({
        id: index + 1,
        priority: 1,
        action: {type: "block"},
        condition: {
          urlFilter: `||${domain}^`,
          resourceTypes: ["main_frame"],
        },
      }));

      chrome.declarativeNetRequest.updateDynamicRules(
          {
            removeRuleIds: ruleIds,
            addRules: rules,
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          }
      );
    },
  },
};
</script>

<style scoped>
.blacklist-manager {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 1rem;
}

.add-button {
  background-color: #008000;
  border-color: #008000;
}

.add-button:hover,
.add-button:focus {
  background-color: #006400;
  border-color: #006400;
}
</style>
