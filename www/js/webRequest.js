var apiTimeOut = 20000;
var count = 0;
var datacount = 0;

function getActivityList(registrationId){

   
    $.ajax({
      url: "http://192.168.1.19/pcn/api/product/1",
      type: "GET",  
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: apiTimeOut,  
      success: function(data, status, xhr) {
        debugger; 
      
       // alert(JSON.stringify(data));
        deleteData(data);
        datacount=data.length;

          $('#progressbar').attr('max',datacount);
          

        for(x=0;x<data.length;x++){
        storeData(data[x].item_group, data[x].item_code, data[x].type, data[x].desc, data[x].desc2, data[x].UOM, data[x].PRICE1, data[x].PRICE2,data[x].PRICE_MIN, data[x].BALANCEQTY,data[x].last_price,data[x].SyncDate);
      }
         
       
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
          //alert("error"+xhr.responseText);
          //alert("Error: Unable to connect to server.");
        }
    }) 
    
}

function deleteData(data){
//sqlitePlugin
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "MANUFACTURE", 200000);
    db.transaction(function(txx) {
            //txx.executeSql('DROP TABLE IF EXISTS DATA');
            txx.executeSql('DELETE FROM DATA');
            OnsuccessDelete,
            OnerrorDelete
       
        
        });
    
}

function storeData(item_group, item_code, type, desc, desc2, UOM, PRICE1, PRICE2,PRICE_MIN, BALANCEQTY, last_price, SyncDate) {

    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "MANUFACTURE", 200000);
    var data = {
    values1 : [item_group, item_code, type, desc, desc2, UOM, PRICE1, PRICE2,PRICE_MIN, BALANCEQTY, last_price, SyncDate]
    };
    

    insertData(data);


    function insertData(data) {
        
  
        db.transaction(function(tx) {
            //tx.executeSql('DROP TABLE IF EXISTS DATA');
            tx.executeSql('create table if not exists DATA(item_group TEXT, item_code TEXT, type TEXT, desc TEXT, desc2 TEXT, UOM TEXT, PRICE1 TEXT, PRICE2 TEXT,PRICE_MIN TEXT, BALANCEQTY TEXT, last_price TEXT, SyncDate TEXT)');
            //tx.executeSql('DELETE FROM DATA');
            tx.executeSql(
                'INSERT INTO DATA(item_group, item_code, type, desc, desc2, UOM, PRICE1, PRICE2,PRICE_MIN, BALANCEQTY, last_price, SyncDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                data.values1,
                successLogin,
                errorLogin
            );
        });
    }
}

function errorLogin(err){
alert("Error message :"+err);
}

function successLogin(){ 
    $(".btnsync").css("display","none");
    $(".btnsearch").css("display","none");
     loading.endLoading();
    count=count+1;
$('#progressbar').css('display','block');
$('#progressbar').attr('value',count);


    if(count == datacount){
       
        $('#progressbar').css('display','none');
        $(".btnsync").css("display","block");
        $(".btnsearch").css("display","block");
         navigator.notification.alert(
                             'All data has been synced / 全部数据已同步',  // message
                             alertDismissed,         // callback
                             'Alert',            // title
                             'OK'                  // buttonName
                         );
    }
//alert("success");
    
}
function OnerrorDelete(err){
alert("Error message :"+err);
}

function OnsuccessDelete(){
//alert("success1");
    
}

function alertDismissed(){
    
}