
//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }

    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID =6
            //[1 2 4 6 8], next ID = 9
            //ID = last ID + 1

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }


            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);

            //Return item
            return newItem;

            //Now add it to the controller function(point 2)
        },

        testing: function () {
            console.log(data);
        }
    };



})();


//UI CONTROLLER
var UIController = (function () {

    // created another object to store the string classes, since easy to modify centrally time and again
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',

        inputBtn: '.add__btn',

        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },



        addListItem: function (obj, type) {
            var html, newHtml,element;

            //Creating HTML strings with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div ></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = html.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //Insert the HTML to the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

            // Now call the method i.e point 3 in ctrlAddItem
        },

        //exposing the DOMstrings to public so can be used globally
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        // On pressing the tick/add button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);


        // On pressing Enter key
        document.addEventListener('keypress', function (event) {

            //13 is the keycode for enter key
            if (event.keyCode === 13 || event.which === 13) {

                ctrlAddItem();
            }
        });

    };




    var ctrlAddItem = function () {
        var input, newItem

        // 1. Get the field input  data
        input = UICtrl.getInput();


        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        // 5. Display the budget on the UI


    };


    return {
        init: function () {
            console.log('Application has started');
            setupEventListeners();
        }
    };






})(budgetController, UIController);


controller.init();
