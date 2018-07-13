<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ eventMessageOnFocus._id ? 'Edit Event Message' : 'New Event Message' }}</h4>
    </div>
    <div class="card-body">
      <form class="form-horizontal">
        <div class="form-group row" v-if="eventMessageOnFocus._id">
          <label class="col-sm-2 form-control-label">ID</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="eventMessage._id" readonly>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Type</label>
          <div class="col-sm-10">
            <select class="form-control" name="type" v-model="eventMessage.type" v-validate="'required'">
              <option value="">Select Type</option>
              <option value="email">Email</option>
              <option value="sms">Sms</option>
              <option value="facebook_messenger">Facebook Messenger</option>
            </select>
            <div class="error" v-show="errors.has('type')">{{ errors.first('type') }}</div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Time Offset</label>
          <div class="col-sm-10">
            <select class="form-control" name="send_time_offset" v-model="eventMessage.send_time_offset" v-on:change="onChangeOffset">
              <option value="" selected>Custom Offset</option>
              <option v-for="(val, index) in offsets" v-bind:key="index" :value="val.offset">{{ val.displayName }}</option>
            </select>
          </div>
        </div>
        <div class="form-group row" v-if="isCustomOffset">
          <label class="col-sm-2 form-control-label"></label>
          <div class="col-sm-10">
            <input type="number" class="form-control" name="custom_offset" v-model="custom_offset" v-validate="'required'">
            <div class="error" v-show="errors.has('custom_offset')">{{ errors.first('custom_offset') }}</div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Message</label>
          <div class="col-sm-10">
            <textarea name="message" class="form-control" v-model="eventMessage.message" v-validate="'required'"></textarea>
            <div class="error" v-show="errors.has('message')">{{ errors.first('message') }}</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <div class="col-sm-4 offset-sm-2">
            <button type="submit" class="btn btn-secondary" @click.prevent="closeEventMessageEditor" v-if="onCloseEventMessageEditor">Cancel</button>
            <button type="submit" class="btn btn-primary" @click.prevent="saveEventMessage">Save</button>
          </div>
        </div>
      </form>
    </div>

    <progressBar v-if="showProgressBar" />
  </div>
</template>

<script>

import _ from 'lodash';

import progressBar from '~/components/progressBar';
import timeOffset from '~/components/mixins/timeOffset';

export default {
  name: 'evMessageEditor',
  props: [ 'eventId', 'eventMessageOnFocus', 'onCloseEventMessageEditor' ],
  mixins: [ timeOffset ],

  data: () => {
    return {
      showProgressBar: false,
      isCustomOffset: false,
      custom_offset: 0,
    };
  },

  created: function() {
    this.resetCustomOffset();
  },

  watch: {
    eventMessage: function() {
      this.resetCustomOffset();
    }
  },

  computed: {
    eventMessage: function() {
      return _.clone(this.eventMessageOnFocus, true);
    },
  },

  methods: {
    closeEventMessageEditor: function() {
      if (this.onCloseEventMessageEditor) {
        this.onCloseEventMessageEditor();
      }
    },

    saveEventMessage: async function() {
      this.$validator.validateAll().then(async result => {
        if (result) { // validation check successful
          this.showProgressBar = true;

          try {
            if (this.isPredefinedOffset(this.eventMessage.send_time_offset)) {
              this.custom_offset = this.eventMessage.send_time_offset;
            }

            if (this.eventMessageOnFocus._id) {
              await this.$store.dispatch('workflows/updateEventMessage', {
                eventId: this.eventId,
                eventMessage: _.merge(this.eventMessage, { send_time_offset: this.custom_offset }),
              });
            }
            else {
              await this.$store.dispatch('workflows/createEventMessage', {
                eventId: this.eventId,
                eventMessage: _.merge(this.eventMessage, { send_time_offset: this.custom_offset }),
              });              
            }
          } catch (err) { }

          this.showProgressBar = false;
          this.closeEventMessageEditor();
        }
      });
    },

    onChangeOffset: function() {
      this.isCustomOffset = this.eventMessage.send_time_offset === '';
    },

    resetCustomOffset: function() {
      if (!this.isPredefinedOffset(this.eventMessage.send_time_offset)) {
        this.custom_offset = this.eventMessage.send_time_offset;
        this.eventMessage.send_time_offset = '';
      }

      this.onChangeOffset();
    }
  },

  components: { progressBar },
}
</script>
