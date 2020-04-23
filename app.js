
//I. BUDGET CONTROLLER
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


    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });

        /*
        0
        [200, 400, 100]
        sum = 0+ 200
        sum = 200 + 400
        sum = 600 + 100 =700
        */

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

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


        calculatingBudget: function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');


            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    };

})();


//II. UI CONTROLLER
var UIController = (function () {

    // created another object to store the string classes, since easy to modify centrally time and again
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)      //parseFloat to covert value from string to a number
            };
        },

        // Now adding it to controller function (point 1)

        //ADDING INCOME AND EXPENSE TO UI

        addListItem: function (obj, type) {
            var html, newHtml, element;

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

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            // Now call the method i.e add it to controller function (point 3)
        },

        // ***Clearing fields after selecting an item***

        clearFields: function () {

            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription
                + ',' + DOMstrings.inputValue);

            // Converting list to array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            //Putting focus back to description field after clearing
            fieldsArr[0].focus();

            //Now add tot the controller function (point 4)

        },

        displayBudget: function(obj) {
             
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        //exposing the DOMstrings to public so can be used globally
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// III. GLOBAL APP CONTROLLER
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



    // MAIN FUNCTIONALITY OVERALL


    var updateBudget = function () {

        // 1. Calculate the budget
        budgetCtrl.calculatingBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();


        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);


    };

    var ctrlAddItem = function () {
        var input, newItem

        // 1. Get the field input  data
        input = UICtrl.getInput();

        //Checking if description box is empty or not
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {


            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clearing the fields
            UICtrl.clearFields();

            //5. Calculate and Update Budget
            updateBudget();

        }



    };


    return {
        init: function () {
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);


controller.init();
