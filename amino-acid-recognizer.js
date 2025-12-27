/*
  Amino Acid Recognizer for JSME
  Uses OpenChemLib when available for canonical matching.
  Falls back to normalized SMILES string matching otherwise.
*/

const AminoAcidRecognizer = (() => {
  const FALLBACK_AMINO_ACIDS = [
    { name: "Glycine", code3: "Gly", code1: "G", smiles: "NCC(=O)O" },
    { name: "Alanine", code3: "Ala", code1: "A", smiles: "NC(C)C(=O)O" },
    { name: "Valine", code3: "Val", code1: "V", smiles: "NC(C(C)C)C(=O)O" },
    { name: "Leucine", code3: "Leu", code1: "L", smiles: "NC(CC(C)C)C(=O)O" },
    { name: "Isoleucine", code3: "Ile", code1: "I", smiles: "NC(C(C)CC)C(=O)O" },
    { name: "Proline", code3: "Pro", code1: "P", smiles: "N1C(CC1)C(=O)O" },
    { name: "Methionine", code3: "Met", code1: "M", smiles: "NC(CCSC)C(=O)O" },
    { name: "Cysteine", code3: "Cys", code1: "C", smiles: "NC(CS)C(=O)O" },
    { name: "Serine", code3: "Ser", code1: "S", smiles: "NC(CO)C(=O)O" },
    { name: "Threonine", code3: "Thr", code1: "T", smiles: "NC(C(O)C)C(=O)O" },
    { name: "Tyrosine", code3: "Tyr", code1: "Y", smiles: "NC(Cc1ccc(O)cc1)C(=O)O" },
    { name: "Tryptophan", code3: "Trp", code1: "W", smiles: "NC(Cc1c[nH]c2ccccc12)C(=O)O" },
    { name: "Phenylalanine", code3: "Phe", code1: "F", smiles: "NC(Cc1ccccc1)C(=O)O" },
    { name: "Aspartic Acid", code3: "Asp", code1: "D", smiles: "NC(CC(=O)O)C(=O)O" },
    { name: "Glutamic Acid", code3: "Glu", code1: "E", smiles: "NC(CCC(=O)O)C(=O)O" },
    { name: "Asparagine", code3: "Asn", code1: "N", smiles: "NC(CC(N)=O)C(=O)O" },
    { name: "Glutamine", code3: "Gln", code1: "Q", smiles: "NC(CCC(N)=O)C(=O)O" },
    { name: "Lysine", code3: "Lys", code1: "K", smiles: "NC(CCCCN)C(=O)O" },
    { name: "Arginine", code3: "Arg", code1: "R", smiles: "NC(CCCNC(N)=N)C(=O)O" },
    { name: "Histidine", code3: "His", code1: "H", smiles: "NC(Cc1c[nH]cn1)C(=O)O" }
  ];

  let indexReady = false;
  let index = new Map();
  let indexNoStereo = new Map();
  let oclAvailable = false;

  function getDataSource() {
    if (Array.isArray(window.aminoAcids) && window.aminoAcids.length) {
      return window.aminoAcids.map((aa) => ({
        name: aa.name,
        code3: aa.abbr3 || aa.code3 || "",
        code1: aa.abbr1 || aa.code1 || "",
        smiles: aa.smiles
      }));
    }
    return FALLBACK_AMINO_ACIDS;
  }

  function normalizeSmiles(smiles) {
    if (!smiles) return "";
    return smiles
      .replace(/\[O\]\[H\]/g, "[OH]")
      .replace(/\[H\]\[O\]/g, "[OH]")
      .replace(/\[NH3\+\]/g, "N")
      .replace(/\[NH2\+\]/g, "N")
      .replace(/\[NH\+\]/g, "N")
      .replace(/\[O-\]/g, "O")
      .replace(/\[S-\]/g, "S")
      .replace(/\+/g, "")
      .replace(/\-/g, "")
      .trim();
  }

  function isOclReady() {
    return !!(window.OCL && OCL.Molecule && typeof OCL.Molecule.fromSmiles === "function");
  }

  function normalizeMolecule(mol) {
    if (!mol) return null;
    if (typeof mol.removeExplicitHydrogens === "function") {
      try {
        mol.removeExplicitHydrogens();
      } catch (err) {
        return mol;
      }
    }
    return mol;
  }

  function cloneMolecule(mol) {
    if (!mol) return null;
    if (typeof mol.getCompactCopy === "function") return mol.getCompactCopy();
    if (typeof mol.getCopy === "function") return mol.getCopy();
    if (typeof mol.getIDCode === "function" && window.OCL && typeof OCL.Molecule.fromIDCode === "function") {
      try {
        return OCL.Molecule.fromIDCode(mol.getIDCode());
      } catch (err) {
        return mol;
      }
    }
    return mol;
  }

  function getIdCode(mol) {
    if (!mol || typeof mol.getIDCode !== "function") return null;
    try {
      return mol.getIDCode();
    } catch (err) {
      return null;
    }
  }

  function getIdCodeNoStereo(mol) {
    const copy = cloneMolecule(mol);
    if (!copy) return null;
    if (typeof copy.stripStereoInformation === "function") {
      try {
        copy.stripStereoInformation();
      } catch (err) {
        return null;
      }
    }
    return getIdCode(copy);
  }

  function tryParseSmiles(smiles) {
    if (!isOclReady() || !smiles) return null;
    try {
      const mol = OCL.Molecule.fromSmiles(smiles);
      return normalizeMolecule(mol);
    } catch (err) {
      return null;
    }
  }

  function ensureIndex() {
    if (indexReady) return;
    indexReady = true;
    index = new Map();
    indexNoStereo = new Map();
    oclAvailable = isOclReady();
    const data = getDataSource();
    if (!oclAvailable) {
      for (const aa of data) {
        const key = normalizeSmiles(aa.smiles);
        if (key && !index.has(key)) {
          index.set(key, aa);
        }
      }
      return;
    }
    for (const aa of data) {
      if (!aa || !aa.smiles) continue;
      const mol = tryParseSmiles(aa.smiles);
      if (!mol) continue;
      const id = getIdCode(mol);
      if (id && !index.has(id)) index.set(id, aa);
      const idNoStereo = getIdCodeNoStereo(mol);
      if (idNoStereo && !indexNoStereo.has(idNoStereo)) indexNoStereo.set(idNoStereo, aa);
    }
  }

  function getAtomSymbol(mol, atomIndex) {
    if (!mol) return null;
    if (typeof mol.getAtomicNo === "function") {
      const atomicNo = mol.getAtomicNo(atomIndex);
      return atomicNo;
    }
    if (typeof mol.getAtomLabel === "function") {
      const label = mol.getAtomLabel(atomIndex);
      if (!label) return null;
      const atom = label.replace(/[^A-Za-z]/g, "");
      const map = { C: 6, N: 7, O: 8, S: 16 };
      return map[atom] || null;
    }
    return null;
  }

  function getNeighbors(mol, atomIndex) {
    if (!mol || typeof mol.getConnAtoms !== "function" || typeof mol.getConnAtom !== "function") return [];
    const total = mol.getConnAtoms(atomIndex);
    const neighbors = [];
    for (let i = 0; i < total; i += 1) {
      neighbors.push(mol.getConnAtom(atomIndex, i));
    }
    return neighbors;
  }

  function getBondOrderBetween(mol, atomA, atomB) {
    if (!mol || typeof mol.getConnAtoms !== "function" || typeof mol.getConnAtom !== "function") return null;
    const total = mol.getConnAtoms(atomA);
    for (let i = 0; i < total; i += 1) {
      const neighbor = mol.getConnAtom(atomA, i);
      if (neighbor !== atomB) continue;
      if (typeof mol.getConnBondOrder === "function") {
        try {
          return mol.getConnBondOrder(atomA, i);
        } catch (err) {
          return null;
        }
      }
      if (typeof mol.getConnBond === "function" && typeof mol.getBondOrder === "function") {
        try {
          const bond = mol.getConnBond(atomA, i);
          return mol.getBondOrder(bond);
        } catch (err) {
          return null;
        }
      }
    }
    return null;
  }

  function isCarbonylCarbon(mol, atomIndex) {
    if (getAtomSymbol(mol, atomIndex) !== 6) return false;
    const neighbors = getNeighbors(mol, atomIndex);
    for (const neighbor of neighbors) {
      if (getAtomSymbol(mol, neighbor) !== 8) continue;
      const order = getBondOrderBetween(mol, atomIndex, neighbor);
      if (order === 2) return true;
    }
    return false;
  }

  function findAlphaCarbon(mol) {
    if (!mol || typeof mol.getAllAtoms !== "function") return null;
    const count = mol.getAllAtoms();
    for (let i = 0; i < count; i += 1) {
      if (getAtomSymbol(mol, i) !== 6) continue;
      const neighbors = getNeighbors(mol, i);
      let hasAmino = false;
      let hasCarboxyl = false;
      for (const neighbor of neighbors) {
        const atomicNo = getAtomSymbol(mol, neighbor);
        if (atomicNo === 7) hasAmino = true;
        if (atomicNo === 6 && isCarbonylCarbon(mol, neighbor)) hasCarboxyl = true;
      }
      if (hasAmino && hasCarboxyl) return i;
    }
    return null;
  }

  function getCipParity(mol, atomIndex) {
    if (!mol || typeof mol.getAtomCIPParity !== "function" || !window.OCL) return null;
    if (typeof mol.ensureHelperArrays === "function" && OCL.Molecule && OCL.Molecule.cHelperCIP) {
      try {
        mol.ensureHelperArrays(OCL.Molecule.cHelperCIP);
      } catch (err) {
        return null;
      }
    }
    let parity = null;
    try {
      parity = mol.getAtomCIPParity(atomIndex);
    } catch (err) {
      return null;
    }
    if (OCL.Molecule && parity === OCL.Molecule.cAtomCIPParityRorM) return "R";
    if (OCL.Molecule && parity === OCL.Molecule.cAtomCIPParitySorP) return "S";
    return null;
  }

  function expectedAlphaParity(aa) {
    if (!aa || !aa.name) return null;
    if (aa.name === "Glycine") return null;
    if (aa.name === "Cysteine") return "R";
    return "S";
  }

  function addStereoInfo(result, mol, aa) {
    if (!result || !mol || !aa) return result;
    const expected = expectedAlphaParity(aa);
    if (!expected) return result;
    const alpha = findAlphaCarbon(mol);
    if (alpha === null) return result;
    const actual = getCipParity(mol, alpha);
    if (!actual) return result;
    result.stereo = { expected, actual };
    result.stereoOk = actual === expected;
    return result;
  }

  function identifyMol(mol) {
    ensureIndex();
    if (!oclAvailable || !mol) return { found: false };
    const id = getIdCode(mol);
    if (id && index.has(id)) {
      return addStereoInfo({ found: true, match: "exact", ...index.get(id) }, mol, index.get(id));
    }
    const idNoStereo = getIdCodeNoStereo(mol);
    if (idNoStereo && indexNoStereo.has(idNoStereo)) {
      return addStereoInfo({ found: true, match: "nostereo", ...indexNoStereo.get(idNoStereo) }, mol, indexNoStereo.get(idNoStereo));
    }
    if (typeof mol.toSmiles === "function") {
      const neutralSmiles = normalizeSmiles(mol.toSmiles());
      const neutralMol = tryParseSmiles(neutralSmiles);
      if (neutralMol) {
        const neutralId = getIdCode(neutralMol);
        if (neutralId && index.has(neutralId)) {
          return addStereoInfo({ found: true, match: "neutral", ...index.get(neutralId) }, mol, index.get(neutralId));
        }
        const neutralNoStereo = getIdCodeNoStereo(neutralMol);
        if (neutralNoStereo && indexNoStereo.has(neutralNoStereo)) {
          return addStereoInfo({ found: true, match: "neutral-nostereo", ...indexNoStereo.get(neutralNoStereo) }, mol, indexNoStereo.get(neutralNoStereo));
        }
      }
    }
    return { found: false };
  }

  function identify(smiles) {
    ensureIndex();
    if (!smiles) return { found: false };
    const clean = normalizeSmiles(smiles);
    if (!clean) return { found: false };
    if (!oclAvailable) {
      const aa = index.get(clean);
      if (!aa) return { found: false };
      return { found: true, match: "string", ...aa };
    }
    const mol = tryParseSmiles(clean);
    if (!mol) return { found: false };
    return identifyMol(mol);
  }

  function getJSMEValue(jsmeInstance, methods, argsList = [[]]) {
    if (!jsmeInstance) return "";
    for (const method of methods) {
      if (typeof jsmeInstance[method] === "function") {
        for (const args of argsList) {
          try {
            const value = jsmeInstance[method](...args);
            if (typeof value === "string" && value.trim()) {
              return value.trim();
            }
          } catch (err) {
            continue;
          }
        }
      }
    }
    return "";
  }

  function getJSMEMolfile(jsmeInstance) {
    return getJSMEValue(
      jsmeInstance,
      [
        "molFile",
        "molfile",
        "getMolFile",
        "getMolfile",
        "getMolfileV3",
        "getMolfileV2",
        "getMolfileV2000",
        "getMolfileV3000"
      ],
      [[], [false], [true]]
    );
  }

  function fromJSME(jsmeInstance) {
    if (!jsmeInstance) return { found: false };
    const smiles = getJSMEValue(jsmeInstance, ["smiles", "SMILES", "getSmiles", "getSMILES"]);
    if (smiles) {
      const result = identify(smiles);
      if (result?.found) return result;
    }
    const molfile = getJSMEMolfile(jsmeInstance);
    if (molfile && isOclReady()) {
      try {
        const mol = OCL.Molecule.fromMolfile(molfile);
        normalizeMolecule(mol);
        return identifyMol(mol);
      } catch (err) {
        return { found: false };
      }
    }
    return { found: false };
  }

  return {
    identify,
    fromJSME
  };
})();
