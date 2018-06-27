const micro = require('micro')
const fetch = require('node-fetch') // Fetch API Polyfill

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

module.exports = async function (req, res) {
    await getNPosts([1,2,3,4,5])

    await micro.send(res, 200, request_result)
}