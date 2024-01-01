AFRAME.registerComponent('create-buttons',{
init:function(){
    // Create button 1
    var button1 = document.createElement("button");
     button1.innerHTML = "ORDER SUMMARY"; 
     button1.setAttribute("id", "order-summary");
     button1.setAttribute("class", "btn btn-warning");
    // Create button 2
     var button2 = document.createElement("button");
     button2.innerHTML = "ORDER NOW"; 
     button2.setAttribute("id", "order-button");
     button2.setAttribute("class", "btn btn-warning");

     var button3 = document.createElement("button");
     button3.innerHTML = "Pay Now"; 
     button3.setAttribute("id", "pay-button");
     button3.setAttribute("class", "btn btn-warning");


     // Append button elements
     var buttonDiv = document.getElementById("button-div"); 
     buttonDiv.appendChild(button1); 
     buttonDiv.appendChild(button2);
     button1.appendChild(button3)
}
})