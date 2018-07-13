<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ isEdit ? 'Edit Workflow' : 'New Workflow' }}</h4>
    </div>
    <div class="card-body">
      <form class="form-horizontal">
        <div class="form-group row" v-if="isEdit">
          <label class="col-sm-2 form-control-label">ID</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="workflow._id" readonly>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Title</label>
          <div class="col-sm-10">
            <input type="text" name="title" class="form-control" v-model="workflow.title" v-validate="'required'">
            <div class="error" v-show="errors.has('title')">{{ errors.first('title') }}</div>
          </div>
        </div>
        <div class="form-group row" v-if="!isEdit">
          <label class="col-sm-2 form-control-label">Type</label>
          <div class="col-sm-10">
            <select class="form-control" name="eventType" v-model="eventType" v-validate="'required'">
              <option value="">Select Type</option>
              <option v-for="(val, index) in eventTypes" v-bind:key="index" :value="val.type">{{ val.displayName }}</option>
            </select>
            <div class="error" v-show="errors.has('eventType')">{{ errors.first('eventType') }}</div>
          </div>
        </div>
        <div class="form-group row" v-if="isEdit && onCloseWorkflowEditor">
          <div class="col-sm-2"></div>
          <div class="col-sm-10">
            <div class="i-checks">
              <input id="chkActive" name="active" type="checkbox" v-model="workflow.active" class="form-control-custom">
              <label for="chkActive">Publish</label>
            </div>
          </div>
        </div>
        <div class="form-group row" v-if="isEdit">
          <div class="col-sm-2"></div>
          <div class="col-sm-10">
            <router-link :to="`/dashboard/workflows/${workflow._id}/editRegForm`"><a>Edit Registration Form</a></router-link> | <a :href="regFormLink" class="slug-link" target="_blank"> Preview</a>
          </div>
        </div>
        <div class="form-group row" v-if="isEdit">
          <div class="col-sm-2"></div>
          <div class="col-sm-10">
            <router-link :to="`/dashboard/workflows/${workflow._id}/subscribers`"><a>View Subscribers</a></router-link>
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <div class="col-sm-4 offset-sm-2">
            <button type="submit" class="btn btn-secondary" @click.prevent="onCloseWorkflowEditor" v-if="onCloseWorkflowEditor">Cancel</button>
            <button type="submit" class="btn btn-primary" @click.prevent="saveWorkflow">Save</button>
            <button type="submit" class="btn btn-publish" @click.prevent="onPublish" v-if="!onCloseWorkflowEditor && !workflow.active">Publish</button>
          </div>
        </div>
      </form>
    </div>

    <progressBar v-if="showProgressBar" />
    <spModal title="Confirmation" v-if="showModal" :onClose="onModalClose" :onApprove="onModalApprove">
      <div slot="modal-body">
        <h3>Publish the workflow?</h3>
        <p><a :href="regFormLink" class="slug-link" target="_blank">{{ regFormLink }}</a></p>
      </div>
    </spModal>
  </div>
</template>

<script>

import _ from 'lodash';

import progressBar from '~/components/progressBar';
import eventType from '~/components/mixins/eventType';
import spModal from '~/components/spModal';

export default {
  name: 'workflowEditor',
  props: [ 'isEdit', 'workflowOnFocus', 'onCloseWorkflowEditor' ],
  mixins: [ eventType ],

  data: () => {
    return {
      showProgressBar: false,
      eventType: '',
      showModal: false,
      modalAction: '',
    };
  },

  computed: {
    workflow: function() {
      return _.clone(this.workflowOnFocus, true);
    },

    regFormLink: function() {
      return `${location.protocol}//${location.host}/subscribe/${this.workflow.entranceSlug}`;
    }
  },
  
  methods: {
    saveWorkflow: async function() {
      this.$validator.validateAll().then(async result => {
        if (result) { // validation check successful
          this.showProgressBar = true;

          try {            
            if (this.isEdit) {        
              await this.$store.dispatch('workflows/updateWorkflow', this.workflow);
            }
            else {
              this.workflow.eventType = this.eventType;
              const data = await this.$store.dispatch('workflows/createWorkflow', this.workflow);
              this.$nuxt.$router.replace({ path: `/dashboard/workflows/${data.workflow._id}` });
            }
          } catch (err) {
            console.log(err);
          }

          this.showProgressBar = false;
          if (this.onCloseWorkflowEditor) {
            this.onCloseWorkflowEditor();
          }
        }
      });
    },

    onModalClose: function() {
      this.showModal = false;
      this.modalAction = null;
    },

    onModalApprove: async function() {
      this.showModal = false;

      try {
        switch (this.modalAction) {
          case 'publish':
            this.showProgressBar = true;
            await this.$store.dispatch('workflows/updateWorkflow', _.merge(this.workflow, { active: true }));
            this.workflow.active = true;

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
    onPublish: function() {
      this.modalAction = 'publish';
      this.showModal = true;
    },
  },

  components: { progressBar, spModal },
}

</script>
