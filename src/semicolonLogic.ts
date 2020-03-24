function injectSemicolons(code: string) {
  function getSemicolonSpots(code: string) : number[] { 
    const {Parser} = require("acorn");
    const MyParser = Parser.extend(require("acorn-jsx")());
    const spots: number[] = [];
    const options = {
      sourceType: 'module',
      onInsertedSemicolon: function(spot: number) {
        spots.push(spot);
      }
    };
    MyParser.parse(code, options);
    return spots;
  }

  function addSemicolonsInSpots(code: string, spots: number[]) {
    for (let i=spots.length-1; i>=0; i--) {
      const x = spots[i];
      code = code.slice(0,x)+';'+code.slice(x);
    }
    return code;
  }

  const spots = getSemicolonSpots(code);
  return addSemicolonsInSpots(code, spots);
}

function removeSemicolons(code: string) {
  return code.replace(/;\s*\n/g, '\n').replace(/;\s*$/g, '');
}

export { injectSemicolons, removeSemicolons };
export default { injectSemicolons, removeSemicolons };

