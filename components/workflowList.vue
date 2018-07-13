<template>
  <div class="card">
    <div class="card-header">
      <h4>Workflow List</h4>
      <div class="card-new-item">
        <a href="#" @click.prevent="onCreateWorkflow()">+</a>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(workflow, index) in workflows" v-bind:key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td><router-link :to="`/dashboard/workflows/` + workflow._id"><a>{{ workflow.title }}</a></router-link></td>
              <td>
                <ul class="action-links">
                  <li>{{ workflow.active ? 'Active' : 'Inactive' }}</li>
                  <li><a href="#" @click.prevent="toggleWorkflowState(workflow)">{{ workflow.active ? 'Unpublish' : 'Publish' }}</a></li>
                </ul>
              </td>
              <td>
                <ul class="action-links">
                  <li><a href="#" @click.prevent="onEditWorkflow(workflow)">Edit</a></li>
                  <li><a href="#" @click.prevent="deleteWorkflow(workflow._id)">Delete</a></li>
                  <li><router-link :to="`/dashboard/workflows/${workflow._id}/subscribers`"><a>Subscribers</a></router-link></li>
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
  name: 'workflowList',
  props: [ 'workflows', 'onEditWorkflow', 'onCreateWorkflow', 'onDeleteWorkflow' ],
  
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
          return 'Are you sure you want to remove the workflow?';
        case 'toggle-state':
          return `Are you sure you want to update the status of the workflow?`;
        default:
          return '';
      }
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
            if (this.onDeleteWorkflow) {
              this.onDeleteWorkflow();
            }
            await this.$store.dispatch('workflows/deleteWorkflow', this.modalData);

            break;
          case 'toggle-state':
            this.modalData.active = !this.modalData.active;
            await this.$store.dispatch('workflows/updateWorkflow', this.modalData);

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
    deleteWorkflow: function(workflowId) {
      this.modalData = workflowId;
      this.modalAction = 'delete';
      this.showModal = true;
    },

    toggleWorkflowState: function(workflow) {
      this.modalData = _.clone(workflow, true);
      this.modalAction = 'toggle-state';
      this.showModal = true;
    },
  },

  components: { progressBar, spModal },
}

</script>