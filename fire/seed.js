const firebase = require('firebase')
require('firebase/firestore')
require('./setup')(firebase)

const db = firebase.firestore()
// get reference to our data


// in node, ~ is not a correct alias
const seed = require('../data/colors')
const {rgb2hex, rgb2hsv, hsv2hsl} = require('color-functions')

const colors = db.collection('colors')

// TODO: Seed the database with colors
let i = seed.length; while(--i >= 0)  {
  // const name = entry.name, color = entry.color
  // then {} plucks only its contents
  const {name, color : {r, g, b} } = seed[i]
  const id = rgb2hex(r,g,b)
  // cannot simply do hsv2hsl(rgb2hsv(r,g,b))
  // because hsv is expected
  const hsv = rgb2hsv(r,g,b)
  const {h,s,l}  = hsv2hsl(hsv.h, hsv.s, hsv.v)

  colors.doc(id).set({
    red: r, green: g, blue: b,
    hue: h, saturation: s, luminance: l,

    // take the computed value of this
    //expression and use it as a key
    // ['names.${name}']:true,
    names: {
      [name] : true
    },
  },{merge: true })
    .then(() =>
    console.log(`wrote ${id} as ${name}`))
    .catch(console.error)
  }
