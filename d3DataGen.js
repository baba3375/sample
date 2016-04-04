var ageWiseLiterateDistribution = new Object();
var gradPopStateAndGradeWise = new Object();
var eduCategWise = new Object();

var file1 = ["inputData/India2011.csv","inputData/IndiaSC2011.csv","inputData/IndiaST2011.csv"]

fileReader(file1);
function fileReader(fileNames) {

    fileNames.map(function(fileName){
      var fs = require('fs');
      var data = fs.readFileSync(fileName).toString();

      textToArrayHash(data);

    });
    ageWiseLiterateDistribution = d3DataFormatter(ageWiseLiterateDistribution);
    gradPopStateAndGradeWise = d3DataFormatter(gradPopStateAndGradeWise);
    eduCategWise = d3DataFormatter(eduCategWise);
}

function d3DataFormatter (objObj) {
  var arrObj =  new Array();
  for(key in objObj) {
    arrObj.push(objObj[key]);
  }
  return arrObj;
}

function textToArrayHash(text) {
  var headerLine = new Array();
  text.split("\n").map(function(strLine, lineNum){
      if(strLine !== '')
       {
        var arrLine = strLine.split(",");
        if (lineNum != 0) {
          arrLine[4] = arrLine[4].trim();
          ageKey = arrLine[5].trim();
          if (arrLine[4] == "Total" ) {
            if (arrLine[5] != "All ages") {
              //For First Age wise Total Literate Population JSON
              arrLine[12] = parseInt(arrLine[12]);
              if(ageKey in ageWiseLiterateDistribution){
                ageWiseLiterateDistribution[ageKey].TotalLiteratePop += arrLine[12];
               }
              else {
                console.log("Keys are "+ Object.keys(ageWiseLiterateDistribution));
                console.log("key" + ageKey);
                ageWiseLiterateDistribution[ageKey] = new Object();
                ageWiseLiterateDistribution[ageKey].ageGroup = ageKey;
                ageWiseLiterateDistribution[ageKey].TotalLiteratePop = arrLine[12];

              }
            }
            else {
              var areaKey = arrLine[3].trim();
              var gradM = parseInt(arrLine[40]);
              var gradF = parseInt(arrLine[41]);

              if (areaKey in gradPopStateAndGradeWise) {
                gradPopStateAndGradeWise[areaKey].gradMales += gradM;
                gradPopStateAndGradeWise[areaKey].gradFemales += gradF;
              }
              else {
                gradPopStateAndGradeWise[areaKey] = {area: areaKey, gradMales: gradM, gradFemales: gradF};

              }


              for(eduCatIndex=15;eduCatIndex<44;eduCatIndex+=3) {
                var eduCatValue = headerLine[eduCatIndex].trim().match(/.*- (.*) -.*/)[1];
                var totalPopValue = parseInt(arrLine[eduCatIndex]);
                if (eduCatValue in eduCategWise) {
                  eduCategWise[eduCatValue].totalPop += totalPopValue;
                }
                else {
                    eduCategWise[eduCatValue] = {eduCateg: eduCatValue, totalPop:totalPopValue };

                }
              }
            }
          }
        }

        else {
            headerLine = arrLine;
        }
    }

  });
}


function Writer(){
    var fs = require('fs');
    fs.writeFile("outPutFiles/ageWiseLiterateDistribution.json",JSON.stringify(ageWiseLiterateDistribution),function(err) {
      if (err) throw err;
      console.log('First file is saved!');
    });

    fs.writeFile("outPutFiles/gradPopStateAndGradeWise.json", JSON.stringify(gradPopStateAndGradeWise), function(err) {
      if (err) throw err;
      console.log('sec file is saved!');
    });
    fs.writeFile("outPutFiles/eduCategWise.json",JSON.stringify(eduCategWise), function(err) {
      if (err) throw err;
      console.log('third file is saved!');
    });
}





Writer();
