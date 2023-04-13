 

document.querySelector("#logout").addEventListener("click", () => {
  try {
    const data = new FormData();
    // body:data,
    fetch("/api/sessions/logout", {
      method: "POST",

      headers: { "Content-type": "application/json" },
    })
      .then((result) => result.json())

      .then((json) => {
        if (json.status == "succes")
          location.href = "http://localhost:8080/login";
      });
  } catch (e) {
    return false;
  }
});
