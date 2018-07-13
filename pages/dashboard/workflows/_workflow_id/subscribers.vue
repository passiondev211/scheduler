<template>
  <div>
    <div class="breadcrumb-holder">
      <div class="container-fluid">
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><router-link :to="`/dashboard/`">Workflows</router-link></li>
          <li class="breadcrumb-item"><router-link :to="`/dashboard/workflows/${workflowId}`">Workflow (id={{ workflowId }})</router-link></li>
          <li class="breadcrumb-item active">Subscribers</li>
        </ul>
      </div>
    </div>

    <section>
      <div class="container-fluid">
        <br/>
        <div class="row">
          <div class="col-lg-12">
            <subscriberList
              :subscribers="subscribers"
              :onEditSubscriber="onEditSubscriber"
              :onCreateSubscriber="onCreateSubscriber"
              :onDeleteSubscriber="onDeleteSubscriber"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <subscriberEditor
              v-if="showSubscriberEditor"
              :isEdit="isSubscriberEdit"
              :subscriberOnFocus="subscriberOnFocus"
              :onCloseSubscriberEditor="onCloseSubscriberEditor"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash';
import subscriberList from '~/components/subscriberList';
import subscriberEditor from '~/components/subscriberEditor';

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
      subscriberId: null,
      showSubscriberEditor: false,
      isSubscriberEdit: false,
    };
  },

  async created() {
    await this.$store.dispatch('workflows/fetchSubscribers', $nuxt.$route.params.workflow_id);
  },

  computed: {
    subscribers: function () {
      return this.$store.state.workflows.subscribers;
    },

    subscriberOnFocus: function() {
      if (!this.subscriberId) {
        return { workflow_id: this.workflowId };
      }

      return _.find(this.$store.state.workflows.subscribers, { _id: this.subscriberId });
    }
  },

  methods: {
    /*
     * Workflow Card
     */
    onDeleteSubscriber: function() {
      this.subscriberId = null;
      this.showSubscriberEditor = false;
    },

    onCreateSubscriber: function() {
      this.subscriberId = null;
      this.isSubscriberEdit = false;
      this.showSubscriberEditor = true;
    },

    onEditSubscriber: function(subscriber) {
      this.subscriberId = subscriber._id;
      this.isSubscriberEdit = true;
      this.showSubscriberEditor = true;
    },
    
    onCloseSubscriberEditor: function() {
      this.subscriberId = null;
      this.showSubscriberEditor = false;
    },
  },

  layout: 'dashboard',
  middleware: 'auth',
  components: { subscriberList, subscriberEditor },
}
</script>
