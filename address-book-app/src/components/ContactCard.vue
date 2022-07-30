<template>
  <div class="contact" :class="contact.private && 'private'">
    <button class="delete-contact"
      v-if="userStore.isLogged"
      @click="deleteContact(contact.id)"
    >
      <img src="../assets/delete-button.svg" alt="Delete contact" />
    </button>
    <h2 class="contact-title">{{ fullName }}</h2>
    <div class="contact-address">
      {{ fullAddress }}
    </div>
    <div class="contact-contact">
      {{ contact.email }} {{ contact.phone }}
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { defineProps, defineEmits, computed } from "vue";

const userStore = useUserStore();

const emit = defineEmits(['delete-contact']);

const props = defineProps({
  contact: {
    type: Object,
    required: true,
  }
});

function deleteContact(contactId) {
  emit("delete-contact", contactId);
}

const fullName = computed(() => {
  return props.contact.name + ' ' + props.contact.lastName;
});

const fullAddress = computed(() => {
  return props.contact.address + ' ' + props.contact.city + ' - ' + props.contact.zip + ' - ' + props.contact.state + ' ' + props.contact.country;
});
</script>

<style scoped>
.contact {
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px;
  border-radius: 4px;
  position: relative;
  text-align: left;
}
.contact.private {
  background-color: #f5f5f5;
}
.contact-title {
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 10px;
}
.contact-address {
  font-size: 18px;
}
.contact-contact {
  font-size: 16px;
}
.contact-info {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.contact-info-label {
  font-weight: bold;
  margin-right: 5px;
}
.delete-contact {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.delete-contact img {
  width: 20px;
}
</style>
