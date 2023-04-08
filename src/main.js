import {createApp} from 'vue'
import App from './App.vue'
import {setupOnChangedListener} from "../public/background";

setupOnChangedListener();

createApp(App).mount('#app')
