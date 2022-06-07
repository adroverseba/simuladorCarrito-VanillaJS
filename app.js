const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCart = document.getElementById("template-cart").content;
const fragment = document.createDocumentFragment();
let cart = {};

// configuro un evento para que se dispare cuando el doc html a sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  fetchData();

  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    printCart();
  }
});

cards.addEventListener("click", (e) => {
  addCart(e);
});

items.addEventListener("click", (e) => {
  btnAction(e);
});

// simulador peticion fetch de los productos
const fetchData = async () => {
  try {
    const res = await fetch("./api.json");
    const data = await res.json();
    printCards(data);
  } catch (err) {
    console.log(err);
  }
};

const printCards = (data) => {
  data.forEach((product) => {
    console.log(product);
    templateCard
      .querySelector(".card-body .card-img-top")
      .setAttribute("src", product.thumbnailUrl);
    templateCard.querySelector(".card .card-body h5").textContent =
      product.title;
    templateCard.querySelector(".card .card-body span").textContent =
      product.precio;
    templateCard.querySelector(".card-body button").dataset.id = product.id;

    const cloneNode = templateCard.cloneNode(true);
    fragment.appendChild(cloneNode);
  });
  cards.appendChild(fragment);
  console.log(fragment);
};

const addCart = (e) => {
  // console.log(e.target);
  // console.log(e.target.classList.contains("btn-dark"));
  if (e.target.classList.contains("btn-dark")) {
    setCart(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCart = (objeto) => {
  // console.log(objeto);
  const product = {
    id: objeto.querySelector("button").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p span").textContent,
    cantidad: 1,
  };

  if (cart.hasOwnProperty(product.id)) {
    product.cantidad = cart[product.id].cantidad + 1;
  }
  // si no existe la siguiente propiedad, lo que hago es crearla
  cart[product.id] = { ...product };

  printCart();
  // console.log(Object.keys(cart));
};

const printCart = () => {
  // console.log(cart);
  items.innerHTML = "";
  Object.values(cart).forEach((product) => {
    templateCart.querySelector("th").textContent = product.id;
    templateCart.querySelectorAll("td")[0].textContent = product.title;
    templateCart.querySelectorAll("td")[1].textContent = product.cantidad;
    templateCart.querySelector(".btn-info").dataset.id = product.id;
    templateCart.querySelector(".btn-danger").dataset.id = product.id;
    templateCart.querySelector("span").textContent =
      product.cantidad * product.precio;

    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  printFooter();

  localStorage.setItem("cart", JSON.stringify(cart));
};

const printFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `;
    return;
  }

  const nCantidad = Object.values(cart).reduce(
    (preValue, { cantidad }) => preValue + cantidad,
    0
  );
  const nPrecio = Object.values(cart).reduce(
    (preValue, { precio, cantidad }) => preValue + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnDelete = document.getElementById("vaciar-carrito");
  btnDelete.addEventListener("click", () => {
    cart = {};
    printCart();
  });
};

const btnAction = (e) => {
  // console.log(e.target);
  if (e.target.classList.contains("btn-info")) {
    //add  item
    // console.log(cart[e.target.dataset.id]);
    cart[e.target.dataset.id].cantidad++;
    printCart();
  }
  //remove item
  if (e.target.classList.contains("btn-danger")) {
    cart[e.target.dataset.id].cantidad--;
    if (cart[e.target.dataset.id].cantidad == 0) {
      delete cart[e.target.dataset.id];
    }
    printCart();
  }

  e.stopPropagation();
};
