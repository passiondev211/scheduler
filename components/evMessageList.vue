<template>
  <div class="card">
    <div class="card-header">
      <h4>Message Nodes</h4>
      <div class="card-new-item">
        <a href="#" @click.prevent="onCreateEventMessage()">+</a>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Time Offset</th>
              <th>Type</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(eventMessage, index) in event_messages" v-bind:key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ offsetName(eventMessage.send_time_offset) }}</td>
              <td>{{ eventMessage.type }}</td>
              <td>{{ compactMessage(eventMessage.message) }}</td>
              <td>
                <ul class="action-links">
                  <li>{{ eventMessage.is_sent ? 'Sent' : 'Pending' }}</li>
                  <li><a href="#" @click.prevent="toggleEvMessageState(eventMessage)">Toggle</a></li>
                </ul>
              </td>
              <td>
                <ul class="action-links">
                  <li><a href="#" @click.prevent="onEditEventMessage(eventMessage._id)">Edit</a></li>
                  <li><a href="#" @click.prevent="deleteEventMessage(eventMessage)">Delete</a></li>
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
</template>

<script>

import spModal from '~/components/spModal';
import progressBar from '~/components/progressBar';
import timeOffset from '~/components/mixins/timeOffset';

export default {
  name: 'evMessageList',
  props: ['eventId', 'onCreateEventMessage', 'onEditEventMessage', 'onDeleteEventMessage'],
  mixins: [ timeOffset ],

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
          return 'Are you sure you want to remove the event message entry?';
        case 'toggle-state':
          return `Are you sure you want to toggle the status of the event notification?`;
        default:
          return '';
      }
    },
    
    event_messages: function() {
      if (this.$store.state.workflows.eventLoaded) {
        return _.find(this.$store.state.workflows.events, { _id: this.eventId }).event_messages;
      }

      return [];
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
            if (this.onDeleteEventMessage) {
              this.onDeleteEventMessage();
            }

            await this.$store.dispatch('workflows/deleteEventMessage', 
              {
                eventId: this.eventId,
                eventMessage: this.modalData,
              });

            break;
          case 'toggle-state':
            this.modalData.is_sent = !this.modalData.is_sent;

            await this.$store.dispatch('workflows/updateEventMessage', {
                eventId: this.eventId,
                eventMessage: this.modalData,
              });

            break;
          default:
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
    deleteEventMessage: function(event_message) {
      this.modalData = event_message;
      this.modalAction = 'delete';
      this.showModal = true;
    },

    compactMessage: function(old) {
      var maxLength = 50;
      var trimmedString = old.length > maxLength ? 
        old.substring(0, maxLength - 3) + "..." : 
        old;

      return trimmedString;
    },

    toggleEvMessageState: function(evMessage) {
      this.modalData = _.clone(evMessage, true);
      this.modalAction = 'toggle-state';
      this.showModal = true;
    }
  },

  components: { progressBar, spModal },
}

</script>
