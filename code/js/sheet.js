
var sheet=exports

let $ = require( "jquery" )

let db = require( "./db_idb.js" )

// https://stackoverflow.com/questions/33713084/download-link-for-google-spreadsheets-csv-export-with-multiple-sheets


// read all data
sheet.googlesheet={
	csvurl:"https://docs.google.com/spreadsheets/d/1C4c1LsbZq4VT8tnwxKLRG68f_oR3y3WvGa6szI7gHOw/export?format=tsv&id=1C4c1LsbZq4VT8tnwxKLRG68f_oR3y3WvGa6szI7gHOw&gid=0",
	jsonurl:"https://docs.google.com/spreadsheets/d/1C4c1LsbZq4VT8tnwxKLRG68f_oR3y3WvGa6szI7gHOw/gviz/tq?tqx=out:json&sheet=approved",
}

// write new data

/*
sheet.googleform={
	posturl:"https://docs.google.com/forms/u/0/d/e/1FAIpQLSc_ARXKahOmySfkDwxmTkLwtUj0f-IWOdz9Dml59RonqieNdQ/formResponse",
	question:"entry.180249156",
	author:"entry.1959390788",
	body:"entry.666967899",
	uuid:"entry.xxxxx", // need this uuid
}
*/

// write new data ( my test delete this )
sheet.googleform={
	posturl:"https://docs.google.com/forms/u/0/d/e/1FAIpQLSfTeBkXcCLC45bUw8cDaW12NI_fpnF1_0mQGUN0J2UjwdQFiA/formResponse",
	uuid:"entry.651258802", // need this generated uuid to uniquely identify each user
	question:"entry.1393996306",
	author:"entry.1946140261",
	language:"entry.1072140922",
	body:"entry.806007134",
}

sheet.setup=async function()
{
	let gotcsv = await db.handle.get("keyval", "gotcsv" )
	if( gotcsv )
	{
		if( gotcsv < ( Date.now() - ( 1000 * 60 * 60 ) ) ) // auto fetch if data is older than an hour
		{
			sheet.fetch()
		}
	}
	else // first time go fetch
	{
		sheet.fetch()
	}
}

/*

fetch all the moderated data that we should display and then update the 
current database with it

*/
sheet.fetch=async function()
{
	window.google={}
	window.google.visualization={}
	window.google.visualization.Query={}
	window.google.visualization.Query.setResponse=async function(data) // this function name is hard coded?
	{
		console.log("GOT CSV")
		console.log(data)
		
		let head={}
		for(let i in data.table.cols)
		{
			let c=data.table.cols[i]
			if(c.label)
			{
				head[i]=c.label
				head[c.label]=i
			}
		}
		let rows=[]
		for(let r of data.table.rows)
		{
			let it={}
			for(let i in r.c)
			{
				let d=r.c[i]
				if(d && d.v)
				{
					it[ head[i]||"" ]=d.v
				}
			}
			if(it.Timestamp)
			{
				let s=it.Timestamp
				s=s.split("Date(").join("")
				s=s.split(")").join("")
				s=s.split(",")
				let t=new Date(s[0],s[1],s[2],s[3],s[4],s[5])
				it.date=t
			}
			if(it.uuid)
			{
				rows.push(it)
			}
		}
		console.log(rows)
		for(let r of rows)
		{
			await db.handle.add('answers', r )
		}
		await db.remove_duplicates()
		
		await db.handle.put("keyval", Date.now() , "gotcsv" )
		
		await tok.show_all_answers()
	}
	$.getScript( sheet.googlesheet.jsonurl+"&_="+(new Date).getTime() ) // time stamp cache breaker
}

/*
send a new row into the moderation queue
*/
sheet.send=async function(it)
{
	let data={}
	
	for(let n in it)
	{
		for(let t in sheet.googleform) // remap 
		{
			if(t==n)
			{
				data[ sheet.googleform[n] ]=it[n]
			}
		}
	}

// this posts OK but will generate errors... so we ignore them
	$.ajax({
		type: "POST",
		url: sheet.googleform.posturl,
		data: data,
		crossDomain: true,
		dataType: 'jsonp',
		headers: {
			"Access-Control-Allow-Origin":"*"
		}
	})

}
