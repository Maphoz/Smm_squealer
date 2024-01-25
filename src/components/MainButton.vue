<!-- ButtonComponent.vue -->
<template>
  <button :class="{ 'active': active }" @click="handleClick" :disabled="active ? false : true">
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  props: {
    onClick: Function,
    buttonText: String,
    active: Boolean,
  },
  methods: {
    handleClick() {
      if (this.onClick) {
        this.onClick();
      }
    },
  },
};
</script>

<style scoped>
@import url('../style/theme.css');
button {
  width: 100%;
  padding: 10px 20px;
  cursor: pointer;
  background-color: lightgray;
  font-size: inherit;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  border: 2px solid lightgray;
}

.active {
  background: #ff3385;
  color: white;
  border: 2px solid #ff3385;   
}

.active:hover {
    background: white;
    color: #ff3385;
    border: 2px solid #ff3385;    
    transition: background 0.3s ease-in-out;
    transition: color 0.1s ease-in-out;
  }

</style>
