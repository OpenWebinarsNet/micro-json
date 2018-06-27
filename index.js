const micro = require('micro')
const fetch = require('node-fetch') // Fetch API Polyfill
const httpHash = require('http-hash')

const hash = new httpHash();

let uri = 'https://jsonplaceholder.typicode.com/posts'

let request_result = []

function getNPosts(arrayOfN)
{
    arrayOfN.forEach(async function (postId) {
        await fetch(`${uri}/${postId}`)
            .catch(err => console.log(err))
            .then(r => r.json())
            .then(data => {
                if(!havePost(data.id)) {
                    request_result.push(data)
                }
            })
    });
}

function havePost(id)
{
    let contain = false;
    request_result.forEach(post => {
        if(post.id == id)
        {
            contain = true
        }
    })

    return contain
}

hash.set('/', async function (req, res) {
    await getNPosts([1,2,3,4,5])

    await micro.send(res, 200, request_result)
})

hash.set('/start', (req, res) => {
    micro.send(res, 200, { status: 200, message: 'Starting the self-diriving car... Please wait :)' })
})

module.exports = async function (req, res) {
    let match = hash.get(req.url)

    if(match.handler)
    {
        try {
            return match.handler(req, res)
        }
        catch (e) {
            micro.send(res, 500, { error: e.message })
        }
    }
}