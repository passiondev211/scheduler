import _ from 'lodash';

var mixin = {
  data: () => {
    return {
      offsets: [
        { offset: -15, displayName: '15 minutes beforehand' },
        { offset: 0, displayName: 'Event start' },
        { offset: -60, displayName: '1 hour beforehand' },
        { offset: -60 * 24, displayName: '24 hours beforehand' },
        { offset: 15, displayName: '15 minutes after' },
        { offset: 60, displayName: '1 hour after' },
        { offset: 6 * 60, displayName: '6 hours after' },
        { offset: 24 * 60, displayName: '24 hours after' },
      ]
    }; 
  },

  methods: {
    offsetName(offset) {
      const tmp = _.find(this.offsets, { offset: offset });
      if (tmp) {
        return tmp.displayName;
      }

      if (offset < 0) {
        return `${offset} minutes beforehand`;
      }

      return `${offset} minutes after`;
    },

    isPredefinedOffset: function(offset) {
      const tmp = _.find(this.offsets, { offset: offset });
      if (tmp) {
        return true;
      }

      return false;
    },
  },
}

export default mixin;