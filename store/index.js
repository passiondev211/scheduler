import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import AuthStore from './auth';
import WorkflowsStore from './workflows';

require('whatwg-fetch');

const store = () => new Vuex.store({
  plugins: [ createPersistedState({
    key: 'scheduler',
  })],

  modules: {
    auth: AuthStore,
    workflows: WorkflowsStore,
  }
});
