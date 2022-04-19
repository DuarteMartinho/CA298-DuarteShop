
function getInfo(id) {
    
    if (id === null) {
        hideOrder();
        return;
    } else {
        fetch("http://localhost:1111/api/order/" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
            },
        }).then(response => response.json()).then((orderData) => {
            console.log(orderData);
            if (orderData.detail != null) {
                console.log('No order found');
                hideOrder();
                return;
            }
            fetch(orderData.basketId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
                },
            }).then(response => response.json()).then((basketData) => {
                let orderTime = new Date(orderData.datetimeOrder);

                let id = document.getElementById('order-id');
                let time = document.getElementById('order-time');
                let total = document.getElementById('order-total');
                id.innerHTML = orderData.id;
                time.innerHTML = orderTime.getDate() + "/" + (orderTime.getMonth() + 1) + "/" + orderTime.getFullYear() + " " + orderTime.getHours() + ":" + orderTime.getMinutes();
                total.innerHTML = orderData.total_price;

                let name = document.getElementById('shipping-name');
                let address = document.getElementById('shipping-address');
                let city = document.getElementById('shipping-city');
                let county = document.getElementById('shipping-county');
                let country = document.getElementById('shipping-country');
                let eircode = document.getElementById('shipping-eircode');
                name.innerHTML = orderData.name;
                address.innerHTML = orderData.addressline1 + ", " + orderData.addressline2;
                city.innerHTML = orderData.city;
                county.innerHTML = orderData.county;
                country.innerHTML = orderData.country;
                eircode.innerHTML = orderData.eircode;

                console.log("Order ID: " + orderData.id);
                console.log("Order total: " + orderData.total_price);
                console.log("Order date: " + orderData.datetimeOrder);
                console.log("Order address: " + orderData.addressline1 + " " + orderData.addressline2 + " " + orderData.city + " " + orderData.county + " " + orderData.eircode);
                console.log("Order products: ");

                let prodTable = document.getElementById('order-table-body');
                for (let i = 0; i < basketData.items.length; i++) {
                    console.log("Product ID: " + basketData.items[i].productId);
                    console.log("Product name: " + basketData.items[i].product_name);
                    console.log("Product price: " + basketData.items[i].product_price);
                    console.log("Product quantity: " + basketData.items[i].quantity);
                    console.log("Total price: " + basketData.items[i].price);
                    let currProd = basketData.items[i];

                    let row = document.createElement('tr');
                    let pName = document.createElement('td');
                    let pPrice = document.createElement('td');
                    let pQuantity = document.createElement('td');
                    let pTotal = document.createElement('td');

                    pName.innerHTML = currProd.product_name;
                    pPrice.innerHTML = currProd.product_price;
                    pQuantity.innerHTML = currProd.quantity;
                    pTotal.innerHTML = currProd.price;
                    
                    row.appendChild(pName);
                    row.appendChild(pPrice);
                    row.appendChild(pQuantity);
                    row.appendChild(pTotal);
                    prodTable.appendChild(row);
                }
            });
        });

    }
}

function hideOrder() {
    let order_content = document.getElementById("order-content");
    let shipping_content = document.getElementById("shipping-content");
    let orderIdText = document.getElementById("order-id-text");
    order_content.style.display = "none";
    shipping_content.style.display = "none";
    orderIdText.style.display = "none";
}