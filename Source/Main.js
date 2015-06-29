"use strict"

let ChildProcess = require('child_process')
let FS = require('fs')
let HTTPS = require('https')
let Request = require('request')

class YTDL{
  static download(ID, Quality){
    return YTDL.info(ID, Quality).then(function(Info){
      return Request(Info)
    })
  }
  static info(ID, Quality){
    let CookiePath = `/tmp/youtube-dl-${ID}-${Math.random()}`
    let Info = {URL: '', Cookies: ''}
    let DL = new Promise(function(Resolve, Reject){
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
        Info.URL = Response.stdout.trim()
        FS.readFile(CookiePath, function(err, data){
          if(err) return Reject(err)
          data = data.toString()
          let Cookies = []
          let Result
          let Regex = /\d+.*?(\w+).*?(\w.*)/g
          while((Result = Regex.exec(data)) !== null){
            Cookies.push(Result[1] + '=' + encodeURIComponent(Result[2]))
          }
          Info.Cookies = Cookies.join('&')
          Resolve()
        })
      })
      Timeout = setTimeout(function(){
        if(Process.exited){
          Process.kill()
          Reject(new Error("Operation Timed Out"))
        }
      }, 15000)
    })
    return DL.then(function(){
      FS.unlink(CookiePath)
      return {url: Info.URL, headers: {'Cookie': Info.Cookies}}
    })
  }
}

module.exports = YTDL