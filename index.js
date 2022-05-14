
import Device from './devices'
import {_webLongrun_,Arrayresult} from './automation'
const username = "*";
const password = "*";
const url = "*"
const groupType = "private";
const config = {
    protocol: 'https',
  host: '*',
  auth: '*'
}
async function run()
{
 
    // var result = await Device._getDevices({
    //     username,
    //     password,
    //     url,
    //     path: 'devices'
    // })

    var devices = await Device._getDevicesBy(
        {
            groupType : groupType,
            onlineDeviceOnly:true
        },
        {
            username,
            password,
            url,
            path: 'devices'
        }
        )
    let desireCap = await Device.convertToDesiredCapabilities(devices,{
        sessionName: "Session created",
        
    })
    console.log(desireCap)
  
    await _webLongrun_(config,desireCap,1)
   
   
}
run()