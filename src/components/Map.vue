<template>
  <div class="map">
    <p>Select an appointment location from map.</p>
    <div class="map__container">
      <div
        ref="mapRef"
        style="width: 650px; height: 450px; position: absolute"
      ></div>
    </div>
    <div
      class="map__route"
      v-if="store.state.verificationPostcode && tripInfo !== null"
    >
      <p class="map__info -info">
        <span class="map__title">Address:</span>
        <span>{{ tripInfo.address }}</span>
      </p>
      <p class="map__info -info">
        <span class="map__title">Distance:</span>
        <span>{{ tripInfo.distance }}</span>
      </p>
      <p class="map__info -info">
        <span class="map__title">Duration:</span>
        <span>{{ tripInfo.duration }}</span>
      </p>
      <p class="map__info -info" v-if="tripInfo.exitTime">
        <span class="map__title">Leave time:</span>
        <span>{{ tripInfo.exitTime }}</span>
      </p>
      <p class="map__info -info" v-if="tripInfo.returnTime">
        <span class="map__title">Arrive time:</span>
        <span>{{ tripInfo.returnTime }}</span>
      </p>
      <p class="map__info -warning" v-if="!tripInfo.exitTime">
        To learn more about trip, enter appointment time in the form.
      </p>
    </div>
    <p
      class="map__info -danger"
      v-if="store.state.verificationPostcode === false"
    >
      Invalid postcode or not in UK.
    </p>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch, reactive } from "vue";
import { useStore } from "vuex";
import { Loader } from "@googlemaps/js-api-loader";
import { getLocation } from "@/utils/request";
import calculateDuration from "@/utils/duration";

export default {
  setup() {
    const store = useStore();
    const mapKey = import.meta.env.VITE_MAP_KEY;
    const loader = new Loader({ apiKey: mapKey });
    const mapRef = ref(null);
    let realEstateLoc = ref(null);
    let appointmentLoc = ref(null);
    let tripInfo = ref(null);
    let appointmentPostcode = computed(() => {
      return store.state.info.appointment_postcode;
    });
    const map = reactive({
      canvas: null,
      directionsDisplay: null,
      directionsService: null,
      geocoder: null,
      route: null,
    });

    async function initMap() {
      await loader.load();
      map.directionsDisplay = new google.maps.DirectionsRenderer();
      map.directionsService = new google.maps.DirectionsService();
      map.geocoder = new google.maps.Geocoder();
      const realEstate = await getLocation("cm27pj");
      realEstateLoc.value = {
        lat: realEstate.result.latitude,
        lng: realEstate.result.longitude,
      };
      map.canvas = new google.maps.Map(mapRef.value, {
        center: realEstateLoc.value,
        zoom: 8,
        mapTypeId: "roadmap",
      });

      map.canvas.addListener("click", async ({ latLng: { lat, lng } }) => {
        appointmentLoc.value = { lat: lat(), lng: lng() };
        map.route = {
          origin: realEstateLoc.value,
          destination: appointmentLoc.value,
          travelMode: "DRIVING",
        };

        map.geocoder.geocode({ location: appointmentLoc.value }, (result) => {
          let postcode = result[0].address_components.filter(
            (el) => el.types[0] === "postal_code"
          );
          store.commit("setPostcode", postcode[0].long_name);
        });
        setDirection();
      });
    }

    watch(appointmentPostcode, (currentVal) => {
      async function checkPostcode() {
        const data = await getLocation(currentVal);
        if (data.status === 200) {
          store.state.verificationPostcode = true;
          map.route = {
            origin: realEstateLoc.value,
            destination: {
              lat: data.result.latitude,
              lng: data.result.longitude,
            },
            travelMode: "DRIVING",
          };
          setDirection();
        } else {
          store.state.verificationPostcode = false;
          map.directionsDisplay.setMap(null);
        }
      }
      checkPostcode();
    });

    function setDirection() {
      map.directionsService.route(map.route, (result) => {
        const routeInfo = result.routes[0].legs[0];
        const duration = calculateDuration(routeInfo);
        tripInfo.value = {
          address: routeInfo.end_address,
          distance: routeInfo.distance.text,
          duration: routeInfo.duration.text,
          exitTime: duration ? duration.exitTime : "",
          returnTime: duration ? duration.returnTime : "",
        };
        map.directionsDisplay.setDirections(result);
        map.directionsDisplay.setMap(map.canvas);
      });
    }

    onMounted(() => {
      initMap();
    });

    return {
      mapRef,
      appointmentLoc,
      tripInfo,
      store,
    };
  },
};
</script>

<style lang="scss">
.map {
  margin-top: 40px;
  width: 650px;
  &__container {
    width: 650px;
    height: 450px;
    margin-block: 15px;
  }
  &__info {
    margin-bottom: 10px;
    color: $light-color;
    padding: 5px 10px;
    border-radius: 2px;
    &.-danger {
      width: fit-content;
      background: $danger-color;
    }
    &.-warning {
      background: $warning-color;
    }
    &.-info {
      border-left: 5px solid $info-color;
      color: $dark-color;
    }
  }
  &__title {
    display: inline-block;
    width: 100px;
  }
}
</style>
