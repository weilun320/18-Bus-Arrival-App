const busStopIdInput = document.getElementById("bus-stop-id");
const arrivalInfo = document.getElementById("arrival-info");
const totalBuses = document.getElementById("total-buses");
let intervalId = null;

async function fetchBusArrival(busStopId) {
  const response = await fetch(`https://sg-bus-arrivals.sigma-schoolsc1.repl.co/?id=${busStopId}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  else {
    throw new Error("Error fetching bus arrival data.");
  }
}

function formatArrivalData(arrivalData) {
  const buses = arrivalData.services;
  const formattedData = [];
  for (const bus of buses) {
    const arrivalTimeString = bus.next_bus_mins <= 0 ? "Arriving" : `${bus.next_bus_mins} min(s)`;
    formattedData.push(`
      <div>
        <strong>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
      </div>
    `);
  }

  formattedData.push(`
    <div id="total-buses">${buses.length} buses</div>
  `);

  return formattedData.join("");
}

function displayBusArrival(busStopId) {
  arrivalInfo.innerHTML = "Loading...";

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    fetchBusArrival(busStopId)
    .then(arrivalData => { 
      const formattedArrivalData = formatArrivalData(arrivalData);
      arrivalInfo.innerHTML = formattedArrivalData;
    })
    .catch(error => {
      console.error("Error:", error);
    })
  }, 5000);
}

function getBusTiming() {
  const busStopId = busStopIdInput.value;

  displayBusArrival(busStopId);
}
