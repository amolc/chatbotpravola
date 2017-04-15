  'use strict';

  var ChatModule = angular.module('mybot',['angular-storage']);

  ChatModule.config(['storeProvider',function(storeProvider)
      {storeProvider.setStore('sessionStorage');}
    ]);
  ChatModule.factory('socket', ['$rootScope', function($rootScope) {
    var socket = io.connect();
    return {
      on: function(eventName, callback){
        socket.on(eventName, callback);
      },
      emit: function(eventName, data) {
        socket.emit(eventName, data);
      }
  };
  }]);
  ChatModule.controller('botCtrl',function($scope,$http,$sce,$timeout,socket,store){
  $scope.session_id = store.get('session_id')||{};
  if(!store.get('session_id')){
    $scope.session_id = store.set('session_id',Math.random(10));
    $scope.session_id = store.get('session_id');
  }
  var label="whereto";
  if(!store.get('label')){
    $scope.label = store.set('label','whereto');
     label="whereto";
  }
  $scope.label = store.set('label','whereto');

  $("#bot").empty();
  $($scope.resp).appendTo('#bot');

	function setInput(text) {
			$("#input").val(text);
			send();
	}
  var Fake = [
    'Hello I am Julia,Your personal flight assistant..!!',
    'Where do you wanna fly today ?',
    '<div><h4>Great, I have listed few types, choose your desired one:</h4>Enter whichever you want..!!<button >1. very light jet</button><button>2. Light jet</button><button>3. Meduim size jet</button><button>4. super meduim jet</button><button>5. heavy jet</button><button>6. turbo pro jet</button></div>'
    ]
  var $messages = $('.messages-content'),
      d, h, m,
      i = 0;

  $messages.mCustomScrollbar();
  function updateScrollbar() {
      $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }

  function setDate(){
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
  }
 
  $('.message-submit').click(function() {
     
      insertMessage();
  });

  $("#chatinput").keypress(function(event) {
    if (event.which == 13) {
     
      insertMessage();
    }
  });

  function insertMessage() {
    var msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    
    console.log('message',msg);

    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
    emitmsg(msg);
  }



  socket.on('getresponse',function(response){


        if(response.nextlabel=="toairports" || response.nextlabel=='fromairports'){
           label=response.nextlabel ;
          store.set('label',response.nextlabel);
          console.log('reponse.label',response.nextlabel);
          setTimeout(function() {
            $('.message.loading').remove();
            if( response.status == 'success' ){
              console.log('success msg' , response.msg);
              console.log('response length' , response.msg.results.length);
              if(response.nextlabel=="toairports"){
                   store.set('toairports',response.msg);
              }
              else{
                   store.set('fromairports',response.msg);
              }
              if(response.msg.results.length>0){
                for(var i=0; i<response.msg.results.length; i++){
                
                  var srno = i+1 ;
                 $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>'+ srno + '. ' + response.msg.results[i].name + '</div>').appendTo($('.mCSB_container')).addClass('new');
                }
              }
               else{
                 $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + response.msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
               }
            }
            else{

                $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + response.msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
            }
            setDate();
            updateScrollbar();
          }, 2000);
        }
        else if(response.nextlabel=="whichplane"){
             label=response.nextlabel ;
            console.log('label:116',response.nextlabel);
            store.set('label',response.nextlabel);
            console.log(response);
            setTimeout(function() {
            $('.message.loading').remove();
            if( response.status == 'success' ){
              console.log('success msg' , response.msg);
              console.log('response length' , response.msg.results.length);
              store.set('planes',response.msg);
              if(response.msg.results.length>1){
                for(var i=0; i<response.msg.results.length; i++){
                 $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>'+ response.msg.results[i].id + '. ' + response.msg.results[i].name + ' US '+response.msg.results[i].costperhr +'/hr</div>').appendTo($('.mCSB_container')).addClass('new');
                }
              }
               else{
                 $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + response.msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
               }
            }
            else{

                $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + response.msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
            }
            setDate();
            updateScrollbar();
          }, 200);

        }
        else{
            label=response.nextlabel ;
            store.set('label',response.nextlabel);
            console.log(response);
            setTimeout(function() {
            $('.message.loading').remove();
            if( response.status == 'success' ){
              console.log('success msg' , response.msg);
              console.log('response length' , response.msg.results.length);
              if(response.msg.results.length>1){
                for(var i=0; i<response.msg.results.length; i++){
                 $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>'+ response.msg.results[i].id + '. ' + response.msg.results[i].name + '</div>').appendTo($('.mCSB_container')).addClass('new');
                }
              }
               else{
                 $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + response.msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
               }
            }
            else{

                $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + response.msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
            }
            setDate();
            updateScrollbar();
          }, 200);
        }
        
        
  });

  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + Fake[0] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    $('<div class="message new">' + Fake[1] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
  }, 100);

  function emitmsg(msg) {
    //console.log({'msg':msg});
    var data = {}
    data.sessionId = store.get('session_id');
    data.label = store.get('label') ;
    data.msg = msg;
    /* Let's store the sessionid and count in localstorage */
    if(data.label=="whereto"){
      console.log('data',data);
      store.set('whereto',msg);
       socket.emit('apicall', data);
    }
    else if(data.label=="toairports"){
      var airports = store.get('toairports');
      console.log('airports',airports);
                 
                 var selectAirport = data.msg-1 ;

                  store.set('toairport',airports.results[selectAirport].name);
                  store.set('toairportlat',airports.results[selectAirport].geometry.location.lat);
                  store.set('toairportlng',airports.results[selectAirport].geometry.location.lng);
                  
                  console.log('toairport',airports.results[selectAirport].name);
                  console.log('toairportlat',airports.results[selectAirport].geometry.location.lat);
                  console.log('toairportlng',airports.results[selectAirport].geometry.location.lng);


      console.log('data',data);
      socket.emit('apicall', data);
    }
    else if(data.label=="fromwhere"){
    store.set('fromwhere',msg)
       console.log('data',data);
      socket.emit('apicall', data);
    }
    else if(data.label=="fromairports"){
      var airports = store.get('fromairports');
      console.log('airports',airports);
     var selectAirport = data.msg-1 ;

                  store.set('fromairport',airports.results[selectAirport].name);
                  store.set('fromairportlat',airports.results[selectAirport].geometry.location.lat);
                  store.set('fromairportlng',airports.results[selectAirport].geometry.location.lng);
                  
                  console.log('fromairport',airports.results[selectAirport].name);
                  console.log('fromairportlat',airports.results[selectAirport].geometry.location.lat);
                  console.log('fromairportlng',airports.results[selectAirport].geometry.location.lng);
      console.log('data',data);

      
      socket.emit('apicall', data);
    }
    else if(data.label=="startdate"){
      
      store.set('startdate',msg)
      console.log('data',data);
      socket.emit('apicall', data);
    }
    else if(data.label=="starttime"){
    store.set('starttime',msg)
     console.log('data',data);
      socket.emit('apicall', data);
    }
    else if(data.label=="whichplane"){
      var planes = store.get('planes');
      console.log('planes',planes);
      for ( var index = 0; index < planes.results.length; index++ ) {
                      console.log(planes.results[index]);
                      if(data.msg==planes.results[index].id){
                        console.log('Matched Plane',planes.results[index].name);
                        store.set('plane-type',planes.results[index].name);
                        store.set('plane-speed',planes.results[index].speed);
                        store.set('plane-range',planes.results[index].range);
                        store.set('plane-costperhr',planes.results[index].costperhr);

                      }
                    
                    }
     console.log('data',data);
      socket.emit('apicall', data);
    }
    else if(data.label=="returnboolen"){
    store.set('returnboolen',msg)
     console.log('data',data);
     socket.emit('apicall', data);
    }
     else if(data.label=="returndate"){
    store.set('returnboolen',msg)
     console.log('data',data);
     socket.emit('apicall', data);
    }
     else if(data.label=="summary"){
    store.set('summary',data)
    console.log('data',data);
     socket.emit('apicall', data);
    }
    else if(data.label=="email"){
    store.set('email',msg);
    data.whereto = store.get('whereto');
    data.toairport = store.get('toairport');
    data.toairportlat = store.get('toairportlat');
    data.toairportlng = store.get('toairportlng');
    data.fromwhere = store.get('fromwhere');
    data.fromairport = store.get('fromairport');
    data.fromairportlat = store.get('fromairportlat');
    data.fromairportlng = store.get('fromairportlng');
    data.startdate = store.get('startdate');
    data.starttime = store.get('starttime');
    data.planetype = store.get('plane-type');
    data.planespeed = store.get('plane-speed');
    data.planerange = store.get('plane-range');
    data.planecostperhr = store.get('plane-costperhr');
    data.returnboolen = store.get('returnboolen');
    data.email = store.get('email');
    console.log('data',data);
      socket.emit('apicall', data);
    }
   
  }



});
