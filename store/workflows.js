import axios from 'axios';
import * as types from './mutation-types';
import _ from 'lodash';

export const state = () => ({
  workflows: [],
  workflowLoaded: false,
  
  events: [],
  eventLoaded: false,

  subscribers: [],
  subscriberLoaded: false,
});

export const mutations = {
  [types.FETCH_WORKFLOWS] (state, data) {
    state.workflows = Array.from(data.workflows);
    state.workflowLoaded = true;
  },

  [types.FETCH_EVENTS] (state, data) {
    state.events = Array.from(data.events);
    state.eventLoaded = true;
  },

  [types.FETCH_SUBSCRIBERS] (state, data) {
    state.subscribers = Array.from(data.subscribers);
  },
  
  [types.FETCH_ERROR] (state, error) {
    console.log(error);
  },

  [types.DELETE_WORKFLOW] (state, workflowId) {
    state.workflows = _.filter(state.workflows, (elem) => {
      return elem._id !== workflowId;
    });
  },

  [types.DELETE_SUBSCRIBER] (state, subscriberId) {
    state.subscribers = _.filter(state.subscribers, (elem) => {
      return elem._id !== subscriberId;
    });
  },

  [types.DELETE_EVENT] (state, eventId) {
    state.events = _.filter(state.events, (elem) => {
      return elem._id !== eventId;
    });
  },

  [types.UPDATE_WORKFLOW] (state, data) {
    var index = _.findIndex(state.workflows, { _id: data.updated._id });
    state.workflows.splice(index, 1, data.updated);
  },

  [types.UPDATE_EVENT] (state, data) {
    var index = _.findIndex(state.events, { _id: data.updated._id });
    state.events.splice(index, 1, data.updated);
  },

  [types.CREATE_WORKFLOW] (state, data) {
    state.workflows.push(data.workflow);
  },

  [types.CREATE_EVENT] (state, data) {
    state.events.push(data.event);
  },

  [types.CREATE_SUBSCRIBER] (state, data) {
    state.subscribers.push(data.subscriber);
  },

  [types.UPDATE_SUBSCRIBER] (state, data) {
    var index = _.findIndex(state.subscribers, { _id: data.updated._id });
    state.subscribers.splice(index, 1, data.updated);
  },
};

export const actions = {
  // get all workflows for a seller
  fetchWorkflows({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/workflows')
      .then( response => {
        commit(types.FETCH_WORKFLOWS, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // delete workflow
  deleteWorkflow({ commit }, workflowId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/workflows/${workflowId}`)
      .then( response => {
        commit(types.DELETE_WORKFLOW, workflowId);
        resolve(workflowId);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // update workflow
  updateWorkflow({ commit }, workflowData) {
    return new Promise((resolve, reject) => {
      axios.patch(`/api/workflows/${workflowData._id}`, workflowData)
      .then( response => {
        commit(types.UPDATE_WORKFLOW, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // create workflow
  createWorkflow({ commit }, workflowData) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/workflows`, workflowData)
      .then( response => {
        commit(types.CREATE_WORKFLOW, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // fetch events for a workflow
  fetchEvents({ commit }, workflowId) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/workflows/${workflowId}/events`)
      .then( response => {
        commit(types.FETCH_EVENTS, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // delete event
  deleteEvent({ commit }, eventData) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/workflows/${eventData.workflow_id}/events/${eventData._id}`)
      .then( response => {
        commit(types.DELETE_EVENT, eventData._id);
        resolve(eventData._id);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // delete event message
  deleteEventMessage({ state, commit }, { eventId, eventMessage }) {
    var eventData = _.find(state.events, { _id: eventId });
    var evMessageList = _.clone(eventData.event_messages, true);
    _.remove(evMessageList, elem => elem._id === eventMessage._id );

    return new Promise((resolve, reject) => {
      axios.patch(`/api/workflows/${eventData.workflow_id}/events/${eventId}/event_messages`, { event_messages: evMessageList })
      .then( response => {
        commit(types.UPDATE_EVENT, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // update event message
  updateEventMessage({ state, commit }, { eventId, eventMessage }) {
    var eventData = _.find(state.events, { _id: eventId });
    var evMessageList = _.clone(eventData.event_messages, true);
    var index = _.findIndex(evMessageList, { _id: eventMessage._id });
    evMessageList.splice(index, 1, eventMessage);

    return new Promise((resolve, reject) => {
      axios.patch(`/api/workflows/${eventData.workflow_id}/events/${eventId}/event_messages`, { event_messages: evMessageList })
      .then( response => {
        commit(types.UPDATE_EVENT, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // create event message
  createEventMessage({ state, commit }, { eventId, eventMessage }) {
    var eventData = _.find(state.events, { _id: eventId });

    return new Promise((resolve, reject) => {
      axios.post(`/api/workflows/${eventData.workflow_id}/events/${eventId}/event_messages`, eventMessage)
      .then( response => {
        commit(types.UPDATE_EVENT, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // create event
  createEvent({ commit }, eventData) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/workflows/${eventData.workflow_id}/events`, eventData)
      .then( response => {
        commit(types.CREATE_EVENT, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // update event
  updateEvent({ commit }, eventData) {
    return new Promise((resolve, reject) => {
      axios.patch(`/api/workflows/${eventData.workflow_id}/events/${eventData._id}`, eventData)
      .then( response => {
        commit(types.UPDATE_EVENT, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // fetch subscribers for a workflow
  fetchSubscribers({ commit }, workflowId) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/workflows/${workflowId}/subscribers`)
      .then( response => {
        commit(types.FETCH_SUBSCRIBERS, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

    // delete subscriber
  deleteSubscriber({ commit }, subscriber) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/workflows/${subscriber.workflow_id}/subscribers/${subscriber._id}`)
      .then( response => {
        commit(types.DELETE_SUBSCRIBER, subscriber._id);
        resolve(subscriber._id);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // create subscriber
  createSubscriber({ commit }, subscriber) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/workflows/${subscriber.workflow_id}/subscribers`, subscriber)
      .then( response => {
        commit(types.CREATE_SUBSCRIBER, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

  // update subscriber
  updateSubscriber({ commit }, subscriber) {
    return new Promise((resolve, reject) => {
      axios.patch(`/api/workflows/${subscriber.workflow_id}/subscribers/${subscriber._id}`, subscriber)
      .then( response => {
        commit(types.UPDATE_SUBSCRIBER, response.data);
        resolve(response.data);
      })
      .catch( error => {
        commit(types.FETCH_ERROR, error);
        reject(error);
      });
    });
  },

};

const store = {
  state: state,
  mutations: mutations,
  actions: actions
};

export default store;
