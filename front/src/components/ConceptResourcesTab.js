import { useFragment } from "react-relay";

export default function ConceptResourcesTab({ concept }) {
  const { concept } = useFragment(ConceptResourceTabFragment);

  return (
    <div className="concept-resources-tab">
      <h3 className="heading2">Resources for {concept.name}</h3>
    </div>
  );
}

const ConceptResourceTabFragment = graphql`
  fragment ConceptResourcesTabFragment_concept on Concept {
    name
    resources
  }
`;
