<template>
  <div>
    <div class="breadcrumb-holder">
      <div class="container-fluid">
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><router-link :to="`/dashboard/`">Workflows</router-link></li>
          <li class="breadcrumb-item"><router-link :to="`/dashboard/workflows/${workflowId}`">Workflow (id={{ workflowId }})</router-link></li>
          <li class="breadcrumb-item active">Event (id={{ eventId }})</li>
        </ul>
      </div>
    </div>

    <section>
      <div class="container-fluid">
        <br/>
        <div class="row">
          <div class="col-lg-12">
            <eventEditor
              :isEdit="true"
              :eventOnFocus="eventOnFocus"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <evMessageList
              :eventId="eventId"
              :onCreateEventMessage="onCreateEventMessage"
              :onEditEventMessage="onEditEventMessage"
              :onDeleteEventMessage="onDeleteEventMessage"
            />
          </div>
          <div class="col-lg-6">
            <evMessageEditor
              :eventId="eventId"
              v-if="showEventMessageEditor"
              :eventMessageOnFocus="eventMessageOnFocus"
              :onCloseEventMessageEditor="onCloseEventMessageEditor"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import _ from 'lodash';

import eventEditor from '~/components/eventEditor';
import evMessageList from '~/components/evMessageList';
import evMessageEditor from '~/components/evMessageEditor';

export default {
  async fetch({ store, redirect }) {
    try {
      if (!store.state.workflows.workflowLoaded) {
        await store.dispatch('workflows/fetchWorkflows');
      }
    } catch(err) {
      await store.dispatch('auth/logout');
      redirect('/login');
    }
  },

  data: () => {
    return {
      workflowId: $nuxt.$route.params.workflow_id,
      eventId: $nuxt.$route.params.event_id,
      eventMessageId: null,
      showEventMessageEditor: false,
    };
  },

  async created() {
    await this.$store.dispatch('workflows/fetchEvents', $nuxt.$route.params.workflow_id);
  },

  computed: {
    eventOnFocus: function() {
      if (this.$store.state.workflows.eventLoaded) {
        return _.find(this.$store.state.workflows.events, { _id: this.eventId });
      }

      return {};
    },

    eventMessageOnFocus: function() {
      if (this.$store.state.workflows.eventLoaded && this.eventMessageId) {
        const evMessageList = _.find(this.$store.state.workflows.events, { _id: this.eventId }).event_messages;
        return _.find(evMessageList, { _id: this.eventMessageId });
      }

      return {};
    },
  },

  methods: {
    onCreateEventMessage: function() {
      this.eventMessageId = null;      
      this.showEventMessageEditor = true;
    },

    onEditEventMessage: function(event_message_id) {
      this.eventMessageId = event_message_id;
      this.showEventMessageEditor = true;
    },

    onDeleteEventMessage: function() {
      this.showEventMessageEditor = false;
    },
    
    onCloseEventMessageEditor: function() {
      this.showEventMessageEditor = false;
    }
  },

  layout: 'dashboard',
  middleware: 'auth',
  components: { eventEditor, evMessageList, evMessageEditor },
}

</script>
