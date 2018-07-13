<template>
  <div>
    <div class="breadcrumb-holder">
      <div class="container-fluid">
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><router-link :to="`/dashboard/`">Workflows</router-link></li>
          <li class="breadcrumb-item active">Workflow (id={{ workflowId }})</li>
        </ul>
      </div>
    </div>

    <section>
      <div class="container-fluid">
        <br/>
        <div class="row">
          <div class="col-lg-12">
            <workflowEditor
              :isEdit="true"
              :workflowOnFocus="workflowOnFocus"
              :isCompact="false"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <eventList
              :workflowId="workflowId"
              :onCreateEvent="onCreateEvent"
              :onEditEvent="onEditEvent"
              :onDeleteEvent="onDeleteEvent"
            />
          </div>
          <div class="col-lg-6">
            <eventEditor
              v-if="showEventEditor"
              :eventOnFocus="eventOnFocus"
              :onCloseEventEditor="onCloseEventEditor"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import _ from 'lodash';

import workflowEditor from '~/components/workflowEditor';
import eventList from '~/components/eventList';
import eventEditor from '~/components/eventEditor';

export default {
  async fetch({ store }) {
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
      showEventEditor: false,
      eventId: null,
    };
  },

  async created() {
    await this.$store.dispatch('workflows/fetchEvents', $nuxt.$route.params.id);
  },

  computed: {
    workflowId: function() {
      return $nuxt.$route.params.id;
    },

    workflowOnFocus: function() {
      return _.find(this.$store.state.workflows.workflows, { _id: this.workflowId });
    },

    eventOnFocus: function() {
      if (!this.eventId) {
        return { workflow_id: this.workflowId };
      }

      return _.find(this.$store.state.workflows.events, { _id: this.eventId });
    }
  },

  methods: {
    onDeleteEvent: function() {
      this.showEventEditor = false;
    },

    onCreateEvent: function() {
      this.eventId = null;
      this.showEventEditor = true;
    },

    onEditEvent: function(event_id) {
      this.eventId = event_id;
      this.showEventEditor = true;
    },

    onCloseEventEditor: function() {
      this.showEventEditor = false;
    },
  },

  layout: 'dashboard',
  middleware: 'auth',
  components: { workflowEditor, eventList, eventEditor },
}

</script>
