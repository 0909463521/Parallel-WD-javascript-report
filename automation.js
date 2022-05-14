import wd from 'wd'
import moment from 'moment'
import fs from 'fs'
import BPromise from 'bluebird'
var reporter = require('cucumber-html-reporter');

let Arrayresult = [];
async function createDriver(config,desiredCapabilities) {
    // const allowW3C = config.allowW3C
    // if (config.allowW3C) {
   
    // }
  
    //  desiredCapabilities.allowW3C = allowW3C
    // desiredCapabilities.w3cPrefix = 'appium'

    const driver = await wd.promiseChainRemote(config)
    try {
      await driver.init(desiredCapabilities)
    }
    catch (error) {
      if (error.data) {
        console.log(error.data)
       
      }
      throw error
    }
    return driver
}
async function checkStatus(name,status,message)
{
        if(status === "passed")
        {
            let objPass = {
                "id": "search-on-here-we-go;search-test-in-here-maps",
                "keyword": "Device",
                "line": 6,
                "name": name,
                "tags": [],
                "type": "scenario",
                "steps": [
                  {
                    "arguments": [],
                    "keyword": "Given ",
                    "line": 7,
                    "name": "Navigate to MultiSelect Page",
                    "match": {
                      "location": "features/step_definitions/multiselectaction.js:7"
                    },
                    "result": {
                      "status": "passed",
                      "duration": 6883000000
                    }
                  },
                  
                ]
              }
              Arrayresult.push(objPass)
              return objPass;
        }
        else{
            let objectFail = {
                "id": "search-on-here-we-go;search-test-in-here-maps",
                "keyword": "Device",
                "line": 6,
                "name": name,
                "tags": [],
                "type": "scenario",
                "steps": [
                  {
                    "arguments": [],
                    "keyword": "And ",
                    "line": 8,
                    "name": "MultiSelect component",
                    "match": {
                      "location": "features/step_definitions/multiselectaction.js:23"
                    },
                    "result": {
                      "status": "failed",
                      "duration": 21000000,
                      "error_message": message
                    }
                  },
                    
                ]
              }
              Arrayresult.push(objectFail)
              return objectFail;
        }
}
async function writeToJson(arrayResult){
  let student = [{ 
    description:"",
    keyword: "Performance testing Date: ",
    name: "Release Hom Nay",
    line: 1,
    id: "Release-hom-nay",
    tags: [],
    uri: "",
    elements: arrayResult
    }];
      let data = JSON.stringify(student);

      fs.writeFileSync(`ReportJson.json`, data, (err) => {
          if (err) throw err;
          console.log('Data written to file');
      });
}
async function generateHtmlReport()
{
    var options = {
          theme: 'bootstrap',
          jsonFile: '/Users/bachvu/Desktop/PerfKobi/wd/ReportJson.json',
          output: './cucumberreportsss.html',
          reportSuiteAsScenarios: true,
          launchReport: true,
          metadata: {
              "App Version":"https://the-internet.herokuapp.com/login",
              "Test Environment": "STAGING",
              "Browser": "Chrome and Safari",
              "Platform": "MAC OS",
              "Parallel": "Scenarios",
              "Executed": "Remote"
          }
        };
  
       await  reporter.generate(options);
      //  fsExtra.emptyDirSync(directoryPath+"/screenshots");


}
export async function _webLongrun_(config,onlineCloudDesiredCaps,time) {
          

      const inProgressTests = await onlineCloudDesiredCaps.map(async(cap) => {
        let driver
        
        try {
          driver = await wd.promiseChainRemote(config)
          await driver.init(cap)
          .sleep(8000)
          
           await driver.get("https://youtu.be/BoW3O8E8Hcw")
          .sleep(8000)
        }
        catch (err) {
          
          return  await checkStatus(cap.deviceName,"failed",err.message)
          
        }
      
        const start = new Date().getTime()
        let end = 0
        const duration = 660000; //24hrs
        let runtime = 0
        // let count = 0
    
        do {
          end = new Date().getTime()
          runtime = end - start
          // count = count + 1
          // eslint-disable-next-line no-console
          // console.log(cap.deviceName + ' - run time: ' + runtime + ' - loop time: ' + count)
    
          try {
            // eslint-disable-next-line babel/no-await-in-loop
            // await driver.get("https://the-internet.herokuapp.com/login")
            // .sleep(5000)
    
            // eslint-disable-next-line babel/no-await-in-loop
            // await driver
            // .waitForElementById('username')
            // .sleep(5000)
            // .clear()
            // .sleep(5000)
            // .sendKeys('test') //tomsmith
            // .sleep(5000)
    
            // // eslint-disable-next-line babel/no-await-in-loop
            // await driver
            // .waitForElementById('password')
            // .sleep(5000)
            // .clear()
            // .sleep(5000)
            // .sendKeys('SuperSecretPassword!')
            // .sleep(5000)
    
            // eslint-disable-next-line babel/no-await-in-loop
            // await driver
            // .waitForElementByXPath("//form[@name='login']")
            // .sleep(5000)
            // .submit()
            // .sleep(5000)

            //youtube
            await driver.setOrientation('LANDSCAPE')
            .sleep(7000)
           
            await driver.setOrientation('PORTRAIT')
            .sleep(7000)
           
          }
          catch (err) {
            // eslint-disable-next-line no-console
            // console.log(err)
            return  await checkStatus(cap.deviceName,"failed",err.message)

            
          }
        }
        while (runtime < duration)
    
        try {
          await checkStatus(cap.deviceName,"passed","KHONG")
          await driver.quit()
        }
        catch (err) {
          return  await checkStatus(cap.deviceName,"failed",err.message)

          
        }
      })
      await Promise.all(inProgressTests);

      await writeToJson(Arrayresult);
      await generateHtmlReport()
    }

    