/**
 * @typedef {Object} Sample
 * @property {string} type 
 */

function main(){    
    document.getElementById("fileInput").addEventListener("input", parseFile)

}

/**
 * @param {InputEvent & { target: HTMLInputElement}} event
*/
function parseFile(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: (results, file) => {
            console.log(results)
            const mapOfSamples = makeObject(results)
            getAverage(mapOfSamples)
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
                const reporterMapList = new Map()
                const reporterValueMap = new Map([["values",[ctValue]]])
                reporterMapList.set(reporterName,reporterValueMap)
                const sample = {
                    name: sampleName,
                    reporterList: reporterMapList
                }
                samples.set(sampleName,sample)
            }
        }
        
    }
    console.log(samples)
    return samples
}

/**
 * 
 * @param {number} ctValue 
 * @returns {boolean}
 */
function isNumber(ctValue){
    if(ctValue === NaN) return false
    else return true
}

function getAverage(mapOfSamples){
    for(let sample of mapOfSamples.values()){
        console.log(sample)
    }
}



main()

