function getInfo(id) {
    
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
            // https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
            let orderTime = new Date(orderData.datetimeOrder);
            let today = new Date();
            let diff = (today.getTime() - orderTime.getTime()) / (1000 * 3600 * 24);

            let bar = document.getElementById('shipping-bar');
            bar.value = (diff / 5) * 100;

            let shippingText = document.getElementById('shipping-status-text');
            let estimatedDelivery = document.getElementById('estimated-delivery');
            
            let deliveryDate = new Date();
            deliveryDate.setDate(orderTime.getDate() + 5);


            if (diff > 5) {
                shippingText.innerHTML = "Delivered on <strong>" + deliveryDate.getDate() + "/" + (deliveryDate.getMonth() + 1) + "/" + deliveryDate.getFullYear() + "</strong>";
                estimatedDelivery.innerHTML = "<strong>Arrived</strong>";
            } else if (diff > 4.5) {
                shippingText.innerHTML = "Out for delivery";
                estimatedDelivery.innerHTML = "<strong>Arriving Today<strong>";
            } else if (diff > 1.5) {
                shippingText.innerHTML = "Shipped";
                estimatedDelivery.innerHTML = "Estimated delivery: <strong>" + deliveryDate.getDate() + "/" + (deliveryDate.getMonth() + 1) + "/" + deliveryDate.getFullYear() + "</strong>";
            } else if (diff > 0.5) {
                shippingText.innerHTML = "Processing";
                estimatedDelivery.innerHTML = "Estimated delivery: <strong>" + deliveryDate.getDate() + "/" + (deliveryDate.getMonth() + 1) + "/" + deliveryDate.getFullYear() + "</strong>";
            } else {
                shippingText.innerHTML = "Order Placed at <strong>" + orderTime.getDate() + "/" + (orderTime.getMonth() + 1) + "/" + orderTime.getFullYear() + "</strong>";
                estimatedDelivery.innerHTML = "Estimated delivery: <strong>" + deliveryDate.getDate() + "/" + (deliveryDate.getMonth() + 1) + "/" + deliveryDate.getFullYear() + "</strong>";
            }
            
            

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
                console.log(currProd);

                let row = document.createElement('tr');
                let tdImg = document.createElement('td');
                let img = document.createElement('img');
                let pName = document.createElement('td');
                let pPrice = document.createElement('td');
                let pQuantity = document.createElement('td');
                let pTotal = document.createElement('td');

                img.setAttribute('src', "http://localhost:1111/media/" + currProd.product_img);
                img.setAttribute('alt', currProd.product_name);
                img.setAttribute('width', '100');
                img.setAttribute('height', '100');
                tdImg.appendChild(img);
                pName.innerHTML = currProd.product_name;
                pPrice.innerHTML = currProd.product_price.toFixed(2) + " €";
                pQuantity.innerHTML = currProd.quantity;
                pTotal.innerHTML = currProd.price.toFixed(2) + " €";
                
                row.appendChild(tdImg);
                row.appendChild(pName);
                row.appendChild(pPrice);
                row.appendChild(pQuantity);
                row.appendChild(pTotal);
                prodTable.appendChild(row);
            }
        });
    });
    
}