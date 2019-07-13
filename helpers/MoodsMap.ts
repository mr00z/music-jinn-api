class MoodsMap {
  private originalMap: Map<string, string>;
  private mirroredMap: Map<string, string>;

  constructor(moodsDictionary: any) {
    this.originalMap = new Map<string, string>();
    this.mirroredMap = new Map<string, string>();
    for (const key in moodsDictionary) {
      if (moodsDictionary.hasOwnProperty(key)) {
        const element = moodsDictionary[key];
        this.originalMap.set(key, element);
        this.mirroredMap.set(element, key);
      }
    }
  }

  public getOppositeMood(mood: string): string {
    for (const key of this.originalMap.keys()) {
      if (key === mood) {
        return this.originalMap.get(key);
      }
    }

    for (const key of this.mirroredMap.keys()) {
      if (key === mood) {
        return this.mirroredMap.get(key);
      }
    }

    return null;
  }
}

export default MoodsMap;
