
export const Events = {

  listeners: {},

  on(event, callback) {
    if( !this.listeners[event] ) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);

    return this;
  },

  off(event, callback = null) {
    if( !this.listeners[event] ) {
      return;
    }

    if( callback ) {
      const index = this.listeners[event].indexOf(callback);
      this.listeners[event].splice(index, 1);
      return;
    }

    this.listeners[event].pop();

    return this;
  },

  trigger(event, ...params) {
    if( !this.listeners[event] ) {
      return;
    }

    this.listeners[event].forEach(callback => {
      callback.apply(this, params);
    });

    return this;
  }
};
