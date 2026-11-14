import messi from './assets/messi.png';
import transfer from './assets/transfer.png';
import liverpool from './assets/liverpool.png';
import lloyd from './assets/lloyd.jpg';
import maradona from './assets/maradona.jpg';
import preview from './assets/preview.png';

export interface StoryMedia { image: string; alt: string; credit: string; videoId?: string; position?: string }
export const storyMedia: Record<string, StoryMedia> = {
  'messi-miami-debut-free-kick': { image: messi, alt: 'Messi celebrates his Inter Miami debut with his teammates', credit: 'Photo: Inter Miami CF · Video: ESPN FC', videoId: 'pORjd5ZkTrs', position: '60% center' },
  'messi-signs-with-inter-miami': { image: transfer, alt: 'Lionel Messi wearing his pink Inter Miami jersey', credit: 'Photo: Inter Miami CF' },
  'liverpool-quick-corner-barcelona': { image: liverpool, alt: 'Divock Origi celebrates the decisive goal at Anfield', credit: 'Photo: UEFA' },
  'carli-lloyd-2015-final-hat-trick': { image: lloyd, alt: 'Carli Lloyd celebrates her World Cup final performance', credit: 'Photo: U.S. Soccer' },
  'maradona-1986-england-two-goals': { image: maradona, alt: 'Maradona dribbles through England’s defense in 1986', credit: 'Video and thumbnail: FIFA', videoId: 'FRAbNlPS2MI' },
  'orlando-city-fc-cincinnati-2026-11-19-preview': { image: preview, alt: 'MLS Cup Playoffs trophy artwork', credit: 'Artwork: MLS' },
  'liverpool-barcelona-four-goals-video': { image: 'https://i.ytimg.com/vi/27GHT7nAF8A/hqdefault.jpg', alt: 'Liverpool and Barcelona in UEFA highlights', credit: 'Video: UEFA', videoId: '27GHT7nAF8A' },
  'brazil-germany-seven-one-video': { image: 'https://i.ytimg.com/vi/aE4BdIP6bvc/hqdefault.jpg', alt: 'Brazil and Germany in FIFA highlights', credit: 'Video: FIFA', videoId: 'aE4BdIP6bvc' },
  'argentina-france-2022-final-video': { image: 'https://i.ytimg.com/vi/IipmpVcISXE/hqdefault.jpg', alt: 'Argentina and France in FIFA highlights', credit: 'Video: FIFA', videoId: 'IipmpVcISXE' },
  'maradona-eight-minutes-video': { image: 'https://i.ytimg.com/vi/FRAbNlPS2MI/hqdefault.jpg', alt: 'Maradona against England in FIFA film', credit: 'Video: FIFA', videoId: 'FRAbNlPS2MI' },
};
