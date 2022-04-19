function getProduct(prodId) {
    let req = "http://localhost:1111/api/products/" + prodId;

    fetch(req) // make a request to this endpoint
      .then(response => response.json()) // with our response, get the json data returned
      .then((data) => {
        if ('detail' in data) { 
          console.log('NOT FOUND');
        } else {
          console.log(data);
          let img = document.getElementById('img');
          let title = document.getElementById('title');
          let desc = document.getElementById('desc');
          let price = document.getElementById('price');
          let addbtn = document.getElementById('add-cart');

          if (localStorage.getItem("accessToken") == null) {
            addbtn.classList.add('disabled');
          } else {
            addbtn.classList.remove('disabled');
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
    fetch('http://localhost:1111/apiadd/', {
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
        console.log(data)
    });
}