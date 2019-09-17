const ip = require ("public-ip")
const cloudflare = require ("cloudflare")

const CF_DEBUG = process.env.CF_DEBUG === "true"
const CF_TOKEN = process.env.CF_TOKEN
const CF_ZONE = process.env.CF_ZONE
const CF_RECORD_NAME = process.env.CF_RECORD_NAME
const CF_RECORD_PROXIED = process.env.CF_RECORD_PROXIED === "true"
const CF_RECORD_TTL = parseInt ( process.env.CF_RECORD_TTL ) || 1

function message ( action, name, content ) {
	action = action.charAt ( 0 ).toUpperCase () + action.substring ( 1 )
	const message = `${action} A record for ${name} to point to ${content}.`
	console.log ( "Action:", message )
}

function errorHandler ( error ) {
	const message = CF_DEBUG ? JSON.stringify ( error, null, 4 ) : error.message
	console.error ( "Error:", message )
	process.exit ( 1 )
}

if ( !CF_TOKEN ) {
	errorHandler ({ message: "Must include CF_TOKEN env var" })
}

if ( !CF_ZONE ) {
	errorHandler ({ message: "Must include CF_ZONE env var" })
}

if ( !CF_RECORD_NAME ) {
	errorHandler ({ message: "Must include CF_RECORD_NAME env var" })
}

if ( CF_DEBUG ) {
	console.log ( "CF_DEBUG:", CF_DEBUG )
	console.log ( "CF_TOKEN:", CF_TOKEN )
	console.log ( "CF_ZONE:", CF_ZONE )
	console.log ( "CF_RECORD_NAME:", CF_RECORD_NAME )
	console.log ( "CF_RECORD_TTL:", CF_RECORD_TTL )
	console.log ( "CF_RECORD_PROXIED:", CF_RECORD_PROXIED )
	console.log ("")
}

async function run () {
	const address = await ip.v4 ()
	const cf = cloudflare ({ token: CF_TOKEN })
	cf.dnsRecords.browse ( CF_ZONE )
		.then ( records => {
			var target = {
				type: "A",
				name: CF_RECORD_NAME,
				content: address,
				ttl: CF_RECORD_TTL,
				proxied: CF_RECORD_PROXIED
			}
			var current = records.result.find ( record =>
				record.type === target.type &&
				record.name === target.name
			)
			if ( current ) {
				if ( current.content !== address ) {
					message ( "updating", CF_RECORD_NAME, address )
					return cf.dnsRecords.edit ( CF_ZONE, current.id, target )
						.then ( response => response.result )
						.catch ( errorHandler )
				}
				return current
			}
			else {
				message ( "creating", CF_RECORD_NAME, address )
				return cf.dnsRecords.add ( CF_ZONE, target )
					.then ( response => response.result )
					.catch ( errorHandler )
			}
		})
		.then ( result => {
			if ( CF_DEBUG ) {
				console.log ( "Record:", JSON.stringify ( result, null, 4 ) )
			}
		})
		.catch ( errorHandler )
}

run ()
