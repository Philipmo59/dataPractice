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

function makeObject(results) {
    const mapOfSamples = new Map()
    for (let i = 0; i < results.data.length; i++) {
        let selectedArray = results.data[i];
        if(selectedArray.length >= 20 && !selectedArray.includes("Reporter")) {
            if(mapOfSamples.has(selectedArray[3])){                                                  //If it has Key
                const sampleProperties = mapOfSamples.get(selectedArray[3])
                if(!sampleProperties.reporterList.has(selectedArray[4])){                            //If it does not have the Reporter name as a value
                    const reporterValueMap = new Map()
                    reporterValueMap.set("values",[selectedArray[12]])
                    sampleProperties.reporterList.set(selectedArray[4],reporterValueMap)             //Set the Reporter name as key, and the CT as the Value
                }
                else{                                                                                //If it does have the Reporter name
                    const reporterName = sampleProperties.reporterList.get(selectedArray[4]).get("values")
                    reporterName.push(selectedArray[12])
                }
            
            }
            else{
                const reporterMapList = new Map()
                const reporterValueMap = new Map([["values",[selectedArray[20]]]])
                reporterMapList.set(selectedArray[4],reporterValueMap)
                const sample = {
                    name: selectedArray[3],
                    reporterList: reporterMapList
                }
                mapOfSamples.set(selectedArray[3],sample)
            }
        }
        
    }
    console.log(mapOfSamples)
    return mapOfSamples
}
function checkIfNumber(ctValue){
    if(ctValue == "Undetermined") return NaN
}

function getAverage(mapOfSamples){
    for(let sample of mapOfSamples.values()){
        console.log(sample)
    }
}



main()

