function initPagamenti() {
  const endpoint = "https://script.google.com/macros/s/AKfycbzQTF83hQlB69kYuyN5VRWi_nh-kqjgKzwO8Yj-m5AdfrMZJONRb4IXOxKm6ThD34ExGw/exec";

  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      console.log("[RMS] CONFIG ricevuto:", data);
      document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      document.getElementById("output").textContent = "Errore: " + error;
    });
}