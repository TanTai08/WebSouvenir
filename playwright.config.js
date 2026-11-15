import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',fullyParallel:false,workers:1,retries:0,timeout:30000,
 reporter:[['list'],['html',{open:'never'}],['junit',{outputFile:'test-results/browser-junit.xml'}]],
 use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
 webServer:{command:'node scripts/run-demo.mjs',url:'http://127.0.0.1:3100',timeout:20000,reuseExistingServer:false,env:{PORT:'3100',DEMO_DB_PATH:'data/e2e.db'}}
});
