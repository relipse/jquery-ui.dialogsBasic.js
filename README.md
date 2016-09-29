# jquery-ui.dialogsBasic.js

Replace those nasty browser confirm, alert, and prompt boxes with nice jquery-ui versions.

$.dlg('alert',"This is an alert message!");
$.dlg('confirm',"Are you sure?", function(data){ if (data){ console.log('You clicked OK'); }else{ console.log('You clicked Cancel'); });
$.dlg('prompt','What is your name', function(data){ if (data !== null){ console.log("Hello " + data); } });

Try it out!
