import React, { useState } from 'react';
import './App.css';
import readXlsxFile from 'read-excel-file'
import * as XLSX from 'xlsx';

const App = (props) => {
  const [content, setContent] = useState("Content is yet to be parsed...")

  const columnNames = ["Emp Code", "Agent", "OSS ID", "Team Leads", "Tenure",

    "Quality Analysis (%)", "CSAT Rating", "Total Sales", "Availability",
    "Sales Goal", "Leads Goal", "Minimum Expe", "Productivity Average",
    "AHT", "Lead Pass", "Attitude / Team work / Policy", "Ramp Down %", "PIP",
    "Productivity Weightage", "QA Weightage", "CSAT Weightage", "Sales",
    "Availability Weightage", "Attitude / Team work / Policy weightage",
    "Ramp Down", "AHT weightage", "Lead pass weightage", "Total Score", "Bonus",
    "Total Score with Bonus", "Grade", "Eligibility", "Rating"]

  let columnMap = new Map()

  const getFileExtension = (name) => {
    const parts = name.split('.');

    if (parts.length > 0) {
      return parts.pop();
    }

    return false;
  }

  const isValidExtension = (name) => {
    const extension = getFileExtension(name);
    return extension && extension.indexOf('xlsx') >= 0;
  }

  const readFile = (event) => {
    console.log("*** event is - ", event)
    const { target } = event;
    console.log("*** target is - ", target)
    const { isTrusted, type } = event;
    console.log("*** isTrusted is - ", isTrusted, ", type is - ", type)

    let file = null;

    if (target.files && target.files.length > 0) {
      file = target.files[0];
      if (!isValidExtension(file.name)) {
        alert("Please select file format .xlxs only")
        return;
      }
    }

    proccessFile(file);
  }

  const proccessFile = (file) => {
    readXlsxFile(file).then((rows) => {
      console.log(rows)
    });
  }

  const printData = (jsonData) => {
    for (var key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        console.log("Key is ", key);
        var val = jsonData[key];
        console.log(val);
      }
    }
  }

  const getData = (jsonData, index) => {
    for (var key in jsonData) {
      if (key > 0) {
        var values = jsonData[key];
        console.log(values[index]);
      }
    }
  }

  const constructColumnNameMap = (header) => {
    columnMap.clear()
    for (let column in columnNames) {
      let name = columnNames[column]
      if (name != "" || name != undefined) {

        let index = header.findIndex((item, i) => {
          return String(item).trim().toLocaleLowerCase() == String(name).trim().toLocaleLowerCase()
        })

        console.log("*** index of ", name, " is ", index)
        if (index > -1) {
          columnMap[name] = index
        }
      }
      //console.log(columnNames[column])
    }
  }

  const readXlsxFile = (evt) => {
    //evt.preventDefault();

    var files = evt.target.files
    var file = files[0]
    var name = file.name;
    var reader = new FileReader();
    reader.onload = function (evt) {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });

      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* Convert array to json*/
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, blankrows: false });
      console.log("**** JSON Data>>>" + jsonData.length);

      printData(jsonData)

      //console.log(jsonData[0])
      let header = jsonData[0]
      constructColumnNameMap(header)

      console.log("\n**** map of column name with index is ", JSON.stringify(columnMap))

      console.log("\n**** Getting emp code from json data")
      getData(jsonData, 0)

    };
    reader.readAsBinaryString(file)
  }

  return (
    <div className="App">
      <h1>Excel upload and Convert to Json POC</h1>

      <h4>Option 1: Using read-excel-file package</h4>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(event) => readFile(event)}
      />

      <br />

      <h4>Option 2: Using SheetJs package</h4>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(event) => readXlsxFile(event)}
      />
    </div>
  );
}

export default App;
