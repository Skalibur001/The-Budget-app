var Budgetcontroller = (function(){

    class Expense {
        constructor(id, desc, value) {
            this.id = id,
                this.desc = desc,
                this.value = value;
        }
    }

    class Income {
        constructor(id, desc, value) {
            this.id = id,
                this.desc = desc,
                this.value = value;
        }
    }

    var calculateTotal = function(type)
    {
        var sum=0;

        Data.Allitem[type].forEach(function(curr)
        {
            sum+=curr.value;
        })
        Data.Total[type]=sum;
      //  return Data.Total.budget;
    }

    var Data= {
        Allitem : {
            inc:[],
            exp:[]
        },
        Total: {
            inc:0,
            exp:0,
        },
        budget:0
    }

   return {
            
        Items : function(_type,_desc,_value) 
        {
            var Type,ID,newItem;

            Type=Data.Allitem[_type]; 
            
            if(Type.length === 0)
            {  
                ID=0;
            }
            else
             {
                // id = id of last element of particular type +1                
                ID = Type[Type.length - 1].id + 1 ;          
            
             }
                
             if(_type==='inc') 
             {
                 newItem = new Income(ID,_desc,_value);
             }
             else if(_type==='exp')
             {
                newItem = new Expense(ID,_desc,_value);
             }

            Type.push(newItem);
            // console.log(ID);
             
             return newItem;
      
      
      
        }
,
        testing:function()
        {
            console.log(Data);
            
        }
,
        updateBudget:function()
        {
            calculateTotal('inc');
            calculateTotal('exp');
            Data.budget = Data.Total.inc-Data.Total.exp;
            //console.log(Data);
            
         }
        ,
        getBudget: function() {
            return {
               budget:Data.budget,
                totalInc: Data.Total.inc,
                totalExp: Data.Total.exp
             //   percentage: data.percentage
            };
        },

        deleteItem:function(type,id)
        {
            var Type,ids,index;
             Type=Data.Allitem[type]; 
          //  console.log(Type);
            
             ids = Type.map(function(current)
             {
                return current.id;
             });
             index=ids.indexOf(id);
             if(index!==-1)
             {
                 Data.Allitem[type].splice(index,1);
             }

        }


   };



})();

var UIcontroller = (function() {

// var Classname= 
//     { 
//         inputType:".add__type",
//         inputDesc:".add_description",
//         inputValue:".add__value"
//     }

        return {
            getInput : function() {
                return {
                    type:document.querySelector(".add__type").value,
                    desc:document.querySelector(".add__description").value,
                    value:  parseFloat(document.querySelector(".add__value").value)
                };
            }  
            ,
            showItem : function(obj,type) 
            {
                var html, newHtml, element;
                // Create HTML string with placeholder text
                
                if (type === 'inc') 
                {
                    element = '.income__list';
                    
                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') 
                {
                    element = '.expense__list';
                    
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                
                // Replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.desc);
                newHtml = newHtml.replace('%value%', obj.value);
                
               // console.log(newHtml);
                
                // Insert the HTML into the DOM
               document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);    

            },

            clearField:function()
            {

               var field = document.querySelectorAll(".add__description" + "," +".add__value");
                var fieldArr = Array.prototype.slice.call(field);       
                fieldArr.forEach(function(current,index,array)
                {
                        current.value="";   
                })
                  fieldArr[0].focus();  
            }
            ,

            updateBudget:function(obj,)
            {
                //update total budget
                document.querySelector(".budget__value").textContent=obj.budget;
                document.querySelector(".budget__income--value").textContent=obj.totalInc
                document.querySelector(".budget__expenses--value").textContent=obj.totalExp;

            },
            deleteItem:function(id)
            {
                var el=document.getElementById(id);
                el.parentNode.removeChild(el);
            },
            displayMonth:function()
            {
                var now = new Date();
                var month=now.getMonth();
                var year = now.getFullYear();
                document.querySelector(".budget__title--month").textContent=month +" "+year;
            }

        }




})();

var controller= (function(budgetCtrl,uiCtrl){

  var finalBudget = function()
  {
    
    budgetCtrl.updateBudget();
    
    var budget=budgetCtrl.getBudget();
    //console.log(budget);
    
    uiCtrl.updateBudget(budget);

  }
  

  var deleteItem = function(event)
  {
      var _id,split,type,id;
    var _id = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if(_id)
    {
         split=_id.split("-");
         type=split[0];
         id=parseInt(split[1]);

         //console.log((type+"  "+id));
         
        //delete item from daata structure
            budgetCtrl.deleteItem(type,id);


        //delete from ui
         uiCtrl.deleteItem(_id);

        //update ui and data structre and budget
         finalBudget();

    }
  }
  
  
  
    var addItem = function()
    {
        var input,newItem;
        //get input data from ui
        uiCtrl.displayMonth();
        input = uiCtrl.getInput();
       // console.log(input);
        if(input.desc!=="" && input.value > 0)
        //add that data into our data structure
      {
         newItem = budgetCtrl.Items(input.type,input.desc,input.value);
       // console.log(newItem);
        
        //present it through ui

        uiCtrl.showItem(newItem,input.type);
        uiCtrl.clearField();

        //change budget
       finalBudget();
    

        }
    }

document.querySelector(".container").addEventListener("click",deleteItem);
document.querySelector(".add__btn").addEventListener("click",addItem);
document.addEventListener("keypress",function(event){
    if(event.keyCode===13)
    {
        console.log("Enter is pressed");
        
        addItem();
    }
})


})(Budgetcontroller,UIcontroller);
