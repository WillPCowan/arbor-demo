export const topicExplainerPrompt = `I am a explanation bot. Give me a topic and I will explain it to you with no expectation about your prior knowledge other than common knowledge. If a topic depends on other topics, I will first give a simple explanation of those and finally an explanation of the given topic.

Topic: Enzyme
Explanation: Cells are the building blocks of humans, animals, and all other life. You are made of trillions of cells, and their communication and operation is what keeps you alive. To work properly, cells need lots of different chemicals, some for fuel, some to make colors, come to help you think. To make these chemicals they use chemical reactions. Chemical reactions can convert one or more chemicals into one or more different chemicals. For example you could have a chemical A, and after a chemical reaction you have chemicals B and C. Chemical reactions take time and can be made to go faster using a catalyst. Catalysts are themselves a type of chemical, but these chemicals help chemical reactions happen faster, by helping the reagent chemicals react more easily. Cells use special catalysts known as proteins. Enzymes are a class of catalysts that cells can make. Cells make these special catalysts that help speed up chemical reactions that are important for their, and your, survival. One example of an enzyme is lipase which helps to break down fat so that it can be used for fuel.

Topic: CPU
Explanation: A computer is a machine that can be instructed to carry out arbitrary sequences of arithmetic or logical operations. A computer is made of hardware and software. Hardware is the physical parts of the computer. It includes the motherboard, the CPU, the RAM, the hard drive, the power supply, the case, the ports, and all the other things that make up the physical computer. Software is the programs that run on the computer. It includes the operating system, the programs you use to do your work, and the programs that make up the internet.

Topic: `;

export const selectionElaboratorPrompt = `I am a elaboration bot. Give me a selection of text and I will elaborate on it, explaining it in more detail. 

Selection: "cells need lots of different chemicals, some for fuel, some to make colors, some to help you think"
Explanation: Consider chemicals as a type of fuel. You need different fuels to allow cells to perform different functions. If a cell needs to send a message to another cell, this requires one type of fuel, and when it sends a message this fuel gets depleted. 

Selection: "data can be served faster"
Explanation: Serving data describes the process of sending data from one place to another place. Serving data faster means you can send more data in a given period of time.

Selection: "long chains of amino acid residues"
Explanation: Amino acids are a type of molecule. Amino acids can be connected to each other to form a sequence of amino acids, called a protein.

Selection: "one unpaired valence electron"
Explanation: A valence electron is an electron in an outer shell of an atom. Electrons form pairs in shells achieving a lower energy state. When an electron is unpaired, the atom is in a high energy state which makes it more reactive. 

Selection: "neuron pathways"
Explanation: A neuron is a type of cell that transmits messages from one place to another. Neurons have a cell body and a long tail called an axon. Neurons form connections with other neurons by sending axons to other neurons. These connections are called synapses. Chains of these connections form neuron pathways.

Selection:`;

// ESSAY WRITER SUITE ---------------------------------------------------------
export const essaySubtopicsPrompt = (
  topic
) => `I am an essay flow bot. I will plan the structure and content of a short essay on a given topic, by providing a sequence of subtopics. The essay makes no assumptions about the domain knowledge or technical knowledge of the reader. This means that a reader with no knowledge related to the topic should be able to read the essay and understand it. This implies that any domain specific or technical vocabulary required to understand the given topic should also be explained in the essay. The essay can also discuss motivations for learning about the topic, such as applications of the concept or linking it to real world experiences.

Topic: cells
Subtopics: [cells are the building blocks of life; what are cells made of; what is DNA; what are organelles; how do cells build up to make animals?;]

Topic: protein
Subtopics: [what are cells?; how do cells use protein?; what is DNA?; how is DNA used to make proteins?; why should we learn about proteins?;]

Topic: enzyme
Subtopics: [what are cells?; what are proteins?; why do cells have proteins?; enzymes are a special type of protein; enzymes are important in lots of body processes; how enzymes are used to make our muscles work;]

Topic: encryption
Subtopics: [why we need to keep information private; Caesar cipher, a simple method of encryption; digital signatures, an application of encryption; types of cryptography; what is public key cryptography; what is private key cryptography;]

Topic: graphics processing unit 
Subtopics: [what is a processor?; the limitation of processing one datum at a time; what is computer parallelism?; GPUs enable parallelism?; how do GPUs work on multiple pieces of data at a time?;]

Topic: supervised machine learning
Subtopics: [some tasks are to complex to write code for; image recognition requires too many rules to learn and write manually in code; machine learning finds rules automatically; what are supervised machine learning models; how do supervised machine learning models learn?;]

Topic: superposition
Subtopics: [quantum mechanics is all about the behavior of particles at the atomic and subatomic level; one of the most famous principles of quantum mechanics is superposition; what is superposition?; why is superposition so important?; how is superposition demonstrated in the lab?]

Topic: Fischer-Tropsch Reactor
Subtopics: [what is Fischer-Tropsch synthesis?; what is a Fischer-Tropsch reactor?; what are the products of a Fischer-Tropsch reactor?; what is the process of Fischer-Tropsch synthesis?; how does a Fischer-Tropsch reactor work?
  
Topic: ${topic}
Subtopics:`;

export const essaySubtopicWriterPrompt = (
  topic,
  precedingSubtopic,
  targetSubtopic,
  nextSubtopic
) => `I am an essay writing bot. Due to limited response length, I can only write about one essay subtopic at a time. To write an essay that flows well you need to give me: the essay topic, a title for the preceding subtopic, the title of the subtopic to be written, and the a title of the next subtopic. With these, I can write about the target subtopic in a way that can flow from the preceding subtopic and into the next subtopic. The essays I write are designed to introduce people to a topic, meaning that any technical or domain specific vocabulary used must be explained, to ensure the reader can comprehend the text. if the target subtopic is the starting or ending subtopic, then provide an empty string "".

Essay topic: "cells"
Preceding subtopic: "cells are the building blocks of life"
Target subtopic: "what are cells made of"
Next subtopic: "what is DNA"
Essay text: "The basic parts of a cell are a nucleus, cytoplasm, and a cell membrane. The nucleus is where the DNA lives. DNA describes what proteins the cell needs to make. The cytoplasm is the liquid that fills the cell and contains all of the machinery for making proteins. Proteins are chemicals that are important for living things to grow and work properly. The cell membrane is a wall around the cell that keeps everything in and everything out."

Essay topic: "supervised machine learning"
Preceding subtopic: ""
Target subtopic: "some tasks are too complex to write code for"
Next subtopic: "image recognition requires too many rules to write manual code for"
Essay text: "Programming has solved a lot of hard problems. We solve problems by learning rules of how to solve the problem, and then write code to solve this. There are some problems that have rules that are too complex for us too learn, and there are some problems that have too many rules for us to learn and write code for.  One example of these problems is image recognition."

Essay topic: "encryption"
Preceding subtopic: "why we want to keep our data private"
Target subtopic: "Caesar cipher, a simple method of encryption"
Next subtopic: "digital signatures, an application of encryption"
Essay text: "One of the earliest methods used to keep information private was the Caesar cipher, used by Julius Caesar in Ancient Rome. The is a simple method of encryption, where each letter in the alphabet is replaced by shifting the alphabet by 1 or more spaces. For example, shifting one space we turn 'a' into 'b', and the word 'cipher' into 'djqifs'. Caesar did this so he could send secret military messages. In the modern world we have more complex algorithms than this and we also have many more applications that enable our digital lives, such as digital signatures."

Essay topic: ${topic}
Preceding subtopic: ${precedingSubtopic}
Target subtopic: ${targetSubtopic}
Next subtopic: ${nextSubtopic}
Essay text:`;

export const originSpecifierPrompt = (
  concept
) => `I am an question answering bot for concept origins. If you give me a concept, I will give you the people involved in its conception and when this was first done. 

Concept: Atom
Origin: 1766, John Dalton

Concept: Protein
Origin: 1838, Gerardus Johannes Mulder

Concept: Black Hole
Origin: 1916, Albert Einstein

Concept: Block Cipher
Origin: 1949, Claud Shannon

Concept: Train
Origin: 1804, Richard Trevithick

Concept: Aeroplane
Origin: 1903, Orville Wright and Wilbur Wright

Concept: Trinitrotoluene
Origin: 1863, Julius Wilbrand

Concept: Plastic
Origin: 1907, Leo Hendrik Baekeland

Concept: ${concept} 
Origin:`;
