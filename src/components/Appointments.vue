<template>
  <table class="appointments">
    <tr class="appointments__header">
      <th class="appointments__title -btn">
        <button
          class="appointments__btn -clear"
          @click="clearFilter"
          v-if="isSorted"
        >
          Clear Filter
        </button>
      </th>
      <th class="appointments__title appointments__flex" @click="sortDate">
        <span>Appointment Date</span>
        <img src="@/assets/svg/arrow-down.svg" alt="" />
      </th>
      <th class="appointments__title">Appointment Time</th>
      <th class="appointments__title">Appointment Postcode</th>
      <th class="appointments__title">
        <div @click="togglePopup" class="appointments__flex">
          <span>Agent Name </span>
          <img src="@/assets/svg/arrow-down.svg" alt="" />
        </div>
        <div v-if="popupActive" class="appointments__agents">
          <p
            @click="groupAgent(item.id)"
            class="appointments__agent"
            :key="item.id"
            v-for="item in agents"
          >
            {{ item.fields.agent_name + " " + item.fields.agent_surname }}
          </p>
        </div>
      </th>
      <th class="appointments__title">Agent Surname</th>
      <th class="appointments__title">Contact Name</th>
      <th class="appointments__title">Contact Surname</th>
      <th class="appointments__title">Contact Phone</th>
      <th class="appointments__title">Contact Email</th>
    </tr>
    <tr
      :key="item.id"
      v-for="item in data"
      class="appointments__item"
      :class="{ '-past': !item.isActive }"
    >
      <td class="appointments__info -btns">
        <button @click="deleteItem(item)" class="appointments__btn -delete">
          <img src="@/assets/svg/trash.svg" alt="" />
        </button>
        <button @click="editItem(item)" class="appointments__btn">
          <img src="@/assets/svg/edit.svg" alt="" />
        </button>
      </td>
      <td class="appointments__info">
        {{ item.appointment_date }}
      </td>
      <td class="appointments__info">
        {{ item.appointment_time }}
      </td>
      <td class="appointments__info">{{ item.appointment_postcode }}</td>
      <td class="appointments__info">{{ item.agent_name }}</td>
      <td class="appointments__info">
        {{ item.agent_surname }}
      </td>
      <td class="appointments__info">
        {{ item.contact_name }}
      </td>
      <td class="appointments__info">
        {{ item.contact_surname }}
      </td>
      <td class="appointments__info">
        {{ item.contact_phone }}
      </td>
      <td class="appointments__info">
        {{ item.contact_email }}
      </td>
    </tr>
  </table>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getData,
  deleteData,
  appointmentsURL,
  agentsURL,
} from "@/utils/request.js";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let agents = ref(null);
    let info = ref(null);
    let data = ref(null);
    let isSorted = ref(false);
    let popupActive = ref(false);

    function getAppointments(info) {
      const now = new Date().toISOString();
      data.value = info.map(
        (el) =>
          (el = {
            agent_id: el.fields.agent_id ? el.fields.agent_id[0] : "",
            agent_name: el.fields.agent_name ? el.fields.agent_name[0] : "",
            agent_surname: el.fields.agent_surname
              ? el.fields.agent_surname[0]
              : "",
            appointment_id: el.id ? el.id : "",
            isActive: el.fields.appointment_date
              ? el.fields.appointment_date < now
                ? false
                : true
              : "",
            iso_date: el.fields.appointment_date
              ? el.fields.appointment_date
              : "",
            appointment_date: el.fields.appointment_date
              ? el.fields.appointment_date.split("T")[0]
              : "",
            appointment_time: el.fields.appointment_date
              ? el.fields.appointment_date.slice(0, 16).split("T")[1]
              : "",
            appointment_postcode: el.fields.appointment_postcode
              ? el.fields.appointment_postcode
              : "",
            contact_email: el.fields.contact_email
              ? el.fields.contact_email.join(",")
              : "",
            contact_phone: el.fields.contact_phone
              ? el.fields.contact_phone.join(",")
              : "",
            contact_name: el.fields.contact_name
              ? el.fields.contact_name.join(",")
              : "",
            contact_surname: el.fields.contact_surname
              ? el.fields.contact_surname.join(",")
              : "",
            contact_id: el.fields.contact_id
              ? el.fields.contact_id.join(",")
              : "",
          })
      );
    }

    function groupAgent(id) {
      const grouped = info.value.filter((el) => el.fields.agent_id[0] === id);
      isSorted.value = true;
      getAppointments(grouped);
      togglePopup();
    }

    function togglePopup() {
      popupActive.value
        ? (popupActive.value = false)
        : (popupActive.value = true);
    }

    function clearFilter() {
      getAppointments(info.value);
      isSorted.value = false;
    }

    function sortDate() {
      isSorted.value = true;
      data.value.sort((a, b) => {
        if (a.iso_date < b.iso_date) {
          return -1;
        }
        if (a.iso_date > b.iso_date) {
          return 1;
        }
        return 0;
      });
    }

    function editItem(item) {
      store.state.info = item;
      router.push("/create");
    }

    async function deleteItem(item) {
      await deleteData(item.appointment_id);
      data.value.splice(data.value.indexOf(item), 1);
      console.log(item.appointment_id);
    }

    async function init() {
      agents.value = await getData(agentsURL);
      info.value = await getData(appointmentsURL);
      getAppointments(info.value);
    }

    onMounted(() => {
      init();
    });

    return {
      data,
      editItem,
      groupAgent,
      sortDate,
      agents,
      popupActive,
      togglePopup,
      isSorted,
      clearFilter,
      deleteItem,
    };
  },
};
</script>

<style lang="scss">
.appointments {
  overflow: auto;
  padding: 0 10px 0 260px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    &.-past {
      color: rgb(189, 182, 182);
      font-weight: 400;
    }
  }
  &__title {
    position: relative;
    width: 200px;
    text-align: left;
    padding: 10px;
    border-bottom: 3px solid $dark-color;
    padding-block: 15px;
    &.-btn {
      padding: 0;
      width: 115px;
      border: none;
    }
  }
  &__flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  &__info {
    width: 200px;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid rgb(199, 194, 194);
    &.-btns {
      display: flex;
      gap: 10px;
      width: 115px;
      padding: 0;
      border: none;
    }
  }
  &__btn {
    padding: 5px 10px;
    cursor: pointer;
    color: $light-color;
    background: $dark-color;
    border: none;
    border-radius: 3px;
    &:hover {
      transform: scale(0.98);
    }
    &.-clear {
      background: $info-color;
      width: 100px;
      height: 35px;
    }
  }
  &__agents {
    position: absolute;
    left: 0;
    right: 0;
    padding: 15px 45px 15px;
    color: $light-color;
    background: rgba(0, 0, 0, 0.9);
    top: 50px;
    border-radius: 3px;
  }
  &__agent {
    padding-block: 10px;
    cursor: pointer;
    &:nth-child(1),
    &:nth-child(2) {
      border-bottom: 1px solid $light-color;
    }
  }
}
</style>
