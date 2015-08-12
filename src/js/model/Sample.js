'use strict';

import Node from './Node';

class Sample extends Node {

  constructor (url) {
    super();
    this.playbackRate = 1.0;

    this.isLoaded = this.loadSample(url)
      .then(buffer => this.buffer = buffer);
  }

  play () {
    if (this.node) { this.node.stop(0); }
    this.node = this.ctx.createBufferSource();
    this.node.buffer = this.buffer;
    this.node.playbackRate.value = this.playbackRate;
    this.node.connect(this.wet);
    this.node.start(0);
  }

  loadSample (url) {
    this.basename = url.split('/').pop();

    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'arraybuffer';

      req.onload = () => {
        if (!req.response) { reject(new Error('no response')); }
        this.ctx.decodeAudioData(req.response, function (buffer) {
          resolve(buffer);
        }, function (err) {
          reject(err);
        });
      };

      req.send();
    });
  }

  getWaveData () {
    return this.isLoaded.then(() => {
      return this.buffer.getChannelData(0);
    });
  }

  setPlaybackRate (playbackRate) {
    this.playbackRate = playbackRate;
  }

}

export default Sample;
