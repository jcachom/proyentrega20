const form = document.getElementById("registerform");
const texterror = document.getElementById("texterror");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json" },
  })
    .then((result) => result.json())
    .then((json) => {
      texterror.innerHTML = json.message;
    });
});
