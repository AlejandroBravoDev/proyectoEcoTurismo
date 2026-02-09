import Filter, { loadDictionary } from "leo-profanity";

//carga de diccionarios de las palabrotas
Filter.loadDictionary("es");
Filter.loadDictionary("en");
Filter.loadDictionary("pt");

//Palabras extras personalizadas
Filter.add("hpta");
Filter.add("hp");
Filter.add("estupido");
Filter.add("estúpido");
Filter.add("bobo");
Filter.add("gonorrea");
Filter.add("gnr");
Filter.add("marica");
Filter.add("marika");
Filter.add("mrc");
Filter.add("mk");
Filter.add("maricon");
Filter.add("maricón");
Filter.add("pirobo");
Filter.add("piroba");
Filter.add("mierda");
Filter.add("perra");
Filter.add("perro");
Filter.add("zorra");
Filter.add("carechimba");
Filter.add("chimba");
Filter.add("chimbo");
Filter.add("verga");
Filter.add("pene");
Filter.add("hijueputa");
Filter.add("jijueputa");
Filter.add("malparido");
Filter.add("malparida");
Filter.add("mal parido");
Filter.add("coño");
Filter.add("vagina");
Filter.add("tetas");
Filter.add("culo");
Filter.add("clo");
Filter.add("mlp");
Filter.add("imbecil");
Filter.add("imbécil");
Filter.add("idiota");
Filter.add("pendejo");
Filter.add("pendeja");
Filter.add("puto");
Filter.add("puta");
Filter.add("putas");
Filter.add("putos");



export default Filter;
