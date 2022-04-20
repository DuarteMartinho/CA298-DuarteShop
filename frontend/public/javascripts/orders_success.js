function getInfo(id) {
    if (id === null || id === "") {
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
            if (orderData.detail != null) {
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

                let deliveryDate = new Date();
                deliveryDate.setDate(orderTime.getDate() + 5);

                let estimatedDelivery = document.getElementById('estimated-delivery');
                estimatedDelivery.innerHTML = deliveryDate.getDate() + "/" + (deliveryDate.getMonth() + 1) + "/" + deliveryDate.getFullYear();

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

                let prodTable = document.getElementById('order-table-body');
                for (let i = 0; i < basketData.items.length; i++) {
                    let currProd = basketData.items[i];

                    let row = document.createElement('tr');
                    let pName = document.createElement('td');
                    let pPrice = document.createElement('td');
                    let pQuantity = document.createElement('td');
                    let pTotal = document.createElement('td');

                    pName.innerHTML = currProd.product_name;
                    pPrice.innerHTML = currProd.product_price.toFixed(2) + " €";
                    pQuantity.innerHTML = currProd.quantity;
                    pTotal.innerHTML = currProd.price.toFixed(2) + " €";
                    
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
    let estimatedDeliveryText = document.getElementById("estimated-delivery-text");
    order_content.style.display = "none";
    shipping_content.style.display = "none";
    orderIdText.style.display = "none";
    estimatedDeliveryText.style.display = "none";
}


let prev_orders = document.getElementById("prev-orders");
prev_orders.onclick = () => {
    window.location.href = "/orderhistory";
}

let home = document.getElementById("home");
home.onclick = () => {
    window.location.href = "/";
}