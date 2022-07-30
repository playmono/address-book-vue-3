<template>
  <div id="app">
    <div class="header">
      <div class="left">
        <img class="logo" alt="UOC logo" src="./assets/uoc-logo.png" />
        <div class="app-name">Address book</div>
      </div>
      <div class="right">
        <span class="user" v-if="userStore.isLogged">{{ userStore.getName }}</span>
        <button class="login-button" @click="toggleLoginForm" v-if="!userStore.isLogged">Login</button>
        <button class="logout-button" @click="doLogout" v-if="userStore.isLogged">Logout</button>
      </div>
    </div>
    <SearchBar v-on:showContactForm="toggleContactForm" v-on:search="setSearchTerm" />
    <ContactList
      :contactList="contactListFiltered"
      v-on:deleteContact="deleteContact"
    />
    <ContactForm
      v-on:addContact="addContact"
      v-on:closeModal="toggleContactForm"
      v-if="showContactModal"
    />
    <LoginForm
      v-if="showLoginModal"
      v-on:closeModal="toggleLoginForm"
      v-on:doLogin="doLogin"
    />
    <Transition>
      <div v-if="popupError" class="popup-danger">
        {{popupError}}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from 'axios';
import { useUserStore } from './store/user'
import LoginForm from "./components/LoginForm.vue"
import ContactForm from "./components/ContactForm.vue"
import ContactList from "./components/ContactList.vue"
import SearchBar from "./components/SearchBar.vue"

const userStore = useUserStore();

axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use((config) => {
  config.headers.Authorization = userStore.getToken
  return config
});

const contactList = ref([]);
const showContactModal = ref(false);
const searchTerm = ref("");
const popupError = ref("");
const showLoginModal = ref(false);

onMounted(() => {
  refreshContactList();
});

const contactListFiltered = computed(() => {
  if (!searchTerm.value) {
    return contactList.value;
  }
  return contactList.value.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  });
});

function toggleContactForm() {
  showContactModal.value = !showContactModal.value;
}

function toggleLoginForm() {
  showLoginModal.value = !showLoginModal.value;
}

function setSearchTerm(search) {
  searchTerm.value = search;
}

async function doLogin(loginForm) {
  const result = await performOperation(() => {
    return axios.post('/login', loginForm);
  });
  if (result === null) {
    return;
  }
  userStore.setUserData(result.data);
  toggleLoginForm();
  //refreshContactList(); reactive
}

function doLogout() {
  userStore.$reset();
  //refreshContactList(); reactive
}

async function addContact(contact) {
  const result = await performOperation(() => {
    return axios.post('/address', contact);
  });
  if (result === null) {
    return;
  }
  refreshContactList();
}

async function deleteContact(contactId) {
  const result = await performOperation(() => {
    return axios.delete('/address', { data: { id: contactId } })
  });
  if (result === null) {
    return;
  }
  refreshContactList();
}

async function refreshContactList() {
  const result = await performOperation(() => {
    return axios.get('/addresses');
  });
  if (result === null) {
    return;
  }
  contactList.value = result.data;
}

async function performOperation(callback) {
  try {
    setPopup('');
    const response = await callback();
    if (!response.data.error) {
      return response.data;
    }
    setPopup(response.data.message);
  } catch (error) {
    if (error.response.data === undefined) {
      setPopup('Server error');
      return null;
    }
    setPopup(error.response.data.message);
  }
  return null;
}

function setPopup(message) {
  popupError.value = message;

  if (message.length === 0) {
    return;
  }

  setTimeout(() => {
    popupError.value = "";
  }, 2000);
}

watch(
  () => userStore.isLogged,
  () => {
      refreshContactList();
  },
  { deep: true }
)
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}
.header {
  width: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  justify-content: space-between;
}
.header .left {
  display: flex;
  align-items: center;
}
.header .right {
  display: flex;
  align-items: center;
}
.header .logo {
  max-height: 50px;
}
.header .app-name {
  margin-left: 25px;
  font-weight: bold;
  font-size: 20px;
}
.header .user {
  display: flex;
}
.header .login-button,
.header .logout-button {
  background: #2c3e50;
  color: #fff;
  border: 0;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
}
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.popup-danger {
  background-color: #ff6565;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 500px;
  padding: 20px;
  border-radius: 5px;
  color: white;
  z-index: 9999;
  bottom: 150px;
}
v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
