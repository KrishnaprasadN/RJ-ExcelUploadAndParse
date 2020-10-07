import React, {useState} from 'react';
import './App.css';
import readXlsxFile from 'read-excel-file'

const App = (props) => {
  const [content, setContent] = useState("Content is yet to be parsed...")

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
    console.log("*** isTrusted is - ", isTrusted , ", type is - ", type)

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
      setContent(JSON.stringify(rows))
      console.log(content)
    });
  }

  return (
    <div className="App">
      <h1>Excel upload and Convert to Json POC</h1>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(event) => readFile(event)}
      />
      </div>
  );
}

export default App;
