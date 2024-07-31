export function isParentOf(parent: HTMLElement|null, node: HTMLElement|ParentNode|null): boolean{
    if(!parent) return false;
    if(!node) return false;
    if(node == parent) return true;
    return isParentOf(parent, node.parentNode);
}

export function capitilizeWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  }