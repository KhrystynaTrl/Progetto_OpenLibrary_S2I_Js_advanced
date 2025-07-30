import "../scss/style.scss";

let form = document.getElementById("form");
let input = document.getElementById("input");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let inputValue = input.value;
  window.location.href = "resultBooks.html?genre=" + inputValue;
});
