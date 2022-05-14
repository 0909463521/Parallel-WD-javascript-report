import pick from 'lodash/pick'
import BPromise from 'bluebird'
import moment from 'moment'
import Authorize from './authorize'



var group = {
  cloud: 'cloud',
  private: 'private',
  favorite: 'favorite'
}



class Device extends Authorize {
    
    

    async _getDevices(optionsAuthorize = {}) {
        const [devicesGroups] = await this.get(optionsAuthorize)
        return devicesGroups
    }
    async _getDevicesBy({
        onlineDeviceOnly,
        groupType ,
        platformName,
        platformVersion,
        deviceName,
        deviceNumbers,
        arrayUDID
      } = {},
      optionsAuthorize = {}) {
        const devicesGroups = await this._getDevices(optionsAuthorize)
        let devices
        let devicesByUDID = []
        console.log( onlineDeviceOnly)
        switch (groupType.toLowerCase()) {
          case 'private':
            devices = devicesGroups.privateDevices.sort((a, b) => a.id - b.id)
            break
          case 'cloud':
            devices = devicesGroups.cloudDevices
            break
          case 'favorite':
            devices = devicesGroups.favoriteDevices
            break
          default:
            devices = devicesGroups.cloudDevices.concat(devicesGroups.privateDevices)
            break
        }
    
        devices = devices.filter((d) => !d.support.appiumDisabled)
    
        if (platformName) {
          platformName = platformName.toLowerCase()
          devices = devices.filter((d) => d.platformName.toLowerCase() === platformName)
        }
    
        if (onlineDeviceOnly) {
          devices = devices.filter((d) => d.isOnline && !d.isBooked)
        }
    
        if (platformVersion) {
          devices = devices.filter((d) => d.platformVersion.includes(platformVersion))
        }
    
        if (deviceName) {
          deviceName = deviceName.toLowerCase()
          devices = devices.filter((d) => d.deviceName.toLowerCase().includes(deviceName))
        }
    
        if (!isNaN(deviceNumbers)) {
          devices = devices.length > deviceNumbers ? devices.slice(0, deviceNumbers) : devices
        }
    
        if (arrayUDID) {
          const udids = arrayUDID.split(',')
          for (const udid of udids) {
            let specificDevice = devices.filter((d) => d.udid === udid)
            if (specificDevice.length > 0) {
              devicesByUDID.push(specificDevice[0])
            }
          }
          devices = devicesByUDID
        }
      
        return devices
    }

    // async getDevices({
    //     groupType = config.device.group,
    //     // groupType = 'private',
    //     platformName = config.device.platformName,
    //     platformVersion = config.device.platformVersion,
    //     deviceName = config.device.name,
    //     deviceNumbers = config.device.number,
    //     arrayUDID = config.device.arrayUDID,
    //     onlineDeviceOnly = config.device.onlineDeviceOnly
    //   } = {}) {
    //     return await this._getDevicesBy({
    //       onlineDeviceOnly,
    //       groupType,
    //       platformName,
    //       platformVersion,
    //       deviceName,
    //       deviceNumbers,
    //       arrayUDID
    //     })
    //   }
    getDefaultBrowserBy(platformName) {
      let browserName
      if (platformName) {
        switch (platformName.toLowerCase()) {
          case 'android':
            browserName = 'chrome'
            break
          case 'ios':
            browserName = 'safari'
            break
        }
      }
    
      return browserName
    }
    
    getDeviceGroup(device) {
      if (device.isCloud) {
        return 'KOBITON'
      }
      else if (device.isMyOrg || device.isMyOwn) {
        return 'ORGANIZATION'
      }
      else {
        throw new Error('This device doesn\'t belong to any group')
      }
    }
    async convertToDesiredCapabilities(
       devices, 
      {
      deviceOrientation = 'portrait' ,
      captureScreenshots = true ,
      // autoWebview = true ,
      automationName ,
      sessionName ,
      
    } = {}) {
     
      return devices
        .map((d) => {
          let desiredCapFields = pick(d, 'platformName', 'platformVersion', 'deviceName',
            'udid', 'automationName','sessionName')
          let deviceGroup = this.getDeviceGroup(d)
          if (deviceGroup === 'KOBITON') {
            delete desiredCapFields.udid
          }
          if (d.platformName === 'Android') {
            desiredCapFields.sessionName = ` ${sessionName} Android ${d.udid}`
          } else {
            desiredCapFields.sessionName = ` ${sessionName} iOS ${d.udid}`
          }
          const sessionDescription = `Auto web session on device ${d.deviceName}`
          const browserName = this.getDefaultBrowserBy(desiredCapFields.platformName)
          const supportedPlatformVersion = parseInt(d.platformVersion.split('.')[0])
    
          if (d.platformName === 'Android') {
            if (supportedPlatformVersion >= 5) {
                desiredCapFields.automationName = 'UIAUTOMATOR2'

            } else {
              desiredCapFields.automationName = 'Appium'
            }
          }
         // nếu là web thì ios không cần automationName = XCUITEST
          if(d.isGigaFoxDevice === true)
          {
            desiredCapFields.autoWebview=true;
            desiredCapFields = pick(desiredCapFields, 'platformName', 'platformVersion', 'deviceName',
            'udid', 'automationName','sessionName','autoWebview')
          }
        
        
          return {...desiredCapFields, deviceOrientation, captureScreenshots,
            browserName, deviceGroup, sessionDescription}
        })
    }

}

export default new Device()
