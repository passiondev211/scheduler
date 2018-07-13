import _ from 'lodash';

var mixin = {
  data: () => {
    return {
      eventTypes: [
        { type: 'item', displayName: 'Item' },
        { type: 'popup', displayName: 'Popup' },
        { type: 'albums', displayName: 'Album Sale' },
        { type: 'lives', displayName: 'Live Sale' },
      ]
    }; 
  },

  methods: {
    eventTypeName(type) {
      const tmp = _.find(this.eventTypes, { type: type });
      if (tmp) {
        return tmp.displayName;
      }

      return null;
    }
  },
}

export default mixin;
