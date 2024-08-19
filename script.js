/**
 * @typedef {Object} Sample
 * @property {string} name - The name of the sample
 * @property {Map<string, Map<string, Map<string, number[]> >>} reporterList - The name of the sample
 */

import { getCSV } from "./getCSV.js";

function main(){    
    document.getElementById("fileInput").addEventListener("input", parseFile)
    getCSV()
}

/**
 * @param {InputEvent & { target: HTMLInputElement}} event
*/
function parseFile(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: (results, file) => {
            const mapOfSamples = makeObject(results)
            getAverage(mapOfSamples)
            const container = document.getElementById("container")
            createTable(container,mapOfSamples)
    }})
}

/**
 * 
 * @param {string[][]} results 
 * @returns 
 */
function makeObject(results) {
    const samples = new Map()
    for (let i = 0; i < results.data.length; i++) {
        let selectedArray = results.data[i];
        if(selectedArray.length >= 20 && !selectedArray.includes("Reporter")) {   
            const sampleName = selectedArray[3]  
            const ctValue = parseFloat(selectedArray[12])   
            const reporterName = selectedArray[4]      
            const average = []
            //If it has the sample name        
            if(samples.has(sampleName)){                                                  
                const sample = samples.get(sampleName)
                
                //If it does not have the Reporter name as a value
                if(!sample.reporterList.has(reporterName)){                            
                    const reporterValueMap = new Map()

                    //Check if ctValue is undetermined, if it is, pass in an empty array
                    if(isNumber(ctValue)) reporterValueMap.set("values",[ctValue])
                    else reporterValueMap.set("values",[])
                    sample.reporterList.set(reporterName,reporterValueMap)  
                }


                else{                                                                                
                    const ctValues = sample.reporterList.get(reporterName).get("values")
                    if(isNumber(ctValue)) ctValues.push(ctValue)
                }
            
            }
            else{
                const reporterMapList = new Map();
                let reporterValueMap 
                if(isNumber(ctValue)) reporterValueMap = new Map([["values",[ctValue]]])
                else reporterValueMap = new Map([["values",[]]])
                reporterMapList.set(reporterName,reporterValueMap)
                const sample = {
                    name: sampleName,
                    reporterList: reporterMapList
                }
                samples.set(sampleName,sample)
            }
        }
        
    }
    const sortedSamples = new Map(Array.from(samples).sort((a,b) => a[0].localeCompare(b[0])))
    return sortedSamples
}

/**
 * 
 * @param {number} ctValue 
 * @returns {boolean}
 */
function isNumber(ctValue){
    if(Number.isNaN(ctValue)) return false
    else return true
}

/**
 * @param {Map<string, Sample>} mapOfSamples 
 * @returns {boolean}   
 */
function getAverage(mapOfSamples){
    for(let sample of mapOfSamples.values()){
        for(let reporterValues of sample.reporterList.values()){
            const ctValues = reporterValues.get("values")
            if(ctValues.length === 0){
                reporterValues.set("average","N/A")
            }
            else{
                const initialValue = 0
                const average = ctValues.reduce((accumulator, currentValue) => accumulator + currentValue,initialValue) / ctValues.length
                reporterValues.set("average",average)}
        }
    }
    return true
}

/**
 * 
 * @param {HTMLDivElement} container 
 * @param {Map<string,Sample>} mapOfSamples 
 */
function createTable(container,mapOfSamples){
    const tbl = document.createElement("table")
    const tblBody = document.createElement("tbody")
    const headerRow = document.createElement("tr")

  // Creating the header "Sample", and the 4 reporters   
    let reporters;
    for(let sample of mapOfSamples.values()){
        reporters = Array.from(sample.reporterList.keys())
        break
    }
    const headers = ["Sample",...reporters.sort()];
    for(let header of headers){
        td = document.createElement("td")
        td.textContent = header
        headerRow.appendChild(td)
    }
    tblBody.appendChild(headerRow)
  // Getting the Average and rounding it by the hundreth place and placing it on table row
    for(let sample of mapOfSamples.values()){    
        row = document.createElement("tr") 
        sampleNameTd = document.createElement("td")
        sampleNameTd.textContent = sample.name
        row.appendChild(sampleNameTd)

        for(let [reporter,ctValue] of sample.reporterList){
            let ctValueTd = document.createElement("td")
            let reporterAverage = ctValue.get("average")
            if(reporterAverage === "N/A"){
                ctValueTd.textContent = "N/A"
                row.appendChild(ctValueTd)
            }
            else{
                ctValueTd.textContent = Math.round(reporterAverage * 100) / 100
                row.appendChild(ctValueTd)
            }
        }
        tblBody.appendChild(row)
    }

    tbl.appendChild(tblBody)


    container.appendChild(tbl)
}



main()

