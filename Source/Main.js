"use strict"

let ChildProcess = require('child_process')
let FS = require('fs')

class YTDL{
  static download(){

  }
  static __getInfo(ID, Quality){
    let CookiePath = `/tmp/youtube-dl-${ID}-${Math.random()}`
    let Request = {URL: '', Cookies: ''}
    let Request = new Promise(function(Resolve, Reject){
      let Output = {stdout: [], stderr: []}
      let Process = ChildProcess.spawn('youtube-dl', ['-f', Quality, '-g', '--cookies', CookiePath, ID])
      let Timeout
      Process.exited = false
      Process.stdout.on('data', function(data){
        Output.stdout.push(data)
      })
      Process.stderr.on('data', function(data){
        Output.stderr.push(data)
      })
      Process.on('close', function(){
        Process.exited = true
        clearTimeout(Timeout)
        let Response = {stdout: Output.stdout.join(''), stderr: Output.stderr.join('')}
        if(Response.stderr) return Reject(new Error(Response.stderr))
        Request.URL = Response.stdout
      })
      Timeout = setTimeout(function(){
        if(Process.exited){
          Process.kill()
          Reject(new Error("Operation Timed Out"))
        }
      }, 15000)
    })
    Request.then(function(){
      FS.unlink(CookiePath)
    })
  }
}

module.exports = YTDL