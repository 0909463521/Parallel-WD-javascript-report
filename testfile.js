import fs from 'fs'
var reporter = require('cucumber-html-reporter');

let array = [{
                name:"case1",
                status:"passed"
            },{
              name:"case2",
              status:"fail",
              message:"fix bug di"
            },
          ];
let Arrayresult = [];
async function checkStatus(name,status,message)
{
        if(status === "passed")
        {
            let objPass = {
                "id": "search-on-here-we-go;search-test-in-here-maps",
                "keyword": "Scenario",
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
              return objPass;
        }
        else{
            let objectFail = {
                "id": "search-on-here-we-go;search-test-in-here-maps",
                "keyword": "Scenario",
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
              "App Version":"0.3.2",
              "Test Environment": "STAGING",
              "Browser": "Chrome  54.0.2840.98",
              "Platform": "Windows 10",
              "Parallel": "Scenarios",
              "Executed": "Remote"
          }
        };
  
       await  reporter.generate(options);
      //  fsExtra.emptyDirSync(directoryPath+"/screenshots");


}
async function run(){
  
    let inprogress = await array.map(async (el)=>{
          if(el.status === "passed"){
            let objectP =  await checkStatus(el.name,el.status,"NOT")
            Arrayresult.push(objectP)
          }
          else{
            let objectF = await checkStatus(el.name,el.status,"LOI O DAY NE")
            Arrayresult.push(objectF)
          }
             
    })
  
    await Promise.all(inprogress)
    await writeToJson(Arrayresult)
    await generateHtmlReport()
}

run()