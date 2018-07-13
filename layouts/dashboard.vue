<template>
  <div>
    <!-- Side Navbar -->
    <nav class="side-navbar">
      <div class="side-navbar-wrapper">
        <!-- Sidebar Header -->
        <div class="sidenav-header d-flex align-items-center justify-content-center">
          <!-- User Info-->
          <div class="sidenav-header-inner text-center">
            <img v-bind:alt="Person" class="img-fluid rounded-circle" v-bind:src="authUser.avatar" v-if="authUser.avatar">
            <h2 class="h5">{{ authUser.name }}</h2><span>Shoppe Seller</span>
          </div>
          
          <!-- Small Brand information, appears on minimized sidebar-->
          <div class="sidenav-header-logo">
            <router-link to="/dashboard" class="brand-small text-center"><strong class="text-primary">S</strong></router-link>
          </div>
        </div>
        
        <!-- Sidebar Navigation Menus-->
        <div class="main-menu">
          <ul id="side-main-menu" class="side-menu list-unstyled">
            <li>
              <a href="#nav_workflows" aria-expanded="false" data-toggle="collapse">
                <i class="icon-interface-windows"></i>My Workflows
              </a>
              <ul id="nav_workflows" class="collapse list-unstyled">
                <router-link v-for="workflow in workflows" v-bind:key="workflow._id" :to="`/dashboard/workflows/` + workflow._id" tag="li"><a>{{ workflow.title }}</a></router-link>
              </ul>
            </li>
            <router-link to="/logout" tag="li"><a><i class="fa fa-sign-out"></i>Logout</a></router-link>
          </ul>
        </div>
      </div>

      <a id="toggle-btn" href="#" class="menu-btn"><i class="icon-bars"></i></a>
    </nav>
    
    <div class="page">      
      <nuxt/>
    </div>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      authUser: this.$store.state.auth.authUser,
    }
  },

  computed: {
    workflows: function () {
      return this.$store.state.workflows.workflows;
    },
  },

  mounted() {
    /**
     * Custom Scrollbar
     */
    if ($(window).outerWidth() > 992) {
      $(window).on("load",function(){
        $("nav.side-navbar").mCustomScrollbar({
          scrollInertia: 200
        });
      });
    }

    /**
     * Side Navbar Functionality
     */
    $('#toggle-btn').on('click', function (e) {
      e.preventDefault();

      if ($(window).outerWidth() > 1194) {
        $('nav.side-navbar').toggleClass('shrink');
        $('.page').toggleClass('active');
      } else {
        $('nav.side-navbar').toggleClass('show-sm');
        $('.page').toggleClass('active-sm');
      }
    });
  },

  middleware: 'auth',
}

</script>

<style>
</style>
