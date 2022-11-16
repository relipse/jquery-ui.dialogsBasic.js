/** 
 * This is a jquery plugin which allows the simple creation of the 
 * three dialog boxes alert, prompt, and confirm using jQueryUI dialog 
 * boxes instead of the nasty browser boxes.
 * 
 * The dialog is created instantly and when it is closed it frees up resources by deleting itself.
 * 
 * jQuery is required.
 * jQuery-ui is required.
 * 
 * For example
 * @example
 * $.dialogsBasic('prompt', 'MESSAGE: Are you sure?', function(data){ console.log(data); });
 * $.dialogsBasic('prompt', 'PROMPT MESSAGE: Are you sure?', 'DIALOG TITLE: Are you really sure?', function(data){ console.log(data); });
 * $.dialogsBasic('confirm','Are you really sure?', function(data){ if (data == false){ console.log('Cancelled'); }else{ console.log('OK'); }});
 * or with the shortcut:
 * $.dlg('alert',"This is an alert message!");
 * 
 * @license
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 Jim Kinsman, Special thanks to Hand of Help Ministries (handofhelp.com)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function ( $ ) {
	//You can add more dialog types 
 	var possible_boxes = {
 		'prompt': {},
 		'confirm': {},
 		'alert': {}
 	}

    /** 
     * Allow stuff like this:
     * @example
     * $.dialogsBasic('prompt', 'Are you sure?', function(data){ console.log(data); });
     */
    $.dialogsBasic = function(dialog_type_or_opts, text_or_callback, title_or_callback, callback) {
    	var opts = {};

    	callback = callback || function(data){};

    	if (typeof(dialog_type_or_opts) == 'object'){
    		opts = dialog_type_or_opts;
    	}else{
    		opts.type = dialog_type_or_opts;
    	}

    	if (typeof(text_or_callback)=='string'){
    		opts.text = text_or_callback;
    	}else if (typeof(text_or_callback)=='function'){
    		callback = text_or_callback;
    	}

    	if (typeof(title_or_callback) == 'string'){
    		opts.title = title_or_callback;
    	}else if (typeof(title_or_callback) == 'function'){
    		callback = title_or_callback;
    	}

    	//allow the user to define his type
    	if (opts.new_popup){
    		possible_boxes[opts.type] = opts.new_popup;
    	}

    	if (!possible_boxes[opts.type]){
    		throw "Invalid popup type: "+opts.type;
    	}


		/**
		 * Returns a random integer between min (inclusive) and max (inclusive)
		 * Using Math.round() will give you a non-uniform distribution!
		 */
		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}


		//find an unused dialog id
		do{
			dlg_id = getRandomInt(1000,999999);

		}while($('#dialogsBasic_'+dlg_id).length > 0);

		var $mydialog = null;

		possible_boxes['prompt'].createHTML = function(id, title, text, input){
 				title = title || opts.title || 'Prompt';
 				text = text || opts.text || '';
 				input = input || opts.input || '<input type="text">';
 				$(document.body).append( $('<div>')
 						.attr('title', title)
 						.attr('id', id)
 						.html('<label>'+text+input+'</label>') );
 				//now make the enter key close the dialog box and click the OK button
 				//also focus the input first anyway
 				$('#'+id).find('input').keypress(function (e) {
				  if (e.which == 13) {
				   $(this).parent().find("button:eq(0)").trigger("click");
				    return false;    //<---- Add this line
				  }
				})[0].focus();
 			};

 		possible_boxes['prompt'].buttons = {
 			'OK': function(){
 				callback($mydialog.find('input').val());
 				$(this).dialog('close');
 			},
 			'Cancel': function(){
 				callback(null);
 				$(this).dialog('close');
 			}
 		}

 		possible_boxes['confirm'].buttons = {
 			'OK': function(){
 				callback(true);
 				$mydialog.dialog('close');
 			},
 			'Cancel': function(){
 				callback(false);
 				$mydialog.dialog('close');
 			}
 		}
		possible_boxes['confirm'].createHTML = function(id, title, text){
 				title = title || opts.title || 'Confirm';
 				text = text || opts.text || '';
 				$(document.body).append( $('<div>')
 						.attr('title', title)
 						.attr('id', id)
 						.html('<label>'+text+'</label>') );
 			};

 		possible_boxes['alert'].buttons = {
 			'OK': function(){
 				callback();
 				$mydialog.dialog('close');
 			}
 		}

		possible_boxes['alert'].createHTML = function(id, title, text){
 				title = title || opts.title || 'Alert';
 				text = text || opts.text || '';
 				$(document.body).append( $('<div>')
 						.attr('title', title)
 						.attr('id', id)
 						.html('<label>'+text+'</label>') );
 			};

 		//create the html structure and add it to the document.body
    	possible_boxes[opts.type].createHTML('dialogsBasic_'+dlg_id);
    	
    	opts.dlgopts = opts.dlgopts || {};

        var dlgopts = $.extend( {}, {
        	autoOpen: true,
        	buttons: possible_boxes[opts.type].buttons,
        	closeOnEscape: true,
        	draggable: true,
        	height: 'auto',
        	hide: null,
        	modal: true,
        	show: null,
        	width: 300,
        	close: function() {
		      	//destroy the dialog and then remove container div (we don't need it anymore)
		      	$(this).dialog('destroy').remove();
		      }
        }, opts.dlgopts );


		//if dlg options position is not set and we are going to cascade the position
		if (!dlgopts.position && opts.position_cascade){
			var lastDlg = null;
			$('.ui-dialog').each(function(){
				lastDlg = this;
			});
			if (lastDlg) {
				var position ={my: 'left top', at: 'left+10 top+10', of: lastDlg};
				dlgopts.position = position;
			}
		}
        //actually create and show the dialog
    	$mydialog = $('#dialogsBasic_'+dlg_id).dialog(dlgopts);
    	return $mydialog;
    };
 
 	//make a nice little shortcut to allow this to work like $.dlg('alert', 'This happened wrong');
 	if (!$.dlg){
 		$.dlg = $.dialogsBasic;
 	}
}( jQuery ));
