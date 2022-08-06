
var tok=exports



let $ = require( "jquery" )

let db = require( "./db_idb.js" )
let plate = require( "./plate.js" )


tok.setup=function(args)
{
	tok.args=args || {}		// remember args
	$(tok.start)			// wait for page to load then call start
}

tok.start=async function()
{
	await db.setup()
	await plate.setup()

	tok.binds()
	await tok.show_answers()
	
	console.log("TOK has started")
}


tok.binds=function()
{
	$("#add_form").submit(function(event){
		tok.add_form(event)
		event.preventDefault()
	})
}

tok.add_form=async function(event)
{
	let post=$("#add_post").val()
	let name=$("#add_name").val()
	let que =$("#add_que ").val()

	console.log("name = "+name)
	console.log("post = "+post)
	console.log("que  = "+que )
	console.log("form submitted")
	
	let it={}
	it.author=name
	it.body=post
	it.date=new Date()
	it.question=que
	
	await db.add(it)
	await tok.show_answers()
	$("#answer_wrap")[0].scrollIntoView({behavior:"smooth"});
}

tok.show_answers=async function(event)
{
	let answers = await db.list({question:"{main_question_code}"})
	answers.reverse()
	for(v of answers)
	{
		v.date_fix=v.date.toISOString().split('T')[0]
	}
	plate.chunks.answers=answers // a json array of answers
	$("#answer_wrap").html( plate.replace("{show_answers}") )
}
