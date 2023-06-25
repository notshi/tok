
var db=exports

let idb = require( "idb" )

let sheet = require( "./sheet.js" )


db.setup=async function(args)
{
	db.args=args

	db.handle = await idb.openDB("tok", 3, {
		upgrade(handle) {
			try{
				let keyval=handle.createObjectStore('keyval')
			}catch(e){console.error(e)}
			try{
				let answers=handle.createObjectStore("answers", {
					keyPath: "id",
					autoIncrement: true,
				})
				answers.createIndex("date", "date")
			}catch(e){console.error(e)}
		},
	})
	
	db.uuid=await db.handle.get("keyval", "uuid" )
	if(!db.uuid) // need to create 
	{
		db.uuid=require("uuid").v4()
		await db.handle.put("keyval", db.uuid , "uuid" )
	}
}

db.add=async function(it)
{
	it.uuid=db.uuid // always sign our data
	it.language=db.args.language // remember current language
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


// look at all answers and remove any duplicates so there is only one answer per uuid per question the most recent
db.remove_duplicates=async function()
{
	let map={}
	let its = await db.handle.getAllFromIndex('answers', 'date')
	its.reverse()
	for(let it of its)
	{
		let u=it.question+it.uuid
		if(map[u])
		{
//			console.log("DEL "+it.id)
			db.handle.delete("answers",it.id)
		}
		else
		{
//			console.log("KEEP "+it.id)
			map[u]=true
		}
	}
}


