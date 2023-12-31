const form = document.querySelector("form");
const table = document.querySelector("table");
const localStorageKey = "shopItem";
const baseurl =
  "https://crudcrud.com/api/e379a2d3bafe41cb88eb6f8a763ea847/shopItems";

form.addEventListener("submit", handleFormSubmit);
const tableBody = document.querySelector(".table-body");

window.onload = () => showData();

function showData() {
  axios(baseurl).then((res) => {
    const data = res.data;
    if (!data || !data.length) return;

    table.style.display = "table";
    data.forEach((item) => {
      const newtrElement = maketrElement(
        item.name,
        item.description,
        item.price,
        item.quantity,
        item._id
      );
      tableBody.appendChild(newtrElement);
    });
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const data = e.target;
  let name = data.name.value;
  let description = data.description.value;
  let price = data.price.value;
  let quantity = data.quantity.value;

  const newtrElementId = await putDataInServer(
    name,
    description,
    price,
    quantity
  );

  table.style.display = "table";
  const newtrElement = maketrElement(
    name,
    description,
    price,
    quantity,
    newtrElementId
  );
  tableBody.appendChild(newtrElement);

  data.name.value = "";
  data.description.value = "";
  data.price.value = "";
  data.quantity.value = "";
}
function putDataInServer(name, description, price, quantity) {
  const obj = {
    name,
    description,
    price,
    quantity,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(baseurl, obj)
      .then((res) => resolve(res.data._id))
      .catch((err) => console.log(err));
  });
}

function maketrElement(name, description, price, quantity, newtrElementId) {
  const trElement = makeElement("tr", null, ["table-row"]);
  const thElement = makeElement("th", "#");
  thElement.scope = "row";
  const tdName = makeElement("td", name, ["name", "text-capitalize"]);
  const tdDescription = makeElement("td", description, [
    "text-capitalize",
    "description",
  ]);
  const tdPrice = makeElement("td", price, ["price"]);
  const tdQuantity = makeElement("td", quantity, ["quantity"]);
  const tdForBtn = makeElement("td");
  const byu1Btn = makeElement("button", "Buy-1", [
    "btn",
    "btn-primary",
    "m-1",
    "buy-1",
  ]);
  const byu2Btn = makeElement("button", "Buy-2", [
    "btn",
    "btn-primary",
    "m-1",
    "buy-2",
  ]);
  const byu3Btn = makeElement("button", "Buy-3", [
    "btn",
    "btn-primary",
    "m-1",
    "buy-3",
  ]);

  const button = [byu1Btn, byu2Btn, byu3Btn];
  button.forEach((item) => {
    item.addEventListener("click", handleRemoveEdit);
    tdForBtn.appendChild(item);
  });

  const trElementBody = [
    thElement,
    tdName,
    tdDescription,
    tdPrice,
    tdQuantity,
    tdForBtn,
  ];
  trElementBody.forEach((item) => {
    trElement.appendChild(item);
  });

  trElement.id = newtrElementId;
  return trElement;
}
function makeElement(ele, text, arr = []) {
  const element = document.createElement(ele);
  for (let item of arr) {
    element.classList.add(item);
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}
function handleRemoveEdit(e) {
  let element = e.target;
  const buyQuantity = element.classList[3].split("-")[1];
  while (element && element.parentNode) {
    element = element.parentNode;
    if (element.className.indexOf("table-row") !== -1) break;
  }

  let quantityElement = element.querySelector(".quantity");
  let availableQuantity = quantityElement.textContent;
  if (availableQuantity >= buyQuantity) {
    availableQuantity -= buyQuantity;
    if (availableQuantity == 0) {
      axios.delete(baseurl + "/" + element.id).catch((err) => console.log(err));
      element.remove();
      return;
    }

    quantityElement.textContent = availableQuantity;
    const name = element.querySelector(".name").textContent;
    const description = element.querySelector(".description").textContent;
    const price = element.querySelector(".price").textContent;
    const obj = {
      name,
      description,
      price,
      quantity: availableQuantity,
    };
    axios.put(baseurl + "/" + element.id, obj).catch((err) => console.log(err));
    return;
  }

  alert("Buying quantity exceed");
}
