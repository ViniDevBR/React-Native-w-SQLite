/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

import { registerRootComponent } from 'expo'

// const { spawn } = require('child_process')
// const child = spawn('dir', [], { shell: true })
import App from './App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
