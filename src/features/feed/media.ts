import messi from './assets/messi.png';
import transfer from './assets/transfer.png';
import liverpool from './assets/liverpool.png';
import lloyd from './assets/lloyd.jpg';
import maradona from './assets/maradona.jpg';
import preview from './assets/preview.png';
import yamalVideo from './assets/videos/yamal.mp4';
import goalyamalVideo from './assets/videos/goalyamal.mp4';
import barsapsglastmatchVideo from './assets/videos/barsapsglastmatch.mp4';
import neymarVideo from './assets/videos/neymar.mp4';
import coutihnoVideo from './assets/videos/coutihno.mp4';
import doueVideo from './assets/videos/doue.mp4';
import oliseVideo from './assets/videos/olise.mp4';
import taarabtVideo from './assets/videos/taarabt.mp4';

export interface StoryMedia { image?: string; alt: string; credit: string; video?: string; position?: string }
export const storyMedia: Record<string, StoryMedia> = {
  'messi-miami-debut-free-kick': { image: messi, alt: 'Messi celebrates his Inter Miami debut with his teammates', credit: 'Photo: Inter Miami CF', position: '60% center' },
  'messi-signs-with-inter-miami': { image: transfer, alt: 'Lionel Messi wearing his pink Inter Miami jersey', credit: 'Photo: Inter Miami CF' },
  'liverpool-quick-corner-barcelona': { image: liverpool, alt: 'Divock Origi celebrates the decisive goal at Anfield', credit: 'Photo: UEFA' },
  'carli-lloyd-2015-final-hat-trick': { image: lloyd, alt: 'Carli Lloyd celebrates her World Cup final performance', credit: 'Photo: U.S. Soccer' },
  'maradona-1986-england-two-goals': { image: maradona, alt: 'Maradona dribbles through England’s defense in 1986', credit: 'Photo: FIFA' },
  'orlando-city-fc-cincinnati-2026-11-19-preview': { image: preview, alt: 'MLS Cup Playoffs trophy artwork', credit: 'Artwork: MLS' },
  'yamal-clip': { video: yamalVideo, alt: 'Lamine Yamal', credit: 'Team video' },
  'goalyamal-clip': { video: goalyamalVideo, alt: 'A goal by Lamine Yamal', credit: 'Team video' },
  'barsapsglastmatch-clip': { video: barsapsglastmatchVideo, alt: 'Barcelona and Paris Saint-Germain', credit: 'Team video' },
  'neymar-clip': { video: neymarVideo, alt: 'Neymar', credit: 'Team video' },
  'coutihno-clip': { video: coutihnoVideo, alt: 'Philippe Coutinho', credit: 'Team video' },
  'doue-clip': { video: doueVideo, alt: 'Désiré Doué', credit: 'Team video' },
  'olise-clip': { video: oliseVideo, alt: 'Michael Olise', credit: 'Team video' },
  'taarabt-clip': { video: taarabtVideo, alt: 'Adel Taarabt', credit: 'Team video' },
};
