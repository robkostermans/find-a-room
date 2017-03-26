# Find a room ... in 3d.
An attempt to learn about the basics of (web) 3d and webgl. I needed an idea for a final end-result; it helped to scope what to implement.
Its an overview of my office building (yes I work in an old church); it shows the meetingsroom and if they are avaialable.  

## Everything is better in 3d
I could do this application in html, css (3d transform) and svg, but wanted to see if I could imlement it in "true" 3d.

## Possibilities everywhere...
I build just a simple application; show the availability of the meetingrooms. The concept can be extended with an interface to actual book the room.
But you could also map an event; which presentation are in which location at what time, map sensor data, how busy certain rom are etc. etc. etc.

## Weapons of Choice
After some research I decided to use ThreeJS as a library wrapper for webgl; it is well documented and widely used with many examples available. In the proces I also decided to use TweenMaax as a animation framework just because it seemd to work prefectly with threejs and also made some basic animation an timing stuff easier; focus was learning webg/threejs and not more css-animation.

## Flat design .. in 3d.
I just wanted clean simple style. I experimented with shadows, textures but eventually chose to create s simple flat-like design for the 3d model. One application for the concept might be the integration within outlook, so I kept the style in line with the clean microsoft/office style.

## Raycasting ... just because explaining the concept makes you sound awesome.
Stuff need to be interactive; click stuff, hover effects etc etc. mainly to show it's more than a static image.  

## Fake it ... till you make it
The room-service (...) is a fake serice that randomly sets the availablity of the meetingsroom on page load.

## Messy
Currently the code is not the cleanest en most structured work I did (understatement). Maybe I will find some time to restructure it later.



 
