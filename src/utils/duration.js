import store from "@/store";
const timeRgx = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default function calculateDuration(info) {
  if (timeRgx.test(store.state.info.appointment_time)) {
    let appointment_time = store.state.info.appointment_time.split(":");
    let appointmentMinute =
      Number(appointment_time[0]) * 60 + Number(appointment_time[1]);
    let duration = info.duration.text.split(" ");
    let durationMinute =
      duration.length > 2
        ? Number(duration[0]) * 60 + Number(duration[2])
        : Number(duration[0]);
    let exitMinute =
      appointmentMinute - durationMinute < 0
        ? 24 * 60 + (appointmentMinute - durationMinute)
        : appointmentMinute - durationMinute;
    let returnMinute = appointmentMinute + durationMinute + 60;

    function addZero(value) {
      if (value < 10) {
        return `0${value}`;
      } else {
        return value;
      }
    }

    return {
      exitTime: `${addZero(Math.floor((exitMinute / 60) % 24))}:${addZero(
        exitMinute % 60
      )}`,
      returnTime: `${addZero(Math.floor((returnMinute / 60) % 24))}:${addZero(
        returnMinute % 60
      )}`,
    };
  }
}
