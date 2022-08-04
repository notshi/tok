
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
	let post=$("#add_post").value()
	let name=$("#add_name").value()

	console.log("name = "+name)
	console.log("post = "+post)
	console.log("form submited")
}
