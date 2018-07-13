<template>
  <div class="card">
    <div class="card-header">
      <h4>Subscribers' List</h4>
      <div class="card-new-item">
        <a href="#" @click.prevent="onCreateSubscriber()">+</a>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Entrance Slug</th>
              <th>Email</th>
              <th>Phone #</th>
              <th>Facebook Messenger ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subscriber, index) in subscribers" v-bind:key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ subscriber.entranceSlug }}</td>
              <td><a :href="`mailto:` + subscriber.email">{{ subscriber.email }}</a></td>
              <td>{{ subscriber.phone_number }}</td>
              <td>{{ subscriber.facebook_messenger_id }}</td>
              <td>
                <ul class="action-links">
                  <li><a href="#" @click.prevent="onEditSubscriber(subscriber)">Edit</a></li>
                  <li><a href="#" @click.prevent="deleteSubscriber(subscriber)">Delete</a></li>
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

import spModal from '~/components/spModal';
import progressBar from '~/components/progressBar';

export default {
  name: 'subscriberList',
  props: [ 'subscribers', 'onEditSubscriber', 'onCreateSubscriber', 'onDeleteSubscriber' ],

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
          return 'Are you sure you want to remove the subscriber?';
        default:
          return '';
      }
    }
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
            if (this.onDeleteWorkflow) {
              this.onDeleteWorkflow();
            }
            await this.$store.dispatch('workflows/deleteSubscriber', this.modalData);

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
    deleteSubscriber: function(subscriber) {
      this.modalData = subscriber;
      this.modalAction = 'delete';
      this.showModal = true;
    },
  },

  components: { progressBar, spModal },
}

</script>