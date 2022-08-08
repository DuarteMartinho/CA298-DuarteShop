function showOrdersHistory() {
    let order_history = document.getElementById("order-history");

    fetch("http://ca298-api.duartemartinho.com:8000/api/order/", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        },
    })
    .then(response => response.json())
    .then((orderData) => {
        console.log(orderData);
        
        if (orderData.length == 0) {
            let no_orders = document.createElement("h2");
            no_orders.setAttribute("class", "title is-4");
            no_orders.innerHTML = "You have no orders";
            order_history.appendChild(no_orders);
        } else {
            let order_header = document.createElement("div");
            order_header.setAttribute("class", "columns is-mobile");
            let h4Id = document.createElement("h4");
            let h4Date = document.createElement("h4");
            let h4Total = document.createElement("h4");
            let h4Shipping = document.createElement("h4");
            h4Id.setAttribute("class", "column");
            h4Date.setAttribute("class", "column");
            h4Total.setAttribute("class", "column")
            h4Shipping.setAttribute("class", "column");

            h4Id.innerHTML = "<strong>Order ID</strong>";
            h4Date.innerHTML = "<strong>Ordered On</strong>";
            h4Total.innerHTML = "<strong>Total</strong>";
            h4Shipping.innerHTML = "<strong>Shipping to</strong>";

            order_header.appendChild(h4Id);
            order_header.appendChild(h4Shipping);
            order_header.appendChild(h4Date);
            order_header.appendChild(h4Total);
            order_history.appendChild(order_header);

            for (let i = orderData.length - 1; i >= 0; i--) {
                let order = orderData[i];
                let orderTime = new Date(order.datetimeOrder);
                
                
                let orderDiv = document.createElement("div");
                orderDiv.setAttribute("id", "order-history-" + order.id);
                orderDiv.setAttribute("class", "mt-4 mb-4");

                let order_content = document.createElement("div");
                order_content.setAttribute("class", "columns is-mobile");

                let pId = document.createElement("div");
                let pDate = document.createElement("div");
                let pTotal = document.createElement("div");
                let pShipping = document.createElement("div");
                pId.setAttribute("class", "column");
                pDate.setAttribute("class", "column");
                pTotal.setAttribute("class", "column");
                pShipping.setAttribute("class", "column");
                pId.innerHTML = "#" + order.id;
                pDate.innerHTML = orderTime.getDate() + "/" + (orderTime.getMonth() + 1) + "/" + orderTime.getFullYear(); 
                pTotal.innerHTML = order.total_price + "€";
                pShipping.innerHTML = order.name;
                
                let btnView = document.createElement("button");
                btnView.innerHTML = "View";
                btnView.setAttribute("class", "button is-primary");
                btnView.addEventListener("click", () => {
                    showOrder(order.id);
                });

                
        
                order_content.appendChild(pId);
                order_content.appendChild(pShipping);
                order_content.appendChild(pDate);
                order_content.appendChild(pTotal);
                order_content.appendChild(btnView);
                
                orderDiv.appendChild(order_content);
                
                order_history.appendChild(orderDiv);
            }
        }
    });

}


function showOrder(id) {
    window.location.href = "/individualorder?id=" + id;
}