<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ isEdit ? 'Edit Subscriber' : 'New Subscriber' }}</h4>
    </div>
    <div class="card-body">
      <form class="form-horizontal">
        <div class="form-group row" v-if="isEdit">
          <label class="col-sm-2 form-control-label">ID</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="subscriber._id" readonly>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Entrance Slug</label>
          <div class="col-sm-10">
            <input type="text" name="entranceSlug" class="form-control" v-model="subscriber.entranceSlug" v-validate="'required'">
            <div class="error" v-show="errors.has('entranceSlug')">{{ errors.first('entranceSlug') }}</div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Email</label>
          <div class="col-sm-10">
            <input type="text" name="email" class="form-control" v-model="subscriber.email" v-validate="'required'">
            <div class="error" v-show="errors.has('email')">{{ errors.first('email') }}</div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Phone #</label>
          <div class="col-sm-10">
            <input type="text" name="phone_number" class="form-control" v-model="subscriber.phone_number">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 form-control-label">Facebook Messenger ID</label>
          <div class="col-sm-10">
            <input type="text" name="facebook_messenger_id" class="form-control" v-model="subscriber.facebook_messenger_id">
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <div class="col-sm-4 offset-sm-2">
            <button type="submit" class="btn btn-secondary" @click.prevent="onCloseSubscriberEditor" v-if="onCloseSubscriberEditor">Cancel</button>
            <button type="submit" class="btn btn-primary" @click.prevent="saveSubscriber">Save</button>
          </div>
        </div>
      </form>
    </div>
    <progressBar v-if="showProgressBar" />
  </div>
</template>

<script>

import progressBar from '~/components/progressBar';

export default {
  name: 'subscriberEditor',
  props: [ 'isEdit', 'subscriberOnFocus', 'onCloseSubscriberEditor' ],
  
  data: () => {
    return {
      showProgressBar: false,
    };
  },

  computed: {
    subscriber: function() {
      return _.clone(this.subscriberOnFocus, true);
    }
  },

  methods: {
    saveSubscriber: async function() {
      this.$validator.validateAll().then(async result => {
        if (result) { // validation check successful
          this.showProgressBar = true;

          try {
            if (this.isEdit) {        
              await this.$store.dispatch('workflows/updateSubscriber', this.subscriber);
            }
            else {
              await this.$store.dispatch('workflows/createSubscriber', this.subscriber);          
            }
          } catch (err) {
            console.log(err);
          }

          this.showProgressBar = false;
          if (this.onCloseSubscriberEditor) {
            this.onCloseSubscriberEditor();
          }
        }
      });
    }
  },

  components: { progressBar },
}

</script>
