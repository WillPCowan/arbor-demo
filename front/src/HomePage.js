import React from "react";

// Components
import Link from "./routing/Link";
import Searchbutton from "./components/Searchbutton.js";

// Styles
import "./styles/_text.scss";
import "./styles/_containers.scss";
import "./styles/HomePage.scss";

export default function HomePage(props) {
  // Pass child page components into Root via props.children
  return (
    <div className="home-page">
      <div className="page page--narrow">
        <h1 className="heading heading1">Welcome!</h1>
        <h2 className="heading heading2">What is Arbor?</h2>
        <div>{sourceStringToReactParagraphs(introText)}</div>
        {/* <Searchbutton /> */}
        <h2 className="heading heading2">Explore</h2>
        <Searchbutton className="home-page__searchbutton" />
        <h3 className="heading heading3">Example Concepts</h3>
        <ConceptCardList concepts={concepts} />
      </div>
    </div>
  );
}

const introText = `
  Welcome to Arbor. Arbor is a platform similar to a wiki, where you can browse
  concepts and get explanations. What sets Arbor apart is that its designed for 
  people to add and vote on resources (articles, papers, videos) that explain
  the concept well.

  We believe Wikipedia is one of Humanities' greatest inventions, however 
  concept descriptions (abstracts) can sometimes be overwhelming, or too simple,
  depending on who you are and your origins. The goal of Arbor is to redirect
  individuals to the resources that suite them most, whether it be a a simple
  explanation, or detailed overview.

  You may want to use Arbor to learn about concepts from generic domains, 
  such as "natural selection", or to learn about concepts from much more 
  specific domains, such as "MongoDB change streams".

  As well as redirecting, users are (will be) empowered to create documents for 
  a given concept directly in Arbor. 
  
  While in development, GPT-3 is being used to dynamically generate concept 
  descriptions as you search for them.

  Get started and search for a concept, or take a look from the examples below!
`;

function sourceStringToReactParagraphs(string) {
  let paragraphs = string.split("\n\n");
  paragraphs = paragraphs.map((p) => p.replace("\n", ""));

  return (
    <>
      {paragraphs.map((p) => (
        <p>{p}</p>
      ))}
    </>
  );
}

function ConceptCardList({ concepts }) {
  return (
    <ul className="concept-list">
      {concepts.map((c) => (
        <li className="concept-list__item concept-card" key={c.key}>
          <Link to={`/concept/${c.name}`}>
            <p className="concept-list__item-text">{c.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

let count = 0;
let concepts = [
  "atom",
  "evolution",
  "emergence",
  "lysosome",
  "cipher",
  "turbulence",
  "flux",
  "ion",
  "epithelium",
  "Mars",
  "centurion",
  "guanine",
  "chromosome",
  "algorithm",
  "entropy",
  "power",
  "inflation",
  "molecule",
  "cortex",
  "latency",
  "threshold",
  "automaton",
  "asynchronous",
  "hydrogenation",
  "genetic recombination",
  "equilibrium",
  "redux",
  "transduction",
  "triune brain",
  "carbon",
  "capitalism",
  "sapling",
  "America",
  "database",
  "Tarantula",
  "Mondello",
  "backpropagation",
  "superposition",
  "combustion",
  "reducer",
  "hashcode",
  "limbic system",
].map((concept) => ({ key: count++, name: concept }));

// const concepts = {[
//   { key: 1, name: "atom" },
//   { key: 2, name: "evolution" },
//   { key: 3, name: "emergence" },
//   { key: 4, name: "lysosome" },
//   { key: 5, name: "cipher" },
//   { key: 6, name: "turbulence" },
//   {}
// ]};
