<template>
  <div class='landing'>
    <h1>Landing Page</h1>
    <Link />
  </div>
</template>

<script>
import Link from '@/components/Link';

export default {
  name: "Landing",
  data() {
    return {
      
    }
  },
  components: {
    Link
  },
  methods: {
  }
};
</script>

<style scoped>

.landing {
  margin: 0 auto;
}

</style>
