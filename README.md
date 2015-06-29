Node-Youtube-DL
===========
Node-Youtube-DL is a youtube-dl downloader interface for Node. It works with streams so you can pipe the output in an HTTP connection or a FileSystem or a stream of your choice.

#### Hello World
Node
```js
let YTDL = require('node-youtube-dl')
YTDL.download('nkqVm5aiC28', '140').then(function(Stream){
  Stream.pipe(FS.createWriteStream('/tmp/song'))
}).catch(function(){
  console.log(arguments[0])
})
```

#### API
```js
class YTDL{
  static download(ID, Quality)
}
```

#### License
This project is licensed under the terms of MIT License. See the License file for more info.