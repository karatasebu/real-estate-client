// Airtable Request
const baseURL = "https://api.airtable.com/v0/";
const applicationId = "appgykZBGTF92MnHu";
const appKey = import.meta.env.VITE_APP_KEY;
const appointmentsURL = `${baseURL}${applicationId}/Appointments/?api_key=${appKey}`;
const agentsURL = `${baseURL}${applicationId}/Agents/?api_key=${appKey}`;
const contactsURL = `${baseURL}${applicationId}/Contacts/?api_key=${appKey}`;

async function getData(url) {
  const data = await fetch(url);
  const info = await data.json();

  return info.records;
}

async function sendData(url, data) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
}

async function updateData(url, data) {
  await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
}

// Postcode Request
const postcodeURL = "https://api.postcodes.io/postcodes/";

async function getLocation(postcode) {
  const data = await fetch(postcodeURL + postcode);
  const info = await data.json();

  return info;
}

export {
  getData,
  getLocation,
  sendData,
  updateData,
  appointmentsURL,
  postcodeURL,
  agentsURL,
  contactsURL,
};
