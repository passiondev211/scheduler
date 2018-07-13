<template>
  <div>
    <progressBar />
  </div>
</template>

<script>

import progressBar from '~/components/progressBar';

export default {
  name: 'signout',

  mounted() {
    this.signOut();
  },

  methods: {
    async signOut() {
      await this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },

  components: { progressBar },
}

</script>

<style>
</style>
