<template>
  <div class="card">
    <div class="card-header">
      <h4>Event List</h4>
      <div class="card-new-item">
        <a href="#" @click.prevent="onCreateEvent()">+</a>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in events" v-bind:key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ eventTypeName(event.type) }}</td>
              <td>
                <ul class="action-links">
                  <li><a href="#" @click.prevent="onEditEvent(event._id)">Edit</a></li>
                  <li><a href="#" @click.prevent="deleteEvent(event)">Delete</a></li>
                  <li><router-link :to="`/dashboard/workflows/${workflowId}/events/${event._id}`"><a>Message Nodes</a></router-link></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <progressBar v-if="showProgressBar" />
    <spModal title="Confirmation" v-if="showModal" :onClose="onModalClose" :onApprove="onModalApprove">
      <div slot="modal-body">
        <p>{{ modalText }}</p>
      </div>
    </spModal>
  </div>
  <!-- Workflow List Card Ends -->
</template>

<script>

import _ from 'lodash';

import spModal from '~/components/spModal';
import progressBar from '~/components/progressBar';
import eventType from '~/components/mixins/eventType';

export default {
  name: 'eventList',
  props: ['workflowId', 'onCreateEvent', 'onEditEvent', 'onDeleteEvent'],
  mixins: [ eventType ],

  data: () => {
    return {
      showProgressBar: false,
      showModal: false,
      modalAction: '',
      modalData: null,
    };
  },

  computed: {
    modalText: function() {
      switch (this.modalAction) {
        case 'delete':
          return 'Are you sure you want to remove the event entry?';
        default:
          return '';
      }
    },

    events: function() {
      return this.$store.state.workflows.events;
    },
  },

  methods: {
    onModalClose: function() {
      this.showModal = false;
      this.modalAction = null;
    },

    onModalApprove: async function() {
      this.showModal = false;
      this.showProgressBar = true;

      try {
        switch (this.modalAction) {
          case 'delete':
            if (this.onDeleteEvent) {
              this.onDeleteEvent();
            }     
            await this.$store.dispatch('workflows/deleteEvent', this.modalData);

            break;
        }
      } catch (err) {
        console.log(err);
      }

      this.showProgressBar = false;
      this.modalAction = null;
    },

    /**
     * modal actions
     */
    deleteEvent: function(event) {
      this.modalData = event;
      this.modalAction = 'delete';
      this.showModal = true;
    },
  },

  components: { progressBar, spModal },
}

</script>