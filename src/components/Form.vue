<template>
  <div class="form">
    <form ref="formRef" @submit.prevent="sendForm">
      <div class="form__item">
        <label class="form__label" for="contact_name">Contact Name</label>
        <input
          v-model="store.state.info.contact_name"
          class="form__input"
          type="text"
          name="contact_name"
          autocomplete="off"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="contact_surname">Contact Surname</label>
        <input
          v-model="store.state.info.contact_surname"
          class="form__input"
          type="text"
          name="contact_surname"
          autocomplete="off"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="contact_email">Contact Email</label>
        <input
          v-model="store.state.info.contact_email"
          class="form__input"
          type="email"
          name="contact_email"
          autocomplete="off"
          placeholder="example@gmail.com"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="contact_phone">Contact Phone</label>
        <input
          v-model="store.state.info.contact_phone"
          class="form__input"
          type="tel"
          name="contact_phone"
          autocomplete="off"
          placeholder="535 576 89 29"
          pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="appointment_date"
          >Appointment Date</label
        >
        <input
          v-model="store.state.info.appointment_date"
          class="form__input"
          type="text"
          name="appointment_date"
          autocomplete="off"
          placeholder="2021-03-26, 2024-11-05..."
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="appointment_time"
          >Appointment Time</label
        >
        <input
          v-model="store.state.info.appointment_time"
          class="form__input"
          type="text"
          name="appointment_time"
          autocomplete="off"
          placeholder="12:40, 23:05..."
          pattern="^([01]\d|2[0-3]):([0-5]\d)$"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="appointment_postcode"
          >Appointment Postcode
        </label>
        <input
          v-model="store.state.info.appointment_postcode"
          class="form__input"
          type="text"
          name="appointment_postcode"
          autocomplete="off"
          required
        />
      </div>
      <div class="form__item">
        <label class="form__label" for="agent_id">Agent</label>
        <select class="form__input" name="agent_id" required>
          <option class="form__option" selected disabled>Select Agent</option>
          <option
            :selected="store.state.info.agent_id === item.id"
            class="form__option"
            :key="item.id"
            :value="item.id"
            v-for="item in agents"
            r
          >
            {{ item.fields.agent_name + " " + item.fields.agent_surname }}
          </option>
        </select>
      </div>
      <button class="form__btn" type="submit">
        {{ store.state.info.appointment_id ? "Update" : "Create" }}
      </button>
    </form>
    <div
      v-if="popup.isActive"
      class="form__popup"
      :class="popup.isSuccess ? '-success' : '-danger'"
    >
      <p>
        {{ !popup.isSuccess ? "Invalid Postcode" : "Saved" }}
      </p>
      <img
        class="form__popup-btn"
        @click="closePopup"
        src="@/assets/svg/close.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
import { useStore } from "vuex";
import {
  getData,
  sendData,
  updateData,
  contactsURL,
  agentsURL,
  appointmentsURL,
} from "@/utils/request";

export default {
  setup() {
    const store = useStore();
    const formRef = ref(null);
    let agents = ref(null);
    let popup = reactive({
      isSuccess: null,
      isActive: false,
    });

    async function getAgents() {
      agents.value = await getData(agentsURL);
    }

    async function sendForm() {
      if (store.state.verificationPostcode) {
        const formData = new FormData(formRef.value);
        const contactInfo = {
          fields: {
            contact_name: formData.get("contact_name"),
            contact_surname: formData.get("contact_surname"),
            contact_email: formData.get("contact_email"),
            contact_phone: formData.get("contact_phone"),
          },
        };

        if (!store.state.info.contact_id) {
          await sendData(contactsURL, contactInfo);
        } else {
          const uptadedContactInfo = {
            records: [
              {
                id: store.state.info.contact_id,
                fields: contactInfo.fields,
              },
            ],
          };
          await updateData(contactsURL, uptadedContactInfo);
        }

        const contacts = await getData(contactsURL);
        contacts.sort(function (a, b) {
          return a.createdTime < b.createdTime
            ? -1
            : a.createdTime > b.createdTime
            ? 1
            : 0;
        });
        const currentContact = contacts[contacts.length - 1];
        const appointmentInfo = {
          fields: {
            appointment_date: `${formData.get(
              "appointment_date"
            )}T${formData.get("appointment_time")}:00.000Z`,
            appointment_postcode: formData.get("appointment_postcode"),
            contact_id: store.state.info.contact_id
              ? [store.state.info.contact_id]
              : [currentContact.id],
            agent_id: [formData.get("agent_id")],
          },
        };
        if (!store.state.info.appointment_id) {
          await sendData(appointmentsURL, appointmentInfo);
        } else {
          const uptadedAppointmentInfo = {
            records: [
              {
                id: store.state.info.appointment_id,
                fields: appointmentInfo.fields,
              },
            ],
          };
          await updateData(appointmentsURL, uptadedAppointmentInfo);
        }
        reset();
        popup.isSuccess = true;
      } else {
        popup.isSuccess = false;
      }
      popup.isActive = true;
      setTimeout(() => {
        closePopup();
      }, 2000);
    }

    function closePopup() {
      popup.isActive = false;
    }

    function reset() {
      store.state.verificationPostcode = null;
      formRef.value.reset();
      store.state.info = Object.fromEntries(
        Object.entries(store.state.info).map(([k, v]) => [k, null])
      );
    }

    onMounted(() => {
      getAgents();
    });
    onBeforeUnmount(() => {
      reset();
    });

    return {
      sendForm,
      formRef,
      agents,
      store,
      popup,
      closePopup,
    };
  },
};
</script>

<style lang="scss" scoped>
.form {
  margin-top: 40px;
  &__item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 15px;
  }
  &__input {
    width: 400px;
    height: 30px;
    padding: 5px;
    &:focus {
      outline: none;
    }
  }
  &__option {
    @include font-size(16);
    margin-bottom: 5px;
  }
  &__btn {
    background: $dark-color;
    color: $light-color;
    padding: 10px 25px;
    border: none;
    border-radius: 5px;
    align-self: flex-end;
    cursor: pointer;
    &:active {
      transform: scale(0.95);
    }
  }
  &__popup {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 15px;
    font-weight: 700;
    color: $light-color;
    border-radius: 5px;
    top: 5px;
    left: 570px;
    &.-success {
      background: $success-color;
    }
    &.-danger {
      background: $danger-color;
    }
    &-btn {
      cursor: pointer;
    }
  }
}
</style>
