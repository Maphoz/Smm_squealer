<!-- ButtonComponent.vue -->
<template>
  <button :class="{ 'active': active }" @click="handleClick">
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
button {
  width: 100%;
  padding: 10px 20px;
  cursor: pointer;
  background-color: lightgray;
  border: 2px solid lightgray;
  font-size: inherit;
  border-radius: 10px;
  color: lightgray;
  font-weight: 600;
}

.active {
  background: black;
  border: 2px solid black; 
  color: white;

  &:hover{
    background-color: white;
    color: black;
    transition: 0.3s ease-in-out;
  }
}
</style>
