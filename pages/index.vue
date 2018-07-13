<template>
  <div>
    <progressBar />
  </div>
</template>

<script>

import progressBar from '~/components/progressBar';

export default {
  async fetch({ store }, context) {
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser"));

      if (authUser) {
        await store.dispatch('auth/setUser', authUser, { root: true });
      }
    } catch (e) {
    
    }
  },

  created() {
    if (this.$store.state.auth.authUser) {
      this.$router.push('/dashboard');
    }
    else {
      this.$router.push('/login');
    }
  },

  components: { progressBar },
}

</script>
