(function( $ ) {
	"use strict";
	
	var Modernizr = window.Modernizr;
	
	$.widget( "ui.syoPopover", {
		version: "@VERSION",
		options: {
			title: "",
			element: null,
			position: "top",
			
			// Opções de animação
			show: null,
			hide: null
		},
		
		classes: {
			widget: "syo-popover",
			titlebar: "syo-popover-titlebar",
			title: "syo-popover-title",
			close: "syo-popover-close",
			arrow: "syo-popover-arrow",
			content: "syo-popover-content",
			hidden: "syo-hidden"
		},
		
		_isOpen: false,
		parent: null,
		
		_create: function() {
			// Guarda posição atual pra quando chamar destroy restaurar
			this.oldPosition = {
				parent: this.element.parent(),
				index:  this.element.parent().children().index( this.element )
			};
			
			this.refresh();
			this._setupEvents();
			
			// Seta novamente, pro caso do cara não ter passado a propriedade na inicialização
			this._setOption( "element", this.options.element );
		},
		
		_setOption: function( key, value ) {
			if ( key === "element" ) {
				// Se valor falso passado, utiliza o primeiro elemento do body.
				value = value || document.body.children[ 0 ];
				
				if ( value instanceof $ || value.nodeType || typeof value === "string" ) {
					this.parent = $( value );
					this._super( key, value );
					this._position();
				}
				
				return;
			}
			
			if ( key === "position" ) {
				value = value.toLowerCase();
				
				if ( !/(top|right|bottom|left)(-(start|end))?/.test( value ) ) {
					value = "top";
				}
			}
			
			this._super( key, value );
			this.refresh();
		},
		
		_setupEvents: function() {
			// Fecha no click do closethick
			$( this.popover ).on(
				"click." + this.widgetEventPrefix,
				"." + this.classes.close,
				$.proxy( this.close, this )
			);
			
			if ( Modernizr && Modernizr.touch ) {
				// Fecha no tap do title
				$( this.popover ).on(
					"tap." + this.widgetEventPrefix,
					"." + this.classes.titlebar,
					$.proxy( this.close, this )
				);
			}
		},
		
		_getTitle: function() {
			if ( this.options.title instanceof $ || this.options.title.nodeType ) {
				return $( this.options.title ).html();
			} else if ( !this.options.title ) {
				return "";
			}
			
			return this.options.title.toString();
		},
		
		_position: function() {
			if ( !this._isOpen ) {
				return;
			}
			
			var position = {};
			var positionValue = this.options.position.split("-");
			var myPos = this.parent.offset();
			var posClassPrefix = this.classes.widget + "-";
			var posClass = this.options.position;
			
			switch ( positionValue[ 0 ] ) {
				case "top":
					position.at = "center top-20";
					position.my = "center bottom";
					break;
					
				case "right":
					position.at = "right+20 center";
					position.my = "left center";
					break;
					
				case "bottom":
					position.at = "center bottom+20";
					position.my = "center top";
					break;
					
				case "left":
					position.at = "left-20 center";
					position.my = "right center";
					break;
			}
			
			if ( positionValue[ 1 ] ) {
				var atStart = positionValue[ 1 ] === "start";
				
				if ( positionValue[ 0 ] === "top" || positionValue[ 0 ] === "bottom" ) {
					position.at = position.at.replace( "center", atStart ? "left" : "right" );
				} else {
					position.at = position.at.replace( "center", atStart ? "top" : "bottom" );
				}
				
				position.my = position.my.replace(
					"center",
					atStart ? "center+40%" : "center-40%"
				);
			}
			
			position.of = this.parent;
			position.within = this.parent;
			
			// @FIXME collision = flip não funciona no Firefox Android :'(
			position.collision = "none";
			
			position = this.popover.position( position ).offset();
			
			// Adiciona a classe certa, de acordo com a posição do popover em relação ao botão
			if ( positionValue[ 0 ] === "top" || positionValue[ 0 ] === "bottom" ) {
				posClass = position.top > myPos.top ? "bottom" : "top";
			} else {
				posClass = position.left > myPos.left ? "right" : "left";
			}
			
			posClass += positionValue[ 1 ] ? "-" + positionValue[ 1 ] : "";
			
			// Removemos outras classes de posicionamento do popover e setamos uma nova
			this.popover
				.attr( "class", this.classes.widget )
				.addClass( posClassPrefix + posClass );
		},
		
		isOpen: function() {
			return this._isOpen;
		},
		
		open: function() {
			this.popover.show( this.options.show );
			
			// Reposiciona o popover com o elemento
			this._isOpen = true;
			this._position();
		},
		
		close: function( e ) {
			// Evita que aconteça um "double tap" em touch devices
			if ( e instanceof $.Event ) {
				e.stopPropagation();
				e.preventDefault();
			}
			
			this._isOpen = false;
			this.popover.hide( this.options.hide );
		},
		
		refresh: function() {
			// Se ainda não existe o popover, cria ele
			if ( !this.popover ) {
				this.popover = $( "<div />", {
					class: this.classes.widget
				}).appendTo( document.body );
				
				this.popover.append(
					"<div class='" + this.classes.arrow + "'></div>" +
					"<div class='" + this.classes.titlebar + "'>" +
						"<div class='" + this.classes.title + "'></div>" +
						"<div class='" + this.classes.close + "'>" +
							"<i class='icon-cancel-circle'></i>" +
						"</div>" +
					"</div>"
				);
				
				// Seta o elemento em que foi chamado o plugin como conteudo do popover
				this.popover.append( this.element.addClass( this.classes.content ) );
			}
			
			this.popover
				// Seta o titulo no popover
				.find( "." + this.classes.title )
					.html( this._getTitle() );
			
			// Reposiciona o popover, se ele estiver aberto
			this._position();
		},
		
		// Sobrescreve o método pai 'widget', do jQuery UI, e retorna o que interessa
		widget: function() {
			return this.popover;
		},
		
		_destroy: function() {
			var oldPosition = this.oldPosition,
				next = oldPosition.parent.children().eq( oldPosition.index );
			
			// Não tenta colocar o popover próximo dele mesmo.
			if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
				this.element.insertBefore( next );
			} else {
				oldPosition.parent.append( this.element );
			}
			
			this.element.removeClass( this.classes.content );
			this.popover.remove();
		}
	});

}( jQuery ));
