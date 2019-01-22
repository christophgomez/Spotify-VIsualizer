<template>
	<div id="nav">
      <router-link to="/visualizer">Visualizer</router-link>
      <router-link to="/system_settings">System</router-link>
    </div>
</template>

<script>
export default {
	name: 'Nav',
}
</script>

<style scoped>
#nav {
  padding: 25px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 30px;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
