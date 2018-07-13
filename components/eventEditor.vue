<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ eventOnFocus._id ? 'Edit Event' : 'New Event' }}</h4>
    </div>
    <div class="card-body">
      <form class="form-horizontal">
        <div class="form-group row" v-if="eventOnFocus._id">
          <label class="col-sm-2 form-control-label">ID</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="event._id" readonly>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Type</label>
          <div class="col-sm-10">
            <select class="form-control" name="type" v-model="event.type" v-validate="'required'">
              <option value="">Select Type</option>
              <option v-for="(val, index) in eventTypes" v-bind:key="index" :value="val.type">{{ val.displayName }}</option>
            </select>
            <div class="error" v-show="errors.has('type')">{{ errors.first('type') }}</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <div class="col-sm-4 offset-sm-2">
            <button type="submit" class="btn btn-secondary" @click.prevent="closeEventEditor" v-if="onCloseEventEditor">Cancel</button>
            <button type="submit" class="btn btn-primary" @click.prevent="saveEvent">Save</button>
          </div>
        </div>
      </form>
    </div>
    <progressBar v-if="showProgressBar" />
  </div>
</template>

<script>

import progressBar from '~/components/progressBar';
import eventType from '~/components/mixins/eventType';

export default {
  name: 'eventEditor',
  props: [ 'eventOnFocus', 'onCloseEventEditor' ],
  mixins: [ eventType ],

  data: () => {
    return {
      showProgressBar: false,
    };
  },

  computed: {
    event: function() {
      return _.clone(this.eventOnFocus, true);
    }
  },

  methods: {
    closeEventEditor: function() {
      if (this.onCloseEventEditor) {
        this.onCloseEventEditor();
      }
    },
    
    saveEvent: async function() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          try {
            this.showProgressBar = true;

            if (this.eventOnFocus._id) {
              await this.$store.dispatch('workflows/updateEvent', this.event);          
            } else {
              await this.$store.dispatch('workflows/createEvent', this.event);
            }
          } catch (err) {
            console.log(err);
          }

          this.showProgressBar = false;
          this.closeEventEditor();
        }
      });
    }
  },

  components: { progressBar },
}

</script>
