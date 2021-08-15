import { createStore } from "vuex";

const store = createStore({
  state: {
    info: {
      agent_id: null,
      agent_name: null,
      agent_surname: null,
      appointment_date: null,
      appointment_id: null,
      appointment_time: null,
      appointment_postcode: null,
      contact_email: null,
      contact_phone: null,
      contact_name: null,
      contact_surname: null,
      contact_id: null,
    },
    verificationPostcode: null,
  },
  mutations: {
    setPostcode(state, value) {
      state.info.appointment_postcode = value;
    },
  },
  actions: {},
  getters: {},
  modules: {},
});

export default store;
