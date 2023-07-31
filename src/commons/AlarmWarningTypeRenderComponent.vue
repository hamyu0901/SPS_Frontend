<template>
  <div>
    <span v-if="params.value"><img class="mt-2" src="@/images/warning_t.png"/></span>
    <span v-else><img class="mt-2" src="@/images/warning_f.png"/></span>
  </div>

</template>
<script>
    export default {
    data: function () {
      return {
      };
    },
    beforeMount() {
    },
    mounted() {},
    methods: {},
  };
</script>