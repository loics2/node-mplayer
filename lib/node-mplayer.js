/*globals require, module*/
var cp = require('child_process'),
  events = require('events'),
  fs = require('fs'),
  readline = require('readline'),
  spawn = cp.spawn
  validUrl = require('valid-url');

function Mplayer(path, addArgs){
  this.childProc = null;
  this.file = "";
  this.rl = null;
  this.playing = false;
  this.volume = 100;
  if(typeof path !== 'undefined')
    this.setFile(path);

  events.EventEmitter.call(this);

  cp.exec('mplayer', function(err, stdout, stdin){
    if(err)
      throw new Error("Mplayer encountered an error or isn't installed.");
  });
}

Object.setPrototypeOf(Mplayer.prototype, events.EventEmitter.prototype);

Mplayer.prototype.play = function(opts) {
  if(this.file !== null){
    if(opts && opts.volume)
      this.volume = opts.volume;

    var args = ['-slave', '-quiet', '--volume='+this.volume, this.file],
      that = this;

    if(opts && opts.additionnalArgs)
      args = args.concat(opts.additionnalArgs);

    this.childProc = spawn('mplayer', args);
    this.playing = true;

    if(opts && opts.loop)
      this.setLoop(opts.loop);

    this.childProc.on('error', function(error){
      that.emit('error');
    });

    this.childProc.on('exit', function(code, sig){
      if(code === 0 && sig === null){
        that.playing = false;
        that.emit('end');
      }
    });

    this.rl = readline.createInterface({
      input: this.childProc.stdout,
      output: this.childProc.stdin
    });
  }
};

Mplayer.prototype.checkPlaying = function(){
  return this.playing;
};

Mplayer.prototype.quit = function() {
  if(this.childProc !== null){
    this.playing = false;
    this.childProc.stdin.write('quit\n');
  }
};

Mplayer.prototype.getPercentPosition = function(callback) {
  if(this.childProc !== null){
    this.rl.question("get_percent_pos\n", function(answer) {
      callback(answer.split('=')[1]);
    });
  }
};

Mplayer.prototype.stop = function() {
  if(this.childProc !== null){
    this.childProc.stdin.write('stop\n');
    this.playing = false;
  }
};


Mplayer.prototype.pause = function() {
  if(this.childProc !== null){
    this.childProc.stdin.write('pause\n');
  }
};

Mplayer.prototype.mute = function() {
  if(this.childProc !== null){
    this.childProc.stdin.write('mute\n');
  }
};

Mplayer.prototype.setVolume = function(volume) {
  if(this.childProc !== null){
    this.volume = volume;
    this.childProc.stdin.write('volume ' + volume + ' 1\n');
  }
};

Mplayer.prototype.seek = function(sec) {
  if(this.childProc !== null){
    this.childProc.stdin.write('seek ' + sec + ' 2\n');
  }
};

Mplayer.prototype.setLoop = function(times) {
  if(this.childProc !== null){
    this.childProc.stdin.write('loop ' + times + '\n');
  }
};

Mplayer.prototype.setSpeed = function(speed) {
  if(this.childProc !== null){
    this.childProc.stdin.write('speed_set ' + speed + '\n');
  }
};

Mplayer.prototype.setFile = function(path) {
  if(this.childProc){
    this.quit();
  }
  if(fs.existsSync(path) || validUrl.isUri(path))
    this.file = path;
  else
    throw new Error("File '" + path + "' not found!");
};

Mplayer.prototype.getTimeLength = function(callback) {
  if(this.childProc !== null){
    this.rl.question("get_time_length\n", function(answer) {
      callback(answer.split('=')[1]);
    });
  }
};

Mplayer.prototype.getTimePosition = function(callback) {
  if(this.childProc !== null){
    var that = this;
    this.rl.question("get_time_pos\n", function(answer) {
      var splittedAns = answer.split('=');

      if (splittedAns[0]=='ANS_TIME_POSITION'){
        callback(splittedAns[1]);
      }
      else{
        // Try again :(
        that.getTimePosition(callback);
      }
    });
  }
};

Mplayer.prototype.getVolume = function(callback) {
  return callback(this.volume);
}

module.exports = Mplayer;