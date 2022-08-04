
var tok=exports



let $ = require( "jquery" )

let db = require( "./db.js" )
let plate = require( "./plate.js" )


tok.setup=function(args)
{
	tok.args=args || {}		// remember args
	$(tok.start)			// wait for page to load then call start
}

tok.start=function()
{

	$("#add_form").submit(function(event){
		tok.add_form(event)
		event.preventDefault();
	})

	console.log("TOK has started")
}

tok.add_form=function(event)
{
	let post=$("#add_post").val()
	let name=$("#add_name").val()
	let que =$("#add_que ").val()

	console.log("name = "+name)
	console.log("post = "+post)
	console.log("que  = "+que )
	console.log("form submitted")
}
