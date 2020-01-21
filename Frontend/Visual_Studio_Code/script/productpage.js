const electron = require("electron");
const { ipcRenderer } = electron;
const { Pool } = require("pg");

const pool = new Pool({
  user: "korre",
  host: "178.118.60.226",
  database: "korredbtest",
  password: "Korre123",
  port: 5432
});

let drankProducts = [];
let snackProducts = [];
let andereProducts = [];
let allProducts = [];

let activeCategory = "Drank";
let activeUser;

let productsInTab = [];

let totalPriceGlobal = 0;
let totalQuantity = 0;

let gratisActive = false;
let happyActive = false;

//#region FUNCTIONS
const updateTotalPrice = function() {
  //let totalPrice = Number(document.querySelector('.tab-footer__price').innerHTML.substring(1));
  let totalPrice = 0;

  for (let product of productsInTab) {
    let id = product.prod_id;
    let name = product.prod_naam;
    let productID = name.substr(0, 3) + id;

    totalPrice += Number(
      document.querySelector(`.js-${productID}-price`).innerHTML.substr(1)
    );
  }

  document.querySelector(
    ".tab-footer__total"
  ).innerHTML = `€${totalPrice.toFixed(2)}`;
  totalPriceGlobal = totalPrice;
};

const changeTabProductQuantity = function(product, increase, reset = 0) {
  let productID = product.prod_naam.substr(0, 3) + product.prod_id;

  let productQuantity = Number(
    document.querySelector(`.js-${productID}-quantity`).innerHTML
  );

  console.log(
    document.querySelector(`.js-${productID}-price`).dataset.unitprice
  );
  let pricePerUnit = Number(
    document
      .querySelector(`.js-${productID}-price`)
      .dataset.unitprice.substr(1)
      .replace(",", ".")
  );

  if (increase) {
    productQuantity += 1;
    totalQuantity += 1;
  } else {
    productQuantity -= 1;
    totalQuantity -= 1;
  }

  if (productQuantity == 0 || reset == 1) {
    document
      .querySelector(`.tab-entry-container`)
      .removeChild(document.querySelector(`#tab-${productID}`));
    const index = productsInTab.indexOf(product);
    productsInTab.splice(index, 1);
    if (reset == 1) {
      totalQuantity -= productQuantity;
    }
  } else {
    console.log(productQuantity);
    console.log(pricePerUnit);
    let totalPrice = productQuantity * pricePerUnit;
    document.querySelector(`.js-${productID}-price`).innerHTML =
      "€" + totalPrice.toFixed(2);
    document.querySelector(
      `.js-${productID}-quantity`
    ).innerHTML = productQuantity;
  }

  if (totalQuantity == 1) {
    document.querySelector(
      ".tab-footer__quantity"
    ).innerHTML = `${totalQuantity} stuk`;
  } else {
    document.querySelector(
      ".tab-footer__quantity"
    ).innerHTML = `${totalQuantity} stuks`;
  }
  product.aantal = productQuantity;

  console.log(productsInTab);

  updateTotalPrice();
};

const addProductToTab = function(product) {
  console.log(product);
  let gratisProduct = {};

  if (gratisActive) {
    gratisProduct.prod_id = String(product.prod_id) + "gratis";
    gratisProduct.prod_verkoopprijs = 0;
    gratisProduct.prod_naam = "Gratis " + product.prod_naam;
    gratisProduct.cat_code = product.cat_code;
    gratisProduct.prod_happyprijs = product.prod_happyprijs;

    let allIDs = [];

    for (let i = 0; i < productsInTab.length; i++) {
      allIDs.push(productsInTab[i].prod_id);
    }

    if (allIDs.indexOf(gratisProduct.prod_id) >= 0) {
      console.log("iere");
      changeTabProductQuantity(gratisProduct, 1);
    } else {
      gratisProduct.aantal = 1;
      productsInTab.push(gratisProduct);
      showTabProduct(gratisProduct);
    }
    gratisActive = false;
  } else {
    if (productsInTab.indexOf(product) >= 0) {
      changeTabProductQuantity(product, 1);
    } else {
      product.aantal = 1;
      productsInTab.push(product);
      showTabProduct(product);
    }
  }
};

const deleteAllProducts = function() {
  productsInTab = [];
  totalQuantity = 0;
  totalPriceGlobal = 0;
  updateTotalPrice();
  document.querySelector(".tab-entry-container").innerHTML = "";
  document.querySelector(".tab-footer__quantity").innerHTML = "0 stuks";
};

const reset = function() {
  activeCategory = "Drank";
  activeUser = "";

  productsInTab = [];
  totalQuantity = 0;
  totalPriceGlobal = 0;

  gratisActive = false;
  happyActive = false;

  drankProducts = [];
  snackProducts = [];
  andereProducts = [];
  allProducts = [];

  document
    .querySelector(".category__button--active")
    .classList.remove("category__button--active");
  document
    .querySelector(".category--first")
    .firstElementChild.classList.add("category__button--active");

  document.querySelector(
    ".tab-container"
  ).innerHTML = `<header class="tab-header">
    <p class="tab-header__name">Naam</p>
    <div class="tab-header__quantity">#</div>
    <p class="tab-header__total">Totaal</p>
    <div class="tab-header__delete"></div>
  </header>
  <div class="tab-entry-container">
  </div>
  <footer class="tab-footer">
      <p class="tab-footer__name">Totaal</p>
      <div class="tab-footer__quantity">0 stuks</div>
      <p class="tab-footer__total">€0.00</p>
      <div class="tab-footer__delete">
          <button type="button" class="tab-footer__delete-button js-delete-all"> 
            <svg class="tab-footer__delete-icon" xmlns="http://www.w3.org/2000/svg" width="18.667" height="24" viewBox="0 0 18.667 24"><path id="ic_delete_24px" class="cls-1" d="M6.333,24.333A2.675,2.675,0,0,0,9,27H19.667a2.675,2.675,0,0,0,2.667-2.667v-16h-16Zm17.333-20H19L17.667,3H11L9.667,4.333H5V7H23.667Z" transform="translate(-5 -3)"/></svg>
          </button>
      </div>
    </footer>`;

  ipcRenderer.send("getActiveUser");
  getAllProducts();
  listenToDeleteAllButton();
};

//#endregion

//#region GET

const getAllProducts = function() {
  pool.query(
    "SELECT prod_id, prod_naam, prod_verkoopprijs, prod_happyprijs, prod_stockaantal, cat_code FROM producten INNER JOIN categorien ON cat_id_categorien = cat_id ORDER BY prod_volgorde",
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        let data = [];
        data = res.rows;
        console.log(data);

        for (let i = 0; i < data.length; i++) {
          if (data[i].cat_code == "DRANK") {
            drankProducts.push(data[i]);
          } else if (data[i].cat_code == "SNACKS") {
            snackProducts.push(data[i]);
          } else if (data[i].cat_code == "ANDERE") {
            andereProducts.push(data[i]);
          }
        }
        showProducts(drankProducts);

        allProducts = drankProducts.concat(snackProducts, andereProducts);
        console.log("All products: ");
        console.log(allProducts);
      }
    }
  );
};
//#endregion

//#region show

const showProducts = function(products) {
  let productsHMTL = "";

  for (let prod of products) {
    const price = String(prod.prod_verkoopprijs)
      .substring(2)
      .replace(",", ".");
    productsHMTL += `<button type="button" data-price="${price}" id="${prod.prod_naam
      .substr(0, 3)
      .replace("&", "n") + prod.prod_id}" class="product">${
      prod.prod_naam
    }</button>`;
  }
  document.querySelector(".products-container").innerHTML = productsHMTL;
  listenToProductButtons();
};

const showTabProduct = function(product) {
  console.log(product);
  const productName = product.prod_naam;
  const productID = productName.substr(0, 3) + product.prod_id;
  let productPrice;

  if (gratisActive) {
    productPrice = 0;
    gratisActive = false;
  } else if (happyActive) {
    productPrice = product.prod_happyprijs;
  } else {
    productPrice = product.prod_verkoopprijs;
  }

  document.querySelector(
    ".tab-entry-container"
  ).innerHTML += `<div id="tab-${productID}" class="tab-entry">
    <p class="tab-entry__name">${productName}</p>
    <div class="tab-entry__quantity">
      <button type="button" class="tab-entry__quantity-button js-min" productID=${productID}>
        <svg class="tab-entry__quantity-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23">
          <g id="Ellipse_1" data-name="Ellipse 1" class="icon1">
            <ellipse class="icon2" cx="12" cy="11.5" rx="12" ry="11.5"/>
            <ellipse class="icon3" cx="12" cy="11.5" rx="11" ry="10.5"/>
          </g>
          <path id="Path_11" data-name="Path 11" class="icon1" d="M0,0H11" transform="translate(6.5 11.5)"/>
        </svg> </button>
        <p class="tab-entry__quantity-number js-${productID}-quantity">0</p>
      <button type="button" class="tab-entry__quantity-button js-plus" productID=${productID}>
        <svg class="tab-entry__quantity-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23">
          <g id="Ellipse_1" data-name="Ellipse 1" class="icon1">
            <ellipse class="icon2" cx="12" cy="11.5" rx="12" ry="11.5"/>
            <ellipse class="icon3" cx="12" cy="11.5" rx="11" ry="10.5"/>
          </g>
          <path id="Path_11" data-name="Path 11" class="icon1" d="M0,0H11" transform="translate(6.5 11.5)"/>
          <path id="Path_12" data-name="Path 12" class="icon1" d="M0,0H11" transform="translate(12 6) rotate(90)"/>
        </svg>
      </button>
    </div>
    <p class="tab-entry__total js-${productID}-price" data-unitprice="${productPrice}">${productPrice}</p>
    <div class="tab-entry__delete">
    <button type="button" class="tab-entry__delete-button js-delete" productID="${productID}"> <svg class="tab-entry__delete-icon" xmlns="http://www.w3.org/2000/svg" width="18.667" height="24" viewBox="0 0 18.667 24">
      <path id="ic_delete_24px" class="cls-1" d="M6.333,24.333A2.675,2.675,0,0,0,9,27H19.667a2.675,2.675,0,0,0,2.667-2.667v-16h-16Zm17.333-20H19L17.667,3H11L9.667,4.333H5V7H23.667Z" transform="translate(-5 -3)"/>
    </svg>
    </button>
    </div>
  </div>`;

  changeTabProductQuantity(product, true);
  updateTotalPrice();
  listenToQuantityButtons();
  listenToDeleteButton();
};

//#endregion

//#region ListenTo

const listenToCategoryButtons = function() {
  let categoryButtons = document.querySelectorAll(".category__button");

  for (let categoryButton of categoryButtons) {
    categoryButton.addEventListener("click", function() {
      const category = categoryButton.innerHTML;
      console.log(category);
      const prevActive = document.querySelector(".category__button--active");

      prevActive.classList.remove("category__button--active");
      categoryButton.classList.add("category__button--active");

      document.querySelector(".products-container").innerHTML = "";
      activeCategory = category;

      if (category == "Drank") {
        showProducts(drankProducts);
      } else if (category == "Snacks") {
        showProducts(snackProducts);
      } else if (category == "Andere") {
        showProducts(andereProducts);
      }
    });
  }
};

const listenToProductButtons = function() {
  let productbuttons = document.querySelectorAll(".product");

  for (let productbutton of productbuttons) {
    productbutton.addEventListener("click", function() {
      if (productbutton.innerHTML == "Gratis") {
        gratisActive = true;
        console.log("gratis active");
      } else {
        let productID = productbutton.id.substr(3);
        let clickedProduct;
        console.log(productID);
        console.log(allProducts);

        for (let prod of allProducts) {
          if (prod.prod_id == productID) {
            clickedProduct = prod;
          }
        }
        console.log(clickedProduct);

        addProductToTab(clickedProduct);
      }
    });
  }
};

const listenToDeleteButton = function() {
  let deleteButtons = document.querySelectorAll(".js-delete");

  for (let button of deleteButtons) {
    button.addEventListener("click", function() {
      let productID = button.getAttribute("productID").substr(3);
      console.log(productID);
      let clickedProduct;

      for (let prod of productsInTab) {
        if (prod.prod_id == productID) {
          clickedProduct = prod;
        }
      }

      console.log(clickedProduct);
      changeTabProductQuantity(clickedProduct, 0, 1);
    });
  }
};

const listenToQuantityButtons = function() {
  let plusButtons = document.querySelectorAll(".js-plus");
  let minButtons = document.querySelectorAll(".js-min");

  for (let button of plusButtons) {
    button.addEventListener("click", function() {
      let productID = button.getAttribute("productID").substr(3);
      let clickedProduct;
      console.log(productID);

      for (let prod of productsInTab) {
        if (prod.prod_id == productID) {
          clickedProduct = prod;
        }
      }
      changeTabProductQuantity(clickedProduct, 1);
    });
  }

  for (let button of minButtons) {
    button.addEventListener("click", function() {
      let productID = button.getAttribute("productID").substr(3);
      let clickedProduct;

      for (let prod of productsInTab) {
        if (prod.prod_id == productID) {
          clickedProduct = prod;
        }
      }
      changeTabProductQuantity(clickedProduct, 0);
    });
  }
};

const listenToDeleteAllButton = function() {
  const delAllButton = document.querySelector(".js-delete-all");

  delAllButton.addEventListener("click", function() {
    deleteAllProducts();
  });
};

const listenToPayButton = function() {
  let payButton = document.querySelector(".action-button__pay");

  payButton.addEventListener("click", function() {
    ipcRenderer.send("checkoutWindow:make", {
      toPay: totalPriceGlobal,
      products: productsInTab
    });
    document.body.style.opacity = 0.2;
  });
};

const listenToSearch = function() {
  let searchBar = document.querySelector(".search-bar");
  let products = [];

  searchBar.addEventListener("input", function() {
    let searchQuery = searchBar.value;

    if (searchQuery == "") {
      if (activeCategory == "Drank") {
        showProducts(drankProducts);
      } else if (activeCategory == "Snacks") {
        showProducts(snackProducts);
      } else if (activeCategory == "Andere") {
        showProducts(andereProducts);
      }
    } else {
      for (let product of allProducts) {
        if (
          product.prod_naam.toUpperCase().includes(searchQuery.toUpperCase())
        ) {
          console.log(product);
          products.push(product);
        }
      }
      showProducts(products);
      products = [];
    }
  });
};

const listenToLogout = function() {
  const logoutButton = document.querySelector(".action-button__cancel");

  logoutButton.addEventListener("click", function() {
    document.body.style.opacity = 0.2;
    deleteAllProducts();
    activeCategory = "Drank";
    activeUser = "";

    ipcRenderer.send("loginWindow:make");
  });
};

ipcRenderer.on("resetOpacity", function() {
  document.body.style.opacity = 1;
});

ipcRenderer.on("returnActiveUser", function(event, arg) {
  activeUser = arg;
  document.querySelector(".header__name").innerHTML = activeUser.firstname;
});

ipcRenderer.on("username", function(event, arg) {
  activeUser = arg;
  document.querySelector(".header__name").innerHTML = activeUser.firstname;
});

ipcRenderer.on("reset", reset);

const listenToTimeout = function() {
  let idleTimer = 30000;

  function resetTimer() {
    idleTimer = 30000;
  }

  function printIt() {
    console.log(idleTimer);
  }

  function logout() {
    document.body.style.opacity = 0.2;
    reset();
    ipcRenderer.send("loginWindow:make");
  }

  document.addEventListener("click", resetTimer);
  document.addEventListener("keypress", resetTimer);

  setInterval(printIt(), 1000);

  setTimeout(logout, idleTimer);
};

//#endregion

//#region init

const init = function() {
  //document.body.style.opacity = 0.2;
  document.querySelector(".tab-entry-container").innerHTML = "";
  ipcRenderer.send("getActiveUser");
  getAllProducts();
  listenToCategoryButtons();
  listenToPayButton();
  listenToDeleteAllButton();
  listenToSearch();
  listenToLogout();
  listenToTimeout();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Productpage loaded");
  init();
});
//#endregion
