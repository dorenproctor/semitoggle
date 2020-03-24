const {Parser} = require("acorn");
const MyParser = Parser.extend(require("acorn-jsx")());

function addSemicolons(code: string) {
  function getSemicolonSpots(code: string) : number[] { 
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
  function removeComments(code: string): string {
    const len = code.length-1;
    const options = {
      sourceType: 'module',
      onComment: function(block: boolean, text: string, start: number, end: number) {
        code = code.substr(0, start) + ' '.repeat(end-start) + code.substr(end, len);
      }
    };
    MyParser.parse(code, options);
    return code;
  }
  
  function findEndingSemicolonIndices(code: string): (number | undefined)[] {
    return [...code.matchAll(/;\s*\n/g)].map(match => match.index);
  }
  
  
  function removeSemicolonsInIndices(code: string, indices: (number | undefined)[]): string {
    for (let i=indices.length-1; i>=0; i--) {
      const x = indices[i];
      if (x) code = code.slice(0,x)+code.slice(x+1);
    }
    return code;
  }

  const noComments = removeComments(code);
  const indices = findEndingSemicolonIndices(noComments);
  return removeSemicolonsInIndices(code, indices);
}

export { addSemicolons, removeSemicolons };
export default { addSemicolons, removeSemicolons };