function submitOrder(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let address1 = document.getElementById("address1").value;
    let address2 = document.getElementById("address2").value;
    let city = document.getElementById("city").value;
    let county = document.getElementById("county").value;
    let eircode = document.getElementById("eircode").value;

    let isValid = true;

    if (address1 === "") {
        console.log("Address line 1 is not valid");
        isValid = false;
    }

    if (address2 === "") {
        console.log("Address line 2 is not valid");
        isValid = false;
    }

    if (city === "") {
        console.log("City is not valid");
        isValid = false;
    }

    if (county === "" || county === "Select County") {
        console.log("County is not valid");
        isValid = false;
    }

    if (eircode === "" || eircode.length !== 7) {
        console.log("Eircode is not valid");
        isValid = false;
    } 

    if (name === "") {
        console.log("Name is not valid");
        isValid = false;
    } 

    if (isValid) {
        let basket = "http://localhost:1111/api/basket/";
        fetch(basket, {
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

            if (currentBasket.items.length === 0) {
                console.log('No items in basket');
            } else {

                fetch("http://localhost:1111/apicheckout/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
                    },
                    body: JSON.stringify({addressline1: address1, addressline2: address2, city: city, county: county, eircode: eircode, name: name})
                })
                .then(response=>response.json())
                .then(data => {
                    updateBasket();
                    if ('addressline1' in data && 'addressline2' in data && 'city' in data && 'county' in data && 'eircode' in data) {
                        console.log("Order submitted successfully");
                        fetch("http://localhost:1111/api/order/", {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ localStorage.getItem("accessToken")
                            },
                        }).then(response => response.json()).then((orderData) => {
                            // console.log(orderData);
                            let currentOrder = orderData[orderData.length - 1];
                            if (currentOrder == null) {
                                console.log('No order found');
                                return;
                            }
                            console.log("Order ID: " + currentOrder.id);
                            
                            window.location.href = "/ordersuccess?id=" + currentOrder.id;
                        });
                    } else{
                        console.log("Order not submitted");
                    }
                });
            }
            });
        }
    }

let orderSubmit = document.getElementById('order-submit');
orderSubmit.addEventListener("submit", submitOrder);