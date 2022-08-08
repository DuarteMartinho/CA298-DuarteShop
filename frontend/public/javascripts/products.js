function getProduct(prodId) {
    let req = "http://ca298-api.duartemartinho.com:8000/api/products/" + prodId;

    fetch(req) // make a request to this endpoint
      .then(response => response.json()) // with our response, get the json data returned
      .then((data) => {
        if ('detail' in data) { 
          window.location.href = "/";
        } else {
          console.log(data);
          let img = document.getElementById('img');
          let title = document.getElementById('title');
          let desc = document.getElementById('desc');
          let price = document.getElementById('price');
          let addbtn = document.getElementById('add-cart');
          let stock = document.getElementById('stock');

          if (localStorage.getItem("accessToken") == null) {
            addbtn.classList.add('disabled');
          } else {
            addbtn.classList.remove('disabled');
          }

          if (data.isInStock) {
            stock.innerHTML = "In stock";
            stock.classList.add('is-success');
            stock.classList.remove('is-danger');
            addbtn.removeAttribute("disabled");
          } else {
            stock.innerHTML = "Out of stock";
            stock.classList.add('is-danger');
            stock.classList.remove('is-success');
            addbtn.setAttribute("disabled", "disabled");
          }
          addbtn.onclick = ()=>{
            addToCart(prodId);
          };
          img.src = data.image;
          title.innerHTML = data.name;
          desc.innerHTML = data.description;
          price.innerHTML = data.price;
        }
      }
    );
}


function addToCart(prodId) {
    console.log(prodId);
    fetch('http://ca298-api.duartemartinho.com:8000/apiadd/', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
        },
        body: JSON.stringify({
        "productId": parseInt(prodId)
        })
    })
    .then(response=>response.json())
    .then(data=>{
        // TODO: display an add to cart success message
        console.log(data);

        UIkit.notification("<span><i class='fa-solid fa-cart-arrow-down'></i></span> Added to basket", {status: 'success', timeout: 1300, pos: 'bottom-right'});

    });
}

function cardImage(currentItem) {
  let cardImage = document.createElement("div");
  let cardFigure = document.createElement("figure");
  let cardImageImg = document.createElement("img");
  
  cardImage.setAttribute("class", "card-image");
  cardFigure.setAttribute("class", "image");
  // cardImageImg.style.width = "300px";
  // cardImageImg.style.height = "300px";
  cardImageImg.setAttribute("src", currentItem.image);

  cardFigure.appendChild(cardImageImg);
  cardImage.appendChild(cardFigure);
  return cardImage;
}

function cardContent(currentItem) {
  let cardContent = document.createElement("div");
  let cardContentMedia = document.createElement("div");
  let cardContentTitle = document.createElement("p");
  let cardContentSubtitle = document.createElement("p");

  cardContent.className = "card-content";
  cardContentMedia.setAttribute("class", "content");
  cardContentTitle.setAttribute("class", "title is-4");
  cardContentTitle.innerHTML = currentItem.name;

  cardContentSubtitle.setAttribute("class", "subtitle is-6");
  cardContentSubtitle.innerHTML = currentItem.price + " €";

  cardContentMedia.appendChild(cardContentTitle);
  cardContentMedia.appendChild(cardContentSubtitle);
  cardContent.appendChild(cardContentMedia);
  return cardContent;
}

function cardFooter(currentItem) {
  let cardFooter = document.createElement("footer");
  cardFooter.setAttribute("class", "card-footer");

  let cardFooterItemView = cardViewBtn(currentItem);
  let cardFooterItemAdd = cardAddBtn(currentItem);

  cardFooter.appendChild(cardFooterItemView);
  cardFooter.appendChild(cardFooterItemAdd);
  return cardFooter;
}

function cardAddBtn(currentItem) {
  let cardFooterItemAdd = document.createElement("button");
  cardFooterItemAdd.setAttribute("class", "button is-primary card-footer-item m-2");

  if (localStorage.getItem("accessToken") == null) {
    cardFooterItemAdd.setAttribute("disabled", "disabled");
  } else {
    cardFooterItemAdd.removeAttribute("disabled");
  }
  
  if (currentItem.isInStock) {
    cardFooterItemAdd.setAttribute("onclick", "addToCart(" + currentItem.id + ")");
    cardFooterItemAdd.innerHTML = "Add to Cart";
    cardFooterItemAdd.removeAttribute("disabled");
  } else {
    cardFooterItemAdd.setAttribute("disabled", "disabled");
    cardFooterItemAdd.innerHTML = "Out of stock";
  }
  return cardFooterItemAdd;
}


function cardViewBtn(currentItem) {
  let cardFooterItemView = document.createElement("a");
  cardFooterItemView.setAttribute("class", "button is-primary card-footer-item m-2");
  cardFooterItemView.href = "/product?id=" + currentItem.id;

  cardFooterItemView.innerHTML = "View";
  return cardFooterItemView;
}