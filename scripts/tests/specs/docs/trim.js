(function() {
	"use strict";
	
	module( "Trim" );
	
	test( "Deve remover a identação do HTML e transformar tabs em spaces", function() {
		expect( 1 );
		
		var html = "\t\t\t<div>\n\t\t\t\t<b>\n\t\t\t\t</b>\n\t\t\t</div>";
		var result = window.trim( html );
		
		strictEqual( result, "<div>\n    <b>\n    </b>\n</div>" );
	});
	test( "Deve desconsiderar caracteres de quebra de linha antes da identação", function() {
		expect( 1 );
		
		var html = "\n<h1>...</h1>";
		var result = window.trim( html );
		
		strictEqual( result, "<h1>...</h1>" );
	});
	test( "Deve substituir os tabs de múltiplos níveis de identação", function() {
		expect( 1 );
		
		var html = "\t\t\t<div>\n\t\t\t\t<b>\n\t\t\t\t\ttest\n\t\t\t\t</b>\n\t\t\t</div>";
		var result = window.trim( html );
		
		strictEqual( result, "<div>\n    <b>\n        test\n    </b>\n</div>" );
	});
}());
