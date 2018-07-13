<template>
  <div>
    <section>
      <div id="gjs"></div>
    </section>
    <progressBar v-if="showProgressBar" />
    <spModal title="Save the form?" v-if="showModal" :onClose="onModalClose" :onApprove="onModalApprove">
      <div slot="modal-body">
        <form>
          <div class="form-group">
            <label for="entranceSlug">Registration URL</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">{{ baseURL }}</span>
              </div>
              <input id="entranceSlug" type="text" placeholder="Registration URL" class="form-control" v-model="workflow.entranceSlug">
            </div>
          </div>
        </form>
      </div>
    </spModal>
  </div>
</template>

<script>

import _ from 'lodash';

import progressBar from '~/components/progressBar';
import spModal from '~/components/spModal';

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
      showProgressBar: false,
      showModal: false,
      editor: null,
    };
  },

  computed: {
    workflowOnFocus: function() {
      return _.find(this.$store.state.workflows.workflows, { _id: this.workflowId });
    },
    
    workflow: function() {
      return _.clone(this.workflowOnFocus, true);
    },

    baseURL: function() {
      return `${window.location.protocol}//${window.location.host}/subscribe/`;
    }
  },

  methods: {
    onModalClose: function() {
      this.showModal = false;
    },

    onModalApprove: async function() {
      var $parent = this;
      
      $parent.showModal = false;
      $parent.showProgressBar = true;

      try {  
        this.workflow.regForm = $parent.editor.getHtml() + `<style>${$parent.editor.getCss()}</style>`;
        await $parent.$store.dispatch('workflows/updateWorkflow', this.workflow);
      } catch (err) {
        console.log(err);
      }

      $parent.showProgressBar = false;
    },
  },

  mounted() {
    var $parent = this;

    // mounting grapesjs email template
    $parent.editor = grapesjs.init({
      container : '#gjs',
    });

    var pnm = $parent.editor.Panels;
    pnm.addButton('options', [{
      id: 'save',
      className: 'fa fa-save',
      command: 'save',
      attributes: { title: 'Save'}
    }]);

    var cmdm = $parent.editor.Commands;
    cmdm.add('save', {
      run: function(editor, sender) {
        sender.set('active', 0);
        $parent.showModal = true;
      }
    });

    $parent.editor.setComponents(this.workflow.regForm);
  },

  layout: 'dashboard',
  middleware: 'auth',
  components: { progressBar, spModal },
}

</script>
