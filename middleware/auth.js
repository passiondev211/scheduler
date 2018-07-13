export default function ({ store, error }) {
  if (!store.state.auth.authUser) {
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser"));

      if (authUser) {
        store.dispatch('auth/setUser', authUser, { root: true });
        return;
      }
    } catch (e) {
      
    }

    error({
      message: 'You are not connected',
      statusCode: 403,
    });
  }
}
