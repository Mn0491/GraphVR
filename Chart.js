function init(){
    load_selectoptions();
}

function load_selectoptions(){
    var data = database["obj"];
    var html=""; 
    for(var i=0; i<Object.keys(database.obj).length; i++){
        $("#select1").append(get_options(data[i]));
        $("#select2").append(get_options(data[i]));
    } 
}

function get_options(data){
    var html="";
    html+="<option value='"+data["name"]+"'>"+data["name"]+"</option>";
    return html;    
}

//finds information about the two selected objects
function get_info(){
    //get the two selections
    var element1=$("#select1").val();
    var element2=$("#select2").val();

    //find the id of the selection
    var elem1id=find_id(element1);
    var elem2id=find_id(element2);
    
    //arrays to store values from dataset
    var leftGraphArray = find_values(elem1id,element1);
    var rightGraphArray = find_values(elem2id,element2);
    
    //console.log(leftGraphArray);
    
    //find the differences in values of attributes
    getdifferenceArray(leftGraphArray,rightGraphArray);
    
}

//get object id
function find_id(value){
    var objID;
    for(var i=0; i<Object.keys(database.obj).length; i++) {
        if(database.obj[i].name == value)
        {
            objID=i;
        }
    }
    
    return objID;
}

//gets all the values of an object and returns an array
function find_values(elemid,elementName){
    var graphArray = [];
    for(var i=0; i<Object.keys(database.dataset).length; i++) {
        if(database.dataset[i].objID == elemid)
        {    
          var value = database.dataset[i].value
          var attID = database.dataset[i].attID
          var attName = database.attribute[attID].name
          var attWarning = database.attribute[attID].warning
          var attImportance = database.attribute[attID].importance
          
          graphArray.push({objName:elementName, att_Name: attName, value: value, warning: attWarning, importance: attImportance})
        }
    }
    
    return graphArray;
}

//Parameters: Array of original values for Lgraph & Rgraph
function getdifferenceArray(leftGraph,rightGraph)
{
    //First, we compare the graphs and find like attributes
    for (var i=0; i<leftGraph.length; i++) {
        for (var j=0; j<rightGraph.length; j++)
        { //find identical attribute to compare
            if (leftGraph[i].att_Name == rightGraph[j].att_Name)
            {
                //compare if left value is bigger
                if (leftGraph[i].value > rightGraph[j].value)
                {
                    var printablevalue_L = calc_difference(leftGraph[i].value,rightGraph[j].value);
                    leftGraph[i].value=printablevalue_L;
                    rightGraph[j].value=0;
                    //make right[i].value=0, so we won't print it later
                }
                else
                {
                    var printablevalue_R = calc_difference(rightGraph[j].value,leftGraph[i].value);
                    rightGraph[j].value=printablevalue_R;
                    leftGraph[i].value=0;
                //make left[i].value=0, so we won't print it later              
                }
            }
            //else, if no same attribute, 
            //We need to do something with that value and make it printable.
        }
    } //endfor
    
    //sort both arrays by value number in descending order
    leftGraph.sort(descending);
    rightGraph.sort(descending);
    
    console.log(leftGraph);
    console.log(rightGraph);
    
    //print arrays
    printGraph(leftGraph,"l");
    printGraph(rightGraph,"r");
    
//    animate(leftGraph, "l");
//    animate(rightGraph, "r");
}

                        
function calc_difference(bignum, smallnum)
{
    var percentdifference = (Math.abs((bignum-smallnum)/(bignum+smallnum)))
    
    //convert value into a printable pixel
    var max=285* (Math.random()*(1.4-1)+1)
    var printable_value= max - (max*percentdifference)  
    return printable_value;
}

function descending(a,b){
    return b.value-a.value;
}

function printGraph(graphArray, side)
{
    var html=""
    
    for (var i=0; i<graphArray.length;i++)
    {   
        if (graphArray[i].warning == true){
            var warning = "warning"
        }else {
            var warning = ""
        }
        html+="<div id='"+graphArray[i].objName+[i]+"' class='"+warning+" importance"+graphArray[i].importance+"'></div>"

    }
    
    if (side=='l')
    {   
        $("#leftside").append(html);
    }
    else{
    
        $("#rightside").append(html);
    }  
    var index = 0;
    animate(graphArray, side, index)
}

function animate(graphArray, side, i){
    setTimeout(function() {
    if(side == 'l') {
        var shiftLeftValue = "-"+graphArray[i].value.toString()+"px"; 
        }else {
        var shiftLeftValue = null;
        }
        
    console.log(shiftLeftValue)
    console.log(graphArray[i].value)
    
    if (graphArray[i].value != 0){
      
      $("#"+graphArray[i].objName+[i]).css({'position': 'relative', 'height': 30, 'width': 0, 'color': 'white'})    
        
      $("#"+graphArray[i].objName+[i]).animate({width:graphArray[i].value, left: shiftLeftValue},350)
    
      $("#"+graphArray[i].objName+[i]).html(graphArray[i].att_Name)
    }
    i++
    if( i < 6){
        animate(graphArray,side, i) 
    }
    },30)
}
