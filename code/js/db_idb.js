
var db=exports



let idb = require( "idb" )


db.setup=async function()
{

	db.handle = await idb.openDB("tok", 1, {
		upgrade(handle) {
			const store = handle.createObjectStore("answers", {
				keyPath: "id",
				autoIncrement: true,
			})
			store.createIndex("date", "date");
		},
	})

}

db.add=async function(it)
{
	await db.handle.add('answers', it )
}


db.list=async function(it)
{
	let its = await db.handle.getAllFromIndex('answers', 'date')

	return its
}
