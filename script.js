const locations = [
  // {
  //   imgSrc: "/assets/Alpha.jpg",
  //   name: "Alfa Hall",
  //   coordinates: "10.6089950,7.4438740",
  // },
  // {
  //   imgSrc: "/assets/Mosgue.jpg",
  //   name: "Mosugu Hall",
  //   coordinates: "10.6088849,7.4441221",
  // },
  // {
  //   imgSrc: "/assets/1st.jpg",
  //   name: "FOS",
  //   coordinates: "10.6092039,7.4447061",
  // },
  {
    imgSrc: "assets/2nd.jpg",
    name: "FSMS",
    coordinates: "10.6096291,7.4450941",
  },
  {
    imgSrc: "assets/3rd.jpg",
    name: "FOC",
    coordinates: "10.6105679,7.4459480",
  },
  {
    imgSrc: "assets/IMG_0575.jpg",
    name: "Yisa Doko",
    coordinates: "10.60832° N, 7.44206° E",
  },
  {
    imgSrc: "assets/Hanger.jpg",
    name: "Hanger",
    coordinates: " 10.6091861,7.4429010",
  },
  {
    imgSrc: "assets/Amao.jpg",
    name: "Amao",
    coordinates: "10.61000° N,7.44024° E",
  },
  {
    imgSrc: "assets/lab.jpg",
    name: "300 LR",
    coordinates: "10.6089950,7.4438740",
  },
  {
    imgSrc: "assets/lost 1.jpg",
    name: "Arament1",
    coordinates: "10.6089950,7.4438740",
  },
  {
    imgSrc: "assets/lost 2.jpg",
    name: "Arament2",
    coordinates: "10.6089950,7.4438740",
  },
];

const locationsContainer = document.getElementById("locations");

locations.forEach((location) => {
  const locationDiv = document.createElement("div");
  locationDiv.className = "location";

  const img = document.createElement("img");
  img.src = location.imgSrc;
  img.alt = location.name;
  img.style.height = "100px";
  img.style.width = "200px";
  img.loading = "lazy";

  const button = document.createElement("button");
  button.className = "button";
  button.onclick = () => handleButtonClick(button, location.coordinates);
  button.innerHTML = `<span>${location.name}</span>`;

  const mapLink = document.createElement("a");
  mapLink.className = "mapLink";
  mapLink.href = "#";
  mapLink.target = "_blank";
  mapLink.innerText = "Get Directions";

  locationDiv.appendChild(img);
  locationDiv.appendChild(button);
  locationDiv.appendChild(mapLink);
  locationsContainer.appendChild(locationDiv);
});

function handleButtonClick(button, destination) {
  const buttonText = button.querySelector("span");
  const mapLink = button.nextElementSibling;
  buttonText.innerText = "Requesting Location...";
  button.dataset.original = buttonText.innerText;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(
          `Current Position: Latitude ${latitude}, Longitude ${longitude}`
        );
        mapLink.href = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
        mapLink.classList.add("visible");
        mapLink.click();
        buttonText.innerText = button.dataset.original;
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve your location. Please try again.");
        buttonText.innerText = button.dataset.original;
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
    buttonText.innerText = button.dataset.original;
  }
}

function toggleMode() {
  const body = document.body;
  const toggleButton = document.querySelector(".toggle-button");
  body.classList.toggle("light-mode");
  body.classList.toggle("dark-mode");
  toggleButton.innerHTML = body.classList.contains("dark-mode") ? "🌙" : "☀️";
}

function filterLocations(event) {
  const searchTerm = event.target.value.toLowerCase();
  const locationDivs = document.querySelectorAll(".location");
  locationDivs.forEach((div) => {
    const name = div.querySelector("span").innerText.toLowerCase();
    if (name.includes(searchTerm)) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  });
}

function updateTimestamp() {
  const timestampElement = document.getElementById("timestamp");
  const now = new Date();
  const formattedTime = now.toLocaleString();
  timestampElement.innerText = `Current Time: ${formattedTime}`;
}

async function checkVPN() {
  try {
    const response = await fetch(
      "https://ipinfo.io/json?token=YOUR_TOKEN_HERE"
    );
    const data = await response.json();
    console.log("IP Information:", data);
    if (data.org && data.org.includes("VPN")) {
      alert(
        "It seems you are using a VPN. Location accuracy might be affected."
      );
    }
  } catch (error) {
    console.error("Error checking IP information:", error);
  }
}

window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
    document.body.classList.toggle("light-mode", savedTheme === "light");
    document.querySelector(".toggle-button").innerHTML =
      savedTheme === "dark" ? "🌙" : "☀️";
  }
  checkVPN();
  const debugMode = true;
  if (debugMode) {
    console.log("Debug Info: ", { locations, savedTheme });
  }
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").then(
        (registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        },
        (error) => {
          console.error("Service Worker registration failed:", error);
        }
      );
    });
  }
};
