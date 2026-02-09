import { mount } from "svelte";
import App from "./App.svelte";
import "./styles/global.scss";

const load = () => {
  return mount(App, {
    target: document.getElementById("app")!
  });
};

export default load();
