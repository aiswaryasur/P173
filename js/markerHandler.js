var userId = null

AFRAME.registerComponent('marker-handler',{
    init:async function(){
        if(userId === null){
            this.askUserId()
        }
        var toys = await this.getToys()
        this.el.addEventListener('markerFound',()=>{
            if(userId!== null){
                var markerId = this.el.id
            
            console.log('Marker-is-found')
            this.handlerMarkerFound(toys,markerId)
            }
        });

        this.el.addEventListener('markerLost',()=>{
            console.log('Marker-is-Lost')
            this.handleMarkerLost()
        })
    },
    getToys: async function(){
        return await firebase.firestore().collection('toys').get().then(
            snapshot=>{
                return snapshot.docs.map(doc=>{doc.data})
            }
        )
    },

    askUserId: function(){
        var url = 'https://raw.githubusercontent.com/whitehatjr/ar-toy-store-assets/master/toy-shop.png'
        swal({
            title:'Wecome To Toy Shop!!!',
            icon: url,
            content:{
                element:'input',
                attributes:{
                    placeHolder:'type your uid Ex:( U01 )',
                    type:'number',
                    min:1,
                }
            },
            closeOnClickOutside:false

        })
        .then((inputValue)=>{
            userId = inputValue

        })
    },
    getOrderSummary: async function (uidNumber) {
        return await firebase
          .firestore()
          .collection("users")
          .doc(uidNumber)
          .get()
          .then(doc => doc.data());
      },

    handlerMarkerFound:function(toys,markerId){
        var toy = toys.filter(toy=>toy.id===markerId)[0] 
        if(toy.is_out_of_stock.includes(true)){
            swal({
                icon:'warning',
                title:toy.toy_name.toUpperCase(),
                text:'this toy is in out of stock !',
                timer:2500,
                buttons:false
            })
        }
        else{
            var model= document.querySelector(`#model-${toy.id}`)
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);

            //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)     
            model.setAttribute("visible", true);

            var ingredientsContainer = document.querySelector(`#main-plane-${toy.id}`);
            descriptionContainer.setAttribute("visible", true);

            var priceplane = document.querySelector(`#price-plane-${dish.id}`);
            priceplane.setAttribute("visible", true)

            // Changing button div visibility
            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex";

            var payButton = document.getElementById("pay-button");
                
            var button = document.getElementById('button-div');
            button.style.display = 'flex'

            var orderButton = document.getElementById('order-button')
            var orderSummaryButton = document.getElementById('order-summary')

            orderButton.addEventListener('click',function(){
                swal({
                    icon:'success',
                    title : 'THANKS FOR ORDER!',
                    text:'Your order will be delivered soon to your house'
                })
            })

            orderSummaryButton.addEventListener('click',function(){
                swal({
                    icon:'warning',
                    title : 'ORDER SUMMARY',
                    text:'Work in progress'
                })
        })
    }
},
handleOrderSummary: async function () {

    //Getting Table Number
    var uidNumber;
    userId <= 9 ? (tNumber = `T0${userId}`) : `T${userId}`;

    //Getting Order Summary from database
    var orderSummary = await this.getOrderSummary(uidNumber);

    //Changing modal div visibility
    var modalDiv = document.getElementById("modal-div");
    modalDiv.style.display = "flex";

    //Get the table element
    var tableBodyTag = document.getElementById("bill-table-body");

    //Removing old tr(table row) data
    tableBodyTag.innerHTML = "";

    //Get the cuurent_orders key 
    var currentOrders = Object.keys(orderSummary.current_orders);

    currentOrders.map(i => {

      //Create table row
      var tr = document.createElement("tr");

      //Create table cells/columns for ITEM NAME, PRICE, QUANTITY & TOTAL PRICE
      var item = document.createElement("td");
      var price = document.createElement("td");
      var quantity = document.createElement("td");
      var subtotal = document.createElement("td");

      //Add HTML content 
      item.innerHTML = orderSummary.current_orders[i].item;

      price.innerHTML = "$" + orderSummary.current_orders[i].price;
      price.setAttribute("class", "text-center");

      quantity.innerHTML = orderSummary.current_orders[i].quantity;
      quantity.setAttribute("class", "text-center");

      subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
      subtotal.setAttribute("class", "text-center");

      //Append cells to the row
      tr.appendChild(item);
      tr.appendChild(price);
      tr.appendChild(quantity);
      tr.appendChild(subtotal);

      //Append row to the table
      tableBodyTag.appendChild(tr);
    });

    //Create a table row to Total bill
    var totalTr = document.createElement("tr");

    //Create a empty cell (for not data)
    var td1 = document.createElement("td");
    td1.setAttribute("class", "no-line");

    //Create a empty cell (for not data)
    var td2 = document.createElement("td");
    td1.setAttribute("class", "no-line");

    //Create a cell for TOTAL
    var td3 = document.createElement("td");
    td1.setAttribute("class", "no-line text-center");

    //Create <strong> element to emphasize the text
    var strongTag = document.createElement("strong");
    strongTag.innerHTML = "Total";

    td3.appendChild(strongTag);

    //Create cell to show total bill amount
    var td4 = document.createElement("td");
    td1.setAttribute("class", "no-line text-right");
    td4.innerHTML = "$" + orderSummary.total_bill;

    //Append cells to the row
    totalTr.appendChild(td1);
    totalTr.appendChild(td2);
    totalTr.appendChild(td3);
    totalTr.appendChild(td4);

    //Append the row to the table
    tableBodyTag.appendChild(totalTr);
  },
  handleRatings: async function (toy) {
    var uidNumber;
    userId<=9?(uidNumber=`T0${userId}`):`t${userId}`;
    var orderSummary = await this.getOrderSummary(uidNumber);
    var currentOrders = Object.keys(orderSummary.currentOrders)
    if(currentOrders.length>0 && currentOrders==toy.i){
      document.getElementById('rating-modal-div').style.display='flex';
      document.getElementById('rating-input').value='0';
      document.getElementById('feedback-input').value='';
      var saveRatingButton = document.getElementById('save-rating-button');
      saveRatingButton.addEventListener('click',()=>{
        document.getElementById('rating-modal-div').style.display='none'; 
        var rating = document.getElementById('rating-input').value;
        var feedback = document.getElementById('feedback-input')
        firebase.firestore().collection('toys').doc(toy.id).update({
          last_review:feedback,
          last_rating:rating
        })
        .then(
          ()=>{
            swal({
              icon:'success',
              title:'Thanks For Rating!',
              text:'We hope you like toy',
              timer:2500,
              buttons:false

            })
          }
        )
      })
    }
    else{
      swal({
        icon:'warning',
              title:'Oops!',
              text:'No toy found give rating',
              timer:2500,
              buttons:false
      })
    }
  },

    handleMarkerLost:function(){
        var button = document.getElementById('button-div');
        button.style.display = 'none'
    }
})