# jquery-ui.dialogsBasic.js

Replace those nasty browser confirm, alert, and prompt boxes with nice jquery-ui versions.

```javascript
$.dlg('alert',"This is an alert message!");
$.dlg('confirm',"Are you sure?", function(data){ if (data){ console.log('You clicked OK'); }else{ console.log('You clicked Cancel'); });
$.dlg('prompt','What is your name', function(data){ if (data !== null){ console.log("Hello " + data); } });

//if you want to cascade the dialog boxes and no be modal, use this
$.dlg({type:'alert',dlgopts:{modal: false}, position_cascade: true},"This is an alert message!",);
```
Try it out!
