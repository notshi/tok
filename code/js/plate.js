
var plate=exports


let plated = require( "plated" ).create({},{pfs:{}})

plate.chunks={}

plated.chunks.fill_chunks( require('fs').readFileSync(__dirname + '/../../plated/source/^.html', 'utf8'), plate.chunks )
plated.chunks.format_chunks( plate.chunks )


plate.replace=function(s){ return plated.chunks.replace(s,plate.chunks) }


plate.setup=async function()
{
	
}
