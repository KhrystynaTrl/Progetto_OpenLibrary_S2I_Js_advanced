import axios from "axios";

const BASEURL = new URL(process.env.OPEN_LIBRARY_URL);

export async function getGenre(genre) {
  try {
    let getGenre = await axios.get(new URL(`subjects/${genre}.json`, BASEURL));
    if (getGenre.status >= 400) {
      throw new Error(
        `Chiamata con errore ${getGenre.status} - ${getGenre.statusText}`
      );
    }
    return getGenre.data?.works;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function getBookDetail(book) {
  try {
    let getDetail = await axios.get(new URL(`${book.key}.json`, BASEURL));
    if (getDetail.status >= 400) {
      throw new Error(
        `Errore nella chiamata ${getDetail.status} - ${getDetail.statusText}`
      );
    }
    return getDetail.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
