<template>
<div class="modal-container">
    <div class="login-form">
        <div class="login-form-header">
            <h2>Login</h2>
            <button @click="$emit('close-modal')">
                <img src="../assets/close-button.svg" alt="Close modal" />
            </button>
        </div>
        <form @submit.prevent="doLogin">
            <div class="login-form-item">
                <label>Email</label>
                <input v-model="loginForm.email" />
            </div>
            <div class="login-form-item">
                <label>Password</label>
                <input v-model="loginForm.password" />
            </div>
            <div class="login-form-item">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
</div>
</template>

<script setup>
import { defineEmits, reactive } from "vue";

const emit = defineEmits(['do-login', 'close-modal']);

const loginForm = reactive({
    name: "",
    password: ""
});

function doLogin() {
    emit('do-login', loginForm);
}
</script>

<style scoped>
.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
}
.login-form-header button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.login-form-header button img {
  width: 20px;
}
.login-form-item {
  margin-bottom: 20px;
}
.login-form-item label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.login-form-item input,
.login-form-item select,
.login-form-item textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 300px;
}
.login-form-item button {
  background: #4caf50;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>