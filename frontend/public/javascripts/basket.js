function createTableHeader(table) {
    let theader = document.createElement("thead");
    let header = document.createElement("tr");
    let pImg = document.createElement("th");
    let pName = document.createElement("th");
    let pPrice = document.createElement("th");
    let pQuantity = document.createElement("th");
    let bTotal = document.createElement("th");
    pImg.innerHTML = "Product Image";
    pName.innerHTML = "Product Name";
    pPrice.innerHTML = "Product Price";
    pQuantity.innerHTML = "Product Quantity";
    bTotal.innerHTML = "Total";
    header.appendChild(pImg);
    header.appendChild(pName);
    header.appendChild(pPrice);
    header.appendChild(pQuantity);
    header.appendChild(bTotal);
    theader.appendChild(header);
    table.appendChild(theader);
    return table;
}

function createtRow(basketData, isCheckout) {
    let row = document.createElement("tr");
    let pImg = document.createElement("td");
    let pImgTag = document.createElement("img");
    let pName = document.createElement("td");
    let pPrice = document.createElement("td");
    let pQuantity = document.createElement("td");
    let bTotal = document.createElement("td");
    pImgTag.src = "http://localhost:1111/media/" + basketData.product_img;
    pImgTag.width = "150";
    pImgTag.height = "100";
    pImg.appendChild(pImgTag);
    pName.innerHTML = basketData.product_name;
    pPrice.innerHTML = basketData.product_price.toFixed(2) + " €";
    pQuantity.innerHTML = basketData.quantity + "x ";
    if (!isCheckout) {
        pQuantity.appendChild(addBasketBtn(basketData.productId));
        pQuantity.appendChild(removeBasketBtn(basketData.productId));
    }
    bTotal.innerHTML = basketData.price.toFixed(2) + " €";
    row.appendChild(pImg);
    row.appendChild(pName);
    row.appendChild(pPrice);
    row.appendChild(pQuantity);
    row.appendChild(bTotal);
    return row
}

function createFooter(basketTotal) {
    let tfoot = document.createElement("tfoot");
    let row = document.createElement("tr");
    let spacer1 = document.createElement("td");
    let spacer2 = document.createElement("td");
    let spacer3 = document.createElement("td");
    let spacer4 = document.createElement("td");
    let totalPrice = document.createElement("th");
    totalPrice.innerHTML = basketTotal + " €";
    row.appendChild(spacer1);
    row.appendChild(spacer2);
    row.appendChild(spacer3);
    row.appendChild(spacer4);
    row.appendChild(totalPrice);
    tfoot.appendChild(row);
    return tfoot;
}

function createBasket(isCheckout) {
    let req = "http://localhost:1111/api/basket/";
    fetch(req, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
        },
    }) // make a request to this endpoint
    .then(response => response.json()) // with our response, get the json data returned
    .then((basketData) => {
        console.log(basketData);
        let currentBasket = basketData[basketData.length - 1];
        if (currentBasket == null) {
            console.log('No basket found');
            return;
        } else if (currentBasket.is_active == false) {
            console.log('No active basket');
            return;
        }

        var totalPrice = 0.0;

        let table = document.createElement("table");
        table.setAttribute("id", "basketTable");
        table = createTableHeader(table);
        let tbody = document.createElement("tbody");
        
        for (let i = 0; i < currentBasket.items.length; i++) {
            let currentItem = currentBasket.items[i];
            let row = createtRow(currentItem, isCheckout);
            tbody.appendChild(row);
            totalPrice += currentItem.price;
        }
        table.appendChild(tbody);
        let tfoot = createFooter(totalPrice.toFixed(2));
        table.appendChild(tfoot);
        document.getElementById("basket-content").appendChild(table);
    });
    
}


function addBasketBtn(id) {
    let btn = document.createElement("button");
    btn.innerHTML = "+";
    btn.setAttribute("id", id);
    btn.addEventListener("click", function() {
        // console.log(this.id);
        fetch('http://localhost:1111/apiadd/', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
              },
              body: JSON.stringify({
                "productId": this.id
              })
            }).then(() => {
                updateBasket();
            });
    });
    return btn;
}

function removeBasketBtn(id) {
    let btn = document.createElement("button");
    btn.innerHTML = "-";
    btn.setAttribute("id", id);
    btn.addEventListener("click", function() {
        // console.log(this.id);
        fetch("http://localhost:1111/apiremove/", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
            },
            body: JSON.stringify({
              "productId": this.id
            })
        }).then(() => {
            updateBasket();
        });
    });
    return btn;
}

function updateBasket() {
    let spinner = document.createElement("h2");
    spinner.innerHTML = "Updating basket...";

    let req = "http://localhost:1111/api/basket/";
    fetch(req, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
        },
    }) // make a request to this endpoint
    .then(response => response.json()) // with our response, get the json data returned
    .then((basketData) => {
        console.log(basketData);
        let currentBasket = basketData[basketData.length - 1];
        if (currentBasket == null) {
            console.log('No basket found');
            return;
        } else if (currentBasket.is_active == false) {
            console.log('No active basket');
            return;
        }

        var totalPrice = 0.0;

        let table = document.createElement("table");
        table.setAttribute("id", "basketTable");
        table = createTableHeader(table);
        let tbody = document.createElement("tbody");
        
        for (let i = 0; i < currentBasket.items.length; i++) {
            let currentItem = currentBasket.items[i];
            let row = createtRow(currentItem, false);
            tbody.appendChild(row);
            totalPrice += currentItem.price;
        }
        table.appendChild(tbody);
        let tfoot = createFooter(totalPrice.toFixed(2));
        table.appendChild(tfoot);

        let oldTable = document.getElementById("basketTable");
        document.getElementById("basket-content").removeChild(oldTable);
        document.getElementById("basket-content").appendChild(table);
    });
}