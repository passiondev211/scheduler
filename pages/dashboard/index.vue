<template>
  <div>
  	<div class="breadcrumb-holder">
      <div class="container-fluid">
        <ul class="breadcrumb">
          <li class="breadcrumb-item active"><router-link :to="`/dashboard/`">Workflows</router-link></li>
        </ul>
      </div>
    </div>

    <section>
      <div class="container-fluid">
        <br/>
        <div class="row">
          <div class="col-lg-6">
            <workflowList
              :workflows="workflows"
              :onEditWorkflow="onEditWorkflow"
              :onCreateWorkflow="onCreateWorkflow"
              :onDeleteWorkflow="onDeleteWorkflow"
            />
          </div>

          <div class="col-lg-6">
            <workflowEditor
              v-if="showWorkflowEditor"
              :isEdit="isWorkflowEdit"
              :workflowOnFocus="workflowOnFocus"
              :onCloseWorkflowEditor="onCloseWorkflowEditor"
              :isCompact="true"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import workflowList from '~/components/workflowList';
import workflowEditor from '~/components/workflowEditor';

export default {
  async fetch({ store, redirect }) {
    if (!store.state.workflows.workflowLoaded) {
      try {
        await store.dispatch('workflows/fetchWorkflows');
      } catch(err) {
        await store.dispatch('auth/logout');
        redirect('/login');
      }
    }
  },

  data: () => {
    return {
      showWorkflowEditor: false,
      workflowOnFocus: null,
      isWorkflowEdit: false,
    };
  },

  computed: {
    workflows: function () {
      return this.$store.state.workflows.workflows;
    },
  },

  methods: {
    /*
     * Workflow Card
     */
    onDeleteWorkflow: function() {
      this.showWorkflowEditor = false;
    },

    onCreateWorkflow: function() {
      this.workflowOnFocus = {};
      this.isWorkflowEdit = false;
      this.showWorkflowEditor = true;
    },

    onEditWorkflow: function(workflow) {
      this.workflowOnFocus = workflow;
      this.isWorkflowEdit = true;
      this.showWorkflowEditor = true;
    },
    
    onCloseWorkflowEditor: function() {
      this.showWorkflowEditor = false;
    },
  },

  layout: 'dashboard',
  middleware: 'auth',
  components: { workflowList, workflowEditor },
}

</script>
