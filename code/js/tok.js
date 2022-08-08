
var tok=exports



let $ = require( "jquery" )

let db = require( "./db_idb.js" )
let plate = require( "./plate.js" )
let sheet = require( "./sheet.js" )

let ques=[
	"p1q1","p1q2","p1q3","p1q4","p1q5",
	"p2q1","p2q2","p2q3","p2q4","p2q5",
	"p3q1","p3q2","p3q3","p3q4","p3q5",
	"p4q1","p4q2","p4q3","p4q4","p4q5",
]
tok.setup=function(args)
{
	tok.args=args || {}		// remember args
	$(tok.start)			// wait for page to load then call start
}

tok.start=async function()
{
	await db.setup()
	await plate.setup()
	await sheet.setup()

	tok.binds()
	for(let que of ques) // try and fill in all questions on page
	{
		await tok.show_answers(que)
	}
	
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
	it.question=que
	it.author=name
	it.body=post
	it.date=new Date()
	
	await db.add(it)
	await tok.show_answers(que)

	let w=$("#answer_wrap_"+que)
	if(w.length>0)
	{
		w[0].scrollIntoView({behavior:"smooth"});
	}
}

tok.show_answers=async function(que)
{
	let w=$("#answer_wrap_"+que)
	if(w.length>0)
	{
		let answers = await db.list({question:que})
		answers.reverse()
		for(v of answers)
		{
			v.date_fix=v.date.toISOString().split('T')[0]
		}
		plate.chunks.answers=answers // a json array of answers
		w.html( plate.replace("{show_answers}") )
	}
}
