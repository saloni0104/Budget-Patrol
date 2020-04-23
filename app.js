
//BUDGET CONTROLLER
var budgetController = (function() {

    // Some Code


})();

//UI CONTROLLER
var UIController = (function() {

    // created another object to store the string classes, since easy to modify centrally time and again
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',

        inputBtn: '.add__btn'
    };

    return{
        getInput: function() {
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        //exposing the DOMstrings to public so csn be used globally
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
     
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM =UICtrl.getDOMstrings();

         // On pressing the tick/add button
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);


    // On pressing Enter key
    document.addEventListener('keypress', function(event) {

        //13 is the keycode for enter key
        if(event.keyCode ===13  || event.which ===13) {
            
            ctrlAddItem();
        }
    });

    };

    


    var ctrlAddItem = function()  {
  
        // 1. Get the field input  data
        var input =UICtrl.getInput();
        

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

        
    };


    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    };



   
  

})(budgetController, UIController);


controller.init();