import axios from 'axios';
import * as types from './mutation-types';

export const state = () => ({
  authUser: null,
})

export const mutations = {
  [types.SET_USER]: function (state, user) {
    state.authUser = user;
  }
}

export const actions = {
  setUser( { commit }, user) {
    commit('SET_USER', user);
  },

  async login ({ commit }, { username, password }) {
    try {
      const { data } = await axios.post('/api/auth', { username, password });
      commit('SET_USER', data);
      localStorage.setItem("authUser", JSON.stringify(data));

      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials');
      }

      throw error;
    }
  },

  async logout({ commit }) {
    await axios.post('/api/auth/logout');
    localStorage.removeItem("authUser");

    commit('SET_USER', null);
  }
}

const store = {
  state: state,
  mutations: mutations,
  actions: actions
}

export default store;
