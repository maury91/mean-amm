/**
 * This script is just for the moment, is the script of the old version
 * I convert this script in a jQuery Plugin in the next time
 */

function buildInputs() {
	/**
	* Input raggrupati (guarda su Accedi e capirai)
	**/

	/**
	* Funzione che mostra l'input successivo
	**/
	var oneAT_next = function() {
		/**
		* Input corrente e totale
		* variabili di supporto per le animazioni
		**/
		var current=$(this).data('current'),
			total=$(this).data('total'),
			that=$(this).children('div.container'),
			ch=that.children().eq(current);
		//Check current value (not empty)
		if ($.trim(ch.val()).length>0) {
			//Se Ã¨ l'ultimo input eseguo il submit e l'animazione
			if (total===current+1) {
				//Controllo esistenza funzione submit
				var submitFunc = $(this).data('onSubmit');
				if (typeof submitFunc === "function") {
					//Faccio sparire il contenuto e creo l'elemento animato
					$(this).children().fadeOut(200).end()
						.append($('<span class="waiting"/>'));
					//Chiamo la funzione di submit con due parametri : funzione per terminare l'animazioe di loading e inputs	
					submitFunc($.proxy(function(){
						//Il primo input deve tornare visibile
						var fi = $(this).find('div.container > input').hide().first().show();
						//Reset valori, i vecchi elementi tornano visibili e l'elemento waiting va cancellato
						$(this).data('current',0).children('span.waiting').remove()
							.end().children().stop().css('opacity','').show().filter('span.status').css('width','').end().filter('div.text').children().text(fi.data('text'));
					},this),that.children('input'));
				}
			} else {
				//Animazione next
				var t=$(this).children('div.text'),
					n=that.children().eq(++current),
					h=t.height();
				//Il testo mi serve di altezza fissa
				t.css('height', h);
				//Sposto il vecchio testo in alto e creo il nuovo sotto
				t.append($('<span/>').text(n.data('text')))
					.children('span').first().animate({marginTop : -h}, 400,function(){
						$(this).remove();
					});
				//Aggiorno il valore di current e animo la barra del progresso
				$(this).data('current',current).children('span.status').animate({width:(current/total*100)+'%'}, 400);
				//FadeOut vecchio input, fadeIn del nuovo
				ch.fadeOut(200, function() {
					n.fadeIn(200, function() {
						$(this).focus();
					});
				});
			}
		}
	}

	/**
	* Creazione dei oneAT
	**/
	$('.oneAT').each(function(index, el) {
		//Variabili di supporto e variabile per i clousure
		var mW=0,mH=0,
			inputContainer=$('<div class="container"/>'),
			that=this,
			//Text Ã¨ il testo da mostrare, in pratica quello del primo input, guarda la catena per capire meglio
			text=
				$(this).children().each(function(index, el) {
					//Ottengo la dimensione massima degli input
					var w,h;
						if (mW<(w=$(this).width()+parseFloat($(this).css('paddingLeft'))*2)) mW = w;
						if (mH<(h=$(this).height()+parseFloat($(this).css('paddingTop'))*2)) mH = h;
						//Bind dei dati e spostamento degli elementi in inputContainer
						$(this).data('text', $(this).attr('data-text')).removeAttr('data-text')
							.appendTo(inputContainer);
				})
				//Tutti gli input devono avere la dimensione del piÃ¹ grande
				.css({
					width: mW,
					height: mH
				}).hide().first().show().data('text');//Faccio rimanere visibile solo il primo
		//Setto le dimensione del elemento padre, e alcuni dati
		$(this).css({
				width: mW
			})
			.attr('tabindex', 0)
			.focus(function(e) {
				//Seleziona input corrente
				$(this).children('.container').children('input').eq($(this).data('current')).focus();
			})
			.data('current',0)
			.data('total',inputContainer.children().length)
			//Aggiungo tutto il contenuto
			.append($('<div class="text"/>').append($('<span/>').text(text)))
			.append(inputContainer.height(mH+2))
			.append($('<span class="status"/>'));
		//Aggiungo la freccia a destra
		inputContainer.append($('<span class="icon-next"/>').click(function(event) {
			//Go to next
			oneAT_next.call(that);
		})).children().focus(function(event) {
			//La freccia destra appare quando selezioni per la prima volta
			$(this).parent().children('span.icon-next').fadeIn();
		});
	}).keydown(function(e) {
		//Ma devo anche commentarla questa?
		switch (e.keyCode) {
			case 13 :
				//Go to next
				oneAT_next.call(this);
			case 9 :
				//Disable Tab
				e.preventDefault();
				//Go to next
				oneAT_next.call(this);
			break;
		}
	});

	
};