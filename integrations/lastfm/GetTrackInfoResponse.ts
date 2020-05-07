export interface Streamable {
  '#text': string;
  fulltrack: string;
}

export interface Artist {
  name: string;
  mbid: string;
  url: string;
}

export interface Image {
  '#text': string;
  size: string;
}

export interface Attr {
  position: string;
}

export interface Album {
  artist: string;
  title: string;
  mbid: string;
  url: string;
  image: Image[];
  '@attr': Attr;
}

export interface Tag {
  name: string;
  url: string;
}

export interface Toptags {
  tag: Tag[];
}

export interface Wiki {
  published: string;
  summary: string;
  content: string;
}

export interface Track {
  name: string;
  mbid: string;
  url: string;
  duration: string;
  streamable: Streamable;
  listeners: string;
  playcount: string;
  artist: Artist;
  album: Album;
  toptags: Toptags;
  wiki: Wiki;
}

export default interface GetTrackInfoResponse {
  track: Track;
}
