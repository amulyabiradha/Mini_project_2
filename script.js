const grid = document.getElementById("slotsGrid");
const message = document.getElementById("message");
const summaryList = document.getElementById("summaryList");
const clearBtn = document.getElementById("clearBookings");

const hours = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00"
];

async function loadSlots() {
  const res = await fetch("http://localhost:5000/bookings");
  const booked = await res.json();

  grid.innerHTML = "";
  summaryList.innerHTML = "";

  hours.forEach(hour => {
    const btn = document.createElement("button");
    btn.textContent = hour;
    btn.className = "slot-btn";

    if (booked.some(b => b.hour === hour)) {
      btn.disabled = true;
      const li = document.createElement("li");
      li.textContent = `Booked: ${hour}`;
      summaryList.appendChild(li);
    }

    btn.onclick = async () => {
      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hour })
      });

      const data = await res.json();
      message.textContent = data.message;
      loadSlots();
    };

    grid.appendChild(btn);
  });
}

clearBtn.onclick = async () => {
  await fetch("http://localhost:5000/clear", { method: "DELETE" });
  message.textContent = "All bookings cleared!";
  loadSlots();
};

loadSlots();
