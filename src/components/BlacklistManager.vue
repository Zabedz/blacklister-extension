<template>
  <div>
    <h1>Domain Blacklister</h1>
    <div>
      <input v-model="newDomain" placeholder="Add domain..."/>
      <button @click="addDomain">Add</button>
    </div>
    <ul>
      <li v-for="(domain, index) in blacklistedDomains" :key="index">
        {{ domain }}
        <button @click="removeDomain(index)">Remove</button>
      </li>
    </ul>
    <button @click="save">Save</button>
  </div>
</template>

<script>
export default {
  /* global chrome */
  data() {
    return {
      blacklistedDomains: [],
      newDomain: "",
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
      console.log("Adding domain:", this.newDomain);
      this.newDomain && this.blacklistedDomains.push(this.newDomain);
      this.newDomain = "";
    },
    removeDomain(index) {
      console.log("Removing domain:", this.blacklistedDomains[index]);
      this.blacklistedDomains.splice(index, 1);
    },
    save() {
      console.log("Saving blacklisted domains:", this.blacklistedDomains);
      chrome.storage.sync.set({blacklistedDomains: this.blacklistedDomains}, () => {
        console.log("Blacklisted domains saved successfully.");
        this.updateRules(this.blacklistedDomains);
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
            } else {
              console.log("Rules updated successfully");
            }
          }
      );
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
