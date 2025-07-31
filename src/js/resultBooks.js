import "../scss/style.scss";

import { getBookDetail, getGenre } from "./api.js";

function createItem(book) {
  let divBooks = document.createElement("li");
  divBooks.classList = "liClass";

  let autor = document.createElement("h3");
  autor.classList = "autorClass";
  autor.innerText = book.authors.map((author) => author.name).join(",");

  let bookName = document.createElement("h1");
  bookName.classList = "bookNameClass";
  bookName.innerText = book.title;

  divBooks.appendChild(autor);
  divBooks.appendChild(bookName);
  document.querySelector(".divUl").appendChild(divBooks);

  divBooks.addEventListener("click", async () => {
    const getDetail = await getBookDetail(book);
    let checkP = document.getElementById("descriptionP");
    if (checkP != null) {
      checkP.parentNode.removeChild(checkP);
    }
    let description = document.getElementById("description");
    let descriptionPara = document.createElement("p");
    descriptionPara.id = "descriptionP";
    description.appendChild(descriptionPara);

    divBooks.appendChild(descriptionPara);
    if (getDetail.description?.value == undefined) {
      return (descriptionPara.innerHTML = "descrizione non disponibile");
    } else descriptionPara.innerText = getDetail.description?.value;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const queryString = window.location.search;
  const URLparam = new URLSearchParams(queryString);
  const genreValue = URLparam.get("genre");
  let response = await getGenre(genreValue);
  for (let book of response) {
    createItem(book);
  }
});
