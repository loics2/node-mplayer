node-mplayer
============

A node.js wrapper for MPlayer on Linux. Use it to play music on your sound card!

## Usage

First, install the module with (assuming you already installed MPlayer)

    npm install node-mplayer

Then, you need to make a new instance of the module. The constructor of the module can take the path of the file to play. 

    var Mplayer = require('node-mplayer'); 
    
    var player1 = new Mplayer('/home/node/Music/Kalimba.mp3');
    var player2 = new Mplayer('http://mysite.com/myfile.mp3');
    var player3 = new Mplayer();
    
## Available methods

###  play

This method will play the file defined when the player object was instanciated or setted with `setFile()`. This method MUST be called before any other. 
It can take in parameter an object that contains the volume, the number of times to play the file (see `setVolume` and `setLoop`) and an array of additionnal arguments to pass to MPlayer.

    player.play();
    player.play({volume: 50});
    player.play({volume: 50,
                loop: 10});
    player.play({additionnalArgs: ['-ao alsa:device=hw']});


### checkPlaying

This method indicates if the player is currently playing something.

    player.checkPlaying();  //returns true if playing, false if not

### stop

This method will stop the played file. 

    player.stop();


### quit

This Method will close the underlying process

    player.quit();
    
### pause

This one will toggle pause.

    player.pause();
    
### mute

The method to toggle mute

    player.mute();
    
### setVolume

This method is used to set the volume. It takes one parameter, the volume value that can go from 1 to 100.

    player.setVolume(52);    //will set the volume to 52%

### seek

This method is used to navigate in the playing file. It take one parameter, the seek value in seconds that goes from 0 to the end of the file. This value is absolute.

    player.seek(50);    //will go to 50 seconds

### setLoop

This will set the number of times to replay the file. The parameter is the number of times, -1 is forever.

    player.setLoop(20);    //will play the file 20 times
    
### setSpeed

This will set the playing speed. It takes one parameter, the speed. 1 is the default speed.

    player.setSpeed(0.5);    //will play the file 0.5x slower
    player.setSpeed(20);    //will play the file 20x faster
    
### setFile

This one is used to set the file to play. The changes will take effect after calling the `play()` method. It takes the path of the file in parameter.

    player.setFile('/home/node/Music/asdf.mp3');

### getTimeLength

Returns the length of the file in seconds. It needs a callback.

    player.getTimeLength(function(length){
        console.log(length);
    });

### getTimePosition

Returns the elapsed play time in seconds. It needs a callback.

    player.getTimePosition(function(elapsedTime){
        console.log(elapsedTime);
    });

### getPercentPosition

Return the elapsed time in percent. It needs a callback.

    player.getPercentPosition(function(elapsedPercent){
        console.log(elapsedPercent);
    });


### getVolume

Return the current volume. It needs a callback.

    player.getVolume(function(currentVolume){
        console.log(currentVolume);
    });

##Events

### end

The end event is emitted when the file has ended.

### error

The error event is emitted when an error has ocurred.

## Stability

The latest tests of this module were made on Ubuntu 15.10 with MPlayer2 2.0-728-g2c378c7-4build1

## Contributing

Any contribution is welcome! Just create a pull request, and I'll take a look as soon as possible.

## Credits

Here's a list of people who contributed to this project :

* [Maocx](https://github.com/Maocx)
* [lacrioque](https://github.com/lacrioque)
* [nkcr](https://github.com/nkcr)
