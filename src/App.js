import "./App.css";
import axios from "axios";
import { useState } from "react";

const getModel = async () => {
  const modelName = "production-model";
  const res = await axios.get(
    `/api/2.0/preview/mlflow/registered-models/get-latest-versions?name=${modelName}&stages=production`
  );

  const model = res.data.model_versions[0];

  console.log(res.data.model_versions);

  const source = model.source;

  console.log(source);

  const toMatch = /^\.\/artifacts\/(\d+)\/(\w+)\//gm;

  const cap = toMatch.exec(source);

  const num = cap[1];
  const id = cap[2];

  return { num, id };
};

const getData = async (value) => {
  const { num, id } = await getModel();

  const tfURI = `/artifacts/${num}/${id}/${value}`;

  const response = await axios.get(tfURI);

  console.log(response);

  return response.data.ypred;
};

function App() {
  const [data, setData] = useState({
    x: 0,
    ypred: 0,
    yreal: 0,
    error: 0,
  });
  return (
    <div className="App">
      <h1>Avaliação de função quadrática</h1>
      <input
        type="number"
        value={data.x}
        onChange={(e) => {
          setData({
            ...data,
            x: e.target.value,
          });
        }}
      ></input>
      <button
        onClick={async () => {
          const ypred = await getData(data.x);
          const yreal = Math.pow(data.x, 2);
          const error = ypred - yreal;
          setData({
            ...data,
            ypred,
            yreal,
            error,
          });
        }}
      >
        Estimar
      </button>
      <div>
        <b>Número pedido: </b> {data.x}
      </div>
      <div>
        <b>Previsão: </b> {data.ypred}
      </div>
      <div>
        <b>Real: </b> {data.yreal}
      </div>
      <div>
        <b>Erro: </b> {data.error}
      </div>
    </div>
  );
}

export default App;
