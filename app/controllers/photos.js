var _ = require('lodash')
,   globule = require('globule')
,   http = require('http')
,   config = require('../../config/config')
,   redis = require('redis').createClient()  // Database components and redis data api
,   db = require('../../config/database.js')
,   images = db.images
,   users = db.users


var __set__; //Store single operating set for now

function DiptychSet(options){
    this.initialize(options)
}
_.assign(DiptychSet.prototype, {
    shuffle: void 0  // a property we expect to be defined in options
,   initialize: function(options){
        _.assign(this, options);
    }
,   pick: function(count, callback){
        this.shuffle.rotate(count, function (err, images) {
            callback(err, images)
        })
    }
})
/**
 * Factory method for Diptych Set
 * @param  {User}     user     the user
 * @param  {Function} callback returns an err and images
 * @return {void}
 */
DiptychSet.create = function(user, callback){
    // derive hash base from user
    // user is undefined, waiting on account backened
    var hash = /*user.hash()*/'user-hash-key:' + 'diptych-set'

    __set__? callback(null, __set__)
    :   images.find({}, function(err, allImages){
        if(err) callback(err)
        // Shuffle data and callback with new DiptychSet
        Shuffler.create(hash, allImages, function(err, shuffle){
            var set = new DiptychSet({
                shuffle: shuffle // shimmy shimmy
            })
            __set__ = set // Make this part of the factory
            callback(err, set)
        })
    })
};

function Shuffler(options){
    _.assign(this, options)
}
Shuffler.prototype.rotate = function (rotations, callback){
    // Rotate the first two keys of the shuffle
    rotations = rotations || 1
    for(var i = 0; i < rotations; i++)
        redis.rpoplpush(this.key, this.key)

    redis.lrange(this.key, 0, rotations - 1, function(err, images){
        callback(err, _(images).map(JSON.parse).value())
    })
}
Shuffler.create = function (key, data, callback) {
    data = _(data).shuffle().map(JSON.stringify)
        .unshift(key).push(function (err) {
            // return our rotator
            callback(err, new Shuffler({key: key}))
        })
        .value()
    redis.flushdb()
    redis.lpush.apply(redis, data)
};

function get (count, callback) {
    DiptychSet.create(null, function(error, set) {
        error? callback(error) : set.pick(count, function (error, images) {
           callback(error, images)
        })
    })
    return this;
}

function sendNext (request, response) {
    get(1, function(err, images){
        if(err) response.send(400, err)
        else response.send(200, images)
    })
    return this;
}

function sendPair (request, response) {
    get(2, function(err, images){
        if(err) response.send(400, err)
        else response.send(200, images)
    })
    return this;
}

function sendPick (request, response) {
    get(request.params.count, function(err, images){
        if(err) response.send(400, err)
        else response.send(200, images)
    })
    return this;
}

function render (request, response) {
    get( 2, function(err, images){
        if(err) response.send(400, err)
        else response.render('home', {
            image: images,
            title:'Diptych ~ Better Visuals'
        });
    })
    return this;
}

exports.get = get;
exports.next = sendNext;
exports.pair = sendPair;
exports.pick = sendPick;
exports.render = render;



