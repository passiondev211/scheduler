import Vue from 'vue';
import VeeValidate from 'vee-validate';

VeeValidate.Validator.extend('number', {
  getMessage: (field) => `The ${field} is not a valid number.`,
  validate: (value) => /^-?[0-9]+$/.test(String(value))
});

Vue.use(VeeValidate);
