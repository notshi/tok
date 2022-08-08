
var db=exports

let idb = require( "idb" )

let sheet = require( "./sheet.js" )


db.setup=async function()
{

	db.handle = await idb.openDB("tok", 1, {
		upgrade(handle) {
			let keyval=handle.createObjectStore('keyval')

			let answers=handle.createObjectStore("answers", {
				keyPath: "id",
				autoIncrement: true,
			})
			answers.createIndex("date", "date")
		},
	})
	
	db.uuid=await db.handle.get("keyval", "uuid" )
console.log("OLD: "+db.uuid)
	if(!db.uuid) // need to create 
	{
		db.uuid=require("uuid").v4()
		await db.handle.put("keyval", db.uuid , "uuid" )
console.log("NEW: "+db.uuid)
	}
}

db.add=async function(it)
{
	it.uuid=db.uuid // always sign our data
	await db.handle.add('answers', it )
	sheet.send(it)
}

/* I got bored reading the documentation (and it looks dumb) so lets just be dumb */
db.list=async function(filter)
{
	filter=filter || {}
	let its = await db.handle.getAllFromIndex('answers', 'date')
	let rs=[]
	for(let v of its) // look at all objects
	{
		let ok=true
		for(let t in filter) // check filter object
		{
			if(filter[t]!==v[t]) { ok=false } // all filters must be true
		}
		if(ok) // add filtered objects to result
		{
			rs.push(v)
		}
	}
	return rs // filtered only, sorted by date
}
