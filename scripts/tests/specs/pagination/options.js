(function( $ ) {
	"use strict";
	
	module( "Opções", {
		setup: function() {
			this.pagination = $( "#pagination" ).syoPagination();
		},
		teardown: function() {
			this.pagination.syoPagination( "destroy" );
		}
	});
	
	test( "items", function() {
		expect( 1 );
		
		this.pagination.syoPagination( "option", "items", 3 );
		strictEqual( this.pagination.find("ul > li").length, 3, "deve criar o número de itens certo" );
	});
	
}( jQuery ));
