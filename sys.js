let tags = 'div,p,a,img,ul,li,span'.split(',')
function makeUp(keys) {
    let set = {}
    tags.forEach( key => set[key] = true)
    return function (tagName) {
        return !!set[tagName.toLowerCase()]
    }
}
let isHTMLTag = makeUp(tags)


