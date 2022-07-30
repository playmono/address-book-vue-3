<template>
  <div class="contact-list">
    <div v-for="contact in contactList" :key="contact.id">
      <ContactCard :contact="contact" v-on:delete-contact="deleteContact" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import ContactCard from "./ContactCard.vue";

const emit = defineEmits(['delete-contact']);

defineProps({
  contactList: {
    type: Array,
    required: true,
  }
});

function deleteContact(contactId) {
  emit("delete-contact", contactId);
}
</script>

<style scoped>
.error {
  color: red;
  margin-bottom: 20px;
}
.contact-list {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
