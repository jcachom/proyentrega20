const form = document.getElementById("loginform");
const texterror = document.getElementById("texterror");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json" },
  })
    .then((result) => result.json())

    .then((json) => {
      if (json.status == "succes") {
        console.log(json.user);
        location.href =
          "http://localhost:8080/products?email=" +
          json.user.email +
          "&rol=" +
          json.user.rol;
      } else {
        texterror.innerHTML = json.message;
      }
    });
});
