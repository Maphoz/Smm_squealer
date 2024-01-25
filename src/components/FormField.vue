<template>
  <div :style="{ width: fieldWidth }" :class="{ 'is-focused': isFocused, 'has-error': error }" class="field">
    <input
      v-model="internalValue"
      :placeholder="name"
      :type="password ? 'password' : 'text'"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <label>{{ name }}</label>
    <div v-if="error" class="error-text">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  props: {
    width: String,
    name: String,
    inputName: String,
    value: [String, Number],
    error: Boolean,
    errorMessage: String,
    password: Boolean
  },
  data() {
    return {
      isFocused: false,
      internalValue: this.value,
      myKey: this.inputName
    };
  },
  computed: {
    fieldWidth() {
      return this.width || "300px";
    },
  },
  watch: {
    value(newValue) {
      // Update internalValue when the value prop changes
      this.internalValue = newValue;
    },
  },
  methods: {
    handleInput() {
      this.$emit("update:value", {key: this.myKey, value: this.internalValue})
    },
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      this.isFocused = false;
    },
  },
};
</script>

<style scoped>
.field {
  position: relative;
  height: 40px;
  line-height: 80px;
  margin-bottom: 40px;
}

.field input {
  position: absolute;
  width: 100%;
  outline: none;
  font-size: 18px;
  padding: 0 15px;
  line-height: 40px;
  border-radius: 10px;
  transition: 0.2s ease;
  z-index: 5;
  border: 2px solid black;
  box-sizing: border-box;


  &:not(:placeholder-shown) + label,
  &:focus + label {
    color: #ff3385;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    transform: translate(-15px, -15px) scale(0.88);
    z-index: 6;
    background: white;
  }

  &:not(:placeholder-shown)::placeholder,
  &:focus::placeholder {
    color: transparent;
  }

  &:focus {
    border: 2px solid #ff3385;
  }

  &:focus ::placeholder{
    color: transparent;
  }
  &:not(:placeholder-shown)::placeholder {
    color: transparent;
  }
}

.field label {
  position: absolute;
  font-size: 20px;
  color: white;
  padding: 0 15px;
  margin: 0 20px;
  transition: 0.2s ease;
}

.field.is-focused input {
  border: 2px solid #ff3385;
}

.field.has-error input,
.field.has-error input:focus {
  border: 2px solid red;
}

.error-text {
  font-size: 0.9em;
  color: red;
  margin-left: 15px;
  padding-top: 15px;
}
</style>
