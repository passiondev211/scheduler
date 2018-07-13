<template>
  <div class="page login-page">
    <div class="container">
      <div class="form-outer text-center d-flex align-items-center">
        <div class="form-inner">
          <div class="logo text-uppercase">
            <strong class="text-primary">Shoppe Scheduler</strong>
          </div>
          <form @submit.prevent="login">
            <div class="form-group-material form-group-material--no-margin" v-show="formError">
              <div class="error">{{ formError }}</div>
            </div>
            <div class="form-group-material">
              <input type="text" name="username" class="input-material" v-model="loginForm.username" v-validate="'required'" placeholder="Username">
              <div class="error" v-show="errors.has('username')">{{ errors.first('username') }}</div>
            </div>
            <div class="form-group-material">
              <input type="password" name="password" class="input-material" v-model="loginForm.password" v-validate="'required'" placeholder="Password">
              <div class="error" v-show="errors.has('password')">{{ errors.first('password') }}</div>
            </div>
            <button class="btn btn-primary" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>

    <progressBar v-if="showProgressBar" />
  </div>
</template>

<script>

import progressBar from '~/components/progressBar';

export default {
  data: () => {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      formError: '',
      showProgressBar: false,
    };
  },

  async fetch({ store }, context) {
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser"));

      if (authUser) {
        await store.dispatch('auth/setUser', authUser, { root: true });
      }
    } catch (err) {
      console.log(err);
    }
  },

  created() {
    if (this.$store.state.auth.authUser) {
      this.$router.push('/dashboard');
    }
  },

  methods: {
    login() {
      try {
        this.$validator.validateAll().then(async result => {
          if (result) {
            this.showProgressBar = true;
            const response = await this.$store.dispatch('auth/login', this.loginForm);
            this.showProgressBar = false;

            if (response.success) {
              this.$nuxt.$router.replace({ path: '/dashboard' });
            }
            else {
              this.formError = response.error.error_message;
            }
          }
        });
      } catch (err) {
        this.formError = 'Unexpected error occured!';
        console.log(err);
      }
    }
  },

  components: { progressBar },
}

</script>

<style>
</style>
