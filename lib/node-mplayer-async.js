/*globals require, module*/
var cp = require('child_process'),
    events = require('events'),
    fs = require('fs'),
    Q = require('q'),
    readline = require('readline'),
    spawn = cp.spawn;

function Mplayer(path){
    this.childProc = null;
    this.file = "";
    this.rl = null;
    this.playing = false;
    if(typeof path !== 'undefined')
        this.setFile(path);

    events.EventEmitter.call(this);

    cp.exec('mplayer', function(err, stdout, stdin){
        if(err)
            throw new Error("Mplayer encountered an error or isn't installed.");
    });
}

Mplayer.setPrototypeOf(Mplayer.prototype,events.EventEmitter.prototype);

Mplayer.prototype.play = function(opts) {
    if(this.file !== null){
        var args = ['-slave', '-quiet', this.file],
            that = this;

        this.childProc = spawn('mplayer', args);
        this.playing = true;
        
        if(typeof opts !== 'undefined'){
            if(typeof opts.volume !== 'undefined')
                this.setVolume(opts.volume);

            if(typeof opts.loop !== 'undefined')
                this.setLoop(opts.loop);
        }

        this.childProc.on('error', function(error){
            that.emit('error');
        });

        this.childProc.on('exit', function(code, sig){
            if(code === 0 && sig === null)
                that.emit('end');
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

Mplayer.prototype.getPercentPosition = function() {
    var def = Q.defer();
    if(this.childProc !== null){
        this.rl.question("get_percent_pos\n", function(answer) {
            def.resolve(answer.split('=')[1]);
        });
    }
    return def.promise;
};

Mplayer.prototype.getMetaData = function() {
    var deferred = Q.defer(),
        getMetaTitle = function(){
            var def = Q.defer();
            this.rl.question("get_meta_title\n", function(answer) {
                fileData.title = answer.split('=')[1];
                def.resolve();
            });
            return def.promise;
        },
        getMetaAlbum = function(){
            var def = Q.defer();
            this.rl.question("get_meta_album\n", function(answer) {
                fileData.album = answer.split('=')[1];
                def.resolve();
            });
            return def.promise;
        },
        getMetaArtist = function(){
            var def = Q.defer();
            this.rl.question("get_meta_artist\n", function(answer) {
                    fileData.artist = answer.split('=')[1];
                def.resolve();
                });
            return def.promise;
        },
        fileData = {};
    if(this.childProc !== null){
        Q.all([getMetaAlbum,getMetaArtist,getMetaTitle]).then(
            function(){
                deferred.resolve(fileData);
            }
        );
        return deferred.promise;
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
    if(fs.existsSync(path))
        this.file = path;
    else
        throw new Error("File '" + path + "' not found!");
};

Mplayer.prototype.getTimeLength = function() {
    var def = Q.defer();
    if(this.childProc !== null){
        this.rl.question("get_time_length\n", function(answer) {
            def.resolve(answer.split('=')[1]);
        });
        return def.promise;
    }
};

Mplayer.prototype.getTimePosition = function() {
    var def = Q.defer();
    if(this.childProc !== null){
        this.rl.question("get_time_pos\n", function(answer) {
            def.resolve(answer.split('=')[1]);
        });
        return def.promise;
    }
};

module.exports = Mplayer;